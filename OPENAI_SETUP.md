# OpenAI Setup Guide

## Overview
4 activities now use OpenAI for dynamic content generation:
1. **Gentle Roast Machine** - AI-generated playful roasts
2. **Bekaar Salah** - AI-generated useless advice
3. **Faltu Joke Drop** - AI-generated jokes
4. **Naam Jodi** - AI-generated compatibility results

## Setup

### 1. Get OpenAI API Key
1. Go to https://platform.openai.com/api-keys
2. Create a new API key
3. Copy the key

### 2. Add to Server `.env`
Add this line to `server/.env`:
```
OPENAI_API_KEY=sk-your-api-key-here
```

### 3. Fallback Behavior
If OpenAI API key is not set or API fails:
- Activities will automatically use hardcoded fallback content
- No errors will be shown to users
- App continues to work normally

## API Endpoint

**POST** `/api/ai/generate`

**Request Body:**
```json
{
  "type": "gentle_roast" | "bekaar_salah" | "faltu_joke" | "naam_jodi",
  "context": {
    "name1": "John",  // Only for naam_jodi
    "name2": "Jane"   // Only for naam_jodi
  }
}
```

**Response:**
```json
{
  "content": "Generated content here",
  "source": "openai" | "fallback"
}
```

## Cost Considerations
- Uses GPT-3.5-turbo (cheapest model)
- Max tokens: 50-100 per request
- Estimated cost: ~$0.0001-0.0002 per activity
- Very cost-effective for this use case

## Testing
1. Without API key: Activities use fallback content (works fine)
2. With API key: Activities use AI-generated content
3. On API error: Automatically falls back to hardcoded content

