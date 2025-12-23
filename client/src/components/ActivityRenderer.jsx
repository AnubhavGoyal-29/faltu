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
      
      {/* Action Buttons - Always visible, Next button disabled until activity completes */}
      <div className="absolute bottom-20 left-0 right-0 flex justify-center items-center gap-4 z-20 px-4">
        {/* Replay Button - Always enabled */}
        {onReplay && (
          <button
            onClick={onReplay}
            className="px-6 py-3 bg-white/10 backdrop-blur-lg text-white rounded-full font-semibold hover:bg-white/20 transition-all flex items-center gap-2 border border-white/20"
            title="Replay this activity"
          >
            <span>↺</span>
            <span>Replay</span>
          </button>
        )}
        
        {/* Next Button - Always visible, disabled until activity completes */}
        {onNext && (
          <button
            onClick={onNext}
            disabled={!isCompleted}
            className={`px-8 py-3 rounded-full font-bold flex items-center gap-2 shadow-lg transition-all ${
              isCompleted
                ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700 cursor-pointer'
                : 'bg-gray-600/50 text-white/50 cursor-not-allowed opacity-50'
            }`}
            title={isCompleted ? "Next activity" : "Complete the activity first"}
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

