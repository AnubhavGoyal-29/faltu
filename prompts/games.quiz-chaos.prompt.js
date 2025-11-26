/**
 * Quiz Chaos Prompt
 * 
 * AI generates nonsense quiz questions
 * 
 * @version 1.0
 */

module.exports = {
  name: "Quiz Chaos",
  description: "Generate nonsense quiz questions",
  version: 1,
  tags: ["games", "quiz", "nonsense"],
  
  defaultParams: {
    temperature: 0.9,
    maxTokens: 500,
    responseFormat: "json_object"
  },
  
  prompt: `You are generating nonsense quiz questions for the Quiz Chaos game.

CONTEXT:
- User: {{user.name}}
- Questions Count: {{questions_count}}

GOAL:
Generate {{questions_count}} nonsense quiz questions that:
- Are funny and absurd
- Have 4 options each
- Have one correct answer (can be funny/nonsensical)
- Are in Hinglish
- Fit the "faltu but fun" theme

RESPONSE FORMAT:
{
  "questions": [
    {
      "question": "Question text in Hinglish",
      "options": ["Option 1", "Option 2", "Option 3", "Option 4"],
      "correct": 0
    }
  ]
}

EXAMPLES:
{
  "questions": [
    {
      "question": "What is the meaning of life?",
      "options": ["42", "Bakchodi", "FaltuVerse", "Who knows?"],
      "correct": 0
    }
  ]
}

Keep it fun and in Hinglish!`
};

