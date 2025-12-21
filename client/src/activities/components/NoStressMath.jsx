import React, { useState, useEffect } from 'react';

const NoStressMath = ({ onComplete }) => {
    const [problem, setProblem] = useState(null);
    const [options, setOptions] = useState([]);
    const [solved, setSolved] = useState(false);

    useEffect(() => {
        // Generate simple math problem
        const a = Math.floor(Math.random() * 20) + 1;
        const b = Math.floor(Math.random() * 20) + 1;
        const ans = a + b;

        // Generate options
        const wrong1 = ans + Math.floor(Math.random() * 5) + 1;
        const wrong2 = ans - Math.floor(Math.random() * 5) - 1;
        const opts = [ans, wrong1, wrong2].sort(() => Math.random() - 0.5);

        setProblem({ a, b, ans });
        setOptions(opts);
    }, []);

    const handleAnswer = (val) => {
        if (solved) return;
        setSolved(true);
        const correct = val === problem.ans;

        setTimeout(() => {
            onComplete({ correct });
        }, 1500);
    };

    if (!problem) return null;

    return (
        <div className="activity-container">
            <h2 className="activity-title text-blue-400 mb-12">No-Stress Math</h2>

            <div className="text-6xl font-black mb-16 flex gap-4 items-center">
                <span>{problem.a}</span>
                <span className="text-blue-500">+</span>
                <span>{problem.b}</span>
                <span className="text-blue-500">=</span>
                <span className="text-blue-400">?</span>
            </div>

            <div className="grid grid-cols-3 gap-4 w-full max-w-sm">
                {options.map((opt, i) => (
                    <button
                        key={i}
                        onClick={() => handleAnswer(opt)}
                        disabled={solved}
                        className={`p-6 rounded-2xl text-2xl font-bold bg-white/5 border border-white/10 active:scale-95 transition-all
                ${solved && opt === problem.ans ? 'bg-green-500/20 border-green-500' : ''}
                ${solved && opt !== problem.ans ? 'opacity-20' : ''}
            `}
                    >
                        {opt}
                    </button>
                ))}
            </div>

            {solved && (
                <div className="mt-8 text-green-400 font-bold text-xl animate-in fade-in">
                    Genius Level: Verified.
                </div>
            )}
        </div>
    );
};

export default NoStressMath;
