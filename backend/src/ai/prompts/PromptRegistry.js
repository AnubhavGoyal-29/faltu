/**
 * Prompt Registry
 * 
 * Central registry of all prompts with:
 * - Auto-discovery and indexing
 * - Performance tracking
 * - Version management
 * - Search and filtering
 * 
 * @version 1.0
 */

const fs = require('fs');
const path = require('path');

class PromptRegistry {
  constructor() {
    this.prompts = new Map();
    this.index = null;
    this.indexPath = path.join(__dirname, '../../../../prompts/prompt-index.json');
    this.promptsDir = path.join(__dirname, '../../../../prompts');
    
    // Load existing index or generate new one
    this.loadIndex();
  }

  /**
   * Load prompt index
   */
  loadIndex() {
    try {
      if (fs.existsSync(this.indexPath)) {
        const indexData = fs.readFileSync(this.indexPath, 'utf8');
        this.index = JSON.parse(indexData);
        console.log(`📚 [PROMPT REGISTRY] Loaded index with ${this.index.prompts?.length || 0} prompts`);
        
        // Load prompts into memory
        this.index.prompts?.forEach(prompt => {
          this.prompts.set(prompt.id, prompt);
        });
      } else {
        console.log(`📚 [PROMPT REGISTRY] Index not found, will generate on first scan`);
      }
    } catch (error) {
      console.error(`📚 [PROMPT REGISTRY] Error loading index:`, error.message);
    }
  }

  /**
   * Scan prompts directory and generate index
   */
  async generateIndex() {
    console.log(`📚 [PROMPT REGISTRY] Generating prompt index...`);
    
    const prompts = [];
    const categories = {};
    const tags = {};
    
    // Scan all subdirectories
    const scanDir = (dir, category = null) => {
      const items = fs.readdirSync(dir);
      
      items.forEach(item => {
        const fullPath = path.join(dir, item);
        const stat = fs.statSync(fullPath);
        
        if (stat.isDirectory()) {
          // Scan subdirectory
          scanDir(fullPath, item);
        } else if (item.endsWith('.prompt.js')) {
          try {
            // Load prompt module
            const promptModule = require(fullPath);
            
            // Extract prompt info
            const promptId = this.getPromptIdFromPath(fullPath);
            const promptInfo = {
              id: promptId,
              name: promptModule.name || promptId,
              description: promptModule.description || '',
              category: category || 'uncategorized',
              subcategory: this.extractSubcategory(promptId),
              filePath: path.relative(this.promptsDir, fullPath),
              version: promptModule.version || 1,
              tags: promptModule.tags || [],
              requiredVariables: this.extractVariables(promptModule.prompt),
              defaultParams: promptModule.defaultParams || {},
              usageCount: 0,
              avgResponseTime: 0,
              successRate: 100,
              lastUpdated: stat.mtime.toISOString()
            };
            
            prompts.push(promptInfo);
            
            // Index by category
            if (!categories[promptInfo.category]) {
              categories[promptInfo.category] = [];
            }
            categories[promptInfo.category].push(promptId);
            
            // Index by tags
            promptInfo.tags.forEach(tag => {
              if (!tags[tag]) {
                tags[tag] = [];
              }
              tags[tag].push(promptId);
            });
            
          } catch (error) {
            console.error(`📚 [PROMPT REGISTRY] Error loading ${item}:`, error.message);
          }
        }
      });
    };
    
    // Start scan
    scanDir(this.promptsDir);
    
    // Generate index object
    this.index = {
      version: "1.0.0",
      generated: new Date().toISOString(),
      totalPrompts: prompts.length,
      prompts,
      categories,
      tags
    };
    
    // Save to file
    this.saveIndex();
    
    // Load into memory
    prompts.forEach(prompt => {
      this.prompts.set(prompt.id, prompt);
    });
    
    console.log(`📚 [PROMPT REGISTRY] ✅ Generated index with ${prompts.length} prompts`);
    
    return this.index;
  }

