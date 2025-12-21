import React, { useState } from 'react';

// Data source could be external
const FACTS = [
    { text: "Honey never spoils. Archaeologists have found edible honey in 3000-year-old tombs.", isTrue: true },
    { text: "Bananas grow on trees.", isTrue: false }, // They grow on large herbaceous plants
    { text: "Octopuses have three hearts.", isTrue: true },
    { text: "The Great Wall of China is visible from space with the naked eye.", isTrue: false },
];

const SachYaFaltu = ({ onComplete }) => {
    const [fact] = useState(() => FACTS[Math.floor(Math.random() * FACTS.length)]);
    const [answered, setAnswered] = useState(false);
    const [result, setResult] = useState(null); // 'correct' | 'wrong'

    const handleChoice = (choice) => {
        if (answered) return;
        setAnswered(true);

        const isCorrect = choice === fact.isTrue;
        setResult(isCorrect ? 'correct' : 'wrong');

        setTimeout(() => {
            onComplete({ result: isCorrect ? 'won' : 'lost' });
        }, 1500);
    };

    return (
        <div className="activity-container">
            <h2 className="text-xl font-bold uppercase tracking-widest text-gray-400 mb-8">Sach Ya Faltu?</h2>

            <div className="bg-white/5 p-8 rounded-2xl w-full max-w-sm min-h-[200px] flex items-center justify-center shadow-lg mb-8">
                <p className="text-2xl font-medium leading-relaxed">"{fact.text}"</p>
            </div>

            <div className="flex flex-col gap-4 w-full max-w-xs">
                {!answered ? (
                    <>
                        <button
                            className="px-8 py-4 text-xl font-bold rounded-2xl border border-green-500/50 bg-green-500/10 text-green-400 active:scale-95 transition-all"
                            onClick={() => handleChoice(true)}
                        >
                            Sach (True)
                        </button>
                        <button
                            className="px-8 py-4 text-xl font-bold rounded-2xl border border-red-500/50 bg-red-500/10 text-red-400 active:scale-95 transition-all"
                            onClick={() => handleChoice(false)}
                        >
                            Faltu (False)
                        </button>
                    </>
                ) : (
                    <div className={`text-4xl font-black animate-bounce ${result === 'correct' ? 'text-green-500' : 'text-red-500'}`}>
                        {result === 'correct' ? '🎉 Sahi Jawab!' : '❌ Galat!'}
                    </div>
                )}
            </div>
        </div>
    );
};

export default SachYaFaltu;
