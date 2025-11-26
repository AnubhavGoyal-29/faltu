# 🤖 AI Usage & Decision Points Report

## Overview
This document lists **ALL** places where AI is called and what decisions it makes in the FaltuVerse project.

---

## 📍 AI Call Locations & Decisions

### 1. **Authentication & Welcome** (`authController.js`)

**Location**: `backend/src/api/controllers/authController.js`

**AI Function**: `generateWelcomeMessage()`

**When Called**: 
- After Google OAuth login
- After email/password login

**Decision Made**:
- ✅ **Generates personalized welcome message** in Hinglish
- Considers: User name, login streak, points
- **Fallback**: Default welcome message if AI unavailable

**Prompt Used**: `engagement.welcome.prompt.js`

---

### 2. **Points & Rewards System** (`pointsService.js`)

**Location**: `backend/src/services/pointsService.js`

**AI Function**: `generateRewardSuggestion()`

**When Called**: 
- Every time points are added to a user
- When user performs actions (login, chat, games, etc.)

**Decision Made**:
- ✅ **Suggests dynamic point amounts** based on context
- Considers: Action type, user activity, current points, performance
- **Fallback**: Uses original/default points if AI unavailable

**Prompt Used**: `rewards.points.prompt.js`

**Example Decisions**:
- "User did great in meme battle → Give 150 points instead of 100"
- "User is new → Give bonus points"
- "User has high streak → Reward more"

---

### 3. **Chaos Events** (`chaosService.js`)

**Location**: `backend/src/services/chaosService.js`

**AI Function**: `generateChaosAction()`

**When Called**: 
- When user clicks "Trigger Chaos" button (costs 1000 points)

**Decision Made**:
- ✅ **Generates creative chaos event type** (breaking_news, confetti, shake, etc.)
- ✅ **Creates custom chaos content/message**
- Considers: User info, current state
- **Fallback**: Random chaos event from predefined list

**Prompt Used**: `ui.chaos.prompt.js`

**Example Decisions**:
- "Generate breaking news: 'BREAKING: User triggered chaos!'"
- "Choose chaos type: confetti explosion"
- "Create custom message for chaos event"

---

### 4. **Chat Bot** (`aiChatBot.js` + `chatBotCron.js`)

**Location**: 
- `backend/src/ai/handlers/aiChatBot.js`
- `backend/src/cron/chatBotCron.js`
- `backend/src/events/socketEvents.js`

**AI Function**: `generateChatResponse()` → `processChatRoomForAI()`

**When Called**: 
- **Cron Job**: Every 2 minutes (checks all active rooms)
- **Real-time**: After user sends message (if room is silent)

**Decision Made**:
- ✅ **Decides IF bot should intervene** (silent room, many messages, random chance)
- ✅ **Generates contextual chat response** based on recent messages
- ✅ **Participates in conversations** naturally
- Considers: Room name, recent messages, conversation context
- **Fallback**: No AI message if unavailable

**Prompt Used**: `chat.conversation.prompt.js`

**Example Decisions**:
- "Room is silent for 30 seconds → Send joke"
- "Users discussing food → Join conversation about snacks"
- "Many messages → Add funny comment"

---

### 5. **Jokes System** (`jokeService.js`)

**Location**: `backend/src/services/jokeService.js`

**AI Function**: `callAI()` with reason 'joke'

**When Called**: 
- User clicks "Get Joke" button
- Idle user engagement (auto-show jokes)
- Chat bot cracks jokes

