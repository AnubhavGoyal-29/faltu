import React, { useEffect, useState } from 'react';
import { useTracking } from '../context/TrackingContext';

const ExitModal = () => {
    const { logEvent } = useTracking();
    const [showModal, setShowModal] = useState(false);
    const [hasShown, setHasShown] = useState(false);

    useEffect(() => {
        // History push state hack to detect "Back" navigation
        // This is simple but effective for "Interruption" style apps
        window.history.pushState(null, document.title, window.location.href);

        const handlePopState = (event) => {
            // User pressed back
            if (!hasShown) {
                window.history.pushState(null, document.title, window.location.href); // Stay on page
                setShowModal(true);
                setHasShown(true);
                logEvent('exit_modal_shown');
            } else {
                // Allow exit if they do it again or if we logic it
                // But for "Once per session" usually means we show it once, then let them go.
                // If they press back again, they go back.
                // Here we pushed state again, so they are trapped unless they click "I'm done"
            }
        };

        window.addEventListener('popstate', handlePopState);
        return () => window.removeEventListener('popstate', handlePopState);
    }, [hasShown, logEvent]);

    const handleStay = () => {
        setShowModal(false);
        logEvent('exit_modal_stay');
    };

    const handleExit = () => {
        logEvent('session_end', { type: 'explicit_exit' });
        // Actually go back/close
        // window.close() only works if script opened it.
        // history.back() * 2 since we pushed state twice?
        // Let's just go back 2 steps
        window.history.go(-2);
        // If that fails, replace with google or something
        setTimeout(() => {
            window.location.href = 'about:blank';
        }, 100);
    };

    if (!showModal) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-[#1a1a1a] border border-white/10 rounded-2xl p-8 max-w-sm w-full text-center shadow-2xl">
                <h2 className="text-2xl font-bold mb-4 text-white">That’s enough faltu for now.</h2>
                <div className="flex flex-col gap-3 mt-8">
                    <button
                        onClick={handleStay}
                        className="w-full py-4 text-lg font-bold bg-[var(--accent)] text-white rounded-xl active:scale-95 transition-all"
                    >
                        One more
                    </button>
                    <button
                        onClick={handleExit}
                        className="w-full py-4 text-lg font-medium text-white/50 hover:text-white rounded-xl active:scale-95 transition-all"
                    >
                        I’m done
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ExitModal;
