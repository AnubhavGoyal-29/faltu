/**
 * Prompt Optimizer
 * 
 * Performs A/B testing on prompt variations and automatically
 * selects the best performing prompts.
 * 
 * @version 1.0
 */

const { createLogger } = require('../../utils/logger');
const logger = createLogger('OPTIMIZER');

class PromptOptimizer {
  constructor() {
    this.experiments = new Map();
    this.results = new Map();
  }

  /**
   * Create new A/B test experiment
   */
  createExperiment(promptId, variants, options = {}) {
    const experiment = {
      promptId,
      variants, // Array of { id, description, changes }
      status: 'active',
      trafficSplit: options.trafficSplit || this.generateEvenSplit(variants.length),
      startTime: new Date().toISOString(),
      endTime: options.endTime || null,
      minSamples: options.minSamples || 100,
      significanceLevel: options.significanceLevel || 0.05,
      metrics: {}
    };
    
    // Initialize metrics for each variant
    variants.forEach(variant => {
      experiment.metrics[variant.id] = {
        impressions: 0,
        successes: 0,
        failures: 0,
        totalResponseTime: 0,
        ratings: []
      };
    });
    
    this.experiments.set(promptId, experiment);
    logger.info(`Created A/B experiment for ${promptId}`, { variantCount: variants.length });
    
    return experiment;
  }

  /**
   * Generate even traffic split
   */
  generateEvenSplit(variantCount) {
    const split = {};
    const percentage = 100 / variantCount;
    
    for (let i = 0; i < variantCount; i++) {
      split[i] = percentage;
    }
    
    return split;
  }

  /**
   * Select variant for user (A/B test assignment)
   */
  selectVariant(promptId, userId = null) {
    const experiment = this.experiments.get(promptId);
    
    if (!experiment || experiment.status !== 'active') {
      return null;
    }
    
    // Use consistent assignment for same user
    if (userId) {
      const hash = this.hashUserId(userId);
      const variantIndex = hash % experiment.variants.length;
      return experiment.variants[variantIndex];
    }
    
    // Random selection based on traffic split
    const random = Math.random() * 100;
    let cumulative = 0;
    
    for (let i = 0; i < experiment.variants.length; i++) {
      cumulative += experiment.trafficSplit[i];
      if (random <= cumulative) {
        return experiment.variants[i];
      }
    }
    
    return experiment.variants[0];
  }

  /**
   * Hash user ID for consistent assignment
   */
  hashUserId(userId) {
    let hash = 0;
    const str = String(userId);
    
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    
    return Math.abs(hash);
  }

  /**
   * Record experiment result
   */
  recordResult(promptId, variantId, success, responseTime = 0, rating = null) {
    const experiment = this.experiments.get(promptId);
    
    if (!experiment) return;
    
    const metrics = experiment.metrics[variantId];
    if (!metrics) return;
    
    metrics.impressions++;
    
    if (success) {
      metrics.successes++;
      metrics.totalResponseTime += responseTime;
    } else {
      metrics.failures++;
    }
    
    if (rating) {
      metrics.ratings.push(rating);
    }
    
    // Check if we should end experiment
    if (this.shouldEndExperiment(experiment)) {
      this.endExperiment(promptId);
    }
  }

  /**
   * Check if experiment should end
   */
  shouldEndExperiment(experiment) {
    // Check if minimum samples reached for all variants
    const allVariantsHaveMinSamples = Object.values(experiment.metrics)
      .every(m => m.impressions >= experiment.minSamples);
    
    if (!allVariantsHaveMinSamples) {
      return false;
    }
    
    // Check for statistical significance
    const winner = this.findWinner(experiment);
    return winner !== null && winner.isSignificant;
  }

