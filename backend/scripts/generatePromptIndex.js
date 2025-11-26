/**
 * Generate Prompt Index Script
 * 
 * Scans all prompts and generates prompt-index.json
 */

const PromptRegistry = require('../src/ai/prompts/PromptRegistry');

async function generateIndex() {
  console.log('🚀 Generating prompt index...');
  
  const registry = new PromptRegistry();
  const index = await registry.generateIndex();
  
  console.log('✅ Prompt index generated successfully!');
  console.log(`📊 Total prompts: ${index.totalPrompts}`);
  console.log(`📂 Categories: ${Object.keys(index.categories).length}`);
  console.log(`🏷️  Tags: ${Object.keys(index.tags).length}`);
  
  process.exit(0);
}

generateIndex().catch(error => {
  console.error('❌ Error generating index:', error);
  process.exit(1);
});

