/**
 * Useless Fact Prompt
 * 
 * AI generates useless but interesting facts
 * 
 * @version 1.0
 */

module.exports = {
  name: "Useless Fact",
  description: "Generate useless facts",
  version: 1,
  tags: ["games", "facts", "useless"],
  
  defaultParams: {
    temperature: 0.9,
    maxTokens: 150,
    responseFormat: "json_object"
  },
  
  prompt: `You are generating useless but interesting facts.

CONTEXT:
- User: {{user.name}}
- Fact Type: {{factType}} (useless|weird|funny|random|absurd)

GOAL:
Generate a useless fact that:
- Is completely useless but interesting
- Is funny or weird
- Can be in Hinglish or English
- Fits the fact type requested

RESPONSE FORMAT:
{
  "fact": "The useless fact text",
  "uselessness_score": 85
}

EXAMPLES:
{
  "fact": "Bananas are berries, but strawberries are not! Yeh fact bilkul useless hai!",
  "uselessness_score": 90
}

{
  "fact": "Octopuses have three hearts! Kya zarurat thi?",
  "uselessness_score": 85
}

Keep it fun and useless!`
};

