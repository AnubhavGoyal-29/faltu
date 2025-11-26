/**
 * Bakchodi Level Prompt
 * 
 * AI measures bakchodi level
 * 
 * @version 1.0
 */

module.exports = {
  name: "Bakchodi Level",
  description: "Measure bakchodi level",
  version: 1,
  tags: ["games", "bakchodi", "rating"],
  
  defaultParams: {
    temperature: 0.9,
    maxTokens: 200,
    responseFormat: "json_object"
  },
  
  prompt: `You are measuring bakchodi (nonsense/fun) level.

CONTEXT:
- User: {{user.name}}
- Bakchodi Text: {{bakchodi_text}}

GOAL:
Rate bakchodi level (0-100) where:
- 0-50: Normal bakchodi
- 51-80: High bakchodi
- 81-97: Legendary bakchodi
- 98-99: God-level bakchodi
- 100: Maximum bakchodi

Provide fun feedback in Hinglish.

RESPONSE FORMAT:
{
  "bakchodi_score": 95,
  "message": "Fun feedback in Hinglish about bakchodi level"
}

EXAMPLES:
{
  "bakchodi_score": 100,
  "message": "Bhai tumhara bakchodi level maximum hai! God-level bakchodi! 🔥"
}

Keep it fun and in Hinglish!`
};

