# 📋 Prompt Files Usage Mapping - Complete Guide

Yeh document **har prompt file** ka exact usage batata hai - kahan use hota hai, kab call hota hai, aur kya karta hai.

---

## 🗂️ Prompt Files Structure

```
prompts/
├── system/
│   ├── system.core.prompt.js          ⭐ ALWAYS USED (System prompt)
│   └── system.cron.prompt.js          ⏰ Cron jobs ke liye
├── engagement/
│   ├── engagement.welcome.prompt.js   👋 Login welcome messages
│   └── engagement.idle.prompt.js     😴 Idle user engagement
├── chat/
│   └── chat.conversation.prompt.js    💬 Chat bot messages
├── games/
│   ├── games.bakchodi.prompt.js       🎮 Bakchodi Challenge (scoring)
│   ├── games.debate.prompt.js         🗣️ Debate game (AI responses)
│   ├── games.joke.prompt.js           😂 Joke generation
│   ├── games.roast.prompt.js          🔥 Roast generation
│   ├── games.meme.prompt.js           🖼️ Meme Battle (scoring)
│   ├── games.dare.prompt.js           💪 Dare generation
│   └── games.future.prompt.js         🔮 Future Prediction
├── rewards/
│   └── rewards.points.prompt.js       🎁 Dynamic points suggestions
├── ui/
│   └── ui.chaos.prompt.js              💥 Chaos events generation
└── fallbacks/
    └── fallbacks.generic.prompt.js     ⚠️ Fallback messages
```

---

## 📍 Detailed Usage Mapping

### 1. **system.core.prompt.js** ⭐
**Location**: `prompts/system/system.core.prompt.js`

**Usage**:
- **ALWAYS USED** - Har AI call mein system prompt ke taur par use hota hai
- **Called From**: `backend/src/ai/handlers/aiDecisionEngine.js` → `callAI()` function
- **When**: Har AI call mein automatically load hota hai (line 50)
- **Purpose**: 
  - AI ko context deta hai ki yeh FaltuVerse hai
  - Hinglish mein respond karna hai
  - JSON format mein response dena hai
  - User-friendly aur fun responses

**Variables Used**:
- `user` - User name
- `reason` - Why AI is being called
- `appState` - Current app state (JSON)
- `chatContext` - Chat context if applicable

**Response Format**: 
- Always JSON object
- Contains system instructions

---

### 2. **engagement.welcome.prompt.js** 👋
**Location**: `prompts/engagement/engagement.welcome.prompt.js`

**Usage**:
- **Called From**: `backend/src/ai/handlers/aiDecisionEngine.js` → `generateWelcomeMessage()`
- **When**: User login karta hai (Google OAuth ya Email/Password)
- **Trigger**: `authController.js` → Login success ke baad
- **Purpose**: 
  - Personalized welcome message generate karta hai
  - User name, points, login streak consider karta hai
  - Hinglish mein fun message

**Variables Used**:
- `user` / `userName` - User name
- `userPoints` - Current points
- `loginStreak` - Login streak count
- `currentTime` - Current timestamp

**Response Format**:
```json
{
  "message": "Arre [Name]! Welcome back bhai! ..."
}
```

**Fallback**: 
- Default message: `"Arre ${user.name}! FaltuVerse mein welcome bhai! Kuch faltu karte hain? 🎉"`

---

### 3. **engagement.idle.prompt.js** 😴
**Location**: `prompts/engagement/engagement.idle.prompt.js`

**Usage**:
- **Called From**: `backend/src/ai/handlers/aiDecisionEngine.js` → `generateIdleEngagement()`
- **When**: User 15 seconds se idle hai (Dashboard pe)
- **Trigger**: `Dashboard.jsx` → `useIdleDetection` hook (15 seconds idle)
- **Purpose**: 
  - Idle user ko engage karne ke liye message
  - Popup ya notification type suggest karta hai
  - Action suggest kar sakta hai (e.g., "Go to Chat")

**Variables Used**:
- `user` / `userName` - User name
- `idleDuration` - Kitne seconds se idle hai
- `currentPage` - Current page (e.g., "dashboard")
- `lastActivity` - Last activity time

