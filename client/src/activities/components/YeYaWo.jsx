import React, { useState } from 'react';

const OPTIONS = [
    { a: "Be Invisible", b: "Be Able to Fly" },
    { a: "Unlimited Pizza", b: "Unlimited Tacos" },
    { a: "Always Summer", b: "Always Winter" },
    { a: "Fight 1 Horse-sized Duck", b: "100 Duck-sized Horses" },
    { a: "No Internet", b: "No Music" },
    { a: "Talk to Animals", b: "Speak All Languages" }
];

const YeYaWo = ({ onComplete }) => {
    const [pair] = useState(() => OPTIONS[Math.floor(Math.random() * OPTIONS.length)]);
    const [selected, setSelected] = useState(null);

    const handleSelect = (choice) => {
        if (selected) return;
        setSelected(choice);

        // Simulate community stats (fake percentage)
        // In a real app, fetch stats
        setTimeout(() => {
            onComplete({ choice });
        }, 1000);
    };

    return (
        <div className="activity-container">
            <h2 className="text-xl font-bold uppercase tracking-widest text-gray-400 mb-12">Ye Ya Wo?</h2>

            <div className="w-full max-w-sm flex flex-col gap-4 relative">
                <button
                    className={`p-8 rounded-2xl text-xl font-bold transition-all relative overflow-hidden bg-gradient-to-br from-[#1e1e1e] to-[#252525]
            ${selected === 'a' ? 'scale-105 border-2 border-[var(--accent)]' : ''}
            ${selected === 'b' ? 'opacity-50' : ''}
          `}
                    onClick={() => handleSelect('a')}
                >
                    {pair.a}
                    {selected && <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-[var(--accent)]">52%</span>}
                </button>

                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-[var(--accent)] rounded-full flex items-center justify-center font-black z-10 shadow-lg border-4 border-[var(--bg-primary)]">
                    VS
                </div>

                <button
                    className={`p-8 rounded-2xl text-xl font-bold transition-all relative overflow-hidden bg-gradient-to-br from-[#1e1e1e] to-[#252525]
            ${selected === 'b' ? 'scale-105 border-2 border-[var(--accent)]' : ''}
            ${selected === 'a' ? 'opacity-50' : ''}
          `}
                    onClick={() => handleSelect('b')}
                >
                    {pair.b}
                    {selected && <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-[var(--accent)]">48%</span>}
                </button>
            </div>
        </div>
    );
};

export default YeYaWo;
