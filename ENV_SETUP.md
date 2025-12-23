# Environment Variables Setup Guide

## Quick Setup

1. **Copy the example file:**
   ```bash
   cp server/.env.example server/.env
   ```

2. **Edit `.env` file** in the `server/` directory with your actual values.

## Required Environment Variables

### Server Configuration
- `PORT` - Server port (default: 3000)
- `NODE_ENV` - Environment mode: `development` or `production`
- `FRONTEND_URL` - Frontend URL for CORS (default: http://localhost:5173)

### MySQL Database
- `DB_HOST` - Database host (default: localhost)
- `DB_PORT` - Database port (default: 3306)
- `DB_USER` - Database username (default: root)
- `DB_PASSWORD` - Database password (default: empty)
- `DB_NAME` - Database name (default: faltuverse)

### Redis (Optional)
- `REDIS_HOST` - Redis host (default: localhost)
- `REDIS_PORT` - Redis port (default: 6379)
- `REDIS_PASSWORD` - Redis password (optional)

### OpenAI (Optional)
- `OPENAI_API_KEY` - OpenAI API key for AI-powered activities (optional)

## Production Setup

For production server, make sure `.env` file exists in `/var/www/faltuverse/server/.env` with production values:

```env
NODE_ENV=production
PORT=3000
FRONTEND_URL=https://faltuverse.cloud
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=faltuverse
REDIS_HOST=localhost
REDIS_PORT=6379
OPENAI_API_KEY=your_openai_key
```

## Local Development Setup

For local development:

```env
NODE_ENV=development
PORT=3000
FRONTEND_URL=http://localhost:5173
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=faltuverse
REDIS_HOST=localhost
REDIS_PORT=6379
```

## Notes

- `.env` files are gitignored and should NOT be committed
- Use `.env.example` as a template
- Never share your `.env` file or commit it to git