**Response Format**:
```json
{
  "type": "popup",
  "content": "Bhai kidhar so gaya? Chal kuch faltu karte hain!",
  "action": "navigate_to_chat" // Optional
}
```

**Fallback**: 
- Default: `{ type: 'popup', content: 'Bhai kidhar so gaya? Chal kuch faltu karte hain!' }`

---

### 4. **chat.conversation.prompt.js** 💬
**Location**: `prompts/chat/chat.conversation.prompt.js`

**Usage**:
- **Called From**: `backend/src/ai/handlers/aiChatBot.js` → `generateAIChatMessage()`
- **When**: 
  - Chat room mein 30 seconds se koi message nahi aaya
  - Ya 5+ messages ho gaye aur random chance (20%)
- **Trigger**: `chatBotCron.js` → Har 2 minutes check karta hai
- **Purpose**: 
  - Chat room mein AI bot message send karta hai
  - Recent messages ko context mein leke relevant response
  - Silent chats ko revive karta hai
  - Jokes crack kar sakta hai

**Variables Used**:
- `roomName` - Chat room name
- `recentMessages` - Last 5-10 messages (JSON)
- `messageCount` - Total messages in room
- `activityLevel` - "low", "medium", "high"

**Response Format**:
```json
{
  "message": "Arre yaar kya ho raha hai yahan? ...",
  "type": "message",
  "shouldSend": true
}
```

**Fallback**: 
- No AI message if disabled (graceful degradation)

---

### 5. **ui.chaos.prompt.js** 💥
**Location**: `prompts/ui/ui.chaos.prompt.js`

**Usage**:
- **Called From**: `backend/src/ai/handlers/aiDecisionEngine.js` → `generateChaosAction()`
- **When**: User "Trigger Chaos" button click karta hai (costs 1000 points)
- **Trigger**: `chaosController.js` → `/api/chaos/trigger` endpoint
- **Purpose**: 
  - Creative chaos event type suggest karta hai
  - Breaking news, confetti, shake, animations, etc.
  - Custom message/content generate karta hai

**Variables Used**:
- `user` / `userName` - User who triggered chaos
- `currentState` - Current app state
- `eventType` - Suggested event type

**Response Format**:
```json
{
  "type": "breaking_news",
  "content": "BREAKING: [User] ne chaos trigger kar diya!",
  "data": {
    "color": "#ff0000",
    "duration": 5000
  }
}
```

**Fallback**: 
- Random chaos event from predefined list

---

### 6. **rewards.points.prompt.js** 🎁
**Location**: `prompts/rewards/rewards.points.prompt.js`

**Usage**:
- **Called From**: `backend/src/ai/handlers/aiDecisionEngine.js` → `generateRewardSuggestion()`
- **When**: Points add hote hain user ko (login, chat, games, etc.)
- **Trigger**: `pointsService.js` → `addPoints()` function
- **Purpose**: 
  - Dynamic point amounts suggest karta hai
  - Context ke basis pe points adjust karta hai
  - Fun reasons generate karta hai

**Variables Used**:
- `action` - Action type (e.g., "login", "chat", "game")
- `userPoints` - Current total points
- `currentPoints` - Points before this action
- `loginStreak` - Login streak

**Response Format**:
```json
{
  "points": 150,
  "reason": "Mast login streak hai bhai! Bonus points!",
  "message": "Tumhe 150 points mile! Keep it up!"
}
```

**Fallback**: 
- Original/default points use hote hain if AI unavailable

---

### 7. **games.bakchodi.prompt.js** 🎮
**Location**: `prompts/games/games.bakchodi.prompt.js`

**Usage**:
- **Called From**: `backend/src/ai/handlers/gamesAIService.js` → `scoreBakchodiSubmission()`
- **When**: 
  - User bakchodi challenge submit karta hai
  - Challenge generation (fallback, mostly hardcoded)
- **Trigger**: `gamesController.js` → `/api/games/bakchodi/submit` endpoint
- **Purpose**: 
  - User submission ko score karta hai (0-100)
  - Review/feedback generate karta hai
  - Challenge generation (if AI used)

**Variables Used**:
- `challenge` - Challenge text
- `submission` - User submission
- `mode` - "score_submission" ya "generate_challenge"

