/**
 * Feedback Collector
 * 
 * Collects implicit and explicit feedback about AI responses
 * to improve prompt quality over time.
 * 
 * @version 1.0
 */

const { createLogger } = require('../../utils/logger');
const logger = createLogger('FEEDBACK');

class FeedbackCollector {
  constructor() {
    this.feedback = [];
    this.maxFeedback = 5000;
  }

  /**
   * Collect explicit feedback (user rating)
   */
  collectExplicit(userId, promptId, reason, rating, comment = null) {
    const feedback = {
      type: 'explicit',
      userId,
      promptId,
      reason,
      rating, // 1-5 stars
      comment,
      timestamp: new Date().toISOString()
    };
    
    this.addFeedback(feedback);
    logger.info('Explicit feedback collected', { promptId, rating });
    
    return feedback;
  }

  /**
   * Collect implicit feedback (user behavior)
   */
  collectImplicit(userId, promptId, reason, behaviorMetrics) {
    const feedback = {
      type: 'implicit',
      userId,
      promptId,
      reason,
      metrics: {
        engagementTime: behaviorMetrics.engagementTime || 0,
        actionTaken: behaviorMetrics.actionTaken || false,
        repeatUsage: behaviorMetrics.repeatUsage || false,
        shareAction: behaviorMetrics.shareAction || false,
        exitedImmediately: behaviorMetrics.exitedImmediately || false
      },
      timestamp: new Date().toISOString()
    };
    
    // Calculate implicit score
    feedback.implicitScore = this.calculateImplicitScore(feedback.metrics);
    
    this.addFeedback(feedback);
    logger.debug('Implicit feedback collected', { promptId, score: feedback.implicitScore });
    
    return feedback;
  }

  /**
   * Calculate implicit score from behavior metrics
   */
  calculateImplicitScore(metrics) {
    let score = 0;
    
    // Engagement time (max 2 points)
    if (metrics.engagementTime > 30) score += 2;
    else if (metrics.engagementTime > 10) score += 1;
    
    // Action taken (1 point)
    if (metrics.actionTaken) score += 1;
    
    // Repeat usage (1 point)
    if (metrics.repeatUsage) score += 1;
    
    // Share action (1 point)
    if (metrics.shareAction) score += 1;
    
    // Penalize immediate exit (-2 points)
    if (metrics.exitedImmediately) score -= 2;
    
    // Normalize to 1-5 scale
    return Math.max(1, Math.min(5, Math.round((score + 2) * 5 / 7)));
  }

  /**
   * Add feedback to collection
   */
  addFeedback(feedback) {
    this.feedback.push(feedback);
    
    // Trim if exceeds max
    if (this.feedback.length > this.maxFeedback) {
      this.feedback = this.feedback.slice(-this.maxFeedback);
    }
  }

  /**
   * Get feedback for prompt
   */
  getFeedbackForPrompt(promptId) {
    return this.feedback.filter(f => f.promptId === promptId);
  }

  /**
   * Get average rating for prompt
   */
  getAverageRating(promptId) {
    const promptFeedback = this.getFeedbackForPrompt(promptId);
    
    if (promptFeedback.length === 0) return null;
    
    const ratings = promptFeedback.map(f => {
      return f.type === 'explicit' ? f.rating : f.implicitScore;
    });
    
    const average = ratings.reduce((sum, r) => sum + r, 0) / ratings.length;
    
    return {
      average: parseFloat(average.toFixed(2)),
      count: promptFeedback.length,
      distribution: this.getRatingDistribution(ratings)
    };
  }

  /**
   * Get rating distribution
   */
  getRatingDistribution(ratings) {
    const dist = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    
    ratings.forEach(rating => {
      const rounded = Math.round(rating);
      if (rounded >= 1 && rounded <= 5) {
        dist[rounded]++;
      }
    });
    
    return dist;
  }

  /**
   * Get top rated prompts
   */
  getTopRatedPrompts(limit = 10) {
    const promptScores = new Map();
    
    // Aggregate scores by prompt
    this.feedback.forEach(f => {
      const score = f.type === 'explicit' ? f.rating : f.implicitScore;
      
      if (!promptScores.has(f.promptId)) {
        promptScores.set(f.promptId, { total: 0, count: 0 });
      }
      
      const stats = promptScores.get(f.promptId);
      stats.total += score;
      stats.count++;
    });
    
    // Calculate averages and sort
    const ranked = Array.from(promptScores.entries())
      .map(([promptId, stats]) => ({
        promptId,
        averageRating: stats.total / stats.count,
        feedbackCount: stats.count
      }))
      .sort((a, b) => b.averageRating - a.averageRating)
      .slice(0, limit);
    
    return ranked;
  }

  /**
   * Get low rated prompts (need improvement)
   */
  getLowRatedPrompts(threshold = 3.0, minFeedback = 5) {
    const promptScores = new Map();
    
    // Aggregate scores
    this.feedback.forEach(f => {
      const score = f.type === 'explicit' ? f.rating : f.implicitScore;
      
      if (!promptScores.has(f.promptId)) {
        promptScores.set(f.promptId, { total: 0, count: 0 });
      }
      
      const stats = promptScores.get(f.promptId);
      stats.total += score;
      stats.count++;
    });
    
    // Filter and sort
    const lowRated = Array.from(promptScores.entries())
      .map(([promptId, stats]) => ({
        promptId,
        averageRating: stats.total / stats.count,
        feedbackCount: stats.count
      }))
      .filter(p => p.averageRating < threshold && p.feedbackCount >= minFeedback)
      .sort((a, b) => a.averageRating - b.averageRating);
    
    return lowRated;
  }

  /**
   * Get feedback summary
   */
  getSummary() {
    const total = this.feedback.length;
    const explicit = this.feedback.filter(f => f.type === 'explicit').length;
    const implicit = this.feedback.filter(f => f.type === 'implicit').length;
    
    return {
      total,
      explicit,
      implicit,
      topRated: this.getTopRatedPrompts(5),
      needsImprovement: this.getLowRatedPrompts(3.0, 5)
    };
  }

  /**
   * Export feedback data
   */
  exportFeedback() {
    return {
      feedback: this.feedback,
      summary: this.getSummary(),
      exportedAt: new Date().toISOString()
    };
  }

  /**
   * Clear old feedback
   */
  clearOld(olderThan = 30 * 24 * 60 * 60 * 1000) { // Default 30 days
    const cutoff = Date.now() - olderThan;
    const before = this.feedback.length;
    
    this.feedback = this.feedback.filter(f => {
      return new Date(f.timestamp).getTime() > cutoff;
    });
    
    const removed = before - this.feedback.length;
    if (removed > 0) {
      logger.info(`Cleared ${removed} old feedback entries`);
    }
  }

  /**
   * Reset all feedback
   */
  reset() {
    this.feedback = [];
    logger.info('Feedback data reset');
  }
}

// Singleton instance
let feedbackInstance = null;

function getFeedbackCollector() {
  if (!feedbackInstance) {
    feedbackInstance = new FeedbackCollector();
  }
  return feedbackInstance;
}

module.exports = { FeedbackCollector, getFeedbackCollector };

