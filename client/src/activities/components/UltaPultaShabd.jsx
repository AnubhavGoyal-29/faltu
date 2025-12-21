import React, { useState } from 'react';

const WORDS = ["MUMBAI", "CRICKET", "SAMOSA", "DIWALI", "PANEER", "TRAFFIC"];

const UltaPultaShabd = ({ onComplete }) => {
    const [target] = useState(() => WORDS[Math.floor(Math.random() * WORDS.length)]);
    const [scrambled] = useState(() => {
        return target.split('').sort(() => Math.random() - 0.5).join('');
    });
    const [input, setInput] = useState("");
    const [status, setStatus] = useState("playing");

    const check = () => {
        if (input.toUpperCase() === target) {
            setStatus("won");
            setTimeout(() => onComplete({ result: 'won' }), 1500);
        } else {
            setStatus("lost"); // Instant fail for higher stakes? Or shaky anim?
            // Let's just create a 'shake' effect logic UI side or retry? PRD says "Unscramble before timer ends".
            // Simple logic: wait for timer or correct input. 
            // For MVP, simplistic check.
            setTimeout(() => setInput(""), 500);
        }
    };

    return (
        <div className="activity-container">
            <h2 className="activity-title text-lime-400 mb-12">Ulta-Pulta Shabd</h2>

            <div className="text-5xl font-black tracking-widest mb-12 text-lime-200">
                {scrambled}
            </div>

            <input
                type="text"
                value={input}
                onChange={e => setInput(e.target.value.toUpperCase())}
                className="w-full max-w-xs bg-lime-900/20 border-2 border-lime-500/30 rounded-xl p-4 text-center text-2xl font-bold outline-none focus:border-lime-500 transition-colors uppercase mb-4"
                placeholder="UNSCRAMBLE"
            />

            <button
                onClick={check}
                disabled={status === 'won'}
                className="btn bg-lime-600 border-lime-500"
            >
                CHECK
            </button>

            {status === 'won' && <div className="mt-8 text-2xl font-bold text-lime-500">CORRECT!</div>}
        </div>
    );
};

export default UltaPultaShabd;
