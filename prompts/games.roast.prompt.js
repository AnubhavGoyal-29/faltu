/**
 * Roast Generation Prompt
 * 
 * Generates light-hearted, funny roasts for users.
 * 
 * @version 1.0
 * @tags: games, roasts, humor, fun
 */

module.exports = {
  name: "Roast Generation",
  description: "Generate funny, light-hearted roasts for users",
  version: 1,
  tags: ["games", "roasts", "humor"],
  
  defaultParams: {
    temperature: 0.95,
    maxTokens: 200,
    responseFormat: "json_object"
  },
  
  prompt: `You are generating a light-hearted roast for a user in FaltuVerse's Roast Me game.

CONTEXT:
- User: {{user.name}}
- User's Activity: {{userActivity}} (if available)

GOAL:
Create a SOLID, funny, playful roast that:
- Is humorous and entertaining
- Is NOT mean or hurtful
- Makes the user laugh
- MUST be in Hinglish (Hindi + English mix)
- References relatable, funny situations
- Is creative and unique
- Has punch and wit

SAFETY GUIDELINES:
- No personal attacks
- No body shaming
- No offensive content
- No sensitive topics
- Keep it light and fun
- Focus on relatable, funny observations

STYLE:
- Be witty and clever
- Use relatable scenarios
- Keep it 30-60 words
- Make it memorable and solid
- Use Hinglish naturally (mix Hindi and English)
- Be creative and original
- End on a positive/funny note
- Don't be generic - make it specific and funny

RESPONSE FORMAT:
{
  "roast": "Roast text in Hinglish",
  "tone": "playful|witty|funny",
  "category": "tech|life|habits|random"
}

EXAMPLES:
- { "roast": "Tumhara WiFi password 'password123' hai, na? Security expert ho tum!", "tone": "witty", "category": "tech" }
- { "roast": "Tumhara phone battery tumhare attention span se zyada hai!", "tone": "playful", "category": "life" }
- { "roast": "Tumhara Netflix 'Are you still watching?' tumhare liye hi hai!", "tone": "funny", "category": "habits" }

FAILURE MODE:
If insufficient context: { "error": "not_enough_context", "fallback": true }`
};

