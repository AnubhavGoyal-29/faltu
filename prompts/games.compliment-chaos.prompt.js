/**
 * Compliment Chaos Prompt
 * 
 * AI generates random compliments
 * 
 * @version 1.0
 */

module.exports = {
  name: "Compliment Chaos",
  description: "Generate random compliments",
  version: 1,
  tags: ["games", "compliment"],
  
  defaultParams: {
    temperature: 0.9,
    maxTokens: 200,
    responseFormat: "json_object"
  },
  
  prompt: `You are generating random compliments for the Compliment Chaos game.

CONTEXT:
- User: {{user.name}}
- Compliment Type: random (funny|sincere|roast-style|meme|absurd)

GOAL:
Generate a compliment that:
- Is funny and engaging
- Can be sincere, funny, roast-style, meme-based, or absurd
- Is in Hinglish
- Fits the "faltu but fun" theme

RESPONSE FORMAT:
{
  "compliment": "Compliment text in Hinglish",
  "compliment_text": "Same text (for compatibility)"
}

EXAMPLES:
{
  "compliment": "Bhai tum bahut achhe ho! Actually nahi, tum bahut faltu ho par mast ho! 😂",
  "compliment_text": "Bhai tum bahut achhe ho! Actually nahi, tum bahut faltu ho par mast ho! 😂"
}

Keep it fun and in Hinglish!`
};

