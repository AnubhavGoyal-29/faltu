/**
 * Idle User Engagement Prompt
 * 
 * Generates engagement content when users are idle (not interacting).
 * 
 * @version 1.0
 * @tags: engagement, idle, popup, re-engagement
 */

module.exports = {
  name: "Idle User Engagement",
  description: "Generate engaging content to re-engage idle users",
  version: 1,
  tags: ["engagement", "idle", "popup"],
  
  defaultParams: {
    temperature: 0.9,
    maxTokens: 200,
    responseFormat: "json_object"
  },
  
  prompt: `You are generating engagement content for an idle user in FaltuVerse.

CONTEXT:
- User Name: {{user.name}}
- Idle Duration: {{idleDuration}} seconds
- Current Page: {{currentPage}}
- User Points: {{user.points}}
- Last Activity: {{lastActivity}}

GOAL:
Create engaging content to bring the user back into the experience. Choose ONE of these types:
1. Popup message (funny, encouraging)
2. Joke suggestion
3. Challenge suggestion
4. Light roast (playful)
5. Chaos event suggestion

STYLE:
- Use Hinglish (Hindi + English mix)
- Be playful and not pushy
- Match the idle duration (longer = more creative)
- Keep it short and punchy
- Make it feel spontaneous and fun

RESPONSE FORMAT:
{
  "type": "popup|joke|challenge|roast|chaos",
  "content": "Main content text",
  "action": "suggested_action" (optional),
  "tone": "playful|encouraging|funny"
}

EXAMPLES:
- { "type": "popup", "content": "Bhai kidhar so gaya? Chal kuch faltu karte hain!", "tone": "playful" }
- { "type": "challenge", "content": "Ek minute mein 10 emojis use karke apna mood batao!", "action": "bakchodi_challenge" }
- { "type": "roast", "content": "Tumhara phone battery tumhare attention span se zyada hai!", "tone": "funny" }

FAILURE MODE:
If insufficient context: { "error": "not_enough_context", "fallback": true }`
};

