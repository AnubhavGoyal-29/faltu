import React from 'react';
import { ACTIVITY_COMPONENTS } from '../activities/registry.js';

function ActivityRenderer({ activity, onComplete, onSkip, onReplay, onNext, replayKey, isCompleted }) {
  const ActivityComponent = ACTIVITY_COMPONENTS[activity.type];
  
  if (!ActivityComponent) {
    return (
      <div className="h-full w-full flex items-center justify-center">
        <div className="text-white">Unknown activity type: {activity.type}</div>
      </div>
    );
  }

  return (
    <div className="h-full w-full relative">
      <ActivityComponent
        key={`${activity.id}-${replayKey}`}
        activity={activity}
        onComplete={onComplete}
        onSkip={onSkip}
      />
      
      {/* Action Buttons */}
      <div className="absolute bottom-20 left-0 right-0 flex justify-center gap-4 z-20 px-4">
        {/* Replay Button - Always visible */}
        {onReplay && !isCompleted && (
          <button
            onClick={onReplay}
            className="px-6 py-3 bg-white/10 backdrop-blur-lg text-white rounded-full font-semibold hover:bg-white/20 transition-all flex items-center gap-2 border border-white/20"
            title="Replay this activity"
          >
            <span>↺</span>
            <span>Replay</span>
          </button>
        )}
        
        {/* Next Button - Show when activity is completed */}
        {isCompleted && onNext && (
          <button
            onClick={onNext}
            className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full font-bold hover:from-purple-700 hover:to-pink-700 transition-all flex items-center gap-2 shadow-lg"
            title="Next activity"
          >
            <span>Next</span>
            <span>→</span>
          </button>
        )}
      </div>
    </div>
  );
}

export default ActivityRenderer;

