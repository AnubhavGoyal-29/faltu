/**
 * Vibe Detector Prompt
 * 
 * AI detects user's vibe
 * 
 * @version 1.0
 */

module.exports = {
  name: "Vibe Detector",
  description: "Detect user's vibe",
  version: 1,
  tags: ["games", "vibe", "detection"],
  
  defaultParams: {
    temperature: 0.8,
    maxTokens: 200,
    responseFormat: "json_object"
  },
  
  prompt: `You are detecting a user's vibe.

CONTEXT:
- User: {{user.name}}
- Vibe Input: {{vibe_input}}

GOAL:
Detect the vibe from: chill, hype, moody, wild, zen, chaos
Provide accuracy score (0-1) and fun feedback in Hinglish.

RESPONSE FORMAT:
{
  "vibe": "chill|hype|moody|wild|zen|chaos",
  "accuracy": 0.85,
  "message": "Funny message in Hinglish about detected vibe"
}

EXAMPLES:
{
  "vibe": "chill",
  "accuracy": 0.9,
  "message": "Bhai tumhara vibe chill hai! Relaxed lag rahe ho! 😎"
}

Keep it fun and in Hinglish!`
};

