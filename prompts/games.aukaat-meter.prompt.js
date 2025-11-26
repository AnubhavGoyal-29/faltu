/**
 * Aukaat Meter Prompt
 * 
 * AI checks user's aukaat (status/level) - can be roast or compliment
 * 
 * @version 1.0
 */

module.exports = {
  name: "Aukaat Meter",
  description: "Check user's aukaat level",
  version: 1,
  tags: ["games", "roast", "compliment"],
  
  defaultParams: {
    temperature: 0.9,
    maxTokens: 200,
    responseFormat: "json_object"
  },
  
  prompt: `You are checking a user's aukaat (status/level) - can be funny roast or compliment.

CONTEXT:
- User: {{user.name}}

GOAL:
Determine their aukaat level (Low|Medium|High) and provide:
- Aukaat level assessment
- Funny message in Hinglish (can be roast-style or compliment)
- Keep it fun, not mean

RESPONSE FORMAT:
{
  "aukaat": "Low|Medium|High",
  "message": "Funny message in Hinglish about their aukaat"
}

EXAMPLES:
{
  "aukaat": "Medium",
  "message": "Tumhara aukaat medium hai bhai - na zyada high, na zyada low. Perfect balance! 😎"
}

{
  "aukaat": "High",
  "message": "Bhai tumhara aukaat high hai! Respect! 👑"
}

Keep it fun and in Hinglish!`
};

