import React from 'react';
import { TrackingProvider } from './context/TrackingContext';
import Feed from './components/Feed';
import ExitModal from './components/ExitModal';

function App() {
    return (
        <TrackingProvider>
            <div className="app-container relative w-full h-full">
                <Feed />
                <ExitModal />

                {/* Privacy Footer - Fixed bottom, unobtrusive */}
                <div className="fixed bottom-2 w-full text-center text-[10px] text-white/20 pointer-events-none z-50">
                    Anonymous usage tracked for improvement. No personal data collected.
                </div>
            </div>
        </TrackingProvider>
    );
}

export default App;
