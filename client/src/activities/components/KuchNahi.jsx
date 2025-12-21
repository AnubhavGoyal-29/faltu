import React, { useEffect, useState } from 'react';

const KuchNahi = ({ onComplete }) => {
    const [timeLeft, setTimeLeft] = useState(10);
    const [failed, setFailed] = useState(false);

    useEffect(() => {
        if (failed) return;

        // Detect movement
        const handleMove = () => {
            setFailed(true);
            onComplete({ result: 'moved' });
        };

        // Sensitive listeners
        window.addEventListener('mousemove', handleMove);
        window.addEventListener('touchmove', handleMove);
        window.addEventListener('click', handleMove);
        window.addEventListener('keydown', handleMove);

        const timer = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    clearInterval(timer);
                    cleanup();
                    onComplete({ result: 'zen' });
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        const cleanup = () => {
            window.removeEventListener('mousemove', handleMove);
            window.removeEventListener('touchmove', handleMove);
            window.removeEventListener('click', handleMove);
            window.removeEventListener('keydown', handleMove);
        };

        return () => {
            clearInterval(timer);
            cleanup();
        };
    }, [failed, onComplete]);

    return (
        <div className="activity-container kuch-nahi">
            <h2 className="activity-title text-center leading-relaxed">
                {failed ? "Oops! You moved." : "Do Absolutely Nothing."}
            </h2>

            {!failed && (
                <div className="text-[6rem] font-thin opacity-50 mt-8">
                    {timeLeft}
                </div>
            )}

            <p className="mt-8 text-sm opacity-30">
                Don't touch. Don't swipe. Just breathe.
            </p>
        </div>
    );
};

export default KuchNahi;
