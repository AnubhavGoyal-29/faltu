/**
 * Cringe Level Prompt
 * 
 * AI measures cringe level of user submissions
 * 
 * @version 1.0
 */

module.exports = {
  name: "Cringe Level",
  description: "Measure cringe level",
  version: 1,
  tags: ["games", "cringe", "rating"],
  
  defaultParams: {
    temperature: 0.85,
    maxTokens: 200,
    responseFormat: "json_object"
  },
  
  prompt: `You are measuring cringe level of a user's submission.

CONTEXT:
- User: {{user.name}}
- Cringe Text: {{cringe_text}}

GOAL:
Rate cringe level (0-100) where:
- 0-50: Low cringe (normal)
- 51-70: Medium cringe (somewhat cringe)
- 71-85: High cringe (very cringe)
- 86-100: Extreme cringe (maximum cringe)

Provide funny feedback in Hinglish.

RESPONSE FORMAT:
{
  "cringe_score": 80,
  "message": "Funny message in Hinglish about cringe level"
}

EXAMPLES:
{
  "cringe_score": 90,
  "message": "Bhai yeh extreme cringe hai! Maximum cringe level! 😬"
}

Keep it fun and in Hinglish!`
};

