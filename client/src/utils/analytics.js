import { getAnonymousUserId } from './userId.js';

// Re-export for convenience
export { getAnonymousUserId };

// Track event to backend
export async function trackEvent(eventName, activityId = null, metadata = {}) {
  const anonymousUserId = getAnonymousUserId();
  
  const payload = {
    anonymous_user_id: anonymousUserId,
    event_name: eventName,
    activity_id: activityId,
    metadata: {
      ...metadata,
      timestamp: new Date().toISOString(),
      user_agent: navigator.userAgent,
      screen_width: window.screen.width,
      screen_height: window.screen.height
    }
  };

  try {
    // Use sendBeacon for reliability on page unload
    if (eventName === 'session_end') {
      const blob = new Blob([JSON.stringify(payload)], { 
        type: 'application/json' 
      });
      navigator.sendBeacon('/api/event', blob);
    } else {
      await fetch('/api/event', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });
    }
  } catch (error) {
    // Silently fail - analytics should not break the app
    console.error('Analytics error:', error);
  }
}


