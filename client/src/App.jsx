import React, { useEffect } from 'react';
import Feed from './components/Feed.jsx';
import { trackEvent } from './utils/analytics.js';

function App() {
  useEffect(() => {
    // Track session start
    trackEvent('session_start');
    
    // Track session end on page unload (best effort)
    const handleBeforeUnload = () => {
      trackEvent('session_end', null, { 
        method: 'beforeunload' 
      });
    };
    
    const handleVisibilityChange = () => {
      if (document.hidden) {
        trackEvent('session_end', null, { 
          method: 'visibilitychange' 
        });
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  return (
    <div className="h-full w-full bg-black text-white">
      <Feed />
    </div>
  );
}

export default App;

