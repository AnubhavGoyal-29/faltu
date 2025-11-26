# FaltuVerse Backend Architecture

## 📁 Directory Structure

```
backend/
├── src/
│   ├── api/                    # API Layer
│   │   ├── controllers/        # Request handlers (thin layer)
│   │   ├── routes/            # Route definitions
│   │   └── validators/        # Input validation (future)
│   │
│   ├── services/              # Business Logic Layer
│   │   ├── authService.js
│   │   ├── chatService.js
│   │   ├── chaosService.js
│   │   ├── gamesService.js
│   │   ├── jokeService.js
│   │   ├── luckyDrawService.js
│   │   ├── minuteLuckyDrawService.js
│   │   ├── pointsService.js
│   │   ├── rushService.js
│   │   ├── systemUsersService.js
│   │   ├── tambolaService.js
│   │   ├── wordleService.js
│   │   └── chaosAnimations.js
│   │
│   ├── repositories/          # Data Access Layer (future)
│   │   └── (to be implemented)
│   │
│   ├── models/               # Sequelize Models
│   │   ├── index.js          # Model exports & associations
│   │   └── *.js              # Individual model files
│   │
│   ├── ai/                    # AI Integration Layer
│   │   ├── handlers/         # AI service wrappers
│   │   │   ├── aiDecisionEngine.js
│   │   │   ├── aiChatBot.js
│   │   │   ├── aiFeaturePlanner.js
│   │   │   └── gamesAIService.js
│   │   └── prompt-loaders/   # Prompt management
│   │       └── promptLoader.js
│   │
│   ├── cron/                  # Scheduled Tasks
│   │   ├── luckyDrawCron.js
│   │   ├── chatBotCron.js
│   │   ├── tambolaCron.js
│   │   └── rushResetCron.js
│   │
│   ├── events/                # Event Handlers
│   │   └── socketEvents.js    # Socket.IO handlers
│   │
│   ├── workers/               # Background Workers (future)
│   │   └── (to be implemented)
│   │
│   ├── middlewares/           # Express Middleware
│   │   └── auth.js           # JWT authentication
│   │
│   ├── config/                # Configuration
│   │   ├── db.js             # Database connection
│   │   └── rushActivities.js # Rush activities config
│   │
│   ├── utils/                # Utility Functions
│   │   └── (helpers, etc.)
│   │
│   └── server.js              # Application Entry Point
│
├── migrations/                # Database Migrations
├── tests/                     # Test Files (future)
└── package.json
```

## 🔄 Request Flow

```
Client Request
    ↓
Routes (/api/routes/*)
    ↓
Middleware (authentication, validation)
    ↓
Controllers (/api/controllers/*)
    ↓
Services (/services/*)
    ↓
Repositories (/repositories/*) [Future]
    ↓
Models (/models/*)
    ↓
Database (MySQL)
```

## 📦 Module Responsibilities

### API Layer (`/api`)

#### Controllers
- **Purpose**: Handle HTTP requests/responses
- **Responsibilities**:
  - Extract request data
  - Call appropriate services
  - Format responses
  - Handle errors
- **DO NOT**: Contain business logic, database queries, or complex processing

#### Routes
- **Purpose**: Define API endpoints
- **Responsibilities**:
  - Map URLs to controllers
  - Apply middleware
  - Define HTTP methods

#### Validators (Future)
- **Purpose**: Validate request data
- **Responsibilities**:
  - Input validation
  - Data sanitization
  - Error messages

### Services Layer (`/services`)

- **Purpose**: Business logic and orchestration
- **Responsibilities**:
  - Implement business rules
  - Coordinate between multiple models/services
  - Call AI handlers when needed
  - Handle complex workflows
- **DO NOT**: Directly query database (use repositories in future)

### AI Layer (`/ai`)

#### Handlers
- **Purpose**: AI service wrappers
- **Responsibilities**:
  - Interface with OpenAI API
  - Format AI requests/responses
  - Handle AI errors gracefully

#### Prompt Loaders
- **Purpose**: Manage AI prompts
- **Responsibilities**:
  - Load prompts from `/prompts` directory
  - Replace template variables
  - Cache prompts

### Models Layer (`/models`)

- **Purpose**: Database schema definitions
- **Responsibilities**:
  - Define Sequelize models
  - Define model associations
  - Export models

### Cron Jobs (`/cron`)

- **Purpose**: Scheduled tasks
- **Responsibilities**:
  - Hourly lucky draws
  - 5-minute lucky draws
  - Chat bot periodic checks
  - Tambola game scheduling
  - Daily rush activity resets

### Events (`/events`)

