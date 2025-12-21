import { useState, useCallback } from 'react';

// Hard fallback in case backend is down/slow
const LOCAL_FALLBACKS = {
    roast: "You look like you struggle to open PDF files.",
    advice: "Don't just stare at the screen, blink occasionally.",
    joke: "I invented a new word! Plagiarism.",
    compatibility: "50% - Maybe in another universe."
};

export const useAI = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const generate = useCallback(async (type, context = {}) => {
        setLoading(true);
        setError(null);
        try {
            const res = await fetch('http://localhost:3000/api/ai/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ type, context }),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Failed');
            return data.result;
        } catch (err) {
            console.error(err);
            setError(err.message);
            return LOCAL_FALLBACKS[type] || "Error loading content.";
        } finally {
            setLoading(false);
        }
    }, []);

    return { generate, loading, error };
};
