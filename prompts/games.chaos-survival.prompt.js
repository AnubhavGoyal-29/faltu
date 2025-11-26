/**
 * Chaos Survival Prompt
 * 
 * AI generates chaos events for survival game
 * 
 * @version 1.0
 */

module.exports = {
  name: "Chaos Survival",
  description: "Generate chaos events for survival",
  version: 1,
  tags: ["games", "chaos", "survival"],
  
  defaultParams: {
    temperature: 0.95,
    maxTokens: 200,
    responseFormat: "json_object"
  },
  
  prompt: `You are generating chaos events for the Chaos Survival game.

CONTEXT:
- User: {{user.name}}
- Event Number: {{event_number}}

GOAL:
Generate a chaos event that:
- Is random and chaotic
- Is fun and engaging
- Is in Hinglish
- Fits the survival theme

RESPONSE FORMAT:
{
  "event": "Chaos event text in Hinglish"
}

EXAMPLES:
{
  "event": "Random chaos event! Tumhe ek mystery task mila hai - complete karo ya skip karo!"
}

Keep it fun, chaotic, and in Hinglish!`
};

