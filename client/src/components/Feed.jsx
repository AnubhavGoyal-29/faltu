import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ActivityRenderer from './ActivityRenderer.jsx';
import HomePage from './HomePage.jsx';
import CompletionScreen from './CompletionScreen.jsx';
import { trackEvent } from '../utils/analytics.js';
import { getNextActivity, trackActivity } from '../utils/activityApi.js';

const STORAGE_KEY_HAS_STARTED = 'faltuverse_has_started';

function Feed() {
  const [showHomePage, setShowHomePage] = useState(false);
  const [currentActivity, setCurrentActivity] = useState(null);
  const [progress, setProgress] = useState({ completed: 0, total: 20, remaining: 20 });
  const [isLoading, setIsLoading] = useState(true);
  const [isCompleting, setIsCompleting] = useState(false);
  const [isAllCompleted, setIsAllCompleted] = useState(false);

  // Load next activity from backend
  const loadNextActivity = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await getNextActivity();
      
      if (!response) {
        console.error('Failed to get next activity');
        setIsLoading(false);
        return;
      }

      if (response.completed) {
        // All activities done
        setIsAllCompleted(true);
        setCurrentActivity(null);
        setProgress(response.progress);
      } else {
        // Set next activity
        setCurrentActivity(response.activity);
        setProgress(response.progress);
        
        // Track activity view
        if (response.activity) {
          trackEvent('activity_view', response.activity.id);
        }
      }
      
      setIsLoading(false);
    } catch (error) {
      console.error('Error loading next activity:', error);
      setIsLoading(false);
    }
  }, []);

  // Check if user is new or existing
  useEffect(() => {
    const hasStarted = localStorage.getItem(STORAGE_KEY_HAS_STARTED);
    
    if (!hasStarted) {
      // New user - show homepage
      setShowHomePage(true);
      setIsLoading(false);
    } else {
      // Existing user - load next activity from backend
      loadNextActivity();
    }
  }, [loadNextActivity]);

  // Handle Enter button from homepage
  const handleEnter = () => {
    localStorage.setItem(STORAGE_KEY_HAS_STARTED, 'true');
    setShowHomePage(false);
    loadNextActivity();
  };

  // Handle activity completion
  const handleComplete = useCallback(async () => {
    if (isCompleting || !currentActivity) return;
    
    setIsCompleting(true);
    
    // Track analytics event
    trackEvent('activity_complete', currentActivity.id);
    
    // Track activity completion in database
    await trackActivity(currentActivity.id, 'completed');

    // Auto-advance after short delay
    setTimeout(() => {
      loadNextActivity();
      setIsCompleting(false);
    }, 500);
  }, [currentActivity, isCompleting, loadNextActivity]);

  // Handle skip (swipe left)
  const handleSkip = useCallback(async () => {
    if (!currentActivity) return;
    
    // Track activity skip in database
    await trackActivity(currentActivity.id, 'skipped');
    
    // Load next activity
    loadNextActivity();
  }, [currentActivity, loadNextActivity]);

  // Handle next activity (swipe up)
  const handleNext = useCallback(() => {
    loadNextActivity();
  }, [loadNextActivity]);

  // Handle replay - restart current activity (don't mark as done)
  const handleReplay = useCallback(() => {
    if (!currentActivity) return;
    
    // Force re-render by updating key
    setCurrentActivity({ ...currentActivity });
    
    // Track replay
    trackEvent('activity_replay', currentActivity.id);
  }, [currentActivity]);

  // Handle restart from completion screen
  const handleRestart = async () => {
    // Clear localStorage
    localStorage.removeItem(STORAGE_KEY_HAS_STARTED);
    
    // Reset state
    setIsAllCompleted(false);
    setCurrentActivity(null);
    setProgress({ completed: 0, total: 20, remaining: 20 });
    
    // Reset to homepage
    setShowHomePage(true);
  };

  // Handle exit
  const handleExit = () => {
    trackEvent('session_end', null, { method: 'user_exit' });
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
  if (isAllCompleted) {
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
            {progress.completed} / {progress.total} Activities
          </span>
          {progress.remaining > 0 && (
            <span className="text-white/60">
              {progress.remaining} remaining
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
