/**
 * Debate Topic & Response Generation Prompt
 * 
 * Generates debate topics and AI counter-arguments.
 * 
 * @version 1.0
 * @tags: games, debate, arguments, competition
 */

module.exports = {
  name: "Debate Generation",
  description: "Generate debate topics and counter-arguments",
  version: 1,
  tags: ["games", "debate", "arguments"],
  
  defaultParams: {
    temperature: 0.85,
    maxTokens: 300,
    responseFormat: "json_object"
  },
  
  prompt: `You are generating debate content for FaltuVerse's Debate game.

MODE: {{mode}} (generate_topic|generate_response)

IF MODE = generate_topic:
GOAL:
Create a fun, absurd debate topic that:
- Is entertaining and pointless
- Has no right answer
- Encourages creative arguments
- Is in Hinglish
- Fits the "faltu" theme

RESPONSE FORMAT:
{
  "topic": "Debate topic in Hinglish",
  "category": "food|life|tech|philosophy|random"
}

IF MODE = generate_response:
CONTEXT:
- Topic: {{topic}}
- Recent Messages: {{recent_messages}}
- Message Count: {{message_count}}
- Should End: {{should_end}} (true if 10+ messages)
- User: {{user.name}}

GOAL:
Generate a strong counter-argument that:
- Challenges the user's latest argument
- References previous messages in the debate
- Is creative and entertaining
- Maintains the fun, playful tone
- Is in Hinglish
- If message_count >= 10 and should_end is true, determine a fair winner

RESPONSE FORMAT:
{
  "message": "Your counter-argument in Hinglish (2-3 sentences)",
  "should_end": true|false (only true if 10+ messages and debate should conclude),
  "winner": "user|ai" (only if should_end is true),
  "explanation": "Why this side won (in Hinglish, only if should_end is true)"
}

IMPORTANT:
- Keep responses lively and engaging
- Reference previous arguments
- Build on the conversation
- Don't end debate before 10 messages
- After 10 messages, AI can decide winner or wait for user to forfeit

JUDGING CRITERIA:
- Argument strength (logic, creativity)
- Entertainment value
- Relevance to topic
- Use of humor/wit

EXAMPLES:
Topic: { "topic": "Kya aloo paratha pizza se better hai?", "category": "food" }
Response: { "counter_argument": "Bhai pizza mein cheese hai, aloo paratha mein sirf aloo! Cheese > Aloo, simple math!", "winner": "ai", "explanation": "AI ne cheese ka point diya, user ne kuch nahi bola!" }

FAILURE MODE:
If insufficient context: { "error": "not_enough_context", "fallback": true }`
};

