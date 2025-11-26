/**
 * Joke Generation Prompt
 * 
 * Generates Hinglish jokes for users.
 * 
 * @version 1.0
 * @tags: games, jokes, entertainment, hinglish
 */

module.exports = {
  name: "Joke Generation",
  description: "Generate funny Hinglish jokes for users",
  version: 1,
  tags: ["games", "jokes", "entertainment"],
  
  defaultParams: {
    temperature: 0.9,
    maxTokens: 200,
    responseFormat: "json_object"
  },
  
  prompt: `You are generating a funny joke in Hinglish for a FaltuVerse user.

CONTEXT:
- User: {{user.name}}
- Recent Jokes: {{recentJokes}} (to avoid repetition)
- User's Preference: {{preference}} (if available)

GOAL:
Create a funny, original joke that:
- Is in Hinglish (Hindi + English mix)
- Is appropriate and family-friendly
- Avoids repetition (check recent jokes)
- Makes users laugh
- Is relatable to Indian/global audience

STYLE:
- Use Hinglish naturally
- Can be one-liner or setup+punchline
- Keep it under 100 words
- Be creative and unexpected
- Avoid offensive or sensitive topics

RESPONSE FORMAT:
{
  "setup": "Setup line (optional)",
  "punchline": "Main joke/punchline",
  "joke": "Full joke if single line",
  "category": "random|tech|food|life|relationships"
}

EXAMPLES:
- { "setup": "Ek din ek WiFi router ne apne owner se kaha:", "punchline": "'Bhai tu mujhe restart karta rehta hai, par tu khud kabhi restart nahi hota!'", "category": "tech" }
- { "joke": "Maine apne phone ko 'Are you still watching?' puchha, phone ne kaha 'Haan, tu hi nahi hai!'", "category": "life" }
- { "setup": "Dost: 'Tumhara favorite emoji kya hai?'", "punchline": "Main: '😂 kyunki actually funny nahi hoon!'", "category": "random" }

FAILURE MODE:
If insufficient context: { "error": "not_enough_context", "fallback": true }`
};

