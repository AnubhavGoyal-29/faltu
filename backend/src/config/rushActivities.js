/**
 * Rush Activities Configuration
 * 
 * All activities that are part of the Rush system.
 * These activities will be shown to users one at a time,
 * prioritizing unvisited and least frequently visited activities.
 */

const RUSH_ACTIVITIES = {
  // Daily activities (reset at midnight)
  bakchodi: {
    type: 'bakchodi',
    name: 'Daily Bakchodi Challenge',
    route: '/games/bakchodi',
    category: 'daily',
    description: 'Daily random challenge prompt'
  },
  wordle: {
    type: 'wordle',
    name: 'Wordle Game',
    route: '/wordle',
    category: 'daily',
    description: 'Daily 5-letter word challenge'
  },
  
  // Repeatable activities (can be done multiple times)
  debate: {
    type: 'debate',
    name: 'Random Argument Generator',
    route: '/games/debate',
    category: 'repeatable',
    description: 'Get random absurd debate topic'
  },
  meme: {
    type: 'meme',
    name: 'Instant Meme Battle',
    route: '/games/meme',
    category: 'repeatable',
    description: 'Create memes and get AI scores'
  },
  wheel: {
    type: 'wheel',
    name: 'Lucky Nonsense Wheel',
    route: '/games/wheel',
    category: 'repeatable',
    description: 'Spin the wheel for random rewards'
  },
  future: {
    type: 'future',
    name: 'AI Predicts Your Future',
    route: '/games/future',
    category: 'repeatable',
    description: 'Get funny future predictions'
  },
  tap: {
    type: 'tap',
    name: '5-Second Tap Game',
    route: '/games/tap',
    category: 'repeatable',
    description: 'Tap as fast as possible'
  },
  runaway: {
    type: 'runaway',
    name: 'Button That Runs Away',
    route: '/games/runaway',
    category: 'repeatable',
    description: 'Try to click the running button'
  },
  dare: {
    type: 'dare',
    name: 'Dare Machine',
    route: '/games/dare',
    category: 'repeatable',
    description: 'Get AI-generated funny dares'
  },
  roast: {
    type: 'roast',
    name: 'Roast Me',
    route: '/games/roast',
    category: 'repeatable',
    description: 'Get AI-generated funny roasts'
  }
};

// Get all rush activity types
const getRushActivityTypes = () => {
  return Object.keys(RUSH_ACTIVITIES);
};

// Get activity config by type
const getActivityConfig = (activityType) => {
  return RUSH_ACTIVITIES[activityType] || null;
};

// Get all activities
const getAllActivities = () => {
  return Object.values(RUSH_ACTIVITIES);
};

// Check if activity is daily
const isDailyActivity = (activityType) => {
  const config = getActivityConfig(activityType);
  return config && config.category === 'daily';
};

module.exports = {
  RUSH_ACTIVITIES,
  getRushActivityTypes,
  getActivityConfig,
  getAllActivities,
  isDailyActivity
};

