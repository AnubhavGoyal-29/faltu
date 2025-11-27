# 🎉 FaltuVerse - Complete Project Description

## 📖 Overview

**FaltuVerse** is a comprehensive entertainment web application designed for "pure entertainment for no reason." It's a chaotic, fun-filled platform where users can engage in random activities, play games, chat with strangers, trigger chaos events, and earn points - all while maintaining a playful Hinglish (Hindi-English) interface.

The platform combines real-time interactions, AI-powered features, multiple game modes, social elements, and a robust points/rewards system to create an engaging and unpredictable user experience.

---

## 🎯 Core Philosophy

- **"Pure Entertainment for No Reason"** - No serious purpose, just fun
- **Chaos-Driven UX** - Unexpected events and animations keep users engaged
- **Hinglish Interface** - Mix of Hindi and English for a relatable Indian audience
- **AI-Enhanced Experience** - Optional AI features that gracefully degrade when unavailable
- **Point-Based Engagement** - Gamification through points, streaks, and rewards

---

## 🏗️ Architecture & Tech Stack

### Backend
- **Runtime**: Node.js (v20+ required)
- **Framework**: Express.js
- **Database**: MySQL with Sequelize ORM
- **Real-time**: Socket.IO for WebSocket connections
- **Authentication**: JWT (JSON Web Tokens)
- **OAuth**: Google OAuth 2.0
- **AI Integration**: OpenAI GPT-3.5-turbo (optional)
- **Task Scheduling**: node-cron for scheduled tasks
- **Validation**: Express middleware

### Frontend
- **Framework**: React 18
- **Build Tool**: Vite
- **Routing**: React Router v6
- **State Management**: React Context API
- **Real-time**: Socket.IO Client
- **OAuth**: @react-oauth/google
- **Styling**: Tailwind CSS
- **Animations**: Canvas Confetti, CSS animations
- **HTTP Client**: Axios

### Infrastructure
- **Database**: MySQL 8.0+
- **Environment**: Development & Production ready
- **Deployment**: Supports PM2, Docker, traditional hosting

---

## 🔐 Authentication System

### Login Methods

1. **Google OAuth Login**
   - One-click Google account authentication
   - Auto-creates user profile with Google data
   - Stores: name, email, profile photo, Google ID
   - Generates JWT token for session management
   - AI-generated personalized welcome messages

2. **Email/Password Login**
   - Traditional email-password authentication
   - Auto-signup for new users
   - Password hashing with bcrypt
   - Minimum 6 character password requirement
   - Optional name field for new user registration

3. **Admin Login**
   - Separate admin authentication endpoint
   - Credentials: `admin` / `admin123`
   - Admin user auto-creation on first login
   - Initial 1000 points for admin account

### Security Features
- JWT token-based authentication
- Token expiration (7 days default)
- Protected API routes with auth middleware
- CORS configuration
- Password hashing
- Secure session management

---

## 🏠 Dashboard Features

### User Information Display
- **Total Points**: Current point balance
- **Login Streak**: Consecutive daily login count
- **Last Lucky Draw Winner**: Recent draw results
- **Welcome Message**: AI-generated or default greeting
- **User Profile**: Name, email, profile photo

### Quick Actions
- **Go to Chat**: Navigate to random chat room
- **Trigger Chaos**: Spend 1000 points to trigger chaos event
- **Get Joke**: Request AI-generated Hinglish joke
- **Play Games**: Access games dashboard
- **View Activities**: Access rush activities

### Visual Elements
- Rotating motivational quotes
- Feature cards with navigation
- Real-time lucky draw countdown timer
- Points and streak badges
- Responsive design

---

## 💬 Chat System

### Random Chat Rooms
- **Auto-Assignment**: Users automatically join random rooms
- **Room Names**: Funny, AI-generated or random names
- **Room Expiration**: Rooms expire after 10 minutes of inactivity
- **Real-time Messaging**: Socket.IO powered instant messaging
- **User Presence**: See who's in the room
- **Message History**: View recent messages on join

### Features
- **Socket.IO Integration**: Real-time bidirectional communication
- **User Avatars**: Profile photos displayed in chat
- **Message Timestamps**: Track when messages were sent
- **Room Switching**: Join new random rooms anytime
- **AI Chat Bot**: Automatic AI bot participation
  - Responds to messages
  - Cracks jokes
  - Revives silent chats
  - Runs every 2 minutes via cron

### Chat Bot Behavior
- Analyzes chat context
- Generates contextual responses
- Participates naturally in conversations
- Triggers on idle rooms or specific keywords

---

## 🎮 Games Collection

### 1. Wordle Game
- **Type**: Daily challenge
- **Mechanics**: 5-letter word guessing game
- **Attempts**: 6 guesses per day
- **Feedback**: Color-coded hints (green/yellow/gray)
- **Rewards**: Points on successful completion
- **Features**: Daily word reset, hint system, word reveal on loss

