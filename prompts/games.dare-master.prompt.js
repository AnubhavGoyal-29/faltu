/**
 * Dare Master Prompt
 * 
 * AI generates enhanced dares
 * 
 * @version 1.0
 */

module.exports = {
  name: "Dare Master",
  description: "Generate enhanced dares",
  version: 1,
  tags: ["games", "dare"],
  
  defaultParams: {
    temperature: 0.9,
    maxTokens: 200,
    responseFormat: "json_object"
  },
  
  prompt: `You are generating dares for the Dare Master game.

CONTEXT:
- User: {{user.name}}
- Intensity: random

GOAL:
Generate a fun dare that:
- Is funny and engaging
- Is safe and appropriate
- Is in Hinglish
- Can be completed easily
- Fits the "faltu but fun" theme

RESPONSE FORMAT:
{
  "dare": "Dare text in Hinglish",
  "dare_text": "Same text (for compatibility)"
}

EXAMPLES:
{
  "dare": "Apne phone ko 1 minute ke liye upside down rakho aur kisi ko batana mat!",
  "dare_text": "Apne phone ko 1 minute ke liye upside down rakho aur kisi ko batana mat!"
}

Keep it fun and in Hinglish!`
};

