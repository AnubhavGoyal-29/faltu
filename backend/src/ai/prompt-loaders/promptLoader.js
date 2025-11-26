/**
 * Prompt Loader Utility
 * 
 * Loads and manages AI prompts from the prompts directory.
 * Supports template variable replacement.
 * 
 * @version 1.0
 */

const path = require('path');
const fs = require('fs');

// Cache for loaded prompts
const promptCache = new Map();

/**
 * Load a prompt file
 * @param {string} promptPath - Path to prompt file (e.g., 'games.joke')
 * @returns {Object} Prompt object with name, description, prompt, etc.
 */
const loadPrompt = (promptPath) => {
  // Check cache first
  if (promptCache.has(promptPath)) {
    return promptCache.get(promptPath);
  }

  try {
    // Resolve prompt file path
    // From backend/src/ai/prompt-loaders -> go to root -> prompts folder
    // __dirname = backend/src/ai/prompt-loaders
    // ../../../../ = root directory
    const fullPath = path.join(__dirname, '../../../../prompts', `${promptPath}.prompt.js`);
    
    if (!fs.existsSync(fullPath)) {
      console.error(`🤖 [PROMPT] Prompt file not found: ${promptPath}`);
      console.error(`🤖 [PROMPT] Looking for: ${fullPath}`);
      return null;
    }

    // Load prompt module
    const promptModule = require(fullPath);
    
    // Cache it
    promptCache.set(promptPath, promptModule);
    
    return promptModule;
  } catch (error) {
    console.error(`🤖 [PROMPT] Error loading prompt ${promptPath}:`, error.message);
    return null;
  }
};

/**
 * Replace template variables in prompt text
 * @param {string} promptText - Prompt text with {{variables}}
 * @param {Object} variables - Variables to replace
 * @returns {string} Prompt text with variables replaced
 */
const replaceVariables = (promptText, variables = {}) => {
  let result = promptText;
  
  // Replace all {{variable}} patterns
  Object.keys(variables).forEach(key => {
    const regex = new RegExp(`\\{\\{${key}\\}\\}`, 'g');
    const value = variables[key] !== undefined && variables[key] !== null 
      ? String(variables[key]) 
      : '';
    result = result.replace(regex, value);
  });
  
  return result;
};

/**
 * Get formatted prompt with variables replaced
 * @param {string} promptPath - Path to prompt file
 * @param {Object} variables - Variables to replace
 * @param {Object} options - Options (temperature, maxTokens, etc.)
 * @returns {Object} Formatted prompt ready for AI
 */
const getFormattedPrompt = (promptPath, variables = {}, options = {}) => {
  const promptModule = loadPrompt(promptPath);
  
  if (!promptModule) {
    return null;
  }

  // Replace variables in prompt text
  const formattedPrompt = replaceVariables(promptModule.prompt, variables);
  
  // Merge default params with options
  const params = {
    ...promptModule.defaultParams,
    ...options
  };

  return {
    prompt: formattedPrompt,
    name: promptModule.name,
    description: promptModule.description,
    version: promptModule.version,
    tags: promptModule.tags || [],
    params: params
  };
};

/**
 * Clear prompt cache (useful for development/reloading)
 */
const clearCache = () => {
  promptCache.clear();
};

module.exports = {
  loadPrompt,
  getFormattedPrompt,
  replaceVariables,
  clearCache
};

