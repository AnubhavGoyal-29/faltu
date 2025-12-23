import { getAnonymousUserId } from './userId.js';

const API_BASE = '/api/activities';

// Track activity completion or skip
export async function trackActivity(activityId, status) {
  const anonymousUserId = getAnonymousUserId();
  
  try {
    const response = await fetch(`${API_BASE}/track`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        anonymous_user_id: anonymousUserId,
        activity_id: activityId,
        status: status // 'completed' or 'skipped'
      })
    });

    if (!response.ok) {
      throw new Error('Failed to track activity');
    }

    return await response.json();
  } catch (error) {
    console.error('Activity tracking error:', error);
    // Don't break the app if tracking fails
    return null;
  }
}

// Get user's completed/skipped activities
export async function getUserActivities() {
  const anonymousUserId = getAnonymousUserId();
  
  try {
    const response = await fetch(`${API_BASE}/user/${anonymousUserId}`);
    
    if (!response.ok) {
      throw new Error('Failed to get user activities');
    }

    const data = await response.json();
    return data.activities || [];
  } catch (error) {
    console.error('Get user activities error:', error);
    return [];
  }
}

// Get completed activity IDs
export async function getCompletedActivityIds() {
  const activities = await getUserActivities();
  return activities
    .filter(a => a.status === 'completed')
    .map(a => a.activity_id);
}

// Get skipped activity IDs
export async function getSkippedActivityIds() {
  const activities = await getUserActivities();
  return activities
    .filter(a => a.status === 'skipped')
    .map(a => a.activity_id);
}

// Get all done activity IDs (completed + skipped)
export async function getDoneActivityIds() {
  const activities = await getUserActivities();
  return activities.map(a => a.activity_id);
}

