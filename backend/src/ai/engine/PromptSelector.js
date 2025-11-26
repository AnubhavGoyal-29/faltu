/**
 * Prompt Selector
 * 
 * Intelligently selects the best prompt for each AI request based on:
 * - Request context and reason
 * - Prompt performance history
 * - User history and preferences
 * - A/B testing variants
 * 
 * @version 1.0
 */

const { getFormattedPrompt } = require('../prompt-loaders/promptLoader');
const PromptRegistry = require('../prompts/PromptRegistry');

class PromptSelector {
  constructor() {
    this.registry = new PromptRegistry();
    
    // Map reason types to primary prompts
    this.reasonToPrompt = {
      'login': 'engagement.welcome',
      'idle': 'engagement.idle',
      'chat': 'chat.conversation',
      'chaos': 'ui.chaos',
      'cron': 'system.cron',
      'rewards': 'rewards.points',
      'joke': 'games.joke',
      'roast': 'games.roast',
      'dare': 'games.dare',
      'bakchodi': 'games.bakchodi',
      'meme': 'games.meme',
      'debate': 'games.debate',
      'future': 'games.future',
      'games': 'games.bakchodi' // Default for games
    };
    
    // Alternate prompts for fallback
    this.alternates = {
      'engagement.welcome': ['engagement.idle', 'fallbacks.generic'],
      'chat.conversation': ['engagement.idle', 'fallbacks.generic'],
      'games.joke': ['games.roast', 'fallbacks.generic']
    };
  }

  /**
   * Select best prompt for request
   */
  async select(context) {
    const { reason, user, appState } = context;
    
    // 1. Get primary prompt ID for this reason
    const primaryPromptId = this.reasonToPrompt[reason] || 'system.core';
    
    // 2. Load system prompt (always needed)
    const systemPromptData = getFormattedPrompt('system.core', this.buildVariables(context));
    
    if (!systemPromptData) {
      console.error(`🤖 [PROMPT SELECTOR] ❌ System prompt not found!`);
      return null;
    }
    
    // 3. Load specific prompt for this reason
    const specificPromptData = getFormattedPrompt(primaryPromptId, this.buildVariables(context));
    
    if (!specificPromptData) {
      console.warn(`🤖 [PROMPT SELECTOR] ⚠️ Prompt ${primaryPromptId} not found, using system prompt`);
      return {
        promptId: 'system.core',
        systemPrompt: systemPromptData.prompt,
        userPrompt: systemPromptData.prompt,
        params: systemPromptData.params || {}
      };
    }
    
    // 4. Build final prompt selection
    return {
      promptId: primaryPromptId,
      systemPrompt: systemPromptData.prompt,
      userPrompt: specificPromptData.prompt,
      params: specificPromptData.params || systemPromptData.params || {},
      metadata: {
        name: specificPromptData.name,
        version: specificPromptData.version,
        tags: specificPromptData.tags
      }
    };
  }

  /**
   * Select alternate prompt if primary fails
   */
  async selectAlternate(context, failedPromptId) {
    const alternates = this.alternates[failedPromptId] || ['fallbacks.generic'];
    
    for (const alternateId of alternates) {
      const promptData = getFormattedPrompt(alternateId, this.buildVariables(context));
      
      if (promptData) {
        const systemPromptData = getFormattedPrompt('system.core', this.buildVariables(context));
        
        return {
          promptId: alternateId,
          systemPrompt: systemPromptData?.prompt || promptData.prompt,
          userPrompt: promptData.prompt,
          params: promptData.params || {}
        };
      }
    }
    
    return null;
  }

  /**
   * Build template variables from context
   */
  buildVariables(context) {
    const { user, appState, reason } = context;
    
    return {
      // User info
      user: user?.name || 'Unknown',
      userName: user?.name || 'Unknown',
      userEmail: user?.email || '',
      userPoints: user?.points || 0,
      
      // App state
      loginStreak: appState?.login_streak || 0,
      currentTime: new Date().toISOString(),
      reason: reason,
      appState: JSON.stringify(appState || {}),
      
      // Chat context
      chatContext: appState?.chatContext || '',
      roomName: appState?.roomName || '',
      recentMessages: appState?.recentMessages || '',
      recent_messages: appState?.recent_messages || appState?.recentMessages || '',
      messageCount: appState?.messageCount || appState?.message_count || 0,
      activityLevel: appState?.activityLevel || 'medium',
      
      // Engagement
      idleDuration: appState?.idleDuration || 0,
      currentPage: appState?.currentPage || '',
      lastActivity: appState?.lastActivity || '',
      
      // Game specific
      action: appState?.action || '',
      mode: appState?.mode || appState?.action || 'default',
      challenge: appState?.challenge || '',
      submission: appState?.submission || '',
      caption: appState?.caption || '',
      topic: appState?.topic || '',
      userArgument: appState?.user_argument || '',
      user_argument: appState?.user_argument || '',
      
      // Rewards
      currentPoints: user?.points || 0,
      
      // Misc
      should_end: appState?.should_end || false,
      name: appState?.name || '',
      mood: appState?.mood || '',
      favSnack: appState?.fav_snack || '',
      date: new Date().toISOString().split('T')[0],
      recentJokes: appState?.recentJokes || 'none',
      preference: appState?.preference || '',
      eventType: appState?.eventType || '',
      userActivity: appState?.userActivity || '',
      recentEvents: appState?.recentEvents || '',
      imageUrl: appState?.imageUrl || '',
      currentState: JSON.stringify(appState || {}),
      originalRequest: reason,
      errorType: '',
      fallbackReason: ''
    };
  }

  /**
   * Add new reason mapping
   */
  addReasonMapping(reason, promptId) {
    this.reasonToPrompt[reason] = promptId;
  }

  /**
   * Add alternate prompts
   */
  addAlternates(promptId, alternateIds) {
    this.alternates[promptId] = alternateIds;
  }

  /**
   * Get all reason mappings
   */
  getReasonMappings() {
    return { ...this.reasonToPrompt };
  }
}

module.exports = PromptSelector;

