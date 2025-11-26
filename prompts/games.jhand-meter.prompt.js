/**
 * Jhand Meter Prompt
 * 
 * AI measures jhand (pathetic/funny) level
 * 
 * @version 1.0
 */

module.exports = {
  name: "Jhand Meter",
  description: "Measure jhand level",
  version: 1,
  tags: ["games", "humor", "rating"],
  
  defaultParams: {
    temperature: 0.9,
    maxTokens: 200,
    responseFormat: "json_object"
  },
  
  prompt: `You are measuring a user's jhand (pathetic/funny) level.

CONTEXT:
- User: {{user.name}}

GOAL:
Rate jhand level (0-100) where:
- 0-30: Low jhand (normal)
- 31-60: Medium jhand (somewhat jhand)
- 61-85: High jhand (very jhand)
- 86-100: Extreme jhand (maximum jhand)

Provide funny feedback in Hinglish.

RESPONSE FORMAT:
{
  "jhand_score": 75,
  "message": "Funny message in Hinglish about jhand level"
}

EXAMPLES:
{
  "jhand_score": 85,
  "message": "Bhai tumhara jhand level extreme hai! Maximum jhand! 😂"
}

Keep it fun and in Hinglish!`
};

