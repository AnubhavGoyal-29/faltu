import React, { useState } from 'react';
import { useAI } from '../../hooks/useAI';
import { Loader2 } from 'lucide-react';

const GentleRoast = ({ onComplete }) => {
    const [roast, setRoast] = useState(null);
    const { generate, loading } = useAI();

    const handleRoast = async () => {
        if (roast || loading) return;
        const result = await generate('roast');
        setRoast(result);
        onComplete({ roasted: true, text: result });
    };

    return (
        <div className="activity-container">
            <h2 className="text-xl font-bold uppercase tracking-widest text-[var(--accent)] mb-12">Gentle Roast Machine</h2>

            {!roast ? (
                <button
                    onClick={handleRoast}
                    disabled={loading}
                    className="w-48 h-48 rounded-full bg-[var(--accent)] text-white font-black text-2xl shadow-[0_0_40px_rgba(255,59,48,0.3)] animate-pulse hover:scale-105 active:scale-95 transition-transform flex items-center justify-center"
                >
                    {loading ? <Loader2 className="animate-spin w-10 h-10" /> : "ROAST ME"}
                </button>
            ) : (
                <div className="text-center max-w-xs animate-in fade-in zoom-in duration-300">
                    <p className="text-2xl font-bold leading-relaxed mb-8">
                        "{roast}"
                    </p>
                    <div className="text-4xl">💀</div>
                </div>
            )}
        </div>
    );
};

export default GentleRoast;
