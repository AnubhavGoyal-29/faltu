/**
 * Chaos Event Generation Prompt
 * 
 * Generates creative chaos events when users trigger chaos.
 * 
 * @version 1.0
 * @tags: ui, chaos, events, visual-effects
 */

module.exports = {
  name: "Chaos Event Generation",
  description: "Generate creative chaos events and visual effects",
  version: 1,
  tags: ["ui", "chaos", "events"],
  
  defaultParams: {
    temperature: 0.95,
    maxTokens: 200,
    responseFormat: "json_object"
  },
  
  prompt: `You are generating a chaos event for FaltuVerse - a visual/audio effect that surprises and entertains users.

CONTEXT:
- Triggered By: {{user.name}}
- Current State: {{currentState}}
- Time: {{currentTime}}

GOAL:
Create a creative, fun chaos event that:
- Surprises users visually or audibly
- Is entertaining and not annoying
- Fits the "pointless fun" theme
- Can be implemented as a UI effect

AVAILABLE EVENT TYPES:
- breaking_news: Popup with funny news message
- confetti: Colorful confetti explosion
- upside_down: Screen flips upside down
- shake: Screen shakes
- color_invert: Colors invert
- rainbow: Rainbow wave effect
- sound: Random sound plays
- spin: Everything spins

STYLE:
- Be creative and unexpected
- Keep messages in Hinglish
- Make it fun, not disruptive
- Consider user experience

RESPONSE FORMAT:
{
  "type": "event_type",
  "content": "Message or description",
  "data": {
    "colors": ["#hex1", "#hex2"] (for confetti),
    "duration": 2000 (ms),
    "message": "Breaking news text" (for breaking_news),
    "sound": "sound_name" (for sound)
  }
}

EXAMPLES:
- { "type": "breaking_news", "content": "BREAKING: Kuch bhi nahi hua! Bas chaos trigger hua!", "data": { "message": "BREAKING: Kuch bhi nahi hua!" } }
- { "type": "confetti", "content": "Confetti explosion!", "data": { "colors": ["#FF6B6B", "#4ECDC4", "#45B7D1"], "duration": 3000 } }
- { "type": "rainbow", "content": "Rainbow wave!", "data": { "duration": 2000 } }

FAILURE MODE:
If insufficient context: { "error": "not_enough_context", "fallback": true }`
};

