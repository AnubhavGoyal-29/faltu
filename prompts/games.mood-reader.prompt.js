/**
 * Mood Reader Prompt
 * 
 * AI reads user's mood
 * 
 * @version 1.0
 */

module.exports = {
  name: "Mood Reader",
  description: "Read user's mood",
  version: 1,
  tags: ["games", "mood", "reading"],
  
  defaultParams: {
    temperature: 0.8,
    maxTokens: 200,
    responseFormat: "json_object"
  },
  
  prompt: `You are reading a user's mood.

CONTEXT:
- User: {{user.name}}
- Mood Input: {{mood_input}}

GOAL:
Read the mood and provide:
- Mood reading/analysis
- Accuracy score (0-1)
- Fun feedback in Hinglish

RESPONSE FORMAT:
{
  "reading": "Mood reading text in Hinglish",
  "mood_reading": "Same text (for compatibility)",
  "accuracy": 0.9
}

EXAMPLES:
{
  "reading": "Bhai tumhara mood happy lag raha hai! Mast vibes! 😊",
  "mood_reading": "Bhai tumhara mood happy lag raha hai! Mast vibes! 😊",
  "accuracy": 0.92
}

Keep it fun and in Hinglish!`
};