  /**
   * Save index to file
   */
  saveIndex() {
    try {
      fs.writeFileSync(
        this.indexPath,
        JSON.stringify(this.index, null, 2),
        'utf8'
      );
      console.log(`📚 [PROMPT REGISTRY] ✅ Index saved to ${this.indexPath}`);
    } catch (error) {
      console.error(`📚 [PROMPT REGISTRY] Error saving index:`, error.message);
    }
  }

  /**
   * Extract prompt ID from file path
   */
  getPromptIdFromPath(filePath) {
    const fileName = path.basename(filePath, '.prompt.js');
    return fileName;
  }

  /**
   * Extract subcategory from prompt ID
   */
  extractSubcategory(promptId) {
    const parts = promptId.split('.');
    return parts[1] || 'general';
  }

  /**
   * Extract template variables from prompt text
   */
  extractVariables(promptText) {
    const variablePattern = /\{\{(\w+)\}\}/g;
    const variables = new Set();
    let match;
    
    while ((match = variablePattern.exec(promptText)) !== null) {
      variables.add(match[1]);
    }
    
    return Array.from(variables);
  }

  /**
   * Get prompt by ID
   */
  getPrompt(promptId) {
    return this.prompts.get(promptId);
  }

  /**
   * Get all prompts
   */
  getAllPrompts() {
    return Array.from(this.prompts.values());
  }

  /**
   * Get prompts by category
   */
  getPromptsByCategory(category) {
    return this.getAllPrompts().filter(p => p.category === category);
  }

  /**
   * Get prompts by tag
   */
  getPromptsByTag(tag) {
    return this.getAllPrompts().filter(p => p.tags.includes(tag));
  }

  /**
   * Search prompts
   */
  searchPrompts(query) {
    const lowerQuery = query.toLowerCase();
    
    return this.getAllPrompts().filter(p =>
      p.id.toLowerCase().includes(lowerQuery) ||
      p.name.toLowerCase().includes(lowerQuery) ||
      p.description.toLowerCase().includes(lowerQuery) ||
      p.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
    );
  }

  /**
   * Update prompt usage stats
   */
  updateUsageStats(promptId, responseTime, success = true) {
    const prompt = this.prompts.get(promptId);
    
    if (prompt) {
      prompt.usageCount++;
      prompt.avgResponseTime = Math.round(
        (prompt.avgResponseTime * (prompt.usageCount - 1) + responseTime) / prompt.usageCount
      );
      
      const successCount = Math.round((prompt.successRate / 100) * (prompt.usageCount - 1));
      const newSuccessCount = successCount + (success ? 1 : 0);
      prompt.successRate = Math.round((newSuccessCount / prompt.usageCount) * 100);
      
      this.prompts.set(promptId, prompt);
    }
  }

  /**
   * Get index
   */
  getIndex() {
    return this.index;
  }

  /**
   * Get registry stats
   */
  getStats() {
    return {
      totalPrompts: this.prompts.size,
      categories: Object.keys(this.index?.categories || {}).length,
      tags: Object.keys(this.index?.tags || {}).length,
      mostUsed: this.getMostUsedPrompts(5),
      leastUsed: this.getLeastUsedPrompts(5)
    };
  }

  /**
   * Get most used prompts
   */
  getMostUsedPrompts(limit = 10) {
    return this.getAllPrompts()
      .sort((a, b) => b.usageCount - a.usageCount)
      .slice(0, limit)
      .map(p => ({ id: p.id, usageCount: p.usageCount }));
  }

  /**
   * Get least used prompts
   */
  getLeastUsedPrompts(limit = 10) {
    return this.getAllPrompts()
      .sort((a, b) => a.usageCount - b.usageCount)
      .slice(0, limit)
      .map(p => ({ id: p.id, usageCount: p.usageCount }));
  }

  /**
   * Refresh index
   */
  async refresh() {
    return await this.generateIndex();
  }
}

module.exports = PromptRegistry;

