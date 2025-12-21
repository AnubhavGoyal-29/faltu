import React, { useState, useEffect, useRef } from 'react';

const PerfectTap = ({ onComplete }) => {
    const [count, setCount] = useState(0);
    const [timeLeft, setTimeLeft] = useState(5);
    const [isActive, setIsActive] = useState(true);
    const target = 10; // Tap 10 times

    // Timer
    useEffect(() => {
        if (!isActive) return;
        const timer = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    clearInterval(timer);
                    endGame(count);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(timer);
    }, [isActive, count]);

    const handleTap = () => {
        if (!isActive) return;
        const newCount = count + 1;
        setCount(newCount);
        if (newCount === target) {
            endGame(newCount);
        }
    };

    const endGame = (finalCount) => {
        setIsActive(false);
        const success = finalCount === target;
        setTimeout(() => {
            onComplete({ result: success ? 'perfect' : 'failed', score: finalCount });
        }, 1500);
    };

    return (
        <div className="activity-container perfect-tap relative overflow-hidden" onTouchStart={handleTap} onClick={handleTap}>
            <h2 className="activity-title pointer-events-none z-10">Tap Exactly {target} Times!</h2>

            <div className="text-[8rem] font-black text-[var(--accent)] select-none pointer-events-none z-10">
                {count}
            </div>

            <div className="text-xl text-white/50 mt-4 pointer-events-none z-10">
                Time: {timeLeft}s
            </div>

            {/* Ripple effect or tap feedback visualization could go here */}

            {!isActive && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/60 z-20 backdrop-blur-sm">
                    <div className="text-4xl font-bold">
                        {count === target ? "PERFECT! 🔥" : (count > target ? "TOO FAST! ⚠️" : "TOO SLOW! 🐢")}
                    </div>
                </div>
            )}
        </div>
    );
};

export default PerfectTap;
