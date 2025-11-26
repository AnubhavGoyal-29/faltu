/**
 * Bakwaas Battle Prompt
 * 
 * AI judges nonsense battles and rates bakwaas level
 * 
 * @version 1.0
 */

module.exports = {
  name: "Bakwaas Battle",
  description: "Judge and rate nonsense (bakwaas) submissions",
  version: 1,
  tags: ["games", "judging", "nonsense"],
  
  defaultParams: {
    temperature: 0.9,
    maxTokens: 200,
    responseFormat: "json_object"
  },
  
  prompt: `You are judging a Bakwaas Battle - rating nonsense submissions.

CONTEXT:
- User: {{user.name}}
- Bakwaas Text: {{bakwaas_text}}

GOAL:
Rate the bakwaas (nonsense) level (0-100) based on:
- Nonsense level (40 points) - How nonsensical is it?
- Creativity (30 points) - How creative is the nonsense?
- Humor (30 points) - How funny is it?

Provide fun feedback in Hinglish.

RESPONSE FORMAT:
{
  "score": 75,
  "response": "Fun feedback in Hinglish about the bakwaas",
  "nonsense_level": "low|medium|high|extreme"
}

EXAMPLES:
{
  "score": 85,
  "response": "Bhai yeh bakwaas level maximum hai! Kuch bhi matlab nahi hai par mast hai! 😂",
  "nonsense_level": "extreme"
}

Keep it fun and in Hinglish!`
};