### 2. Tambola (Housie/Bingo)
- **Type**: Scheduled multiplayer game
- **Mechanics**: Number calling game with tickets
- **Ticket Format**: 3x9 grid with numbers
- **Win Conditions**: 
  - Top Row (5 numbers)
  - Middle Row (5 numbers)
  - Bottom Row (5 numbers)
  - Full House (all numbers)
- **Schedule**: Games start every 5 minutes
- **Registration**: 30-second registration window
- **System Users**: Auto-join bots for engagement
- **Real-time Updates**: Live number calling via Socket.IO
- **Rewards**: Points for winning

### 3. Daily Bakchodi Challenge
- **Type**: Daily challenge
- **Mechanics**: Random challenge prompt, user submits response
- **AI Scoring**: AI evaluates creativity, humor, nonsense factor
- **Scoring**: 0-100 points based on AI evaluation
- **Rewards**: Points based on score
- **History**: View past challenges and scores

### 4. Random Argument Generator / Debate
- **Type**: Repeatable
- **Mechanics**: Get random absurd debate topic, write argument
- **AI Counter-Argument**: AI generates counter-argument
- **Winner Declaration**: AI decides winner based on arguments
- **Rewards**: Points if user wins

### 5. Instant Meme Battle
- **Type**: Repeatable
- **Mechanics**: Get random meme image, write caption
- **AI Scoring**: Evaluates humor, creativity, nonsense
- **Scoring Breakdown**: 
  - Humor score
  - Creativity score
  - Nonsense score
  - Total score
- **Rewards**: Points based on total score

### 6. Lucky Nonsense Wheel
- **Type**: Repeatable
- **Mechanics**: Spin wheel for random outcome
- **Outcomes**:
  - Roast (AI-generated funny roast)
  - Compliment (AI-generated compliment)
  - Dare (AI-generated dare)
  - Points reward (random amount)
- **Animation**: Visual wheel spin animation
- **Rewards**: Points for reward outcomes

### 7. AI Predicts Your Future
- **Type**: Repeatable
- **Mechanics**: Answer questions, get future prediction
- **Questions**: Name, mood, favorite snack, etc.
- **AI Prediction**: Funny, nonsensical future prediction
- **History**: View past predictions

### 8. 5-Second Tap Game
- **Type**: Repeatable
- **Mechanics**: Tap button as fast as possible for 5 seconds
- **Scoring**: Count of taps in 5 seconds
- **Leaderboard**: Top scores displayed
- **Rewards**: Points based on performance

### 9. Button That Runs Away
- **Type**: Repeatable
- **Mechanics**: Try to click button that moves on hover
- **Tracking**: Counts attempts to catch button
- **Rewards**: Points on successful click

### 10. Dare Machine
- **Type**: Repeatable
- **Mechanics**: Request AI-generated funny dare
- **AI Generation**: Contextual, humorous dares
- **Display**: Show dare text

### 11. Roast Me
- **Type**: Repeatable
- **Mechanics**: Request AI-generated funny roast
- **AI Generation**: Personalized, humorous roasts
- **Display**: Show roast text

### 12. Room Chaos Mode
- **Type**: Group activity (placeholder)
- **Mechanics**: Multi-user chaos activities
- **Status**: Coming soon

---

## 🎰 Lucky Draw System

### Types of Draws

1. **Hourly Lucky Draw**
   - Runs every hour at :00 minutes
   - Selects random active user
   - Awards points (AI-suggested or default)
   - Broadcasts winner to all users

2. **5-Minute Lucky Draw**
   - Runs every 5 minutes
   - Backend-driven timer (persistent)
   - Countdown displayed to all users
   - Only runs if users are active
   - Awards points to winner
   - Broadcasts results via Socket.IO

### Features
- **Real-time Timer**: 5-minute countdown visible to all
- **Winner Announcements**: Socket.IO broadcasts
- **Point Rewards**: AI-suggested or default amounts
- **Participation**: Automatic for active users
- **History**: Last winner displayed on dashboard

---

## 💥 Chaos Events System

### Triggering Chaos
- **Cost**: 1000 points
- **Method**: Click "Trigger Chaos" button on dashboard
- **Broadcast**: Event sent to all connected users via Socket.IO
- **AI Enhancement**: AI generates chaos events when enabled

### Chaos Event Types

1. **Breaking News**
   - Popup with random news message
   - Examples: "BREAKING NEWS: Kuch bhi!", "ALERT: Randomness detected!"

2. **Confetti**
   - Colorful confetti explosion
   - Customizable colors and duration

3. **Upside Down**
   - Screen flips upside down
   - CSS transform animation

