# FaltuVerse Codebase Scan Summary

**Generated:** 2024-12-03  
**Phase:** 0 - Initial Audit & Discovery

---

## Executive Summary

FaltuVerse is a full-stack entertainment web application built with Node.js/Express backend and React frontend. The application features multiple games, real-time chat, lucky draws, chaos events, and AI-powered interactions. This scan identifies key modules, potential improvements, and areas requiring attention.

---

## 1. Project Structure

### Backend Architecture
- **Framework:** Express.js (v4.18.2)
- **Database:** MySQL with Sequelize ORM (v6.35.2)
- **Real-time:** Socket.IO (v4.6.1)
- **Authentication:** JWT + Google OAuth 2.0
- **AI:** OpenAI API (v4.20.1)
- **Cron Jobs:** node-cron (v3.0.3)
- **Admin Panel:** AdminJS (v6.8.7)

### Frontend Architecture
- **Framework:** React 18 + Vite
- **Routing:** React Router DOM (v6.21.1)
- **Styling:** TailwindCSS
- **Real-time:** Socket.IO Client (v4.6.1)
- **Auth:** @react-oauth/google

---

## 2. Key Modules Identified

### API Routes (`backend/src/api/routes/`)
1. **authRoutes.js** - Google OAuth, email/password auth, JWT
2. **userRoutes.js** - User profile, points, leaderboard
3. **gamesRoutes.js** - All game endpoints (30+ games)
4. **wordleRoutes.js** - Wordle game endpoints
5. **tambolaRoutes.js** - Tambola (Bingo) game endpoints
6. **chaosRoutes.js** - Chaos event triggers
7. **luckyDrawRoutes.js** - Lucky draw endpoints
8. **rushRoutes.js** - Daily rush activity system
9. **jokeRoutes.js** - AI joke generation
10. **aiRoutes.js** - AI management endpoints
11. **gamesManagementRoutes.js** - Admin game management

### Controllers (`backend/src/api/controllers/`)
- **authController.js** - Authentication logic
- **gamesController.js** - Game request handlers (30+ games)
- **wordleController.js** - Wordle game logic
- **tambolaController.js** - Tambola game logic
- **chaosController.js** - Chaos event handlers
- **luckyDrawController.js** - Lucky draw handlers
- **userController.js** - User management
- **jokeController.js** - Joke generation

### Services (`backend/src/services/`)

#### Games Services (`games/`)
- **gamesService.js** - Main game service (30+ games)
- **wordleService.js** - Wordle game logic (daily word generation)
- **tambolaService.js** - Tambola game logic (ticket generation, number calling)
- **jokeService.js** - Joke generation
- **GameEngine.js** - Base game engine class
- **GameRegistry.js** - Game registration and discovery

#### Engagement Services (`engagement/`)
- **rushService.js** - Daily rush activity system (next activity selection)
- **chaosService.js** - Chaos event management
- **luckyDrawService.js** - Hourly lucky draw
- **minuteLuckyDrawService.js** - 5-minute lucky draw

#### Core Services
- **pointsService.js** - Points system
- **authService.js** - Authentication logic
- **chatService.js** - Chat room management

### Cron Jobs (`backend/src/cron/`)
1. **luckyDrawCron.js** - Hourly + 5-minute lucky draws
2. **rushResetCron.js** - Daily midnight reset for rush activities
3. **tambolaCron.js** - Tambola game initialization
4. **chatBotCron.js** - AI chatbot checks

### AI System (`backend/src/ai/`)

#### Engine (`engine/`)
- **AIEngine.js** - Main AI engine
- **PromptSelector.js** - Prompt selection logic
- **ContextBuilder.js** - Context building
- **FallbackManager.js** - Fallback handling
- **ResponseCache.js** - In-memory response caching

