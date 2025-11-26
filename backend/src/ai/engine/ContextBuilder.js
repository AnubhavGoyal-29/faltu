/**
 * Context Builder
 * 
 * Aggregates and enriches context for AI requests.
 * Pulls data from multiple sources to provide comprehensive context.
 * 
 * @version 1.0
 */

class ContextBuilder {
  constructor() {
    this.contextEnrichers = [];
  }

  /**
   * Build comprehensive context from request
   */
  async build(request) {
    const context = {
      reason: request.reason,
      user: request.user || null,
      appState: request.appState || {},
      chatContext: request.chatContext || null,
      temperature: request.temperature,
      maxTokens: request.maxTokens,
      timestamp: new Date().toISOString()
    };

    // Enrich user context if user provided
    if (context.user) {
      context.user = await this.enrichUserContext(context.user);
    }

    // Enrich app state
    context.appState = await this.enrichAppState(context.appState, request.reason);

    // Run custom enrichers
    for (const enricher of this.contextEnrichers) {
      try {
        context = await enricher(context);
      } catch (error) {
        console.error(`🤖 [CONTEXT] Enricher error:`, error.message);
      }
    }

    return context;
  }

  /**
   * Enrich user context with additional data
   */
  async enrichUserContext(user) {
    // Add any additional user data needed
    return {
      ...user,
      // Could fetch user history, preferences, etc.
      enriched: true
    };
  }

  /**
   * Enrich app state with reason-specific data
   */
  async enrichAppState(appState, reason) {
    const enriched = { ...appState };

    // Add reason-specific enrichment
    switch (reason) {
      case 'chat':
        enriched.chatMode = true;
        break;
      case 'games':
        enriched.gameMode = true;
        break;
      case 'chaos':
        enriched.chaosMode = true;
        break;
    }

    return enriched;
  }

  /**
   * Register custom context enricher
   */
  registerEnricher(enricherFn) {
    if (typeof enricherFn === 'function') {
      this.contextEnrichers.push(enricherFn);
    }
  }

  /**
   * Extract relevant context for caching
   */
  extractCacheableContext(context) {
    // Return minimal context needed for cache key generation
    return {
      reason: context.reason,
      userId: context.user?.user_id,
      key: context.appState?.action || context.appState?.mode || 'default'
    };
  }
}

module.exports = ContextBuilder;

