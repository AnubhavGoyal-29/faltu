import { getAnonymousUserId } from './userId.js';

const API_BASE = '/api/activities';

// Get next activity from backend
export async function getNextActivity() {
  const anonymousUserId = getAnonymousUserId();
  
  try {
    const response = await fetch(`${API_BASE}/next?anonymous_user_id=${anonymousUserId}`);
    
    if (!response.ok) {
      throw new Error('Failed to get next activity');
    }

    return await response.json();
  } catch (error) {
    console.error('Get next activity error:', error);
    return null;
  }
}

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
    return null;
  }
}

// Reset all activities for user (restart)
export async function resetActivities() {
  const anonymousUserId = getAnonymousUserId();
  
  try {
    const response = await fetch(`${API_BASE}/reset?anonymous_user_id=${anonymousUserId}`, {
      method: 'DELETE'
    });

    if (!response.ok) {
      throw new Error('Failed to reset activities');
    }

    return await response.json();
  } catch (error) {
    console.error('Reset activities error:', error);
    return null;
  }
}

