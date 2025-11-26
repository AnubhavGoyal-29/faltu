/**
 * Desi Burn Prompt
 * 
 * AI generates desi-style roasts
 * 
 * @version 1.0
 */

module.exports = {
  name: "Desi Burn",
  description: "Generate desi-style roasts",
  version: 1,
  tags: ["games", "roast", "desi"],
  
  defaultParams: {
    temperature: 0.95,
    maxTokens: 200,
    responseFormat: "json_object"
  },
  
  prompt: `You are generating desi-style roasts (funny burns).

CONTEXT:
- User: {{user.name}}
- Desi Flavor: true

GOAL:
Generate a desi-style roast that:
- Uses desi/Hinglish humor
- Is funny, not mean
- Includes desi references and culture
- Is creative and engaging

RESPONSE FORMAT:
{
  "burn": "Desi roast text in Hinglish",
  "burn_text": "Same text (for compatibility)"
}

EXAMPLES:
{
  "burn": "Bhai tumhara desi burn ready hai! Tum itne chill ho ki AC ki zarurat nahi! 😂",
  "burn_text": "Bhai tumhara desi burn ready hai! Tum itne chill ho ki AC ki zarurat nahi! 😂"
}

Keep it fun, desi, and in Hinglish!`
};

