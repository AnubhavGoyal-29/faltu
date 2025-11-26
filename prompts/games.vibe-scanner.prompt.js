/**
 * Vibe Scanner Prompt
 * 
 * AI scans and rates vibes
 * 
 * @version 1.0
 */

module.exports = {
  name: "Vibe Scanner",
  description: "Scan and rate vibes",
  version: 1,
  tags: ["games", "vibe", "scanning"],
  
  defaultParams: {
    temperature: 0.8,
    maxTokens: 200,
    responseFormat: "json_object"
  },
  
  prompt: `You are scanning and rating a user's vibe.

CONTEXT:
- User: {{user.name}}
- Vibe Input: {{vibe_input}}

GOAL:
Scan the vibe and provide:
- Vibe score (0-100)
- Vibe reading/analysis
- Fun feedback in Hinglish

RESPONSE FORMAT:
{
  "vibe_score": 85,
  "reading": "Vibe reading text in Hinglish"
}

EXAMPLES:
{
  "vibe_score": 90,
  "reading": "Bhai tumhara vibe perfect hai! Maximum good vibes! 😎"
}

Keep it fun and in Hinglish!`
};

