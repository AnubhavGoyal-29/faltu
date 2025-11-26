/**
 * AI Engine - Main Orchestrator
 * 
 * Central AI decision engine that intelligently:
 * - Selects the best prompt for each request
 * - Builds comprehensive context
 * - Manages response caching
 * - Handles fallback chains
 * - Tracks analytics
 * 
 * @version 1.0
 */

const OpenAI = require('openai');
const PromptSelector = require('./PromptSelector');
const ContextBuilder = require('./ContextBuilder');
const ResponseCache = require('./ResponseCache');
const FallbackManager = require('./FallbackManager');

class AIEngine {
  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });
    
    this.promptSelector = new PromptSelector();
    this.contextBuilder = new ContextBuilder();
    this.responseCache = new ResponseCache();
    this.fallbackManager = new FallbackManager();
    
    this.enabled = !!process.env.OPENAI_API_KEY;
    this.model = process.env.OPENAI_MODEL || 'gpt-3.5-turbo';
    
    this.analytics = {
      totalCalls: 0,
      successfulCalls: 0,
      failedCalls: 0,
      cacheHits: 0,
      totalResponseTime: 0,
      promptUsage: {}
    };
  }

  /**
   * Check if AI is enabled
   */
  isEnabled() {
    return this.enabled;
  }

  /**
   * Main entry point for all AI requests
   */
  async process(request) {
    const startTime = Date.now();
    
    console.log(`🤖 [AI ENGINE] Processing request: ${request.reason}, User: ${request.user?.name || 'N/A'}`);
    
    if (!this.isEnabled()) {
      console.log(`🤖 [AI ENGINE] ❌ AI disabled - using fallback`);
      return null;
    }

    try {
      // 1. Build comprehensive context
      const context = await this.contextBuilder.build(request);
      
      // 2. Check cache for similar requests
      const cacheKey = this.responseCache.generateKey(context);
      const cached = await this.responseCache.get(cacheKey);
      
      if (cached) {
        console.log(`🤖 [AI ENGINE] ✅ Cache hit!`);
        this.analytics.cacheHits++;
        return cached;
      }
      
      // 3. Select best prompt for this request
      const promptSelection = await this.promptSelector.select(context);
      
      if (!promptSelection) {
        console.log(`🤖 [AI ENGINE] ⚠️ No prompt found for reason: ${request.reason}`);
        return null;
      }
      
      console.log(`🤖 [AI ENGINE] Selected prompt: ${promptSelection.promptId}`);
      
      // 4. Call AI with fallback chain
      const response = await this.fallbackManager.executeWithFallback(
        async () => await this.callOpenAI(promptSelection, context),
        [
          () => this.tryAlternatePrompt(promptSelection, context),
          () => this.useDefaultResponse(context)
        ]
      );
      
      // 5. Cache response
      if (response) {
        await this.responseCache.set(cacheKey, response, context.reason);
      }
      
      // 6. Track analytics
      const responseTime = Date.now() - startTime;
      this.trackSuccess(promptSelection.promptId, responseTime);
      
      console.log(`🤖 [AI ENGINE] ✅ Response generated in ${responseTime}ms`);
      
      return response;
      
    } catch (error) {
      console.error(`🤖 [AI ENGINE] ❌ Error:`, error.message);
      this.trackFailure(request.reason);
      return null;
    }
  }

  /**
   * Call OpenAI API
   */
  async callOpenAI(promptSelection, context) {
    const { systemPrompt, userPrompt, params } = promptSelection;
    
    const completion = await this.openai.chat.completions.create({
      model: this.model,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      temperature: params.temperature || 0.9,
      max_tokens: params.maxTokens || 300,
      response_format: { type: 'json_object' }
    });

    const response = completion.choices[0].message.content;
    const parsed = JSON.parse(response);
    
    return parsed;
  }

  /**
   * Try alternate prompt if primary fails
   */
  async tryAlternatePrompt(originalSelection, context) {
    console.log(`🤖 [AI ENGINE] Trying alternate prompt...`);
    
    const alternate = await this.promptSelector.selectAlternate(
      context,
      originalSelection.promptId
    );
    
    if (alternate) {
      return await this.callOpenAI(alternate, context);
    }
    
    return null;
  }

  /**
   * Use default/fallback response
   */
  useDefaultResponse(context) {
    console.log(`🤖 [AI ENGINE] Using default response`);
    
    // Return structured default based on reason
    const defaults = {
      'login': { message: `Welcome to FaltuVerse! Chal kuch faltu karte hain! 🎉` },
      'chat': { message: 'Kya chal raha hai yaar? 😄', shouldSend: true },
      'chaos': { type: 'confetti', content: 'Chaos time! 🎉' },
      'idle': { type: 'popup', content: 'Bhai kidhar so gaya? Kuch karo!' },
      'rewards': { points: 10, reason: 'activity' },
      'joke': { joke: 'Ek baar ek banda... arrey yaar, bhool gaya! 😅' }
    };
    
    return defaults[context.reason] || { message: 'Kuch toh hua! 🎉' };
  }

  /**
   * Track successful call
   */
  trackSuccess(promptId, responseTime) {
    this.analytics.totalCalls++;
    this.analytics.successfulCalls++;
    this.analytics.totalResponseTime += responseTime;
    
    if (!this.analytics.promptUsage[promptId]) {
      this.analytics.promptUsage[promptId] = {
        calls: 0,
        successes: 0,
        failures: 0,
        totalTime: 0
      };
    }
    
    this.analytics.promptUsage[promptId].calls++;
    this.analytics.promptUsage[promptId].successes++;
    this.analytics.promptUsage[promptId].totalTime += responseTime;
  }

  /**
   * Track failed call
   */
  trackFailure(reason) {
    this.analytics.totalCalls++;
    this.analytics.failedCalls++;
  }

  /**
   * Get analytics summary
   */
  getAnalytics() {
    const avgResponseTime = this.analytics.totalCalls > 0
      ? Math.round(this.analytics.totalResponseTime / this.analytics.totalCalls)
      : 0;
    
    const successRate = this.analytics.totalCalls > 0
      ? Math.round((this.analytics.successfulCalls / this.analytics.totalCalls) * 100)
      : 0;
    
    const cacheHitRate = this.analytics.totalCalls > 0
      ? Math.round((this.analytics.cacheHits / this.analytics.totalCalls) * 100)
      : 0;

    return {
      summary: {
        totalCalls: this.analytics.totalCalls,
        successfulCalls: this.analytics.successfulCalls,
        failedCalls: this.analytics.failedCalls,
        cacheHits: this.analytics.cacheHits,
        successRate: `${successRate}%`,
        cacheHitRate: `${cacheHitRate}%`,
        avgResponseTime: `${avgResponseTime}ms`
      },
      promptUsage: this.analytics.promptUsage
    };
  }

  /**
   * Reset analytics
   */
  resetAnalytics() {
    this.analytics = {
      totalCalls: 0,
      successfulCalls: 0,
      failedCalls: 0,
      cacheHits: 0,
      totalResponseTime: 0,
      promptUsage: {}
    };
  }
}

// Singleton instance
let aiEngineInstance = null;

function getAIEngine() {
  if (!aiEngineInstance) {
    aiEngineInstance = new AIEngine();
  }
  return aiEngineInstance;
}

module.exports = { AIEngine, getAIEngine };

