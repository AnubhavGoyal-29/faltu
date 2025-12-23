import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ActivityRenderer from './ActivityRenderer.jsx';
import HomePage from './HomePage.jsx';
import CompletionScreen from './CompletionScreen.jsx';
import { trackEvent } from '../utils/analytics.js';
import { trackActivity, getDoneActivityIds } from '../utils/activityTracking.js';
import { getAnonymousUserId } from '../utils/analytics.js';
import { ACTIVITY_REGISTRY } from '../activities/registry.js';

const STORAGE_KEY_HAS_STARTED = 'faltuverse_has_started';

function Feed() {
  const [showHomePage, setShowHomePage] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [activities, setActivities] = useState([]);
  const [doneActivityIds, setDoneActivityIds] = useState(new Set());
  const [isLoading, setIsLoading] = useState(true);
  const [isCompleting, setIsCompleting] = useState(false);

  // Check if user is new or existing
  useEffect(() => {
    const hasStarted = localStorage.getItem(STORAGE_KEY_HAS_STARTED);
    
    if (!hasStarted) {
      // New user - show homepage
      setShowHomePage(true);
      setIsLoading(false);
    } else {
      // Existing user - load their progress
      loadUserProgress();
    }
  }, []);

  // Load user's completed/skipped activities
  const loadUserProgress = async () => {
    try {
      const doneIds = await getDoneActivityIds();
      setDoneActivityIds(new Set(doneIds));
      
      // Filter out done activities
      const availableActivities = ACTIVITY_REGISTRY.filter(
        activity => !doneIds.includes(activity.id)
      );
      
      if (availableActivities.length === 0) {
        // All activities done
        setActivities([]);
      } else {
        // Shuffle and set available activities
        const shuffled = [...availableActivities].sort(() => Math.random() - 0.5);
        setActivities(shuffled);
        
        // Track first activity view
        if (shuffled.length > 0) {
          trackEvent('activity_view', shuffled[0].id);
        }
      }
      
      setIsLoading(false);
    } catch (error) {
      console.error('Error loading user progress:', error);
      // Fallback: show all activities
      const shuffled = [...ACTIVITY_REGISTRY].sort(() => Math.random() - 0.5);
      setActivities(shuffled);
      setIsLoading(false);
    }
  };

  // Handle Enter button from homepage
  const handleEnter = () => {
    localStorage.setItem(STORAGE_KEY_HAS_STARTED, 'true');
    setShowHomePage(false);
    loadUserProgress();
  };

  // Handle activity completion
  const handleComplete = useCallback(async () => {
    if (isCompleting || !currentActivity) return;
    
    setIsCompleting(true);
    
    // Track analytics event
    trackEvent('activity_complete', currentActivity.id);
    
    // Track activity completion in database
    await trackActivity(currentActivity.id, 'completed');
    
    // Add to done set
    setDoneActivityIds(prev => new Set([...prev, currentActivity.id]));

    // Auto-advance after short delay
    setTimeout(() => {
      handleNext();
      setIsCompleting(false);
    }, 500);
  }, [currentActivity, isCompleting]);

  // Handle skip (swipe left)
  const handleSkip = useCallback(async () => {
    if (!currentActivity) return;
    
    // Track activity skip in database
    await trackActivity(currentActivity.id, 'skipped');
    
    // Add to done set
    setDoneActivityIds(prev => new Set([...prev, currentActivity.id]));
    
    handleNext();
  }, [currentActivity]);

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
      // No more activities - show completion screen
      setActivities([]);
    }
  }, [currentIndex, activities]);

  // Handle replay - restart current activity
  const handleReplay = useCallback(() => {
    if (!currentActivity) return;
    
    // Force re-render by changing key
    setCurrentIndex(currentIndex);
    
    // Track replay
    trackEvent('activity_replay', currentActivity.id);
  }, [currentActivity, currentIndex]);

  // Handle restart from completion screen
  const handleRestart = () => {
    // Clear done activities
    setDoneActivityIds(new Set());
    localStorage.removeItem(STORAGE_KEY_HAS_STARTED);
    
    // Reset to homepage
    setShowHomePage(true);
    setCurrentIndex(0);
    setActivities([]);
  };

  // Handle exit
  const handleExit = () => {
    trackEvent('session_end', null, { method: 'user_exit' });
    // Could navigate away or show exit message
  };

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
    if (!touchStart || !touchEnd || showHomePage) return;
    
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

  const currentActivity = activities[currentIndex];
  const completedCount = doneActivityIds.size;
  const totalActivities = ACTIVITY_REGISTRY.length;
  const remainingCount = totalActivities - completedCount;

  // Show loading
  if (isLoading) {
    return (
      <div className="h-full w-full flex items-center justify-center bg-black">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  // Show homepage for new users
  if (showHomePage) {
    return <HomePage onEnter={handleEnter} />;
  }

  // Show completion screen if all activities done
  if (activities.length === 0 && completedCount >= totalActivities) {
    return (
      <CompletionScreen
        onRestart={handleRestart}
        onExit={handleExit}
      />
    );
  }

  // Show activities
  if (!currentActivity) {
    return (
      <div className="h-full w-full flex items-center justify-center bg-black">
        <div className="text-white">No more activities</div>
      </div>
    );
  }

  return (
    <>
      {/* Progress Counter */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-black/50 backdrop-blur-sm px-4 py-2">
        <div className="max-w-md mx-auto flex items-center justify-between text-white text-sm">
          <span className="font-semibold">
            {completedCount} / {totalActivities} Activities
          </span>
          {remainingCount > 0 && (
            <span className="text-white/60">
              {remainingCount} remaining
            </span>
          )}
        </div>
      </div>

      <div
        className="h-full w-full relative overflow-hidden pt-12"
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
              onReplay={handleReplay}
            />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Footer */}
      <div className="fixed bottom-0 left-0 right-0 p-4 text-center text-xs text-white/30 z-10 bg-black/50 backdrop-blur-sm">
        We track anonymous usage to improve the experience. No personal data is collected.
      </div>
    </>
  );
}

export default Feed;