**Decision Made**:
- ✅ **Generates Hinglish joke** (setup + punchline)
- ✅ **Avoids repetition** (tracks user's joke history)
- Considers: User's recent jokes, preferences
- **Fallback**: Random joke from predefined Hinglish jokes list

**Prompt Used**: `games.joke.prompt.js`

**Example Decisions**:
- "Generate funny joke about user's current activity"
- "Create joke avoiding user's last 10 jokes"

---

### 6. **Wordle Game** (`wordleService.js`)

**Location**: `backend/src/services/wordleService.js`

**AI Function**: `callAI()` with reason 'wordle_hint'

**When Called**: 
- User requests hint for Wordle game

**Decision Made**:
- ✅ **Generates helpful hint** without revealing the word
- Considers: Current attempts, daily word, user progress
- **Fallback**: Generic hint if AI unavailable

**Prompt Used**: `system.core.prompt.js` (TODO: Create specific prompt)

**Example Decisions**:
- "User has 3 attempts left → Give subtle hint"
- "User struggling → Provide more helpful hint"

---

### 7. **Daily Bakchodi Challenge** (`gamesAIService.js`)

**Location**: `backend/src/ai/handlers/gamesAIService.js`

**AI Function**: `generateDailyChallenge()`

**When Called**: 
- User requests daily challenge
- Daily challenge page loads

**Decision Made**:
- ✅ **Generates creative daily challenge** prompt
- Considers: User info, previous challenges
- **Fallback**: Random challenge from predefined list

**Prompt Used**: `games.bakchodi.prompt.js`

**Example Decisions**:
- "Generate challenge: 'Explain your day using only emojis'"
- "Create unique challenge based on user's interests"

---

### 8. **Bakchodi Challenge Scoring** (`gamesAIService.js`)

**Location**: `backend/src/ai/handlers/gamesAIService.js`

**AI Function**: `scoreBakchodiSubmission()`

**When Called**: 
- User submits response to daily challenge

**Decision Made**:
- ✅ **Scores submission** (0-100 points)
- ✅ **Writes review/feedback** on submission
- Considers: Challenge text, user's submission, creativity, humor
- **Fallback**: Random score (50-100) with default review

**Prompt Used**: `games.bakchodi.prompt.js`

**Example Decisions**:
- "Submission is creative → Score: 85/100"
- "Submission is funny → Score: 90/100"
- "Submission is basic → Score: 60/100"

---

### 9. **Debate Topic Generation** (`gamesAIService.js`)

**Location**: `backend/src/ai/handlers/gamesAIService.js`

**AI Function**: `generateDebateTopic()`

**When Called**: 
- User requests debate topic

**Decision Made**:
- ⚠️ **Currently uses predefined topics** (no AI)
- **Future**: Could generate random absurd topics

**Prompt Used**: None (hardcoded topics)

---

### 10. **Debate Response & Winner** (`gamesAIService.js`)

**Location**: `backend/src/ai/handlers/gamesAIService.js`

**AI Function**: `generateDebateResponse()`

**When Called**: 
- User submits argument in debate game

**Decision Made**:
- ✅ **Generates AI counter-argument**
- ✅ **Decides winner** (user vs AI)
- ✅ **Provides explanation** for decision
- Considers: Topic, user's argument, logic, humor
- **Fallback**: Random winner with default counter-argument

**Prompt Used**: `games.debate.prompt.js`

**Example Decisions**:
- "User's argument is strong → User wins"
- "AI's counter-argument is funnier → AI wins"
- "Both arguments are good → Random winner"

---

### 11. **Meme Caption Scoring** (`gamesAIService.js`)

**Location**: `backend/src/ai/handlers/gamesAIService.js`

**AI Function**: `scoreMemeCaption()`

**When Called**: 
- User submits meme caption

**Decision Made**:
- ✅ **Scores caption** on 3 dimensions:
  - Humor score (0-100)
  - Creativity score (0-100)
  - Nonsense score (0-100)
- ✅ **Calculates total score**
- Considers: Meme image, caption text, context
- **Fallback**: Random scores (50-80 range)

**Prompt Used**: `games.meme.prompt.js`

**Example Decisions**:
- "Caption is hilarious → Humor: 95, Creativity: 80, Nonsense: 70"
- "Caption is creative → Humor: 70, Creativity: 90, Nonsense: 60"

---

### 12. **Future Prediction** (`gamesAIService.js`)

**Location**: `backend/src/ai/handlers/gamesAIService.js`

**AI Function**: `generateFuturePrediction()`

**When Called**: 
- User completes "AI Predicts Your Future" game form

**Decision Made**:
- ✅ **Generates funny future prediction** based on user inputs
- Considers: Name, mood, favorite snack
- **Fallback**: Random prediction from predefined list

**Prompt Used**: `games.future.prompt.js`

**Example Decisions**:
- "User likes pizza → 'You will become pizza king!'"
- "User is happy → 'Your future is bright and full of snacks!'"

---

### 13. **Dare Generation** (`gamesAIService.js`)

**Location**: `backend/src/ai/handlers/gamesAIService.js`

**AI Function**: `generateDare()`

**When Called**: 
- User requests dare from "Dare Machine"

**Decision Made**:
- ✅ **Generates funny, safe dare** for user
- Considers: User context, previous dares
- **Fallback**: Random dare from predefined list

**Prompt Used**: `games.dare.prompt.js`

**Example Decisions**:
- "Generate dare: 'Dance for 10 seconds'"
- "Create personalized dare based on user's activity"

---

### 14. **Roast Generation** (`gamesAIService.js`)

**Location**: `backend/src/ai/handlers/gamesAIService.js`

**AI Function**: `generateRoast()`

**When Called**: 
- User requests roast from "Roast Me" game

**Decision Made**:
- ✅ **Generates funny, light-hearted roast**
- ✅ **Keeps it playful** (not abusive)
- Considers: User context, humor level
- **Fallback**: Random roast from predefined list

**Prompt Used**: `games.roast.prompt.js`

**Example Decisions**:
- "Generate roast: 'Your WiFi password is password123'"
- "Create personalized funny roast"

---

### 15. **Idle User Engagement** (`aiDecisionEngine.js`)

**Location**: `backend/src/ai/handlers/aiDecisionEngine.js`

**AI Function**: `generateIdleEngagement()`

**When Called**: 
- User is idle on dashboard (frontend detection)
- Periodic checks for idle users

**Decision Made**:
- ✅ **Suggests engagement action** (popup, joke, challenge, roast)
- ✅ **Generates engaging message**
- Considers: Idle duration, current page, last activity
- **Fallback**: Default idle message

**Prompt Used**: `engagement.idle.prompt.js`

**Example Decisions**:
- "User idle 2 minutes → Show joke popup"
- "User idle 5 minutes → Suggest challenge"
- "User on dashboard → Show activity suggestion"

---

### 16. **Cron Event Suggestions** (`aiDecisionEngine.js`)

**Location**: `backend/src/ai/handlers/aiDecisionEngine.js`

**AI Function**: `generateCronEventSuggestion()`

**When Called**: 
- During scheduled cron jobs (lucky draws, etc.)
- System-level event decisions

**Decision Made**:
- ✅ **Suggests if event should happen**
- ✅ **Suggests event type and content**
- Considers: Time, user activity, recent events
- **Fallback**: Default cron behavior

**Prompt Used**: `system.cron.prompt.js`

**Example Decisions**:
- "Should lucky draw happen? → Yes, users are active"
- "What event type? → Special bonus draw"

---

### 17. **Feature Planning** (`aiFeaturePlanner.js`)

**Location**: `backend/src/ai/handlers/aiFeaturePlanner.js`

**AI Function**: `getFeatureSuggestions()`, `getFeatureImplementationPlan()`

**When Called**: 
- Admin/developer requests feature suggestions
- Feature planning tool

**Decision Made**:
- ✅ **Suggests new features** for platform
- ✅ **Creates implementation plans**
- Considers: Current features, platform type, tech stack
- **Fallback**: Default feature suggestions

**Prompt Used**: `system.core.prompt.js` (TODO: Create specific prompts)

**Example Decisions**:
- "Suggest 10 new game features"
- "Create implementation plan for feature X"

---

## 📊 Summary Statistics

### Total AI Call Points: **17**

### By Category:

1. **Engagement** (3):
   - Welcome messages
   - Idle engagement
   - Chat bot

2. **Games** (8):
   - Daily challenge generation
   - Challenge scoring
   - Debate topics & responses
   - Meme caption scoring
   - Future predictions
   - Dares
   - Roasts
   - Wordle hints

3. **Rewards** (1):
   - Point suggestions

4. **UI/Chaos** (1):
   - Chaos event generation

5. **System** (2):
   - Cron event suggestions
   - Feature planning

6. **Content** (2):
   - Joke generation
   - Chat responses

---

## 🔄 Decision Flow Pattern

```
User Action / System Event
    ↓
Check: isAIEnabled()?
    ↓
YES → Call AI with context
    ↓
AI Returns Decision/Content
    ↓
Process AI Response
    ↓
Apply Decision / Use Content
    ↓
Fallback (if AI unavailable)
```

---

## 🛡️ Fallback Strategy

**Every AI call has a fallback**:
- ✅ Default values
- ✅ Predefined lists
- ✅ Random selection
- ✅ No-op (skip feature)

**No feature breaks** if AI is unavailable!

---

## 📝 Notes

1. **All AI calls are optional** - App works without OpenAI API key
2. **Graceful degradation** - Fallbacks ensure functionality
3. **Context-aware** - AI receives user info, app state, history
4. **Hinglish focus** - All AI content is in Hindi-English mix
5. **Structured prompts** - Uses centralized prompt system
6. **Error handling** - Try-catch blocks prevent crashes

---

**Last Updated**: December 2024  
**Total AI Integration Points**: 17

