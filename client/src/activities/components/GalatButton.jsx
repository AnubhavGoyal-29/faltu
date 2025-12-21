import React, { useState } from 'react';

const JUDGMENTS = [
    "Why did you pick this one? Weird.",
    "Excellent choice, said no one ever.",
    "This button was clearly the evil one.",
    "Boring choice. Try harder properly.",
    "You possess the wisdom of a potato.",
    "Destiny is disappointed in you."
];

const GalatButton = ({ onComplete }) => {
    const [selected, setSelected] = useState(null);
    const [judgment, setJudgment] = useState("");

    const handleSelect = (idx) => {
        if (selected !== null) return;
        setSelected(idx);

        const randomMsg = JUDGMENTS[Math.floor(Math.random() * JUDGMENTS.length)];
        setJudgment(randomMsg);

        setTimeout(() => {
            onComplete({ choice: idx, judgment: randomMsg });
        }, 2000);
    };

    return (
        <div className="activity-container">
            <h2 className="activity-title mb-12">Pick a Button</h2>

            <div className="flex flex-col gap-6 w-full max-w-xs">
                {[0, 1, 2].map((i) => (
                    <button
                        key={i}
                        onClick={() => handleSelect(i)}
                        disabled={selected !== null}
                        className={`p-6 rounded-2xl text-xl font-bold border-2 transition-all 
              ${selected === i
                                ? 'bg-red-500/20 border-red-500 scale-105'
                                : 'bg-white/5 border-white/10 hover:bg-white/10'
                            }
              ${selected !== null && selected !== i ? 'opacity-30 blur-sm' : ''}
            `}
                    >
                        Button {i + 1}
                    </button>
                ))}
            </div>

            {judgment && (
                <div className="mt-8 text-xl font-medium text-red-400 text-center animate-in fade-in slide-in-from-bottom-2">
                    "{judgment}"
                </div>
            )}
        </div>
    );
};

export default GalatButton;
