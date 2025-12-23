import express from 'express';
import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || ''
});

// POST /api/ai/generate - Generate AI content
router.post('/generate', async (req, res) => {
  try {
    const { type, context } = req.body;

    if (!type) {
      return res.status(400).json({ 
        error: 'type is required' 
      });
    }

    let prompt = '';
    let maxTokens = 100;

    switch (type) {
      case 'gentle_roast':
        prompt = `Generate a playful, gentle roast (not mean, just funny). Keep it under 100 characters. Make it creative and lighthearted.`;
        maxTokens = 80;
        break;

      case 'bekaar_salah':
        prompt = `Generate useless/bad advice that sounds like it could be real but is actually terrible. Keep it under 80 characters. Make it funny and absurd.`;
        maxTokens = 70;
        break;

      case 'faltu_joke':
        prompt = `Generate a clean, funny joke. Keep it short (under 150 characters). Make it family-friendly and humorous.`;
        maxTokens = 100;
        break;

      case 'naam_jodi':
        const name1 = context?.name1 || 'Person 1';
        const name2 = context?.name2 || 'Person 2';
        prompt = `Generate a fun, creative compatibility result for "${name1}" and "${name2}". Keep it under 50 characters. Make it playful and positive. Examples: "Perfect match! 🌟", "Good vibes! ✨", "Surprising combo! 🎯"`;
        maxTokens = 50;
        break;

      default:
        return res.status(400).json({ 
          error: 'Invalid type. Supported: gentle_roast, bekaar_salah, faltu_joke, naam_jodi' 
        });
    }

    // Check if OpenAI API key is configured
    if (!process.env.OPENAI_API_KEY) {
      // Return fallback content if OpenAI not configured
      return res.json({
        content: getFallbackContent(type, context),
        source: 'fallback'
      });
    }

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'You are a creative content generator. Generate fun, engaging content that is appropriate for all ages.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      max_tokens: maxTokens,
      temperature: 0.9
    });

    const content = completion.choices[0]?.message?.content?.trim() || getFallbackContent(type, context);

    res.json({
      content,
      source: 'openai'
    });
  } catch (error) {
    console.error('OpenAI API error:', error);
    
    // Return fallback content on error
    res.json({
      content: getFallbackContent(req.body.type, req.body.context),
      source: 'fallback'
    });
  }
});

// Fallback content if OpenAI fails or not configured
function getFallbackContent(type, context) {
  const fallbacks = {
    gentle_roast: [
      "You're like a cloud - when you disappear, it's a beautiful day.",
      "You're the human equivalent of a participation trophy.",
      "If I had a dollar for every time you had a good idea, I'd have zero dollars.",
      "You're proof that evolution can go in reverse.",
      "You're not stupid, you just have bad luck thinking.",
    ],
    bekaar_salah: [
      "Always trust your first gut feeling, even if it's 3 AM.",
      "If something's hard, just don't do it.",
      "The best way to save money is to never check your bank account.",
      "Procrastination is just future you's problem.",
      "If you can't decide, flip a coin and then do the opposite.",
    ],
    faltu_joke: [
      "Why don't scientists trust atoms? Because they make up everything!",
      "I told my wife she was drawing her eyebrows too high. She looked surprised.",
      "Why don't eggs tell jokes? They'd crack each other up!",
      "What do you call a fake noodle? An impasta!",
      "Why did the scarecrow win an award? He was outstanding in his field!",
    ],
    naam_jodi: [
      "Perfect match! 🌟",
      "Good vibes! ✨",
      "Decent compatibility! 👍",
      "Interesting combo! 🤔",
      "Could work! 💫",
    ]
  };

  const options = fallbacks[type] || ['Something went wrong!'];
  return options[Math.floor(Math.random() * options.length)];
}

export default router;

