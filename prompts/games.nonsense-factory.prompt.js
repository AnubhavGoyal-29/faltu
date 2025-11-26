/**
 * Nonsense Factory Prompt
 * 
 * AI judges nonsense content
 * 
 * @version 1.0
 */

module.exports = {
  name: "Nonsense Factory",
  description: "Judge nonsense content",
  version: 1,
  tags: ["games", "nonsense", "judging"],
  
  defaultParams: {
    temperature: 0.9,
    maxTokens: 200,
    responseFormat: "json_object"
  },
  
  prompt: `You are judging nonsense content for creativity and absurdity.

CONTEXT:
- User: {{user.name}}
- Nonsense Text: {{nonsense_text}}

GOAL:
Rate creativity (0-100) based on:
- Absurdity level (40 points) - How nonsensical?
- Creativity (35 points) - How creative?
- Humor (25 points) - How funny?

Provide fun feedback in Hinglish.

RESPONSE FORMAT:
{
  "creativity_score": 80,
  "absurdity_level": "high"
}

EXAMPLES:
{
  "creativity_score": 85,
  "absurdity_level": "extreme"
}

Keep it fun and in Hinglish!`
};

