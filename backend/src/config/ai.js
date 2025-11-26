/**
 * AI Configuration
 * 
 * Central configuration for AI features
 * 
 * @version 1.0
 */

module.exports = {
  // OpenAI Configuration
  openai: {
    apiKey: process.env.OPENAI_API_KEY,
    model: process.env.OPENAI_MODEL || 'gpt-3.5-turbo',
    enabled: !!process.env.OPENAI_API_KEY
  },

  // Default AI Parameters
  defaults: {
    temperature: 0.9,
    maxTokens: 300,
    responseFormat: 'json_object'
  },

  // Cache Configuration
  cache: {
    enabled: true,
    ttl: {
      login: 60 * 5, // 5 minutes
      idle: 60 * 2, // 2 minutes
      chat: 60 * 1, // 1 minute
      chaos: 60 * 3, // 3 minutes
      joke: 60 * 10, // 10 minutes
      roast: 60 * 5, // 5 minutes
      dare: 60 * 5, // 5 minutes
      rewards: 60 * 2, // 2 minutes
      default: 60 * 3 // 3 minutes
    },
    maxSize: 1000
  },

  // Retry Configuration
  retry: {
    maxRetries: 3,
    retryDelay: 1000, // milliseconds
    exponentialBackoff: true
  },

  // Analytics Configuration
  analytics: {
    enabled: true,
    maxEvents: 10000,
    cleanupInterval: 60 * 60 * 1000, // 1 hour
    dataRetention: 30 * 24 * 60 * 60 * 1000 // 30 days
  },

  // Feedback Configuration
  feedback: {
    enabled: true,
    maxFeedback: 5000,
    implicitTracking: true,
    explicitRatings: true
  },

  // A/B Testing Configuration
  abTesting: {
    enabled: true,
    minSamples: 100,
    significanceLevel: 0.05,
    autoSelectWinner: true
  },

  // Prompt Configuration
  prompts: {
    indexPath: '../../../prompts/prompt-index.json',
    autoReload: process.env.NODE_ENV === 'development',
    validationEnabled: true
  }
};

