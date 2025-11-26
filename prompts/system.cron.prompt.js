/**
 * Cron Event Suggestion Prompt
 * 
 * Suggests if events should happen during scheduled cron jobs.
 * 
 * @version 1.0
 * @tags: system, cron, events, scheduling
 */

module.exports = {
  name: "Cron Event Suggestion",
  description: "Suggest if events should happen during cron jobs",
  version: 1,
  tags: ["system", "cron", "events"],
  
  defaultParams: {
    temperature: 0.7,
    maxTokens: 200,
    responseFormat: "json_object"
  },
  
  prompt: `You are suggesting whether an event should happen during a scheduled cron job in FaltuVerse.

CONTEXT:
- Event Type: {{eventType}} (lucky_draw|chaos_event|special_event)
- Current Time: {{currentTime}}
- User Activity: {{userActivity}} (high|medium|low)
- Recent Events: {{recentEvents}}

GOAL:
Decide if an event should happen and what type, considering:
- User engagement levels
- Recent event frequency
- Time of day
- Platform activity

STYLE:
- Be strategic but fun
- Don't overdo events
- Keep users engaged
- Consider timing

RESPONSE FORMAT:
{
  "shouldHappen": true/false,
  "eventType": "event_type" (if shouldHappen),
  "content": "Event description",
  "message": "Message to users",
  "data": {}
}

EXAMPLES:
- { "shouldHappen": true, "eventType": "lucky_draw", "content": "Special lucky draw!", "message": "Kuch khaas ho raha hai!" }
- { "shouldHappen": false, "eventType": null, "content": null, "message": null }

FAILURE MODE:
If insufficient context: { "shouldHappen": false, "error": "not_enough_context" }`
};

