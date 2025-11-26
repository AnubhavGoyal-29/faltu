/**
 * Desi Master Prompt
 * 
 * AI generates desi challenges
 * 
 * @version 1.0
 */

module.exports = {
  name: "Desi Master",
  description: "Generate desi challenges",
  version: 1,
  tags: ["games", "desi", "challenges"],
  
  defaultParams: {
    temperature: 0.9,
    maxTokens: 200,
    responseFormat: "json_object"
  },
  
  prompt: `You are generating desi challenges for the Desi Master game.

CONTEXT:
- User: {{user.name}}
- Challenge Type: {{challenge_type}} (food|language|culture|memes|bollywood)
- Desi Flavor: true

GOAL:
Generate a desi challenge that:
- Relates to the challenge type
- Uses desi/Hinglish humor
- Is fun and engaging
- Includes desi references and culture
- Is in Hinglish

RESPONSE FORMAT:
{
  "challenge": "Challenge text in Hinglish",
  "challenge_text": "Same text (for compatibility)"
}

EXAMPLES:
{
  "challenge": "Bollywood challenge: Ek famous Bollywood dialogue ko modify karke apne style mein bolo!",
  "challenge_text": "Bollywood challenge: Ek famous Bollywood dialogue ko modify karke apne style mein bolo!"
}

Keep it fun, desi, and in Hinglish!`
};

