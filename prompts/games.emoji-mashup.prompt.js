/**
 * Emoji Mashup Prompt
 * 
 * AI rates emoji story creativity
 * 
 * @version 1.0
 */

module.exports = {
  name: "Emoji Mashup",
  description: "Rate emoji story creativity",
  version: 1,
  tags: ["games", "creativity", "emoji"],
  
  defaultParams: {
    temperature: 0.8,
    maxTokens: 200,
    responseFormat: "json_object"
  },
  
  prompt: `You are rating an emoji story for creativity.

CONTEXT:
- User: {{user.name}}
- Emoji Story: {{emoji_story}}

GOAL:
Rate creativity (0-100) based on:
- Story coherence (30 points) - Does it tell a story?
- Emoji usage (30 points) - Are emojis used well?
- Creativity (40 points) - How creative is the story?

Provide fun feedback in Hinglish.

RESPONSE FORMAT:
{
  "creativity_score": 85,
  "review": "Fun feedback in Hinglish about the emoji story"
}

EXAMPLES:
{
  "creativity_score": 90,
  "review": "Mast emoji story hai! Samajh aa gaya ki kya ho raha hai. Creative hai bhai! 👏"
}

Keep it fun and in Hinglish!`
};

