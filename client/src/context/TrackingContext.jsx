import React, { createContext, useContext, useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

const TrackingContext = createContext();

export const useTracking = () => useContext(TrackingContext);

// API URL - relative path for production (proxied by backend/nginx)
const API_URL = '/api/event';

export const TrackingProvider = ({ children }) => {
    const [userId, setUserId] = useState(null);
    const [sessionId, setSessionId] = useState(null);

    useEffect(() => {
        // 1. Initialize Anonymous User ID
        let storedId = localStorage.getItem('faltu_user_id');
        if (!storedId) {
            storedId = uuidv4();
            localStorage.setItem('faltu_user_id', storedId);
        }
        setUserId(storedId);

        // 2. Start Session
        const newSessionId = uuidv4();
        setSessionId(newSessionId);

        // Track Session Start
        logEvent('session_start', { session_id: newSessionId });

        // Cleanup: Session End
        const handleUnload = () => {
            // Best effort beacon
            const data = JSON.stringify({
                anonymous_user_id: storedId,
                event_name: 'session_end',
                timestamp: Date.now(),
                metadata: { session_id: newSessionId }
            });
            if (navigator.sendBeacon) {
                navigator.sendBeacon(API_URL, new Blob([data], { type: 'application/json' }));
            }
        };

        window.addEventListener('beforeunload', handleUnload);
        return () => window.removeEventListener('beforeunload', handleUnload);
    }, []);

    const logEvent = (eventName, properties = {}) => {
        if (!userId) {
            // Retry shortly if user ID not yet set (rare race condition)
            setTimeout(() => logEvent(eventName, properties), 100);
            return;
        }

        const payload = {
            anonymous_user_id: userId,
            event_name: eventName,
            activity_id: properties.activity_id || null, // Top level field
            timestamp: Date.now(),
            metadata: {
                session_id: sessionId,
                ...properties
            }
        };

        // Console log for dev
        console.log('[Analytics]', eventName, payload);

        // Send to backend
        fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        }).catch(err => console.error('Analytics missing:', err));
    };

    return (
        <TrackingContext.Provider value={{ userId, sessionId, logEvent }}>
            {children}
        </TrackingContext.Provider>
    );
};
