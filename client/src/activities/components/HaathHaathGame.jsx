import React, { useState } from 'react';

const MOVES = ['✊', '✋', '✌️'];

const HaathHaathGame = ({ onComplete }) => {
    const [wins, setWins] = useState(0);
    const [userMove, setUserMove] = useState(null);
    const [aiMove, setAiMove] = useState(null);
    const [msg, setMsg] = useState("Win 3 to Exit");

    const play = (move) => {
        if (userMove) return;
        setUserMove(move);

        // Random AI
        const ai = MOVES[Math.floor(Math.random() * MOVES.length)];
        setAiMove(ai);

        // Logic
        let result = '';
        if (move === ai) result = 'draw';
        else if (
            (move === '✊' && ai === '✌️') ||
            (move === '✋' && ai === '✊') ||
            (move === '✌️' && ai === '✋')
        ) result = 'win';
        else result = 'lost';

        if (result === 'win') {
            const newWins = wins + 1;
            setWins(newWins);
            setMsg("YOU WON!");
            if (newWins >= 3) {
                setTimeout(() => onComplete({ result: 'won_match' }), 2000);
            } else {
                setTimeout(reset, 1500);
            }
        } else if (result === 'lost') {
            setMsg("AI WON!");
            setTimeout(reset, 1500);
        } else {
            setMsg("DRAW!");
            setTimeout(reset, 1500);
        }
    };

    const reset = () => {
        setUserMove(null);
        setAiMove(null);
        setMsg(`Wins: ${wins}/3`);
    };

    return (
        <div className="activity-container">
            <h2 className="activity-title text-indigo-400 mb-8">Haath-Haath Game</h2>

            <div className="flex justify-between items-center w-full max-w-xs mb-12 px-8">
                <div className="text-center">
                    <div className="text-sm text-white/50 mb-2">YOU</div>
                    <div className={`text-6xl ${userMove ? 'animate-bounce' : ''}`}>{userMove || '❓'}</div>
                </div>
                <div className="text-2xl font-bold text-white/20">VS</div>
                <div className="text-center">
                    <div className="text-sm text-white/50 mb-2">AI</div>
                    <div className={`text-6xl ${aiMove ? 'animate-bounce' : ''}`}>{aiMove || '❓'}</div>
                </div>
            </div>

            <div className="text-2xl font-bold mb-12 text-indigo-300">{msg}</div>

            {!userMove && (
                <div className="flex gap-4">
                    {MOVES.map(m => (
                        <button
                            key={m}
                            onClick={() => play(m)}
                            className="w-20 h-20 text-4xl bg-white/10 rounded-full hover:bg-white/20 active:scale-90 transition-all"
                        >
                            {m}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

export default HaathHaathGame;
