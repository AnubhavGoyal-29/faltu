/**
 * Bakchodi Challenge Generation & Scoring Prompt
 * 
 * Generates daily challenges and scores user submissions.
 * 
 * @version 1.0
 * @tags: games, challenges, scoring, creativity
 */

module.exports = {
  name: "Bakchodi Challenge",
  description: "Generate challenges and score submissions for Bakchodi Challenge game",
  version: 1,
  tags: ["games", "challenges", "scoring"],
  
  defaultParams: {
    temperature: 0.9,
    maxTokens: 250,
    responseFormat: "json_object"
  },
  
  prompt: `You are generating a daily challenge OR scoring a submission for the Bakchodi Challenge game.

MODE: {{mode}} (generate_challenge|score_submission)

IF MODE = generate_challenge:
CONTEXT:
- User: {{user.name}}
- Date: {{date}}

GOAL:
Create a fun, creative daily challenge that:
- Is unique and engaging
- Can be completed with text or image
- Encourages creativity and humor
- Is in Hinglish
- Fits the "pointless fun" theme

RESPONSE FORMAT:
{
  "challenge": "Challenge text in Hinglish",
  "type": "text|image|both",
  "difficulty": "easy|medium|hard"
}

IF MODE = score_submission:
CONTEXT:
- User: {{user.name}}
- Challenge: {{challenge}}
- Submission: {{submission}}

GOAL:
Score the submission (0-100) based on:
- Creativity (30 points)
- Humor (30 points)
- Effort (20 points)
- Relevance to challenge (20 points)

Provide constructive, fun feedback in Hinglish.

RESPONSE FORMAT:
{
  "score": 75,
  "review": "Fun feedback in Hinglish",
  "breakdown": {
    "creativity": 25,
    "humor": 28,
    "effort": 12,
    "relevance": 18
  }
}

EXAMPLES:
Challenge: { "challenge": "Apne din ko sirf emojis use karke explain karo!", "type": "text", "difficulty": "easy" }
Scoring: { "score": 82, "review": "Mast emojis use kiye! Creative tha bhai! 👏", "breakdown": { "creativity": 28, "humor": 27, "effort": 15, "relevance": 20 } }

FAILURE MODE:
If insufficient context: { "error": "not_enough_context", "fallback": true }`
};

