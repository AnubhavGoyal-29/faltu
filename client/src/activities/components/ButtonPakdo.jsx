import React, { useState, useEffect } from 'react';

const ButtonPakdo = ({ onComplete }) => {
    const [position, setPosition] = useState({ top: '50%', left: '50%' });
    const [score, setScore] = useState(0);
    const [timeLeft, setTimeLeft] = useState(15);
    const [gameOver, setGameOver] = useState(false);

    useEffect(() => {
        if (gameOver) return;
        const timer = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    clearInterval(timer);
                    setGameOver(true);
                    onComplete({ result: 'timeout', score });
                    return 0;
                }
                return prev - 1;
            });
            moveButton();
        }, 800); // Move every 800ms automatically

        return () => clearInterval(timer);
    }, [gameOver, score]);

    const moveButton = () => {
        const top = Math.random() * 80 + 10; // Keep within 10-90%
        const left = Math.random() * 80 + 10;
        setPosition({ top: `${top}%`, left: `${left}%` });
    };

    const handleCatch = (e) => {
        e.stopPropagation(); // Prevent swipe or other interactions
        if (gameOver) return;

        setScore(s => s + 1);
        moveButton(); // Move immediately on catch

        // Win condition? maybe just survive 15s or catch X times?
        // PRD says "Catch it before time runs out". Infinite score?
        // Let's say catch 5 times to win.
        if (score + 1 >= 5) {
            setGameOver(true);
            onComplete({ result: 'won', score: score + 1 });
        }
    };

    return (
        <div className="activity-container relative overflow-hidden">
            <h2 className="activity-title pointer-events-none z-0">Button Pakdo</h2>

            {!gameOver && (
                <div className="absolute top-4 right-4 text-white/50 font-mono pointer-events-none">
                    {timeLeft}s
                </div>
            )}

            {!gameOver ? (
                <button
                    onClick={handleCatch}
                    style={{ top: position.top, left: position.left }}
                    className="absolute w-24 h-24 bg-[var(--accent)] rounded-full shadow-[0_0_20px_var(--accent)] active:scale-95 transition-all duration-300 font-bold text-white flex-center transform -translate-x-1/2 -translate-y-1/2"
                >
                    CATCH
                </button>
            ) : (
                <div className="text-4xl font-bold animate-bounce">
                    {score >= 5 ? "GOTCHA! 🏆" : "TOO SLOW! 🐢"}
                </div>
            )}

            <div className="absolute bottom-10 font-bold text-2xl text-white/20 pointer-events-none">
                Score: {score}/5
            </div>
        </div>
    );
};

export default ButtonPakdo;