4. **Shake**
   - Screen shakes violently
   - Intense shaking animation

5. **Color Invert**
   - All colors invert
   - CSS filter animation

6. **Rainbow**
   - Rainbow color wave effect
   - Animated gradient

7. **Sound**
   - Random sound plays
   - Volume control

### Advanced Chaos Animations
- **Rainbow Wave**: Wave of rainbow colors
- **Shake Intense**: Very intense shaking
- **Spin Chaos**: Everything spins
- **Zoom In/Out**: Zoom animation
- **Rotate 360**: Full rotation
- **Blur Effect**: Screen blur
- **Glitch**: Glitch effect
- **Particle Explosion**: Particle effects
- **Screen Flip**: Screen flips

### Return Chaos Feature
- **Mechanics**: Return chaos to original creator
- **Cost**: 500 points
- **Effect**: Original creator experiences chaos
- **Tracking**: Links chaos events

---

## 😂 Jokes System

### Features
- **Hinglish Jokes**: Mix of Hindi and English
- **AI Generation**: OpenAI-powered joke generation
- **Non-Repetitive**: Tracks shown jokes
- **Random Delivery**: Unpredictable joke timing
- **Multiple Formats**: Single-line and multi-line jokes

### Integration Points
- **Manual Request**: Click "Get Joke" button
- **Idle Detection**: Auto-show jokes when user idle
- **Chat Bot**: AI bot cracks jokes in chat rooms
- **Welcome Messages**: Jokes in welcome messages

---

## 🎯 Rush Activities System

### Concept
Guided activity flow that shows users activities one at a time, prioritizing unvisited and least frequently visited activities.

### Activity Categories

#### Daily Activities (Reset at Midnight)
1. **Daily Bakchodi Challenge** (`/games/bakchodi`)
2. **Wordle Game** (`/wordle`)

#### Repeatable Activities
1. **Random Argument Generator** (`/games/debate`)
2. **Instant Meme Battle** (`/games/meme`)
3. **Lucky Nonsense Wheel** (`/games/wheel`)
4. **AI Predicts Your Future** (`/games/future`)
5. **5-Second Tap Game** (`/games/tap`)
6. **Button That Runs Away** (`/games/runaway`)
7. **Dare Machine** (`/games/dare`)
8. **Roast Me** (`/games/roast`)

### Features
- **Activity Tracking**: Tracks user visits to each activity
- **Smart Prioritization**: Shows least visited activities first
- **Daily Reset**: Daily activities reset at midnight
- **Progress Tracking**: Shows completion status
- **Navigation**: Direct links to activities

---

## 📊 Points & Rewards System

### Earning Points

1. **Daily Login**: 10 points (with streak bonus)
2. **Chat Messages**: Points for chatting
3. **Game Wins**: Points for winning games
4. **Lucky Draws**: Random point rewards
5. **Chaos Events**: 25 points for triggering chaos
6. **Challenges**: Points based on performance
7. **AI Evaluations**: Points from AI-scored activities

### AI-Enhanced Rewards
- **Dynamic Point Amounts**: AI suggests point values based on context
- **Contextual Rewards**: Considers user activity, performance, history
- **Personalized**: Tailored to individual users
- **Fallback**: Default points if AI unavailable

### Login Streak System
- **Daily Tracking**: Tracks consecutive daily logins
- **Streak Bonus**: Additional points for streaks
- **Reset**: Resets if user misses a day
- **Display**: Shown on dashboard

### Points Display
- **Dashboard**: Total points prominently displayed
- **History**: Points history (if implemented)
- **Leaderboard**: Top users (if implemented)

---

## 🤖 AI Integration

### AI Features (Optional)

All AI features gracefully degrade when OpenAI API key is not configured. The entire AI system uses a structured prompt architecture for consistency and maintainability.

### AI Prompt Architecture

The project uses a centralized prompt management system with organized, reusable prompts:

#### Prompt Directory Structure
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

#### Prompt Files
Each prompt file follows a consistent structure:
- **Name & Description**: Human-readable identification
- **Version**: For tracking changes
- **Tags**: For categorization and search
- **Default Parameters**: Temperature, max tokens, response format
- **Template Variables**: `{{variable}}` syntax for dynamic content
- **Structured Format**: Role, goal, context, response format, examples, failure modes

#### Prompt Loader Utility
- **Location**: `backend/src/utils/promptLoader.js`
- **Function**: Loads prompts, replaces template variables, manages caching
- **Features**: 
  - Automatic variable replacement
  - Prompt caching for performance
  - Error handling and fallbacks

### AI Features by Category

#### 1. Welcome Messages
- **Prompt**: `engagement.welcome.prompt.js`
- **Location**: Login flow
- **Function**: Personalized welcome messages in Hinglish
- **Fallback**: Default welcome message
- **Parameters**: User name, points, login streak

