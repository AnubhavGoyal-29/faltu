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

      case 'sach_ya_faltu':
        prompt = `Generate an interesting fact that could be true or false. Make it surprising and believable. Format as a single statement. Keep it under 100 characters. Examples: "Octopuses have three hearts", "Bananas are berries but strawberries aren't"`;
        maxTokens = 80;
        break;

      case 'ye_ya_wo':
        prompt = `Generate a fun choice pair for "Ye Ya Wo" game. Two simple, relatable options separated by comma. Keep each option under 15 characters. Examples: "Pizza, Burger", "Summer, Winter", "Coffee, Tea"`;
        maxTokens = 40;
        break;

      case 'kaunsa_jhooth':
        prompt = `Generate 3 statements: 2 true facts and 1 believable fake fact. Format as JSON: {"statements": ["statement1", "statement2", "statement3"], "fakeIndex": 0 or 1 or 2}. Make the fake one very believable. Keep each statement under 80 characters.`;
        maxTokens = 150;
        break;

      case 'galat_button':
        prompt = `Generate a funny, playful judgment/comment for someone who picked a random button. Keep it under 60 characters. Make it humorous but not mean. Examples: "You chose... poorly.", "Interesting choice...", "Bold move."`;
        maxTokens = 50;
        break;

      case 'shabdbaazi':
        prompt = `Generate a Hinglish word (Hindi-English mix) with a hint. Format as JSON: {"word": "WORD_IN_CAPS", "hint": "hint description", "answer": "WORD_IN_CAPS"}. Keep word 4-8 letters, hint under 30 characters. Examples: {"word": "CHUTKULA", "hint": "Funny thing", "answer": "CHUTKULA"}`;
        maxTokens = 80;
        break;

      case 'dialogbaazi':
        prompt = `Generate a famous Indian movie dialogue (Hindi/Bollywood) with 3 movie options where one is correct. Format as JSON: {"dialogue": "dialogue text", "options": ["movie1", "movie2", "movie3"], "answer": 0}. Keep dialogue under 100 characters.`;
        maxTokens = 120;
        break;

      case 'ulta_pulta_shabd':
        prompt = `Generate a scrambled Hindi/English word with its answer. Format as JSON: {"scrambled": "SCRAMBLED_WORD", "answer": "CORRECT_WORD"}. Keep word 4-6 letters. Make it fun and solvable.`;
        maxTokens = 60;
        break;

      case 'number_dhoondo':
        const number = context?.number || 50;
        prompt = `Generate a creative, fun hint for the number ${number} (between 1-100). Make it interesting and playful. Keep it under 50 characters. Examples: "Between 1-33", "A lucky number", "Close to half century"`;
        maxTokens = 50;
        break;

      default:
        return res.status(400).json({ 
          error: 'Invalid type. Supported: gentle_roast, bekaar_salah, faltu_joke, naam_jodi, sach_ya_faltu, ye_ya_wo, kaunsa_jhooth, galat_button, shabdbaazi, dialogbaazi, ulta_pulta_shabd, number_dhoondo' 
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

    let content = completion.choices[0]?.message?.content?.trim() || getFallbackContent(type, context);
    
    // Try to parse JSON for activities that need structured data
    const jsonTypes = ['kaunsa_jhooth', 'shabdbaazi', 'dialogbaazi', 'ulta_pulta_shabd', 'ye_ya_wo'];
    if (jsonTypes.includes(type)) {
      try {
        // Try to extract JSON from response if wrapped in text
        const jsonMatch = content.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          content = JSON.parse(jsonMatch[0]);
        } else if (type === 'ye_ya_wo' && content.includes(',')) {
          // Handle "Option1, Option2" format for ye_ya_wo
          const parts = content.split(',').map(s => s.trim());
          if (parts.length === 2) {
            content = { left: parts[0], right: parts[1] };
          } else {
            throw new Error('Invalid format');
          }
        } else {
          content = JSON.parse(content);
        }
      } catch (e) {
        // If parsing fails, use fallback
        const fallback = getFallbackContent(type, context);
        try {
          if (typeof fallback === 'string' && fallback.startsWith('{')) {
            content = JSON.parse(fallback);
          } else {
            content = fallback;
          }
        } catch (e2) {
          content = fallback;
        }
      }
    }

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
    ],
    sach_ya_faltu: [
      "Bananas are berries, but strawberries aren't.",
      "Octopuses have three hearts.",
      "Wombats poop in cubes.",
      "Sharks have been around longer than trees.",
      "Honey never spoils.",
    ],
    ye_ya_wo: [
      JSON.stringify({ left: "Pizza", right: "Burger" }),
      JSON.stringify({ left: "Summer", right: "Winter" }),
      JSON.stringify({ left: "Beach", right: "Mountains" }),
      JSON.stringify({ left: "Coffee", right: "Tea" }),
      JSON.stringify({ left: "Cats", right: "Dogs" }),
    ],
    kaunsa_jhooth: [
      JSON.stringify({
        statements: [
          "The Great Wall of China is visible from space.",
          "Humans use 100% of their brain capacity.",
          "Bats are blind.",
        ],
        fakeIndex: 0,
      }),
      JSON.stringify({
        statements: [
          "Sharks can't get cancer.",
          "Goldfish have a 3-second memory.",
          "Humans have five senses.",
        ],
        fakeIndex: 1,
      }),
    ],
    galat_button: [
      "You chose... poorly.",
      "Interesting choice...",
      "Hmm, okay.",
      "Really? That one?",
      "Bold move.",
    ],
    shabdbaazi: [
      JSON.stringify({ word: "CHUTKULA", hint: "Funny thing", answer: "CHUTKULA" }),
      JSON.stringify({ word: "JUGAAD", hint: "Creative solution", answer: "JUGAAD" }),
      JSON.stringify({ word: "FIRANGI", hint: "Foreigner", answer: "FIRANGI" }),
    ],
    dialogbaazi: [
      JSON.stringify({
        dialogue: "Kitne aadmi the?",
        options: ["Sholay", "Dilwale", "3 Idiots"],
        answer: 0,
      }),
      JSON.stringify({
        dialogue: "Mogambo khush hua",
        options: ["Mr. India", "Don", "Agneepath"],
        answer: 0,
      }),
    ],
    ulta_pulta_shabd: [
      JSON.stringify({ scrambled: "HALP", answer: "PHAL" }),
      JSON.stringify({ scrambled: "KAMAB", answer: "KAMAB" }),
      JSON.stringify({ scrambled: "RATAP", answer: "PATAR" }),
    ],
    number_dhoondo: [
      "Between 1-33",
      "Between 34-66",
      "Between 67-100",
    ],
  };

  // Handle JSON fallbacks
  if (type === 'kaunsa_jhooth' || type === 'shabdbaazi' || type === 'dialogbaazi' || type === 'ulta_pulta_shabd' || type === 'ye_ya_wo') {
    const jsonOptions = fallbacks[type] || [];
    const selected = jsonOptions[Math.floor(Math.random() * jsonOptions.length)];
    try {
      return JSON.parse(selected);
    } catch (e) {
      return selected;
    }
  }

  const options = fallbacks[type] || ['Something went wrong!'];
  return options[Math.floor(Math.random() * options.length)];
}

export default router;