- **Purpose**: Real-time event handling
- **Responsibilities**:
  - Socket.IO connection management
  - Real-time message handling
  - User presence tracking

## 🔌 Dependencies

### Service Dependencies
```
Services → AI Handlers
Services → Models (directly - will use repositories in future)
Services → Other Services
Controllers → Services
Controllers → Models (for simple lookups)
Routes → Controllers
Routes → Middlewares
Cron → Services
Cron → AI Handlers
Events → Services
Events → Models
```

### Import Paths

- **From Controllers**: `../../services/...`, `../../models/...`
- **From Routes**: `../controllers/...`, `../../middlewares/...`
- **From Services**: `../ai/handlers/...`, `../models/...`, `./otherService`
- **From Cron**: `../services/...`, `../ai/handlers/...`
- **From Events**: `../services/...`, `../models/...`

## 🎯 Naming Conventions

### Files
- **Controllers**: `*Controller.js` (e.g., `authController.js`)
- **Routes**: `*Routes.js` (e.g., `authRoutes.js`)
- **Services**: `*Service.js` (e.g., `authService.js`)
- **Models**: `PascalCase.js` (e.g., `User.js`)
- **Cron**: `*Cron.js` (e.g., `luckyDrawCron.js`)

### Functions
- **Controllers**: Verb-based (e.g., `getProfile`, `createUser`)
- **Services**: Verb-based (e.g., `findUser`, `createRoom`)
- **Cron**: `schedule*`, `initialize*`

## 🔐 Authentication Flow

1. User sends credentials to `/api/auth/*`
2. `authController` calls `authService`
3. `authService` validates and creates JWT token
4. Token returned to client
5. Client includes token in `Authorization` header
6. `auth` middleware validates token
7. `req.user` populated with user data

## 🤖 AI Integration

### AI Features
- Welcome messages
- Chat bot responses
- Chaos event generation
- Reward suggestions
- Game evaluations (scoring, content generation)
- Idle user engagement
- Cron event suggestions

### AI Flow
```
Service → AI Handler → Prompt Loader → OpenAI API
                ↓
         Response Processing
                ↓
         Service continues
```

### Graceful Degradation
- All AI features check `isAIEnabled()` before calling
- Fallback to default behavior if AI unavailable
- No errors thrown when AI disabled

## 📊 Database

### Models
- Sequelize ORM
- Models defined in `/models`
- Associations in `/models/index.js`
- Migrations in `/migrations`

### Query Pattern (Current)
- Services directly query models
- Future: Use repository pattern

## ⏰ Cron Jobs

### Scheduled Tasks
- **Hourly Lucky Draw**: `0 * * * *`
- **5-Minute Lucky Draw**: `*/5 * * * *`
- **Chat Bot Check**: `*/2 * * * *`
- **Tambola Backup**: `*/5 * * * *`
- **Rush Reset**: `0 0 * * *`

### Initialization
- Cron jobs initialized in `server.js`
- Pass `io` instance for Socket.IO broadcasting

## 🔌 Socket.IO

### Events
- Chat room events (`join_room`, `message`, etc.)
- Lucky draw events (`lucky_draw_timer`, `lucky_draw_winner`)
- Tambola events (`tambola_room_created`, `tambola_number_called`)
- Chaos events (`chaos_event`, `return_chaos`)

### Handler Location
- Socket handlers in `/events/socketEvents.js`
- Initialized in `server.js`

## 🚀 Server Startup

1. Load environment variables
2. Initialize Express app
3. Initialize Socket.IO
4. Setup middleware
5. Register routes
6. Initialize cron jobs
7. Connect to database
8. Sync models
9. Create system users
10. Initialize tambola game
11. Start HTTP server

## 📝 Code Style

- **Hinglish**: Comments and console logs in Hinglish
- **Error Handling**: Try-catch in all async functions
- **Logging**: Console logs for debugging
- **Graceful Fallbacks**: Always provide fallbacks for optional features

## 🔮 Future Improvements

### Repository Layer
- Extract database queries from services
- Improve testability
- Centralize data access logic

### Validators
- Create input validation layer
- Centralize validation rules
- Better error messages

### Workers
- Background job processing
- Queue management
- Async task handling

### Testing
- Unit tests for services
- Integration tests for API
- E2E tests for critical flows

## 📚 Key Files

- **Entry Point**: `src/server.js`
- **Database Config**: `src/config/db.js`
- **Auth Middleware**: `src/middlewares/auth.js`
- **Socket Events**: `src/events/socketEvents.js`
- **AI Core**: `src/ai/handlers/aiDecisionEngine.js`
- **Model Exports**: `src/models/index.js`

---

**Last Updated**: December 2024  
**Version**: 2.0 (Restructured)