#### 2. Chat Bot
- **Prompt**: `chat.conversation.prompt.js`
- **Location**: Chat rooms
- **Function**: Participates in conversations, cracks jokes, revives silent chats
- **Trigger**: After messages, periodic checks (every 2 minutes)
- **Fallback**: No AI messages if disabled
- **Parameters**: Room name, recent messages, activity level

#### 3. Chaos Event Generation
- **Prompt**: `ui.chaos.prompt.js`
- **Location**: Chaos trigger
- **Function**: Generates creative chaos events (breaking news, confetti, animations)
- **Fallback**: Random chaos events
- **Parameters**: User info, current state

#### 4. Reward Suggestions
- **Prompt**: `rewards.points.prompt.js`
- **Location**: Points system
- **Function**: Suggests dynamic point amounts and fun reasons
- **Fallback**: Default point values
- **Parameters**: Action type, user context, current points

#### 5. Game Evaluations
- **Prompts**: 
  - `games.bakchodi.prompt.js` - Challenge generation & scoring
  - `games.meme.prompt.js` - Meme caption scoring
  - `games.debate.prompt.js` - Debate topics & counter-arguments
  - `games.future.prompt.js` - Future predictions
  - `games.dare.prompt.js` - Dare generation
  - `games.roast.prompt.js` - Roast generation
  - `games.joke.prompt.js` - Joke generation
- **Location**: Various games
- **Function**: Scores submissions, generates content, evaluates performance
- **Fallback**: Random scores or default content

#### 6. Idle User Engagement
- **Prompt**: `engagement.idle.prompt.js`
- **Location**: Dashboard
- **Function**: Suggests activities when user idle (popup, joke, challenge, roast)
- **Fallback**: Default idle messages
- **Parameters**: Idle duration, current page, last activity

#### 7. Periodic Events
- **Prompt**: `system.cron.prompt.js`
- **Location**: Cron jobs
- **Function**: Suggests if events should happen during scheduled tasks
- **Fallback**: Default cron behavior
- **Parameters**: Event type, user activity, recent events

### AI Configuration
```env
OPENAI_API_KEY=your_api_key_here
OPENAI_MODEL=gpt-3.5-turbo  # Optional, defaults to gpt-3.5-turbo
```

### AI Response Format
All AI responses follow structured JSON format:
- **Consistent Structure**: Based on prompt requirements
- **Hinglish Content**: All user-facing text in Hindi-English mix
- **Error Handling**: Graceful fallbacks when AI unavailable
- **Context-Aware**: Responses consider user history, app state, and activity

### Prompt System Benefits

1. **Maintainability**: All prompts in one organized location
2. **Consistency**: Standardized format and structure
3. **Reusability**: Prompts can be shared and referenced
4. **Version Control**: Track prompt changes over time
5. **Easy Updates**: Modify prompts without touching code
6. **Testing**: Test prompts independently
7. **Documentation**: Self-documenting prompt files
8. **Scalability**: Easy to add new prompts and features

---

## 🎨 User Interface & UX

### Design Philosophy
- **Chaos-Driven**: Unexpected animations and effects
- **Colorful**: Vibrant color schemes
- **Playful**: Fun, engaging interactions
- **Responsive**: Works on desktop and mobile
- **Hinglish**: Mix of Hindi and English text

### Key UI Components

1. **Login Screen**
   - Moving button (first 5 seconds)
   - Background image reveal
   - Google OAuth button
   - Email/password form

2. **Dashboard**
   - Points display
   - Feature cards
   - Lucky draw timer
   - Quick actions

3. **Chat Interface**
   - Message list
   - Input field
   - User avatars
   - Room information

4. **Game Pages**
   - Game-specific UI
   - Score displays
   - Leaderboards
   - Submission forms

5. **Chaos Effects**
   - Full-screen animations
   - Popups
   - CSS transformations
   - Sound effects

### Animations
- Confetti bursts
- Screen shakes
- Color inversions
- Rotations
- Glitch effects
- Particle explosions
- Rainbow waves
- Zoom effects

---

## 🔄 Real-time Features

### Socket.IO Events

#### Chat Events
- `join_room`: User joins chat room
- `message`: New message sent
- `user_joined`: User joins room
- `user_left`: User leaves room
- `room_expired`: Room expires

#### Lucky Draw Events
- `lucky_draw_timer`: Timer updates (every second)
- `lucky_draw_winner`: Hourly draw winner
- `lucky_draw_result`: 5-minute draw results

#### Tambola Events
- `tambola_room_created`: New room created
- `tambola_game_started`: Game starts
- `tambola_number_called`: Number called
- `tambola_winner`: Winner announced
- `tambola_game_completed`: Game ends

