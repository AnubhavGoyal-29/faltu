import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Feed from './components/Feed.jsx';
import AdminDashboard from './components/AdminDashboard.jsx';
import { trackEvent } from './utils/analytics.js';

function App() {
  useEffect(() => {
    // Track session start (only for main feed, not admin)
    if (!window.location.pathname.includes('/admin')) {
      trackEvent('session_start');
    }
    
    // Track session end on page unload (best effort)
    const handleBeforeUnload = () => {
      if (!window.location.pathname.includes('/admin')) {
        trackEvent('session_end', null, { 
          method: 'beforeunload' 
        });
      }
    };
    
    const handleVisibilityChange = () => {
      if (document.hidden && !window.location.pathname.includes('/admin')) {
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
    <Router>
      <div className="h-full w-full bg-black text-white">
        <Routes>
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/" element={<Feed />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

