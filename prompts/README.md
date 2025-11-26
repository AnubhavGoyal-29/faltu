# FaltuVerse AI Prompts Directory

This directory contains all AI prompts used in the FaltuVerse platform. Prompts are organized by category and follow a consistent structure.

## Directory Structure

```
prompts/
├── games/          # Game-related prompts (jokes, challenges, scoring)
├── chat/           # Chat bot conversation prompts
├── ui/              # UI/UX prompts (chaos events, popups)
├── system/          # System-level prompts (core, cron)
├── engagement/      # User engagement prompts (welcome, idle)
├── moderation/      # Content moderation prompts (future)
├── rewards/         # Reward system prompts
└── fallbacks/       # Fallback prompts for error handling
```

## File Naming Convention

Files follow this pattern: `<category>.<feature>.<purpose>.prompt.js`

Examples:
- `games.joke.prompt.js` - Joke generation
- `chat.conversation.prompt.js` - Chat bot responses
- `engagement.welcome.prompt.js` - Welcome messages

## Prompt File Structure

Each prompt file exports an object with:

```javascript
module.exports = {
  name: "Human-readable name",
  description: "What this prompt does",
  version: 1,
  tags: ["tag1", "tag2"],
  defaultParams: {
    temperature: 0.9,
    maxTokens: 300,
    responseFormat: "json_object"
  },
  prompt: `... prompt text with {{variables}} ...`
};
```

## Template Variables

Prompts use `{{variable}}` syntax for dynamic content. Common variables:

- `{{user.name}}` - User's name
- `{{user.email}}` - User's email
- `{{user.points}}` - User's current points
- `{{currentTime}}` - Current timestamp
- `{{loginStreak}}` - User's login streak
- Context-specific variables as needed

## Usage

Prompts are loaded via `promptLoader.js`:

```javascript
const { getFormattedPrompt } = require('../utils/promptLoader');

const promptData = getFormattedPrompt('games.joke', {
  userName: 'John',
  recentJokes: 'none'
});
```

## Adding New Prompts

1. Create file in appropriate category directory
2. Follow naming convention
3. Include all required fields
4. Use template variables for dynamic content
5. Add to reason mapping in `aiDecisionEngine.js` if needed

## Version Control

- Increment version when making breaking changes
- Keep backward compatibility when possible
- Document changes in prompt comments

## Best Practices

1. **Clarity**: Be explicit about what you want
2. **Structure**: Use consistent JSON response formats
3. **Safety**: Include safety guidelines in prompts
4. **Fallbacks**: Always define failure modes
5. **Examples**: Include example responses
6. **Hinglish**: All user-facing text must be in Hinglish

## Categories

### Games (`/games`)
- Joke generation
- Challenge creation & scoring
- Meme caption scoring
- Debate topics & responses
- Future predictions
- Dares & roasts

### Chat (`/chat`)
- Conversation responses
- Engagement messages
- Topic suggestions

### UI (`/ui`)
- Chaos event generation
- Visual effect descriptions
- Popup messages

### System (`/system`)
- Core system prompt
- Cron event suggestions
- Feature planning

### Engagement (`/engagement`)
- Welcome messages
- Idle user re-engagement
- Activity suggestions

### Rewards (`/rewards`)
- Point suggestions
- Reward reasons
- Gamification logic

### Fallbacks (`/fallbacks`)
- Error handling
- Default responses
- Emergency fallbacks

## Maintenance

- Review prompts quarterly
- Update based on user feedback
- Optimize for cost and quality
- Test with various inputs
- Monitor AI response quality