#### Chaos Events
- `chaos_event`: Chaos event triggered
- `return_chaos`: Chaos returned to creator

---

## 📁 Database Schema

### Core Tables

1. **users**
   - `user_id` (Primary Key)
   - `name`
   - `email` (Unique)
   - `profile_photo`
   - `google_id`
   - `password` (hashed)
   - `created_at`
   - `updated_at`

2. **user_points**
   - `points_id` (Primary Key)
   - `user_id` (Foreign Key)
   - `total_points`
   - `last_login`
   - `login_streak`
   - `updated_at`

3. **chat_rooms**
   - `room_id` (Primary Key)
   - `name`
   - `created_at`
   - `expires_at`

4. **chat_messages**
   - `message_id` (Primary Key)
   - `room_id` (Foreign Key)
   - `user_id` (Foreign Key)
   - `message`
   - `created_at`

5. **lucky_draws**
   - `draw_id` (Primary Key)
   - `winner_user_id` (Foreign Key)
   - `reward_points`
   - `timestamp`
   - `type` (hourly/minute)

6. **chaos_events**
   - `event_id` (Primary Key)
   - `triggered_by_user_id` (Foreign Key)
   - `returned_by_user_id` (Foreign Key, nullable)
   - `event_type`
   - `event_data` (JSON)
   - `created_at`

### Game Tables

7. **tambola_rooms**
   - `room_id` (Primary Key)
   - `status` (waiting/active/completed)
   - `called_numbers` (JSON)
   - `current_number`
   - `winner_user_id` (Foreign Key, nullable)
   - `started_at`
   - `completed_at`
   - `created_at`

8. **tambola_tickets**
   - `ticket_id` (Primary Key)
   - `room_id` (Foreign Key)
   - `user_id` (Foreign Key)
   - `ticket_numbers` (JSON)
   - `marked_numbers` (JSON)
   - `completed_rows` (JSON)
   - `has_won`
   - `created_at`

9. **wordle_games**
   - `game_id` (Primary Key)
   - `user_id` (Foreign Key)
   - `word`
   - `guesses` (JSON)
   - `status` (in_progress/completed)
   - `date`
   - `created_at`

10. **bakchodi_challenges**
    - `challenge_id` (Primary Key)
    - `user_id` (Foreign Key)
    - `challenge_text`
    - `response_text`
    - `ai_score`
    - `ai_review`
    - `points_awarded`
    - `date`
    - `created_at`

11. **debates**
    - `debate_id` (Primary Key)
    - `user_id` (Foreign Key)
    - `topic`
    - `user_argument`
    - `ai_counter_argument`
    - `winner` (user/ai)
    - `points_awarded`
    - `created_at`

12. **meme_battles**
    - `battle_id` (Primary Key)
    - `user_id` (Foreign Key)
    - `meme_image_url`
    - `caption`
    - `humor_score`
    - `creativity_score`
    - `nonsense_score`
    - `total_score`
    - `points_awarded`
    - `created_at`

13. **wheel_spins**
    - `spin_id` (Primary Key)
    - `user_id` (Foreign Key)
    - `result_type` (roast/compliment/dare/reward)
    - `result_content`
    - `points_awarded`
    - `created_at`

14. **future_predictions**
    - `prediction_id` (Primary Key)
    - `user_id` (Foreign Key)
    - `user_responses` (JSON)
    - `prediction_text`
    - `created_at`

15. **tap_game_scores**
    - `score_id` (Primary Key)
    - `user_id` (Foreign Key)
    - `taps`
    - `created_at`

16. **runaway_button_wins**
    - `win_id` (Primary Key)
    - `user_id` (Foreign Key)
    - `attempts`
    - `points_awarded`
    - `created_at`

17. **dares**
    - `dare_id` (Primary Key)
    - `user_id` (Foreign Key)
    - `dare_text`
    - `created_at`

18. **roasts**
    - `roast_id` (Primary Key)
    - `user_id` (Foreign Key)
    - `roast_text`
    - `created_at`

19. **user_activity_tracking**
    - `tracking_id` (Primary Key)
    - `user_id` (Foreign Key)
    - `activity_type`
    - `activity_data` (JSON)
    - `visit_count`
    - `last_visit`
    - `created_at`
    - `updated_at`

