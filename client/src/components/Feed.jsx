import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ActivityRenderer from './ActivityRenderer.jsx';
import ExitModal from './ExitModal.jsx';
import { trackEvent } from '../utils/analytics.js';
import { ACTIVITY_REGISTRY } from '../activities/registry.js';

function Feed() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [activities, setActivities] = useState([]);
  const [showExitModal, setShowExitModal] = useState(false);
  const [hasShownExitModal, setHasShownExitModal] = useState(false);
  const [isCompleting, setIsCompleting] = useState(false);

  // Initialize activities on mount
  useEffect(() => {
    const shuffled = [...ACTIVITY_REGISTRY].sort(() => Math.random() - 0.5);
    setActivities(shuffled);
    
    // Track first activity view
    if (shuffled.length > 0) {
      trackEvent('activity_view', shuffled[0].id);
    }
  }, []);

  const currentActivity = activities[currentIndex];

  // Handle next activity
  const handleNext = useCallback(() => {
    if (currentIndex < activities.length - 1) {
      const nextIndex = currentIndex + 1;
      setCurrentIndex(nextIndex);
      
      // Track next activity view
      if (activities[nextIndex]) {
        trackEvent('activity_view', activities[nextIndex].id);
      }
    } else {
      // Shuffle and restart
      const shuffled = [...ACTIVITY_REGISTRY].sort(() => Math.random() - 0.5);
      setActivities(shuffled);
      setCurrentIndex(0);
      if (shuffled[0]) {
        trackEvent('activity_view', shuffled[0].id);
      }
    }
  }, [currentIndex, activities]);

  // Handle activity completion
  const handleComplete = useCallback(() => {
    if (isCompleting) return;
    
    setIsCompleting(true);
    if (currentActivity) {
      trackEvent('activity_complete', currentActivity.id);
    }

    // Auto-advance after short delay
    setTimeout(() => {
      handleNext();
      setIsCompleting(false);
    }, 500);
  }, [currentActivity, isCompleting, handleNext]);

  // Handle skip (swipe left)
  const handleSkip = useCallback(() => {
    handleNext();
  }, [handleNext]);

  // Swipe handlers
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);

  const minSwipeDistance = 50;

  const onTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart({
      x: e.targetTouches[0].clientX,
      y: e.targetTouches[0].clientY
    });
  };

  const onTouchMove = (e) => {
    setTouchEnd({
      x: e.targetTouches[0].clientX,
      y: e.targetTouches[0].clientY
    });
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distanceX = touchStart.x - touchEnd.x;
    const distanceY = touchStart.y - touchEnd.y;
    const isLeftSwipe = distanceX > minSwipeDistance;
    const isUpSwipe = distanceY > minSwipeDistance;

    // Prioritize horizontal swipes over vertical
    if (Math.abs(distanceX) > Math.abs(distanceY)) {
      if (isLeftSwipe) {
        handleSkip();
      }
    } else {
      if (isUpSwipe) {
        handleNext();
      }
    }
  };

  // Handle exit modal
  useEffect(() => {
    const handlePopState = () => {
      if (!hasShownExitModal) {
        setShowExitModal(true);
        setHasShownExitModal(true);
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [hasShownExitModal]);

  const handleExit = () => {
    trackEvent('session_end', null, { method: 'user_exit' });
    // Allow natural browser navigation
  };

  const handleOneMore = () => {
    setShowExitModal(false);
  };

  if (!currentActivity) {
    return (
      <div className="h-full w-full flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  return (
    <>
      <div
        className="h-full w-full relative overflow-hidden"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={currentActivity.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="h-full w-full"
          >
            <ActivityRenderer
              activity={currentActivity}
              onComplete={handleComplete}
              onSkip={handleSkip}
            />
          </motion.div>
        </AnimatePresence>
      </div>

      {showExitModal && (
        <ExitModal
          onExit={handleExit}
          onOneMore={handleOneMore}
        />
      )}

      {/* Footer */}
      <div className="fixed bottom-0 left-0 right-0 p-4 text-center text-xs text-white/30 z-10">
        We track anonymous usage to improve the experience. No personal data is collected.
      </div>
    </>
  );
}

export default Feed;

