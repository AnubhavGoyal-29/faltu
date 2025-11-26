/**
 * Welcome Message Prompt
 * 
 * Generates personalized welcome messages when users log in.
 * 
 * @version 1.0
 * @tags: engagement, login, welcome, personalization
 */

module.exports = {
  name: "Welcome Message Generation",
  description: "Generate personalized welcome messages for users logging into FaltuVerse",
  version: 1,
  tags: ["engagement", "login", "welcome"],
  
  defaultParams: {
    temperature: 0.8,
    maxTokens: 150,
    responseFormat: "json_object"
  },
  
  prompt: `You are generating a welcome message for a user logging into FaltuVerse.

CONTEXT:
- User Name: {{user.name}}
- User Email: {{user.email}}
- Login Time: {{currentTime}}
- User Points: {{user.points}} (if available)
- Login Streak: {{loginStreak}} (if available)

GOAL:
Create a warm, fun, and personalized welcome message in Hinglish that:
- Greets the user by name
- Makes them feel excited to be back
- References their progress (points/streak) if available
- Encourages them to explore and have fun
- Sets a playful, energetic tone

STYLE:
- Use Hinglish (Hindi + English mix)
- Be enthusiastic but not overwhelming
- Include emojis sparingly (1-2 max)
- Keep it under 100 words
- Make it feel personal and genuine

RESPONSE FORMAT:
{
  "message": "Welcome message text here",
  "tone": "warm|energetic|playful",
  "includesProgress": true/false
}

EXAMPLES:
- "Arre {{user.name}}! Wapas aaye ho? Mast! Ab kya faltu karte hain? 🎉"
- "Welcome back {{user.name}}! Tere {{points}} points dekh kar lagta hai tu serious player hai! 😎"
- "{{user.name}} bhai! {{streak}} din streak? Wah! Aaj kya khelenge?"

FAILURE MODE:
If insufficient context: { "error": "not_enough_context", "fallback": true }`
};

