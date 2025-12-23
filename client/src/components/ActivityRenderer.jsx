import React from 'react';
import { ACTIVITY_COMPONENTS } from '../activities/registry.js';

function ActivityRenderer({ activity, onComplete, onSkip }) {
  const ActivityComponent = ACTIVITY_COMPONENTS[activity.type];
  
  if (!ActivityComponent) {
    return (
      <div className="h-full w-full flex items-center justify-center">
        <div className="text-white">Unknown activity type: {activity.type}</div>
      </div>
    );
  }

  return (
    <ActivityComponent
      activity={activity}
      onComplete={onComplete}
      onSkip={onSkip}
    />
  );
}

export default ActivityRenderer;

