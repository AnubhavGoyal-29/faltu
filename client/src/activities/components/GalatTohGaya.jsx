import React, { useState, useEffect } from 'react';

const GalatTohGaya = ({ onComplete }) => {
    const [grid, setGrid] = useState(Array(9).fill(false));
    const [pattern, setPattern] = useState([]);
    const [revealing, setRevealing] = useState(true);
    const [taps, setTaps] = useState(0);
    const [failed, setFailed] = useState(false);

    useEffect(() => {
        // Generate pattern of 4 safe spots
        const indices = Array.from({ length: 9 }, (_, i) => i).sort(() => Math.random() - 0.5).slice(0, 4);
        setPattern(indices);

        // Show safe spots for 1.5s
        setGrid(prev => prev.map((_, i) => indices.includes(i)));

        setTimeout(() => {
            setGrid(Array(9).fill(false)); // Hide
            setRevealing(false);
        }, 1500);
    }, []);

    const handleTap = (idx) => {
        if (revealing || failed) return;

        if (pattern.includes(idx)) {
            // Correct
            if (grid[idx]) return; // Already tapped

            const newGrid = [...grid];
            newGrid[idx] = true;
            setGrid(newGrid);

            const newTaps = taps + 1;
            setTaps(newTaps);

            if (newTaps === pattern.length) {
                setTimeout(() => onComplete({ result: 'won' }), 1000);
            }
        } else {
            // Wrong
            setFailed(true);
            setTimeout(() => onComplete({ result: 'lost' }), 1500);
        }
    };

    return (
        <div className="activity-container">
            <h2 className="activity-title text-red-500 mb-8">Galat Toh Gaya (Memory)</h2>

            {revealing && <div className="text-xl animate-pulse mb-8 text-white/50">MEMORIZE...</div>}
            {failed && <div className="text-2xl font-bold text-red-500 mb-8 animate-shake">WRONG!</div>}
            {!revealing && !failed && taps < 4 && <div className="text-xl mb-8">TAP THE SAFE SPOTS</div>}
            {taps === 4 && <div className="text-2xl font-bold text-green-500 mb-8">SAFE!</div>}

            <div className="grid grid-cols-3 gap-4">
                {Array(9).fill(0).map((_, i) => (
                    <button
                        key={i}
                        onClick={() => handleTap(i)}
                        disabled={revealing || failed || grid[i]}
                        className={`w-20 h-20 rounded-xl transition-all duration-300
               ${grid[i] || (revealing && pattern.includes(i)) ? 'bg-green-500 shadow-[0_0_20px_rgba(34,197,94,0.5)]' : 'bg-white/10'}
               ${failed && !pattern.includes(i) && !grid[i] ? 'bg-red-900/50' : ''}
            `}
                    />
                ))}
            </div>
        </div>
    );
};

export default GalatTohGaya;
