import React, { useState } from 'react';

const WORDS = [
    { word: "JUGAAD", hint: "Innovative fix" },
    { word: "BINDAAS", hint: "Carefree" },
    { word: "DHAKKAN", hint: "Foolish person" },
    { word: "CHAMCHA", hint: "Sycophant" },
    { word: "PATAKA", hint: "Firework / Hot" },
    { word: "KHICHDI", hint: "Messy mix" }
];

const Shabdbaazi = ({ onComplete }) => {
    const [game] = useState(() => WORDS[Math.floor(Math.random() * WORDS.length)]);
    const [guess, setGuess] = useState("");
    const [attempts, setAttempts] = useState(0);
    const [status, setStatus] = useState("playing"); // playing, won, lost
    const MAX_ATTEMPTS = 3;

    const handleSubmit = (e) => {
        e.preventDefault();
        if (status !== 'playing') return;

        if (guess.toUpperCase() === game.word) {
            setStatus("won");
            setTimeout(() => onComplete({ result: 'won' }), 1500);
        } else {
            const newAttempts = attempts + 1;
            setAttempts(newAttempts);
            setGuess("");
            if (newAttempts >= MAX_ATTEMPTS) {
                setStatus("lost");
                setTimeout(() => onComplete({ result: 'lost' }), 2000);
            }
        }
    };

    return (
        <div className="activity-container">
            <h2 className="activity-title text-indigo-400 mb-4">Shabdbaazi</h2>
            <div className="text-sm text-white/50 mb-8 uppercase tracking-widest">Guess the Hinglish Word</div>

            <div className="mb-12 text-center">
                <span className="text-4xl font-black tracking-[0.5em] font-mono block mb-4">
                    {status === 'playing'
                        ? game.word.split('').map((c, i) => (i === 0 || i === game.word.length - 1 ? c : '_')).join('')
                        : game.word
                    }
                </span>
                <div className="bg-white/10 inline-block px-4 py-1 rounded-full text-sm">
                    Hint: {game.hint}
                </div>
            </div>

            <form onSubmit={handleSubmit} className="w-full max-w-xs flex flex-col gap-4">
                <input
                    autoFocus
                    type="text"
                    value={guess}
                    onChange={e => setGuess(e.target.value.toUpperCase())}
                    placeholder="TYPE HERE"
                    className="bg-transparent border-b-2 border-white/20 p-4 text-center text-2xl font-bold outline-none focus:border-indigo-500 transition-colors uppercase"
                    maxLength={game.word.length}
                    disabled={status !== 'playing'}
                />

                <button
                    type="submit"
                    disabled={!guess || status !== 'playing'}
                    className="btn bg-indigo-600 border-indigo-500"
                >
                    GUESS ({MAX_ATTEMPTS - attempts} left)
                </button>
            </form>

            {status !== 'playing' && (
                <div className={`mt-8 text-2xl font-black animate-in zoom-in ${status === 'won' ? 'text-green-500' : 'text-red-500'}`}>
                    {status === 'won' ? 'SAHI PAKDE HAIN!' : 'TUMSE NA HO PAYEGA.'}
                </div>
            )}
        </div>
    );
};

export default Shabdbaazi;
