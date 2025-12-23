import React from 'react';
import { ACTIVITY_COMPONENTS } from '../activities/registry.js';

function ActivityRenderer({ activity, onComplete, onSkip, onReplay, replayKey }) {
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
        key={replayKey}
        activity={activity}
        onComplete={onComplete}
        onSkip={onSkip}
      />
      
      {/* Replay Button */}
      {onReplay && (
        <div className="absolute bottom-20 left-0 right-0 flex justify-center z-20 px-4">
          <button
            onClick={onReplay}
            className="px-6 py-3 bg-white/10 backdrop-blur-lg text-white rounded-full font-semibold hover:bg-white/20 transition-all flex items-center gap-2 border border-white/20"
            title="Replay this activity"
          >
            <span>↺</span>
            <span>Replay</span>
          </button>
        </div>
      )}
    </div>
  );
}

export default ActivityRenderer;

