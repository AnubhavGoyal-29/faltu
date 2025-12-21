import React, { useState, useEffect } from 'react';
import { useAI } from '../../hooks/useAI';
import { Loader2 } from 'lucide-react';

const FaltuJokeDrop = ({ onComplete }) => {
    const [joke, setJoke] = useState(null);
    const { generate, loading } = useAI();

    // Load joke immediately on mount
    useEffect(() => {
        let mounted = true;
        const fetchJoke = async () => {
            const result = await generate('joke');
            if (mounted) {
                setJoke(result);
                onComplete({ viewed: true });
            }
        };
        fetchJoke();
        return () => { mounted = false; };
    }, []);

    return (
        <div className="activity-container">
            <h2 className="text-xl font-bold uppercase tracking-widest text-purple-400 mb-12">Faltu Joke Drop</h2>

            {!joke ? (
                <Loader2 className="w-12 h-12 text-purple-400 animate-spin" />
            ) : (
                <div className="bg-purple-500/10 border border-purple-500/20 p-8 rounded-2xl max-w-sm rotate-1 hover:rotate-0 transition-transform duration-300 shadow-xl">
                    <p className="text-2xl font-medium leading-relaxed">
                        "{joke}"
                    </p>
                    <div className="mt-6 text-4xl text-right">🤡</div>
                </div>
            )}
        </div>
    );
};

export default FaltuJokeDrop;
