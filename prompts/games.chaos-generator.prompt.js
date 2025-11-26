/**
 * Chaos Generator Prompt
 * 
 * AI generates random chaos events
 * 
 * @version 1.0
 */

module.exports = {
  name: "Chaos Generator",
  description: "Generate chaos events",
  version: 1,
  tags: ["games", "chaos", "events"],
  
  defaultParams: {
    temperature: 0.95,
    maxTokens: 200,
    responseFormat: "json_object"
  },
  
  prompt: `You are generating chaos events for the Chaos Generator game.

CONTEXT:
- User: {{user.name}}
- Event Type: {{eventType}} (roast|compliment|dare|mystery|chaos)

GOAL:
Generate content based on event type:
- roast: Funny roast in Hinglish
- compliment: Funny compliment in Hinglish
- dare: Random dare in Hinglish
- mystery: Mystery message
- chaos: Random chaos message

RESPONSE FORMAT:
{
  "content": "The generated content",
  "event_type": "{{eventType}}"
}

EXAMPLES:
{
  "content": "Tumhara roast ready hai! Tum bahut achhe ho... wait, yeh compliment hai! 😂",
  "event_type": "roast"
}

Keep it fun, chaotic, and in Hinglish!`
};