**Response Format**:
```json
{
  "score": 85,
  "review": "Mast bakchodi ki hai bhai! Creative tha!"
}
```

**Fallback**: 
- Random score (50-100) + default review

---

### 8. **games.debate.prompt.js** 🗣️
**Location**: `prompts/games/games.debate.prompt.js`

**Usage**:
- **Called From**: `backend/src/ai/handlers/gamesAIService.js` → `generateDebateResponse()`
- **When**: 
  - User debate message send karta hai
  - AI counter-argument generate karta hai
- **Trigger**: `gamesController.js` → `/api/games/debate/message` endpoint
- **Purpose**: 
  - Multi-round debate responses generate karta hai
  - Recent messages ko context mein leke relevant counter-argument
  - Debate end karne ka decision (10+ messages ke baad)
  - Winner decide karta hai

**Variables Used**:
- `topic` - Debate topic
- `recent_messages` - Recent debate messages (JSON)
- `message_count` - Total messages
- `user_argument` - User's latest argument
- `should_end` - Should debate end?

**Response Format**:
```json
{
  "message": "Tum galat ho bhai! Main sahi bol raha hoon!",
  "should_end": false,
  "winner": null, // Only if should_end is true
  "explanation": null // Only if should_end is true
}
```

**Fallback**: 
- Default counter-arguments array se random message

---

### 9. **games.joke.prompt.js** 😂
**Location**: `prompts/games/games.joke.prompt.js`

**Usage**:
- **Called From**: `backend/src/ai/handlers/aiDecisionEngine.js` → `callAI()` with reason 'joke'
- **When**: User "Random Joke" request karta hai
- **Trigger**: `jokeController.js` → `/api/jokes/random` endpoint
- **Purpose**: 
  - Hinglish jokes generate karta hai
  - Context-aware jokes (recent jokes avoid karta hai)

**Variables Used**:
- `recentJokes` - Recent jokes (to avoid repetition)
- `user` - User name (for personalization)

**Response Format**:
```json
{
  "joke": "Ek baar ek developer...",
  "category": "tech" // Optional
}
```

**Fallback**: 
- Hardcoded jokes array se random joke

---

### 10. **games.roast.prompt.js** 🔥
**Location**: `prompts/games/games.roast.prompt.js`

**Usage**:
- **Called From**: `backend/src/ai/handlers/gamesAIService.js` → `generateRoast()`
- **When**: User "Roast Me" game play karta hai
- **Trigger**: `gamesController.js` → `/api/games/roast` endpoint
- **Purpose**: 
  - Hinglish roasts generate karta hai
  - Light-hearted, funny roasts (not mean)
  - User name ko context mein leke

**Variables Used**:
- `user` / `userName` - User name
- `ensure_hinglish` - Always true (Hinglish required)

**Response Format**:
```json
{
  "roast": "Arre [Name], tumhara...",
  "roast_text": "..." // Alternative field name
}
```

**Fallback**: 
- **NO FALLBACK** - Error throw karta hai if AI fails (AI required)

---

### 11. **games.meme.prompt.js** 🖼️
**Location**: `prompts/games/games.meme.prompt.js`

**Usage**:
- **Called From**: `backend/src/ai/handlers/gamesAIService.js` → `scoreMemeCaption()`
- **When**: User meme caption submit karta hai
- **Trigger**: `gamesController.js` → `/api/games/meme/submit` endpoint
- **Purpose**: 
  - Meme caption ko score karta hai (3 dimensions)
  - Humor, creativity, nonsense scores
  - Total score calculate karta hai

**Variables Used**:
- `caption` - User's meme caption
- `imageUrl` - Meme image URL (if available)

**Response Format**:
```json
{
  "humor_score": 75,
  "creativity_score": 80,
  "nonsense_score": 90
}
```

**Fallback**: 
- Random scores (50-80 range)

---

### 12. **games.dare.prompt.js** 💪
**Location**: `prompts/games/games.dare.prompt.js`