---

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/google` - Google OAuth login
- `POST /api/auth/email` - Email/password login
- `POST /api/auth/admin` - Admin login

### Users
- `GET /api/users/profile` - Get user profile (protected)
- `GET /api/users/points` - Get user points (protected)

### Chat
- `GET /api/chat/rooms` - Get available rooms (protected)
- `GET /api/chat/messages/:roomId` - Get room messages (protected)

### Jokes
- `GET /api/jokes/random` - Get random joke (protected)

### Lucky Draws
- `GET /api/lucky-draws/last` - Get last draw (protected)
- `GET /api/lucky-draws/history` - Get draw history (protected)

### Chaos Events
- `POST /api/chaos/trigger` - Trigger chaos event (protected, costs 1000 points)
- `POST /api/chaos/return/:eventId` - Return chaos (protected, costs 500 points)
- `GET /api/chaos/recent` - Get recent events (protected)

### Wordle
- `GET /api/wordle/daily` - Get daily wordle (protected)
- `POST /api/wordle/guess` - Submit guess (protected)
- `GET /api/wordle/status` - Get game status (protected)

### Tambola
- `GET /api/tambola/active` - Get active room (protected)
- `POST /api/tambola/register` - Register for game (protected)
- `GET /api/tambola/ticket` - Get user ticket (protected)
- `POST /api/tambola/mark` - Mark number on ticket (protected)

### Games
- `GET /api/games/bakchodi/challenge` - Get daily challenge (protected)
- `POST /api/games/bakchodi/submit` - Submit challenge response (protected)
- `GET /api/games/bakchodi/history` - Get challenge history (protected)
- `GET /api/games/debate/topic` - Get debate topic (protected)
- `POST /api/games/debate/submit` - Submit argument (protected)
- `GET /api/games/meme/image` - Get random meme image (protected)
- `POST /api/games/meme/submit` - Submit meme caption (protected)
- `POST /api/games/wheel/spin` - Spin wheel (protected)
- `POST /api/games/future/predict` - Get future prediction (protected)
- `POST /api/games/tap/submit` - Submit tap score (protected)
- `GET /api/games/tap/leaderboard` - Get tap leaderboard (protected)
- `POST /api/games/runaway/win` - Record runaway button win (protected)
- `GET /api/games/dare` - Get dare (protected)
- `GET /api/games/roast` - Get roast (protected)

### Rush Activities
- `GET /api/rush/next` - Get next activity (protected)
- `GET /api/rush/status` - Get activity status (protected)
- `POST /api/rush/visit/:activityType` - Record activity visit (protected)

---

## ⏰ Scheduled Tasks (Cron Jobs)

1. **Hourly Lucky Draw** (`0 * * * *`)
   - Runs every hour at :00 minutes
   - Selects random active user
   - Awards points
   - Broadcasts winner

2. **5-Minute Lucky Draw** (`*/5 * * * *`)
   - Runs every 5 minutes
   - Only if users are active
   - Awards points
   - Broadcasts results

3. **Chat Bot Periodic Check** (`*/2 * * * *`)
   - Runs every 2 minutes
   - Processes active chat rooms
   - AI bot participation
   - Revives silent chats

4. **Tambola Game Scheduler** (`*/5 * * * *`)
   - Backup scheduler for tambola games
   - Creates new games if none active

---

## 🎯 User Journey Flow

### New User
1. Lands on login page
2. Sees moving button (5 seconds)
3. Background image appears
4. Chooses login method (Google/Email)
5. Account auto-created
6. Receives welcome message
7. Lands on dashboard
8. Sees points (10 for login)
9. Explores features

### Returning User
1. Logs in
2. Sees updated points and streak
3. Checks last lucky draw winner
4. Views welcome message
5. Chooses activity:
   - Chat with strangers
   - Play games
   - Trigger chaos
   - Get jokes
   - Participate in lucky draws

### Daily Routine
1. Login (earn 10 points + streak bonus)
2. Check daily challenges (Wordle, Bakchodi)
3. Participate in rush activities
4. Chat in random rooms
5. Play games
6. Wait for lucky draws
7. Trigger chaos (if enough points)

---

## 🔧 Configuration & Environment Variables

### Backend (.env)
```env
# Server
PORT=5000
NODE_ENV=development

# Database
DB_HOST=localhost
DB_PORT=3306
DB_NAME=faltuverse
DB_USER=root
DB_PASSWORD=your_password

# JWT
JWT_SECRET=your_secret_key
JWT_EXPIRES_IN=7d

# Google OAuth
GOOGLE_CLIENT_ID=your_client_id
GOOGLE_CLIENT_SECRET=your_client_secret
GOOGLE_REDIRECT_URI=http://localhost:5000/api/auth/google/callback

# OpenAI (Optional)
OPENAI_API_KEY=your_api_key
OPENAI_MODEL=gpt-3.5-turbo

