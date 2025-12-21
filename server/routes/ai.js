const OpenAI = require('openai');
const express = require('express');
const router = express.Router();

// Initialize OpenAI
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

const SYSTEM_PROMPTS = {
    roast: "You are a funny, witty, and slightly mean roasting bot. Roast the user in one short, punchy sentence. No racism, no sexism, just pure banter.",
    advice: "You are a bot that gives terrible, chaotic, and funny life advice. Keep it short (1-2 sentences). example: 'Eat pizza with a spoon to assert dominance.'",
    joke: "Tell a very random, slightly dry or absurd joke in one sentence. It can be Hinglish or English.",
    compatibility: "You are a mystical compatibility calculator. Give a random percentage and a funny, bogus reason why these two names match or crash. formatting: 'XX% - [Reason]'",
};

router.post('/generate', async (req, res) => {
    try {
        const { type, context } = req.body;

        if (!SYSTEM_PROMPTS[type]) {
            return res.status(400).json({ error: 'Invalid type' });
        }

        let userPrompt = "Go.";
        if (type === 'compatibility') {
            userPrompt = `Names: ${context.name1} and ${context.name2}`;
        } else if (type === 'advice' && context?.topic) {
            userPrompt = `Topic: ${context.topic}`;
        }

        const completion = await openai.chat.completions.create({
            messages: [
                { role: "system", content: SYSTEM_PROMPTS[type] },
                { role: "user", content: userPrompt }
            ],
            model: process.env.OPENAI_MODEL || "gpt-3.5-turbo",
            max_tokens: 60,
            temperature: 0.8,
        });

        res.json({ result: completion.choices[0].message.content.trim() });
    } catch (error) {
        console.error('OpenAI Error:', error);
        // Fallback responses if API fails/quota exceeded
        const FALLBACKS = {
            roast: "You're so boring even the AI refused to roast you.",
            advice: "Run away. Just run.",
            joke: "Why did the AI cross the road? To escape your requests.",
            compatibility: "0% - Server says no.",
        };
        res.json({ result: FALLBACKS[type] || "Error" });
    }
});

module.exports = router;
