import React, { useState } from 'react';
import { useAI } from '../../hooks/useAI';
import { Loader2, Heart } from 'lucide-react';

const NaamJodi = ({ onComplete }) => {
    const [names, setNames] = useState({ name1: '', name2: '' });
    const [result, setResult] = useState(null);
    const { generate, loading } = useAI();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!names.name1 || !names.name2 || loading) return;

        // Simulate thinking time for "Scientific Calculation"
        const aiResult = await generate('compatibility', names);
        setResult(aiResult);
        onComplete({ names, result: aiResult });
    };

    return (
        <div className="activity-container">
            <h2 className="text-xl font-bold uppercase tracking-widest text-pink-500 mb-8">Naam Jodi Calculator</h2>

            {!result ? (
                <form onSubmit={handleSubmit} className="w-full max-w-xs flex flex-col gap-6">
                    <input
                        type="text"
                        placeholder="Name 1"
                        className="w-full bg-white/10 border-none rounded-xl p-4 text-center text-xl focus:ring-2 focus:ring-pink-500 outline-none"
                        value={names.name1}
                        onChange={e => setNames({ ...names, name1: e.target.value })}
                        maxLength={15}
                    />
                    <Heart className="w-8 h-8 text-pink-500 mx-auto animate-pulse" />
                    <input
                        type="text"
                        placeholder="Name 2"
                        className="w-full bg-white/10 border-none rounded-xl p-4 text-center text-xl focus:ring-2 focus:ring-pink-500 outline-none"
                        value={names.name2}
                        onChange={e => setNames({ ...names, name2: e.target.value })}
                        maxLength={15}
                    />

                    <button
                        type="submit"
                        disabled={!names.name1 || !names.name2 || loading}
                        className="mt-4 w-full py-4 bg-pink-600 rounded-xl font-bold text-lg disabled:opacity-50 active:scale-95 transition-all text-white flex items-center justify-center"
                    >
                        {loading ? <Loader2 className="animate-spin" /> : "Check Compatibility"}
                    </button>
                </form>
            ) : (
                <div className="text-center max-w-sm animate-in zoom-in duration-300">
                    <div className="text-6xl font-black text-pink-500 mb-6 drop-shadow-xl">
                        {result.split('-')[0]}
                    </div>
                    <p className="text-xl font-medium leading-relaxed text-white/90 bg-white/5 p-6 rounded-xl">
                        "{result.split('-')[1] || result}"
                    </p>
                </div>
            )}
        </div>
    );
};

export default NaamJodi;