# Frontend URL
FRONTEND_URL=http://localhost:5173
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:5000
VITE_GOOGLE_CLIENT_ID=your_client_id
```

---

## 📦 Project Structure

```
faltu/
├── backend/
│   ├── config/
│   │   ├── database.js          # Sequelize config
│   │   └── rushActivities.js    # Rush activities config
│   ├── migrations/
│   │   ├── 001-create-users.js
│   │   ├── 002-create-chat-rooms.js
│   │   ├── 003-create-chat-messages.js
│   │   ├── 004-create-lucky-draws.js
│   │   ├── 005-create-user-points.js
│   │   ├── 006-create-chaos-events.js
│   │   └── ... (more migrations)
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js            # Database connection
│   │   ├── controllers/         # Route controllers
│   │   │   ├── authController.js
│   │   │   ├── chaosController.js
│   │   │   ├── gamesController.js
│   │   │   ├── jokeController.js
│   │   │   ├── luckyDrawController.js
│   │   │   ├── tambolaController.js
│   │   │   ├── userController.js
│   │   │   └── wordleController.js
│   │   ├── middleware/
│   │   │   └── auth.js          # JWT authentication
│   │   ├── models/              # Sequelize models
│   │   │   ├── User.js
│   │   │   ├── ChatRoom.js
│   │   │   ├── ChatMessage.js
│   │   │   ├── LuckyDraw.js
│   │   │   ├── UserPoints.js
│   │   │   ├── ChaosEvent.js
│   │   │   ├── TambolaRoom.js
│   │   │   ├── TambolaTicket.js
│   │   │   └── ... (more models)
│   │   ├── routes/              # Express routes
│   │   │   ├── authRoutes.js
│   │   │   ├── userRoutes.js
│   │   │   ├── jokeRoutes.js
│   │   │   ├── luckyDrawRoutes.js
│   │   │   ├── chaosRoutes.js
│   │   │   ├── wordleRoutes.js
│   │   │   ├── tambolaRoutes.js
│   │   │   ├── gamesRoutes.js
│   │   │   └── rushRoutes.js
│   │   ├── services/            # Business logic
│   │   │   ├── authService.js
│   │   │   ├── chatService.js
│   │   │   ├── jokeService.js
│   │   │   ├── luckyDrawService.js
│   │   │   ├── minuteLuckyDrawService.js
│   │   │   ├── chaosService.js
│   │   │   ├── chaosAnimations.js
│   │   │   ├── pointsService.js
│   │   │   ├── wordleService.js
│   │   │   ├── tambolaService.js
│   │   │   ├── gamesService.js
│   │   │   ├── gamesAIService.js
│   │   │   ├── rushService.js
│   │   │   ├── systemUsersService.js
│   │   │   ├── aiDecisionEngine.js
│   │   │   ├── aiChatBot.js
│   │   │   └── aiFeaturePlanner.js
│   │   ├── utils/              # Utility functions
│   │   │   └── promptLoader.js # AI prompt loader utility
│   │   ├── sockets/
│   │   │   └── chatSocket.js     # Socket.IO handlers
│   │   └── server.js             # Express server entry
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   │   ├── axios.js          # Axios configuration
│   │   │   └── ai.js             # AI API client
│   │   ├── components/
│   │   │   ├── DiscoMode.jsx
│   │   │   ├── FaltuPopup.jsx
│   │   │   ├── FloatingButton.jsx
│   │   │   ├── JokeCard.jsx
│   │   │   ├── LuckyDrawCountdown.jsx
│   │   │   ├── LuckyDrawTimer.jsx
│   │   │   └── ProtectedRoute.jsx
│   │   ├── context/
│   │   │   ├── AuthContext.jsx   # Authentication context
│   │   │   ├── ChaosContext.jsx  # Chaos events context
│   │   │   └── UIChaosContext.jsx # UI chaos context
│   │   ├── hooks/
│   │   │   ├── useIdleDetection.js
│   │   │   └── useRandomStyle.js
│   │   ├── pages/
│   │   │   ├── Login.jsx
│   │   │   ├── Admin.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── ChatRoom.jsx
│   │   │   ├── Jokes.jsx
│   │   │   ├── Wordle.jsx
│   │   │   ├── Tambola.jsx
│   │   │   ├── Games.jsx
│   │   │   ├── RushActivity.jsx
│   │   │   └── games/
│   │   │       ├── BakchodiChallenge.jsx
│   │   │       ├── DareMachine.jsx
│   │   │       ├── Debate.jsx
│   │   │       ├── FuturePrediction.jsx
│   │   │       ├── MemeBattle.jsx
│   │   │       ├── RoastMe.jsx
│   │   │       ├── RoomChaos.jsx
│   │   │       ├── RunawayButton.jsx
│   │   │       ├── TapGame.jsx
│   │   │       └── WheelSpin.jsx
│   │   ├── utils/
│   │   │   └── confettiBlast.js
│   │   ├── App.jsx
│   │   ├── App.css
│   │   ├── main.jsx
│   │   └── index.css
│   ├── tailwind.config.js
│   ├── vite.config.js
│   └── package.json
│
├── prompts/                     # AI Prompt Management System
│   ├── games/                  # Game-related prompts
│   │   ├── joke.prompt.js
│   │   ├── bakchodi.prompt.js
│   │   ├── meme.prompt.js
│   │   ├── debate.prompt.js
│   │   ├── future.prompt.js
│   │   ├── dare.prompt.js
│   │   └── roast.prompt.js
│   ├── chat/                   # Chat bot prompts
│   │   └── conversation.prompt.js
│   ├── ui/                     # UI/UX prompts
│   │   └── chaos.prompt.js
│   ├── system/                 # System prompts
│   │   ├── core.prompt.js
│   │   └── cron.prompt.js
│   ├── engagement/             # Engagement prompts
│   │   ├── welcome.prompt.js
│   │   └── idle.prompt.js
│   ├── rewards/                # Reward prompts
│   │   └── points.prompt.js
│   ├── fallbacks/              # Fallback prompts
│   │   └── generic.prompt.js
│   └── README.md               # Prompt system documentation
│
├── Documentation Files
│   ├── README.md
│   ├── PROJECT_DESCRIPTION.md (this file)
│   ├── FEATURE_STATUS.md
│   ├── GAMES_STATUS.md
│   ├── ACTIVITY_LIST.md
│   ├── AI_INTEGRATION.md
│   ├── SETUP.md
│   ├── QUICK_START.md
│   └── ... (more docs)
│
└── start.sh                    # Startup script
```

---

## 🚀 Deployment Considerations

### Backend Deployment
- Use PM2 or similar process manager
- Set `NODE_ENV=production`
- Configure production database
- Use environment variables for secrets
- Enable HTTPS
- Configure CORS for production domain
- Set up logging
- Monitor server health

### Frontend Deployment
- Build with `npm run build`
- Serve static files with nginx/Apache
- Configure API URL for production
- Enable compression
- Set up CDN (optional)
- Configure caching

### Database
- Regular backups
- Index optimization
- Connection pooling
- Query optimization

---

## 🐛 Known Issues & Limitations

1. **Email/Password Route**: May need server restart after adding new routes
2. **Node Version**: Requires Node.js v20+ (project includes `.nvmrc` and `.node-version` for automatic version management)
3. **AI Features**: Optional, app works without OpenAI API key
4. **Mobile**: Some features may need mobile optimization
5. **Performance**: Large user base may need optimization

---

## 🔮 Future Enhancements

### Potential Features
- User profiles and customization
- Friends/social connections
- Private messaging
- Achievement system
- Badges and trophies
- Global leaderboards
- Tournament mode
- Custom game creation
- Mobile app (React Native)
- Push notifications
- Email notifications
- Social media sharing
- Content moderation
- Admin dashboard
- Analytics dashboard
- Multi-language support
- Dark mode
- Themes and customization

### Technical Improvements
- Redis caching
- WebSocket optimization
- Database query optimization
- Image CDN
- Rate limiting
- API versioning
- GraphQL API (optional)
- Microservices architecture (if scaling)
- Docker containerization
- Kubernetes deployment
- CI/CD pipeline

### AI Enhancements
- Content moderation prompts
- Advanced game scoring algorithms
- Personalized content recommendations
- Dynamic difficulty adjustment
- User behavior analysis
- Predictive engagement modeling
- Multi-language support (beyond Hinglish)
- Voice interaction prompts
- Image generation integration
- Advanced chat bot personalities

---

## 📝 Development Notes

### Code Style
- Hinglish comments and console logs
- Consistent naming conventions
- Error handling in all async functions
- Logging for debugging
- Graceful fallbacks for AI features

### AI Prompt Management
- All prompts stored in `/prompts` directory
- Prompts use template variables (`{{variable}}`)
- Prompts follow consistent structure (role, goal, context, format)
- Prompt loader utility handles loading and variable replacement
- Prompts are cached for performance
- Version control for prompt changes

### Testing
- Manual testing for all features
- End-to-end workflow testing
- Mobile responsiveness testing
- Performance testing
- Security testing

### Contributing
- Follow existing code patterns
- Add error handling
- Include logging
- Update documentation
- Test thoroughly

---

## 🎉 Conclusion

FaltuVerse is a comprehensive entertainment platform that combines:
- **Social Features**: Chat, multiplayer games
- **Gamification**: Points, streaks, rewards
- **AI Integration**: Optional AI enhancements
- **Real-time**: Socket.IO for live interactions
- **Variety**: 12+ different games and activities
- **Chaos**: Unexpected events and animations
- **Engagement**: Multiple ways to interact and earn points

The platform is designed to be fun, engaging, and unpredictable, providing users with endless entertainment "for no reason."

---

**Last Updated**: December 2024
**Version**: 1.0
**Status**: Active Development

---

*"Pure Entertainment for No Reason"* 🎉

