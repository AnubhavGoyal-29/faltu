import React, { useState, useEffect } from 'react';
import { useAI } from '../../hooks/useAI';
import { Loader2 } from 'lucide-react';

const KaunsaJhooth = ({ onComplete }) => {
    const [statements, setStatements] = useState(null);
    const [loading, setLoading] = useState(true);
    const { generate } = useAI();

    // For MVP, we'll hardcode some sets or fetch from AI if "list" type supported.
    // Ideally, use AI to generate { truth1, truth2, lie } JSON. 
    // Let's hardcode a few for reliability + speed if AI is slow or text-only.
    // Actually, let's try a clever text-only parse or just hardcode for MVP stability 
    // since parsing JSON from text-model can be flaky without strict schema mode.
    // PRD says "Three statements appear". 

    const STATIC_SETS = [
        { s: ["I have never broken a bone", "I have visited 10 countries", "I can fly"], lie: 2 },
        { s: ["Bananas are berries", "Strawberries are berries", "Avocados are fruit"], lie: 1 }, // Strawberries are NOT berries botanically
        { s: ["Sharks have bones", "Dolphins sleep with one eye open", "Octopuses have 3 hearts"], lie: 0 }, // Sharks have cartilage
    ];

    const [currentSet] = useState(() => STATIC_SETS[Math.floor(Math.random() * STATIC_SETS.length)]);
    const [revealed, setRevealed] = useState(false);

    const handleGuess = (idx) => {
        if (revealed) return;
        setRevealed(true);
        const success = idx === currentSet.lie;
        setTimeout(() => {
            onComplete({ result: success ? 'won' : 'lost' });
        }, 2000);
    };

    useEffect(() => {
        // Simulate loading delay to feel "premium" or real
        const t = setTimeout(() => setLoading(false), 500);
        return () => clearTimeout(t);
    }, []);

    return (
        <div className="activity-container">
            <h2 className="activity-title text-orange-500 mb-8">Kaunsa Jhooth? (Spot the Lie)</h2>

            {loading ? (
                <Loader2 className="animate-spin text-orange-500 w-10 h-10" />
            ) : (
                <div className="flex flex-col gap-4 w-full max-w-sm">
                    {currentSet.s.map((text, i) => (
                        <button
                            key={i}
                            onClick={() => handleGuess(i)}
                            className={`p-6 rounded-xl text-lg font-medium border border-white/10 bg-white/5 active:scale-95 transition-all text-left relative overflow-hidden
                ${revealed && i === currentSet.lie ? 'bg-green-500/20 border-green-500' : ''}
                ${revealed && i !== currentSet.lie ? 'opacity-50' : ''}
              `}
                        >
                            <span className="font-bold mr-4 text-orange-500/50">#{i + 1}</span>
                            {text}
                            {revealed && i === currentSet.lie && (
                                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-green-500 font-black">LIE!</span>
                            )}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

export default KaunsaJhooth;
