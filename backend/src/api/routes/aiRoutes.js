/**
 * AI Management Routes
 * 
 * Routes for AI analytics, prompt management, and optimization
 * 
 * @version 1.0
 */

const express = require('express');
const router = express.Router();
const { authenticate } = require('../../middlewares/auth');
const { getAIEngine } = require('../../ai/engine/AIEngine');
const { getAnalyticsTracker } = require('../../ai/improvement/AnalyticsTracker');
const { getFeedbackCollector } = require('../../ai/improvement/FeedbackCollector');
const { getPromptOptimizer } = require('../../ai/improvement/PromptOptimizer');
const PromptRegistry = require('../../ai/prompts/PromptRegistry');

// Initialize instances
const aiEngine = getAIEngine();
const analytics = getAnalyticsTracker();
const feedback = getFeedbackCollector();
const optimizer = getPromptOptimizer();
const registry = new PromptRegistry();

/**
 * GET /api/ai/status
 * Get AI system status
 */
router.get('/status', (req, res) => {
  res.json({
    status: 'success',
    data: {
      enabled: aiEngine.isEnabled(),
      model: process.env.OPENAI_MODEL || 'gpt-3.5-turbo',
      analytics: aiEngine.getAnalytics().summary
    }
  });
});

/**
 * GET /api/ai/analytics
 * Get comprehensive AI analytics
 */
router.get('/analytics', authenticate, (req, res) => {
  res.json({
    status: 'success',
    data: {
      engine: aiEngine.getAnalytics(),
      tracker: analytics.getMetrics(),
      feedback: feedback.getSummary(),
      optimizer: optimizer.getSummary()
    }
  });
});

/**
 * GET /api/ai/prompts
 * Get all prompts
 */
router.get('/prompts', authenticate, (req, res) => {
  const { category, tag, search } = req.query;
  
  let prompts;
  
  if (category) {
    prompts = registry.getPromptsByCategory(category);
  } else if (tag) {
    prompts = registry.getPromptsByTag(tag);
  } else if (search) {
    prompts = registry.searchPrompts(search);
  } else {
    prompts = registry.getAllPrompts();
  }
  
  res.json({
    status: 'success',
    data: {
      prompts,
      total: prompts.length,
      index: registry.getIndex()
    }
  });
});

/**
 * GET /api/ai/prompts/:promptId
 * Get specific prompt details
 */
router.get('/prompts/:promptId', authenticate, (req, res) => {
  const { promptId } = req.params;
  const prompt = registry.getPrompt(promptId);
  
  if (!prompt) {
    return res.status(404).json({
      status: 'error',
      message: 'Prompt not found'
    });
  }
  
  // Get feedback for this prompt
  const promptFeedback = feedback.getAverageRating(promptId);
  
  res.json({
    status: 'success',
    data: {
      prompt,
      feedback: promptFeedback
    }
  });
});

/**
 * POST /api/ai/prompts/refresh
 * Refresh prompt index
 */
router.post('/prompts/refresh', authenticate, async (req, res) => {
  try {
    const index = await registry.refresh();
    
    res.json({
      status: 'success',
      message: 'Prompt index refreshed',
      data: {
        totalPrompts: index.totalPrompts,
        categories: Object.keys(index.categories).length,
        tags: Object.keys(index.tags).length
      }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Failed to refresh prompt index',
      error: error.message
    });
  }
});

/**
 * POST /api/ai/feedback
 * Submit explicit feedback
 */
router.post('/feedback', authenticate, (req, res) => {
  const { promptId, rating, comment } = req.body;
  const userId = req.user.user_id;
  
  if (!promptId || !rating) {
    return res.status(400).json({
      status: 'error',
      message: 'promptId and rating are required'
    });
  }
  
  if (rating < 1 || rating > 5) {
    return res.status(400).json({
      status: 'error',
      message: 'rating must be between 1 and 5'
    });
  }
  
  const feedbackEntry = feedback.collectExplicit(
    userId,
    promptId,
    req.body.reason || 'general',
    rating,
    comment
  );
  
  res.json({
    status: 'success',
    message: 'Feedback submitted',
    data: feedbackEntry
  });
});

/**
 * GET /api/ai/experiments
 * Get active A/B testing experiments
 */
router.get('/experiments', authenticate, (req, res) => {
  const active = optimizer.getActiveExperiments();
  const completed = optimizer.getAllResults();
  
  res.json({
    status: 'success',
    data: {
      active: active.map(e => ({
        promptId: e.promptId,
        variants: e.variants.length,
        status: e.status,
        startTime: e.startTime
      })),
      completed: completed.slice(-10).map(r => ({
        promptId: r.experiment.promptId,
        winner: r.winner.id,
        significant: r.isSignificant,
        completedAt: r.completedAt
      }))
    }
  });
});

/**
 * GET /api/ai/stats
 * Get comprehensive AI stats
 */
router.get('/stats', authenticate, (req, res) => {
  res.json({
    status: 'success',
    data: {
      registry: registry.getStats(),
      analytics: analytics.getMetrics(),
      feedback: feedback.getSummary(),
      optimizer: optimizer.getSummary()
    }
  });
});

/**
 * POST /api/ai/reset-analytics
 * Reset analytics (admin only)
 */
router.post('/reset-analytics', authenticate, (req, res) => {
  // TODO: Add admin check
  
  aiEngine.resetAnalytics();
  analytics.reset();
  
  res.json({
    status: 'success',
    message: 'Analytics reset successfully'
  });
});

module.exports = router;

