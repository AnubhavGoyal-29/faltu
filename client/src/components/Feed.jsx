import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getRandomActivity } from '../activities/registry';
import { useTracking } from '../context/TrackingContext';

const Feed = () => {
    const { logEvent } = useTracking();
    const [currentActivity, setCurrentActivity] = useState(null);
    const [direction, setDirection] = useState(0); // 1 = up (next), -1 = left (skip)

    // Initialize first activity
    useEffect(() => {
        loadNextActivity();
    }, []);

    const loadNextActivity = useCallback(() => {
        setCurrentActivity(prev => {
            const next = getRandomActivity(prev?.id);
            return { ...next, key: Math.random().toString(36).substr(2, 9) }; // Unique key to force re-render
        });
    }, []);

    const handleComplete = (result) => {
        logEvent('activity_complete', {
            activity_id: currentActivity.id,
            result
        });
    };

    const handleSwipe = (offset) => {
        const swipeThreshold = 50;
        if (offset.y < -swipeThreshold) {
            // Swipe Up -> Next
            setDirection(1);
            logEvent('activity_next', { type: 'swipe_up' });
            loadNextActivity();
        } else if (offset.x < -swipeThreshold) {
            // Swipe Left -> Skip
            setDirection(-1);
            logEvent('activity_skip', { type: 'swipe_left' });
            loadNextActivity();
        }
    };

    if (!currentActivity) return <div className="w-full h-full flex-center bg-black">Loading...</div>;

    const ActivityComponent = currentActivity.component;

    // Animation variants
    const variants = {
        enter: (direction) => ({
            y: direction === 1 ? '100%' : 0,
            x: direction === -1 ? '100%' : 0,
            opacity: 0,
            scale: 0.9
        }),
        center: {
            y: 0,
            x: 0,
            opacity: 1,
            scale: 1,
            transition: { duration: 0.4, type: 'spring', stiffness: 300, damping: 30 }
        },
        exit: (direction) => ({
            y: direction === 1 ? '-100%' : 0,
            x: direction === -1 ? '-100%' : 0,
            opacity: 0,
            scale: 0.9,
            transition: { duration: 0.3 }
        })
    };

    return (
        <div className="feed-container full-screen overflow-hidden bg-black text-white relative">
            <AnimatePresence initial={false} custom={direction} mode='wait'>
                <motion.div
                    key={currentActivity.key}
                    custom={direction}
                    variants={variants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    drag="y"
                    dragConstraints={{ top: 0, bottom: 0 }}
                    dragElastic={0.2}
                    onDragEnd={(e, { offset }) => handleSwipe(offset)}
                    className="absolute inset-0 w-full h-full"
                >
                    <PageWrapper onSwipe={handleSwipe}>
                        <ActivityComponent onComplete={handleComplete} />
                    </PageWrapper>
                </motion.div>
            </AnimatePresence>

            {/* Navigation Hints */}
            <div className="pointer-events-none fixed bottom-10 w-full text-center text-white/30 text-xs">
                Swipes: Up (Next) • Left (Skip)
            </div>
        </div>
    );
};

// Wrapper to handle gestures
const PageWrapper = ({ children, onSwipe }) => {
    return (
        <motion.div
            className="page-wrapper w-full h-full"
            drag
            dragConstraints={{ top: 0, bottom: 0, left: 0, right: 0 }}
            onDragEnd={(e, { offset }) => onSwipe(offset)}
        >
            {children}
        </motion.div>
    );
};

export default Feed;
