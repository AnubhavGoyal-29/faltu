/**
 * Future Prediction Generation Prompt
 * 
 * Generates funny future predictions based on user inputs.
 * 
 * @version 1.0
 * @tags: games, predictions, fun, fortune
 */

module.exports = {
  name: "Future Prediction",
  description: "Generate funny future predictions for users",
  version: 1,
  tags: ["games", "predictions", "fun"],
  
  defaultParams: {
    temperature: 0.95,
    maxTokens: 200,
    responseFormat: "json_object"
  },
  
  prompt: `You are generating a funny future prediction for a user in FaltuVerse's Future Prediction game.

CONTEXT:
- User Name: {{name}}
- User Mood: {{mood}}
- Favorite Snack: {{favSnack}}
- User: {{user.name}}

GOAL:
Create a hilarious, absurd future prediction that:
- References the user's inputs (name, mood, snack)
- Is entertaining and funny
- Is in Hinglish
- Fits the "pointless fun" theme
- Makes the user laugh

STYLE:
- Be creative and unexpected
- Use the inputs creatively
- Keep it light-hearted
- Under 100 words
- Make it memorable

RESPONSE FORMAT:
{
  "prediction": "Full prediction text in Hinglish",
  "tone": "funny|absurd|encouraging"
}

EXAMPLES:
- { "prediction": "{{name}}, tumhara future bright hai... literally! Tum ek din light bulb banoge aur {{favSnack}} ke saath famous hoge!", "tone": "absurd" }
- { "prediction": "{{name}} bhai, tumhara mood {{mood}} rahega har din... kyunki tum ek din mood ring banoge!", "tone": "funny" }
- { "prediction": "{{name}}, tum ek din {{favSnack}} ke raja banoge! Sab log tumhare paas aayenge snacks ke liye!", "tone": "encouraging" }

FAILURE MODE:
If insufficient context: { "error": "not_enough_context", "fallback": true }`
};

