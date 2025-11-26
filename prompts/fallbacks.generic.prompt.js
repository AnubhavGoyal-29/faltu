/**
 * Generic Fallback Prompt
 * 
 * Provides fallback responses when AI is unavailable or fails.
 * 
 * @version 1.0
 * @tags: fallbacks, error-handling, defaults
 */

module.exports = {
  name: "Generic Fallback",
  description: "Fallback responses when AI is unavailable",
  version: 1,
  tags: ["fallbacks", "error-handling"],
  
  defaultParams: {
    temperature: 0.5,
    maxTokens: 100,
    responseFormat: "json_object"
  },
  
  prompt: `You are providing fallback responses when AI is unavailable or fails in FaltuVerse.

CONTEXT:
- Original Request: {{originalRequest}}
- Error Type: {{errorType}}
- Fallback Reason: {{reason}}

GOAL:
Provide a simple, functional fallback that:
- Maintains user experience
- Is appropriate for the context
- Keeps the app functional
- Is in Hinglish

RESPONSE FORMAT:
{
  "fallback": true,
  "message": "Fallback message",
  "data": {}
}

NOTE:
This prompt is rarely used - it's for emergency fallbacks when all else fails.`

};