  /**
   * Find winning variant
   */
  findWinner(experiment) {
    const variants = experiment.variants.map(v => {
      const metrics = experiment.metrics[v.id];
      const successRate = metrics.impressions > 0
        ? metrics.successes / metrics.impressions
        : 0;
      const avgResponseTime = metrics.successes > 0
        ? metrics.totalResponseTime / metrics.successes
        : 0;
      const avgRating = metrics.ratings.length > 0
        ? metrics.ratings.reduce((sum, r) => sum + r, 0) / metrics.ratings.length
        : 0;
      
      // Calculate composite score
      const score = (successRate * 0.5) + (1 - (avgResponseTime / 1000) * 0.3) + (avgRating / 5 * 0.2);
      
      return {
        id: v.id,
        successRate,
        avgResponseTime,
        avgRating,
        score,
        impressions: metrics.impressions
      };
    });
    
    // Sort by score
    variants.sort((a, b) => b.score - a.score);
    
    const winner = variants[0];
    const runnerUp = variants[1];
    
    if (!runnerUp) {
      return { variant: winner, isSignificant: false };
    }
    
    // Simple significance test (Z-test for proportions)
    const isSignificant = this.testSignificance(
      winner.successRate,
      runnerUp.successRate,
      winner.impressions,
      runnerUp.impressions,
      experiment.significanceLevel
    );
    
    return { variant: winner, isSignificant };
  }

  /**
   * Test statistical significance
   */
  testSignificance(p1, p2, n1, n2, alpha) {
    // Z-test for difference in proportions
    const pooledP = ((p1 * n1) + (p2 * n2)) / (n1 + n2);
    const se = Math.sqrt(pooledP * (1 - pooledP) * ((1 / n1) + (1 / n2)));
    const z = Math.abs((p1 - p2) / se);
    
    // Critical value for two-tailed test at alpha level
    const criticalValue = this.getZCritical(alpha);
    
    return z > criticalValue;
  }

  /**
   * Get Z critical value
   */
  getZCritical(alpha) {
    // Approximate critical values
    const table = {
      0.01: 2.576,
      0.05: 1.96,
      0.10: 1.645
    };
    
    return table[alpha] || 1.96;
  }

  /**
   * End experiment and select winner
   */
  endExperiment(promptId) {
    const experiment = this.experiments.get(promptId);
    
    if (!experiment) return null;
    
    experiment.status = 'completed';
    experiment.endTime = new Date().toISOString();
    
    const winnerResult = this.findWinner(experiment);
    experiment.winner = winnerResult.variant;
    experiment.isSignificant = winnerResult.isSignificant;
    
    this.results.set(promptId, {
      experiment,
      completedAt: experiment.endTime,
      winner: experiment.winner,
      isSignificant: experiment.isSignificant
    });
    
    logger.info(`Experiment ended for ${promptId}`, {
      winner: experiment.winner.id,
      significant: experiment.isSignificant
    });
    
    return experiment;
  }

  /**
   * Get experiment status
   */
  getExperiment(promptId) {
    return this.experiments.get(promptId);
  }

  /**
   * Get all active experiments
   */
  getActiveExperiments() {
    return Array.from(this.experiments.values())
      .filter(e => e.status === 'active');
  }

  /**
   * Get experiment results
   */
  getResults(promptId) {
    return this.results.get(promptId);
  }

  /**
   * Get all results
   */
  getAllResults() {
    return Array.from(this.results.values());
  }

  /**
   * Get optimization summary
   */
  getSummary() {
    const active = this.getActiveExperiments();
    const completed = Array.from(this.results.values());
    
    return {
      activeExperiments: active.length,
      completedExperiments: completed.length,
      significantWinners: completed.filter(r => r.isSignificant).length,
      active: active.map(e => ({
        promptId: e.promptId,
        variants: e.variants.length,
        totalImpressions: Object.values(e.metrics)
          .reduce((sum, m) => sum + m.impressions, 0)
      })),
      recentCompletions: completed.slice(-5).map(r => ({
        promptId: r.experiment.promptId,
        winner: r.winner.id,
        significant: r.isSignificant,
        completedAt: r.completedAt
      }))
    };
  }

  /**
   * Reset optimizer
   */
  reset() {
    this.experiments.clear();
    this.results.clear();
    logger.info('Prompt optimizer reset');
  }
}

// Singleton instance
let optimizerInstance = null;

function getPromptOptimizer() {
  if (!optimizerInstance) {
    optimizerInstance = new PromptOptimizer();
  }
  return optimizerInstance;
}

module.exports = { PromptOptimizer, getPromptOptimizer };

