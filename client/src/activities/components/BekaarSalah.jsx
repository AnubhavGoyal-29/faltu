import React, { useState } from 'react';
import { useAI } from '../../hooks/useAI';
import { Loader2 } from 'lucide-react';

const TOPICS = ["Dating", "Money", "Career", "Fitness", "Fashion", "Friendship"];

const BekaarSalah = ({ onComplete }) => {
    const [advice, setAdvice] = useState(null);
    const { generate, loading } = useAI();

    const handleGetAdvice = async (topic) => {
        if (loading) return;
        const result = await generate('advice', { topic });
        setAdvice({ topic, text: result });
        onComplete({ topic, advice: result });
    };

    return (
        <div className="activity-container">
            <h2 className="text-xl font-bold uppercase tracking-widest text-yellow-500 mb-8">Bekaar Salah (Bad Advice)</h2>

            {!advice ? (
                <div className="grid grid-cols-2 gap-4 w-full max-w-sm">
                    {TOPICS.map(topic => (
                        <button
                            key={topic}
                            onClick={() => handleGetAdvice(topic)}
                            disabled={loading}
                            className="p-4 rounded-xl bg-white/10 hover:bg-white/20 active:scale-95 transition-all text-lg font-bold border border-white/5"
                        >
                            {topic}
                        </button>
                    ))}
                    {loading && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-10">
                            <Loader2 className="animate-spin text-yellow-500 w-12 h-12" />
                        </div>
                    )}
                </div>
            ) : (
                <div className="text-center max-w-sm animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="text-sm text-white/50 mb-4 uppercase tracking-wider">Advice on {advice.topic}</div>
                    <p className="text-2xl font-bold leading-relaxed text-yellow-400 mb-8">
                        "{advice.text}"
                    </p>
                    <div className="text-4xl">🤷‍♂️</div>
                </div>
            )}
        </div>
    );
};

export default BekaarSalah;
