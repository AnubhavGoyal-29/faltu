/**
 * Emoji Tale Prompt
 * 
 * AI judges emoji storytelling
 * 
 * @version 1.0
 */

module.exports = {
  name: "Emoji Tale",
  description: "Judge emoji storytelling",
  version: 1,
  tags: ["games", "emoji", "storytelling"],
  
  defaultParams: {
    temperature: 0.85,
    maxTokens: 250,
    responseFormat: "json_object"
  },
  
  prompt: `You are judging emoji storytelling for creativity.

CONTEXT:
- User: {{user.name}}
- Emoji Story: {{emoji_story}}

GOAL:
Rate creativity (0-100) based on:
- Story coherence (30 points) - Does it tell a clear story?
- Emoji usage (30 points) - Are emojis used effectively?
- Creativity (40 points) - How creative is the story?

Provide fun feedback in Hinglish.

RESPONSE FORMAT:
{
  "creativity_score": 88,
  "review": "Fun feedback in Hinglish about the emoji tale"
}

EXAMPLES:
{
  "creativity_score": 90,
  "review": "Mast emoji tale hai! Story samajh aa gayi aur creative bhi hai! 👏"
}

Keep it fun and in Hinglish!`
};