**Usage**:
- **Called From**: `backend/src/ai/handlers/gamesAIService.js` → `generateDare()`
- **When**: User "Dare Machine" game play karta hai
- **Trigger**: `gamesController.js` → `/api/games/dare` endpoint
- **Purpose**: 
  - Creative dares generate karta hai
  - Safe, fun dares (not dangerous)

**Variables Used**:
- `user` - User name (for personalization)

**Response Format**:
```json
{
  "dare": "Apne phone ko 1 minute ke liye upside down rakho"
}
```

**Fallback**: 
- Hardcoded dares array se random dare

---

### 13. **games.future.prompt.js** 🔮
**Location**: `prompts/games/games.future.prompt.js`

**Usage**:
- **Called From**: `backend/src/ai/handlers/gamesAIService.js` → `generateFuturePrediction()`
- **When**: User "Future Prediction" game play karta hai
- **Trigger**: `gamesController.js` → `/api/games/future` endpoint
- **Purpose**: 
  - User ke future predictions generate karta hai
  - Name, mood, favorite snack ko context mein leke

**Variables Used**:
- `name` - User name
- `mood` - User's current mood
- `fav_snack` - Favorite snack

**Response Format**:
```json
{
  "prediction": "Tum [snack] ke raja banoge!"
}
```

**Fallback**: 
- Hardcoded predictions array se random prediction

---

### 14. **system.cron.prompt.js** ⏰
**Location**: `prompts/system/system.cron.prompt.js`

**Usage**:
- **Called From**: `backend/src/ai/handlers/aiDecisionEngine.js` → `generateCronEventSuggestion()`
- **When**: Cron jobs run hote hain (periodic checks)
- **Trigger**: Various cron jobs (lucky draw, chat bot, etc.)
- **Purpose**: 
  - Cron events suggest karta hai
  - Special events, announcements, etc.

**Variables Used**:
- `time` - Current timestamp
- `appState` - Current app state

**Response Format**:
```json
{
  "shouldHappen": true,
  "eventType": "special_announcement",
  "content": "...",
  "data": {}
}
```

**Fallback**: 
- `{ shouldHappen: false }`

---

### 15. **fallbacks.generic.prompt.js** ⚠️
**Location**: `prompts/fallbacks/fallbacks.generic.prompt.js`

**Usage**:
- **Called From**: `promptLoader.js` → Fallback mechanism
- **When**: Specific prompt file nahi milta ya error aata hai
- **Purpose**: 
  - Generic fallback messages
  - Error handling

**Variables Used**:
- Generic variables

**Response Format**:
- Generic JSON response

---

## 🔄 Prompt Loading Flow

```
1. AI Call Triggered
   ↓
2. aiDecisionEngine.js → callAI()
   ↓
3. REASON_TO_PROMPT mapping check
   ↓
4. Load system.core.prompt.js (ALWAYS)
   ↓
5. Load specific prompt (e.g., games.roast.prompt.js)
   ↓
6. Replace variables with actual values
   ↓
7. Send to OpenAI API
   ↓
8. Parse JSON response
   ↓
9. Return to caller
```

---

## 📊 Summary Table

| Prompt File | Reason Key | Used In | When Called |
|------------|------------|---------|-------------|
| `system.core` | Always | All AI calls | Every AI call |
| `engagement.welcome` | `login` | `authController` | User login |
| `engagement.idle` | `idle` | `Dashboard.jsx` | 15s idle |
| `chat.conversation` | `chat` | `chatBotCron` | Chat silent |
| `ui.chaos` | `chaos` | `chaosController` | Chaos trigger |
| `rewards.points` | `rewards` | `pointsService` | Points added |
| `games.bakchodi` | `games` | `gamesController` | Bakchodi submit |
| `games.debate` | `games` | `gamesController` | Debate message |
| `games.joke` | `joke` | `jokeController` | Random joke |
| `games.roast` | `roast` | `gamesController` | Roast request |
| `games.meme` | `games` | `gamesController` | Meme submit |
| `games.dare` | `games` | `gamesController` | Dare request |
| `games.future` | `games` | `gamesController` | Future request |
| `system.cron` | `cron` | Cron jobs | Periodic checks |

---

## 🎯 Next Steps

Ab hum line-by-line har prompt file ko fix karenge. Pehle batao kaunse prompt se start karna hai? 🚀

