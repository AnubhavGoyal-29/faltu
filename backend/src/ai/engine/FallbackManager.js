/**
 * Fallback Manager
 * 
 * Manages fallback chains for AI calls.
 * Implements progressive degradation with multiple fallback strategies.
 * 
 * @version 1.0
 */

class FallbackManager {
  constructor() {
    this.maxRetries = 3;
    this.retryDelay = 1000; // 1 second
    this.fallbackChain = [];
  }

  /**
   * Execute function with fallback chain
   */
  async executeWithFallback(primaryFn, fallbackFns = []) {
    // Try primary function with retries
    const primaryResult = await this.executeWithRetry(primaryFn);
    
    if (primaryResult !== null) {
      return primaryResult;
    }
    
    console.log(`🤖 [FALLBACK] Primary function failed, trying fallbacks...`);
    
    // Try each fallback in sequence
    for (let i = 0; i < fallbackFns.length; i++) {
      const fallbackFn = fallbackFns[i];
      console.log(`🤖 [FALLBACK] Trying fallback ${i + 1}/${fallbackFns.length}`);
      
      try {
        const result = await fallbackFn();
        
        if (result !== null && result !== undefined) {
          console.log(`🤖 [FALLBACK] ✅ Fallback ${i + 1} succeeded!`);
          return result;
        }
      } catch (error) {
        console.error(`🤖 [FALLBACK] Fallback ${i + 1} error:`, error.message);
      }
    }
    
    console.log(`🤖 [FALLBACK] ❌ All fallbacks exhausted`);
    return null;
  }

  /**
   * Execute function with retry logic
   */
  async executeWithRetry(fn, retries = this.maxRetries) {
    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        const result = await fn();
        return result;
      } catch (error) {
        console.error(`🤖 [RETRY] Attempt ${attempt}/${retries} failed:`, error.message);
        
        if (attempt < retries) {
          // Wait before retry
          await this.delay(this.retryDelay * attempt); // Exponential backoff
        } else {
          console.error(`🤖 [RETRY] Max retries reached`);
          return null;
        }
      }
    }
    
    return null;
  }

  /**
   * Delay helper
   */
  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Add global fallback
   */
  addGlobalFallback(fallbackFn) {
    if (typeof fallbackFn === 'function') {
      this.fallbackChain.push(fallbackFn);
    }
  }

  /**
   * Clear global fallbacks
   */
  clearGlobalFallbacks() {
    this.fallbackChain = [];
  }

  /**
   * Set max retries
   */
  setMaxRetries(retries) {
    this.maxRetries = retries;
  }

  /**
   * Set retry delay
   */
  setRetryDelay(delay) {
    this.retryDelay = delay;
  }

  /**
   * Get configuration
   */
  getConfig() {
    return {
      maxRetries: this.maxRetries,
      retryDelay: this.retryDelay,
      globalFallbacksCount: this.fallbackChain.length
    };
  }
}

module.exports = FallbackManager;

