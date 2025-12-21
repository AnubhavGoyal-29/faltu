import React, { useState } from 'react';
import { motion } from 'framer-motion';

const KismatFlip = ({ onComplete }) => {
    const [choice, setChoice] = useState(null); // 'Head' (Smart) | 'Tails' (Dumb)
    const [flipping, setFlipping] = useState(false);
    const [result, setResult] = useState(null);

    const handleFlip = (selectedChoice) => {
        if (flipping || result) return;
        setChoice(selectedChoice);
        setFlipping(true);

        // Flip duration 2s
        setTimeout(() => {
            const outcome = Math.random() > 0.5 ? 'Head' : 'Tails';
            setResult(outcome);
            setFlipping(false);
            onComplete({ choice: selectedChoice, result: outcome });
        }, 2000);
    };

    return (
        <div className="activity-container">
            <h2 className="activity-title mb-8 text-yellow-500">Kismat Flip</h2>

            <div className="perspective-1000 w-48 h-48 mb-12 relative cursor-pointer" onClick={() => !choice && handleFlip('Head')}>
                <motion.div
                    className="w-full h-full relative preserve-3d"
                    animate={{
                        rotateY: flipping ? 1800 : (result === 'Tails' ? 180 : 0)
                    }}
                    transition={{ duration: flipping ? 2 : 0.5, ease: "easeInOut" }}
                >
                    {/* Front (Head - Smart) */}
                    <div className="absolute inset-0 backface-hidden rounded-full bg-yellow-400 border-4 border-yellow-600 flex-center shadow-2xl">
                        <span className="text-4xl font-black text-yellow-900">SMART</span>
                    </div>
                    {/* Back (Tails - Dumb) */}
                    <div className="absolute inset-0 backface-hidden rounded-full bg-gray-400 border-4 border-gray-600 flex-center shadow-2xl rotate-y-180">
                        <span className="text-4xl font-black text-gray-900">DUMB</span>
                    </div>
                </motion.div>
            </div>

            {!choice ? (
                <div className="flex gap-4">
                    <button
                        onClick={() => handleFlip('Head')}
                        className="btn bg-yellow-400/20 border-yellow-400 text-yellow-400"
                    >
                        I'm Smart
                    </button>
                    <button
                        onClick={() => handleFlip('Tails')}
                        className="btn bg-gray-400/20 border-gray-400 text-gray-400"
                    >
                        I'm Dumb
                    </button>
                </div>
            ) : (
                <div className="text-2xl font-bold animate-pulse">
                    {flipping ? "Flipping..." : (
                        result === choice ? "Destiny Agrees! 🎉" : "Destiny Disagrees. 🤡"
                    )}
                </div>
            )}
        </div>
    );
};

export default KismatFlip;