#### Handlers (`handlers/`)
- **gamesAIService.js** - Game-specific AI calls
- **aiChatBot.js** - Chat bot AI
- **aiDecisionEngine.js** - Decision engine
- **aiDecisionEngineV2.js** - V2 decision engine
- **aiFeaturePlanner.js** - Feature planning AI

#### Prompts (`prompts/`)
- **PromptRegistry.js** - Central prompt registry with auto-discovery
- **promptLoader.js** - Prompt loading utilities

#### Improvement (`improvement/`)
- **AnalyticsTracker.js** - AI call analytics
- **FeedbackCollector.js** - User feedback collection
- **PromptOptimizer.js** - Prompt optimization

### Models (`backend/src/models/`)
- **User.js** - User accounts
- **UserPoints.js** - Points tracking
- **UserActivityTracking.js** - Rush activity tracking
- **ChatRoom.js** - Chat rooms
- **ChatMessage.js** - Chat messages
- **LuckyDraw.js** - Lucky draw records
- **ChaosEvent.js** - Chaos events
- **TambolaRoom.js** - Tambola game rooms
- **TambolaTicket.js** - Tambola tickets
- **BakchodiChallenge.js** - Bakchodi game records
- **Debate.js** - Debate game records
- **MemeBattle.js** - Meme battle records
- **WheelSpin.js** - Wheel spin records
- **FuturePrediction.js** - Future prediction records
- **TapGameScore.js** - Tap game scores
- **RunawayButtonWin.js** - Runaway button wins
- **Dare.js** - Dare records
- **Roast.js** - Roast records
- **GameRoom.js** - Generic game rooms
- **GameRoomUser.js** - Game room users

### Socket Events (`backend/src/events/`)
- **socketEvents.js** - Chat socket handlers (join room, send message, AI bot)

### Configuration (`backend/src/config/`)
- **games.js** - Central game configuration (30+ games, 1090 lines)
- **rushActivities.js** - Rush activity definitions
- **ai.js** - AI configuration (OpenAI, caching, retry, analytics)
- **db.js** - Database connection (Sequelize)

---

## 3. Games Inventory

### Core Games (Original)
1. **Wordle** - Daily 5-letter word guessing game
2. **Tambola** - Bingo-style game with rooms
3. **Bakchodi** - Daily AI challenge
4. **Meme** - Meme battle with AI scoring
5. **Debate** - AI-powered debate generator
6. **Wheel** - Lucky wheel with random outcomes
7. **Future** - AI future predictions
8. **Tap** - 5-second tap speed game
9. **Runaway** - Button that runs away
10. **Dare** - AI-generated dares
11. **Roast** - AI-generated roasts

### New Games (30+ Additional)
- AukaatMeter, BakchodiLevel, BakwaasBattle, BombTimer
- ChaosGenerator, ChaosSurvival, ComplimentChaos, CringeLevel
- DareMaster, DesiBurn, DesiMaster, DesiSpeedRush
- EmojiMashup, EmojiTale, GyaanGuru, JhandMeter
- LuckyChaos, MemeMaster, MoodReader, MoodSwinger
- NonsenseFactory, PoetryChaos, PressureTest, QuizChaos
- ReflexMaster, TypingChaos, UselessFact, VibeDetector, VibeScanner

**Total:** 40+ games configured

---

## 4. AI Prompts Location

**Base Path:** `/prompts/`

