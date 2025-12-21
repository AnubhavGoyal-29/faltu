import React, { useState } from 'react';

const DIALOGUES = [
    { text: "Kitne aadmi the?", movie: "Sholay", options: ["Sholay", "Deewar", "Don"] },
    { text: "Mere paas Maa hai.", movie: "Deewar", options: ["Zanjeer", "Deewar", "Trishul"] },
    { text: "Bade bade deshon mein aisi choti choti baatein hoti rehti hai.", movie: "DDLJ", options: ["KKHH", "DDLJ", "K3G"] },
    { text: "Mogambo khush hua.", movie: "Mr. India", options: ["Shaan", "Mr. India", "Kalicharan"] },
    { text: "Picture abhi baaki hai mere dost.", movie: "Om Shanti Om", options: ["OSO", "Chennai Express", "Happy New Year"] }
];

const Dialogbaazi = ({ onComplete }) => {
    const [q] = useState(() => DIALOGUES[Math.floor(Math.random() * DIALOGUES.length)]);
    const [answered, setAnswered] = useState(false);
    const [selected, setSelected] = useState(null);

    const handleGuess = (opt) => {
        if (answered) return;
        setAnswered(true);
        setSelected(opt);

        setTimeout(() => {
            onComplete({ result: opt === q.movie ? 'won' : 'lost' });
        }, 1500);
    };

    return (
        <div className="activity-container">
            <h2 className="activity-title text-cyan-400 mb-8">Dialogbaazi</h2>

            <div className="bg-cyan-900/20 border border-cyan-500/30 p-8 rounded-2xl w-full max-w-sm mb-12 relative">
                <div className="absolute -top-4 -left-2 text-4xl">🎬</div>
                <p className="text-xl font-serif italic leading-relaxed text-cyan-100">
                    "{q.text}"
                </p>
            </div>

            <div className="flex flex-col gap-3 w-full max-w-xs">
                {q.options.map((opt) => (
                    <button
                        key={opt}
                        onClick={() => handleGuess(opt)}
                        className={`p-4 rounded-xl text-lg font-bold border-2 transition-all
               ${answered && opt === q.movie ? 'bg-green-500/20 border-green-500' : ''}
               ${answered && opt === selected && opt !== q.movie ? 'bg-red-500/20 border-red-500' : ''}
               ${!answered ? 'bg-white/5 border-white/10 hover:bg-white/10' : ''}
             `}
                    >
                        {opt}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default Dialogbaazi;
