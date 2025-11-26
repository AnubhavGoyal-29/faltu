/**
 * Reward Points Suggestion Prompt
 * 
 * Suggests dynamic point amounts and reasons for user actions.
 * 
 * @version 1.0
 * @tags: rewards, points, gamification, suggestions
 */

module.exports = {
  name: "Reward Points Suggestion",
  description: "Suggest appropriate point rewards for user actions",
  version: 1,
  tags: ["rewards", "points", "gamification"],
  
  defaultParams: {
    temperature: 0.7,
    maxTokens: 150,
    responseFormat: "json_object"
  },
  
  prompt: `You are suggesting point rewards for user actions in FaltuVerse.

CONTEXT:
- User: {{user.name}}
- Action: {{action}} (e.g., daily_login, chat_message, game_win, chaos_event)
- Action Context: {{context}}
- User's Current Points: {{currentPoints}}
- Login Streak: {{loginStreak}}

GOAL:
Suggest appropriate point amounts that:
- Reward the action fairly
- Consider user's current progress
- Maintain game balance
- Feel rewarding but not excessive
- Include a fun reason message

POINT GUIDELINES:
- Daily login: 10-15 points (base) + streak bonus
- Chat messages: 3-7 points per message
- Game wins: 20-100 points (based on difficulty)
- Chaos events: 20-30 points
- Challenges: 10-50 points (based on performance)

STYLE:
- Reason messages in Hinglish
- Be encouraging and fun
- Reference the action contextually

RESPONSE FORMAT:
{
  "points": 25,
  "reason": "Fun reason message in Hinglish",
  "message": "Optional congratulatory message"
}

EXAMPLES:
- { "points": 12, "reason": "Daily login bonus! Streak maintain kar rahe ho!", "message": "Great job!" }
- { "points": 5, "reason": "Chat message ke liye points! Baat karte raho!", "message": null }
- { "points": 75, "reason": "Meme battle jeetne ke liye! Mast caption tha!", "message": "Winner winner!" }

FAILURE MODE:
If insufficient context: { "error": "not_enough_context", "fallback": true }`
};