### Categories
- **chat/** - Chat conversation prompts
- **engagement/** - Engagement prompts (idle, welcome)
- **fallbacks/** - Fallback prompts
- **games/** - Game-specific prompts (30+ prompt files)
- **moderation/** - Moderation prompts
- **rewards/** - Rewards/points prompts
- **system/** - System prompts (core, cron)
- **ui/** - UI-related prompts

### Prompt Registry
- **prompt-index.json** - Auto-generated index
- **PromptRegistry.js** - Central registry with auto-discovery
- Prompts loaded from filesystem and indexed

---

## 5. Existing Caching

### Current State
- **NO Redis** - No Redis caching currently implemented
- **In-Memory Caching:**
  - AI response cache (`backend/src/ai/engine/ResponseCache.js`) - In-memory only
  - Game engine instances cached in `GameRegistry`
  - Prompt registry loaded in memory

### Cache Configuration (AI)
- Located in `backend/src/config/ai.js`
- TTLs defined for: login (5m), idle (2m), chat (1m), chaos (3m), joke (10m), roast (5m), dare (5m), rewards (2m)
- **Issue:** Currently only in-memory, not persisted

---

## 6. Existing Logging

### Current State
- **Basic Logger** (`backend/src/utils/logger.js`)
  - Simple console-based logger
  - Log levels: ERROR, WARN, INFO, DEBUG
  - No file rotation
  - No structured JSON logging
  - No log separation by module

### Logging Usage
- Console.log/error used throughout codebase
- Logger utility exists but not consistently used
- No centralized log management
- No log retention policy

---

## 7. Testing Status

### Current State
- **NO TEST SUITE** - No tests found in codebase
- **Test Directory:** `backend/tests/` exists but is empty
- **No Test Framework:** No Jest, Mocha, or other test framework configured
- **No Test Scripts:** package.json has no test scripts

### Test Coverage
- **0% Coverage** - No tests exist

---

## 8. Database Access Patterns

### Heavy DB Queries Identified

1. **Rush Service** (`rushService.js`)
   - `getNextRushActivity()` - Queries all user activity tracking records
   - Called on every rush page load
   - **Cache Opportunity:** Cache next activity per user (15m TTL)

2. **Wordle Service** (`wordleService.js`)
   - `getDailyWord()` - Computed daily, but no caching
   - **Cache Opportunity:** Cache daily word per date (26h TTL)

3. **Tambola Service** (`tambolaService.js`)
   - Active room state queries
   - Number calling state
   - **Cache Opportunity:** Cache active room state (1h TTL or until completion)

4. **Game Config** (`games.js`)
   - Large config file (1090 lines) loaded on every request
   - **Cache Opportunity:** Cache game config (12h TTL)

5. **Lucky Draw** (`luckyDrawService.js`)
   - Active users query for candidate pool
   - **Cache Opportunity:** Cache active user set (with heartbeat expiry)

6. **Leaderboards**
   - User points queries for leaderboard
   - **Cache Opportunity:** Cache leaderboard snapshots (5m TTL)

---

## 9. Areas of High Complexity

### 1. Game Configuration (`games.js`)
- **1090 lines** of configuration
- 40+ games with complex configs
- Loaded on every game request
- **Risk:** Performance bottleneck

### 2. Rush Activity System (`rushService.js`)
- Complex priority algorithm (unvisited > least frequent > daily first)
- Multiple DB queries per request
- **Risk:** Slow response times

### 3. Tambola Game Logic (`tambolaService.js`)
- Real-time number calling
- Multiple concurrent rooms
- **Risk:** Race conditions, state management issues

### 4. Lucky Draw Cron (`luckyDrawCron.js`)
- Multiple cron jobs (hourly + 5-minute)
- Timer broadcasting
- **Risk:** Double execution, race conditions

### 5. AI Prompt System (`PromptRegistry.js`)
- File system scanning
- In-memory caching
- **Risk:** Memory usage, slow startup

---

## 10. TODOs and Technical Debt

### Found TODOs
1. **aiRoutes.js:223** - `// TODO: Add admin check`
2. **aiDecisionEngine.js:19-20** - `// TODO: Create specific prompt` (feature_planning, feature_implementation)

### Technical Debt Areas
1. **No Redis Caching** - All caching is in-memory
2. **No File Logging** - Only console logging
3. **No Tests** - Zero test coverage
4. **No Rate Limiting** - Public endpoints unprotected
5. **No Cron Locks** - Risk of double execution
6. **Inconsistent Error Handling** - Mix of try/catch and console.error
7. **No Request ID Tracking** - Hard to trace requests

---

## 11. Dependencies Status

### Backend Dependencies
- ✅ All core dependencies installed
- ❌ **Missing:** Redis client (ioredis/node-redis)
- ❌ **Missing:** Winston (for logging)
- ❌ **Missing:** Test framework (Jest/Mocha)
- ❌ **Missing:** Supertest (for API testing)

### Dev Dependencies
- ✅ nodemon (dev)
- ✅ sequelize-cli (migrations)
- ❌ **Missing:** ESLint/Prettier (no linting config found)
- ❌ **Missing:** Test framework

---

## 12. Potential Issues & Risks

### Critical Risks
1. **Cron Double Execution** - No locking mechanism
2. **Race Conditions** - Tambola winners, lucky draws
3. **Memory Leaks** - In-memory caches grow unbounded
4. **No Error Recovery** - Redis unavailable = system down (when added)
5. **No Rate Limiting** - API abuse possible

### Performance Risks
1. **DB Query Overload** - Rush service queries on every page load
2. **Large Config Loading** - games.js loaded repeatedly
3. **No Connection Pooling** - Redis (when added) needs connection pooling
4. **No Request Timeouts** - External API calls (OpenAI) can hang

### Security Risks
1. **No Rate Limiting** - Public endpoints unprotected
2. **No Input Validation** - Some endpoints may lack validation
3. **Token Expiry** - Need to verify JWT expiry handling

---

## 13. Recommended Improvements Priority

### High Priority (Phase 1-2)
1. ✅ Add Redis caching for games config
2. ✅ Add Redis caching for rush activities
3. ✅ Add Redis caching for Wordle daily word
4. ✅ Add Redis caching for Tambola room state
5. ✅ Add Redis caching for leaderboards

### Medium Priority (Phase 3-4)
1. ✅ Implement file-based rotating logs
2. ✅ Add structured JSON logging
3. ✅ Create test suite (unit + integration)
4. ✅ Add Redis locks for cron jobs

### Low Priority (Phase 5-6)
1. ✅ Add rate limiting
2. ✅ Add request timeouts
3. ✅ Add circuit breakers
4. ✅ Improve error handling

---

## 14. Migration Requirements

### Database Migrations
- **NO SCHEMA CHANGES REQUIRED** for caching/logging
- Existing migrations in `backend/migrations/` appear complete
- **Action:** Verify no migrations needed before proceeding

---

## 15. Next Steps

### Immediate Actions
1. ✅ **Create scan summary** (this document)
2. ⏳ **Wait for confirmation** before proceeding with changes
3. ⏳ **Verify no DB migrations needed** (user confirmation)
4. ⏳ **Proceed with Phase 1** (Redis caching) after approval

### Questions for User
1. **Redis Setup:** Do you have Redis available? (local or cloud)
2. **DB Migrations:** Any pending migrations or schema changes needed?
3. **Test Priority:** Which modules should be tested first?
4. **Log Retention:** How many days of logs to retain? (default: 30 days)

---

## 16. File Count Summary

- **Backend Routes:** 11 files
- **Backend Controllers:** 8 files
- **Backend Services:** 28+ files
- **Backend Models:** 21 files
- **Cron Jobs:** 4 files
- **AI Handlers:** 5 files
- **AI Prompts:** 30+ prompt files
- **Frontend Pages:** 48+ files
- **Frontend Components:** 7 files

**Total Estimated Files:** 150+ files

---

## Conclusion

The codebase is well-structured but lacks:
1. **Redis caching** (critical for performance)
2. **File-based logging** (critical for debugging)
3. **Test coverage** (critical for reliability)
4. **Cron locks** (critical for data integrity)

All improvements can be made **without database schema changes**, making this a safe enhancement project.

---

**Status:** ✅ Phase 0 Complete - Ready for Phase 1 after user confirmation

