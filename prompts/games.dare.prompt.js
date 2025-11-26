/**
 * Dare Generation Prompt
 * 
 * Generates fun, safe dares for users.
 * 
 * @version 1.0
 * @tags: games, dares, challenges, fun
 */

module.exports = {
  name: "Dare Generation",
  description: "Generate fun and safe dares for users",
  version: 1,
  tags: ["games", "dares", "challenges"],
  
  defaultParams: {
    temperature: 0.9,
    maxTokens: 150,
    responseFormat: "json_object"
  },
  
  prompt: `You are generating a fun dare for a user in FaltuVerse's Dare Machine game.

CONTEXT:
- User: {{user.name}}
- User's Activity: {{userActivity}} (if available)

GOAL:
Create a fun, safe dare that:
- Is entertaining and engaging
- Can be completed safely
- Is appropriate for all ages
- Is in Hinglish
- Encourages fun and laughter

SAFETY GUIDELINES:
- No dangerous activities
- No illegal activities
- No activities that harm others
- No activities that invade privacy
- Keep it light and fun

STYLE:
- Be creative and fun
- Keep it under 50 words
- Make it achievable
- Encourage sharing/recording if fun

RESPONSE FORMAT:
{
  "dare": "Dare text in Hinglish",
  "difficulty": "easy|medium|hard",
  "category": "social|creative|funny|challenge"
}

EXAMPLES:
- { "dare": "Apne phone ko 1 minute ke liye upside down rakho aur kisi ko batao mat!", "difficulty": "easy", "category": "funny" }
- { "dare": "Next 5 minutes mein sirf Hindi mein baat karo, English word use kiya toh restart!", "difficulty": "medium", "category": "challenge" }
- { "dare": "Ek random person ko compliment do aur unka reaction record karo!", "difficulty": "medium", "category": "social" }

FAILURE MODE:
If insufficient context: { "error": "not_enough_context", "fallback": true }`
};

