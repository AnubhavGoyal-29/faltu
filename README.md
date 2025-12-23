# Faltuverse

An endless feed of tiny, zero-commitment activities.

## Tech Stack

- **Frontend**: React + Vite + Tailwind CSS
- **Backend**: Node.js + Express
- **Database**: MySQL
- **Cache**: Redis

## Setup

1. Install dependencies:
```bash
cd server && npm install
cd ../client && npm install
```

2. Configure environment variables:
```bash
cp .env.example .env
# Edit .env with your MySQL and Redis credentials
```

3. Start development:
```bash
# Terminal 1: Backend
cd server && npm run dev

# Terminal 2: Frontend
cd client && npm run dev
```

## Deployment

```bash
git pull origin faltuverse
./deploy.sh
```

