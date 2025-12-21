import React, { useState } from 'react';

const NumberDhoondo = ({ onComplete }) => {
    const [target] = useState(() => Math.floor(Math.random() * 100) + 1);
    const [guess, setGuess] = useState("");
    const [hints, setHints] = useState([]); // Array of strings
    const [attempts, setAttempts] = useState(0);

    const handleGuess = (e) => {
        e.preventDefault();
        const val = parseInt(guess);
        if (!val) return;

        setAttempts(p => p + 1);

        if (val === target) {
            setHints(h => [`${val} IS CORRECT! 🎉`, ...h]);
            setTimeout(() => onComplete({ result: 'won', attempts }), 1500);
        } else if (val < target) {
            setHints(h => [`${val} is too LOW ↑`, ...h]);
        } else {
            setHints(h => [`${val} is too HIGH ↓`, ...h]);
        }
        setGuess("");
    };

    return (
        <div className="activity-container">
            <h2 className="activity-title text-teal-400 mb-8">Number Dhoondo (1-100)</h2>

            <form onSubmit={handleGuess} className="flex gap-2 w-full max-w-xs mb-8">
                <input
                    type="number"
                    value={guess}
                    onChange={e => setGuess(e.target.value)}
                    placeholder="00"
                    className="flex-1 bg-white/10 rounded-xl p-4 text-center text-2xl font-black outline-none focus:ring-2 ring-teal-500"
                    autoFocus
                />
                <button type="submit" className="p-4 bg-teal-600 rounded-xl font-bold">
                    GO
                </button>
            </form>

            <div className="flex flex-col gap-2 w-full max-w-xs h-40 overflow-hidden relative fade-bottom">
                {hints.map((hint, i) => (
                    <div key={i} className={`p-2 rounded-lg text-lg font-bold text-center ${hint.includes('CORRECT') ? 'bg-green-500 text-black' : 'bg-white/5'}`}>
                        {hint}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default NumberDhoondo;
