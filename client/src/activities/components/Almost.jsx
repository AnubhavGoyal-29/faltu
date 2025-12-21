import React, { useState, useEffect } from 'react';

const Almost = ({ onComplete }) => {
    const [progress, setProgress] = useState(0);
    const [moving, setMoving] = useState(true);

    useEffect(() => {
        let animationFrame;
        const animate = () => {
            if (moving) {
                setProgress(p => {
                    if (p >= 100) return 0;
                    return p + 1.5; // Speed
                });
                animationFrame = requestAnimationFrame(animate);
            }
        };
        animationFrame = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(animationFrame);
    }, [moving]);

    const handleStop = () => {
        if (!moving) return;
        setMoving(false);

        // Calculate closeness to 90-95% (Sweet spot)
        const score = progress;
        const isPerfect = score >= 90 && score <= 99;

        setTimeout(() => {
            onComplete({ result: isPerfect ? 'perfect' : 'close', score });
        }, 1500);
    };

    return (
        <div className="activity-container almost" onClick={handleStop}>
            <h2 className="activity-title mb-12">Stop at 95%</h2>

            <div className="w-full max-w-xs h-16 border-4 border-white rounded-full overflow-hidden relative">
                <div
                    className="h-full bg-[var(--accent)]"
                    style={{ width: `${progress}%` }}
                />
                {/* Target Zone Marker */}
                <div className="absolute top-0 bottom-0 right-[5%] w-[5%] bg-green-500/30"></div>
            </div>

            <div className="mt-8 text-4xl font-mono">
                {Math.floor(progress)}%
            </div>

            {!moving && (
                <div className="mt-8 text-2xl font-bold animate-pulse">
                    {progress >= 90 && progress <= 99 ? "NAILED IT! 🎯" : "Missed! 💩"}
                </div>
            )}
        </div>
    );
};

export default Almost;
