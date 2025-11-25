// Different chaos animation types
const CHAOS_ANIMATION_TYPES = {
  RAINBOW_WAVE: 'rainbow_wave',
  SHAKE_INTENSE: 'shake_intense',
  SPIN_CHAOS: 'spin_chaos',
  COLOR_INVERT: 'color_invert',
  ZOOM_IN_OUT: 'zoom_in_out',
  ROTATE_360: 'rotate_360',
  BLUR_EFFECT: 'blur_effect',
  GLITCH: 'glitch',
  PARTICLE_EXPLOSION: 'particle_explosion',
  SCREEN_FLIP: 'screen_flip'
};

// Get random chaos animation
const getRandomChaosAnimation = () => {
  const types = Object.values(CHAOS_ANIMATION_TYPES);
  return types[Math.floor(Math.random() * types.length)];
};

// Get chaos animation config
const getChaosAnimationConfig = (type) => {
  const configs = {
    [CHAOS_ANIMATION_TYPES.RAINBOW_WAVE]: {
      duration: 3000,
      intensity: 'high',
      cssClass: 'chaos-rainbow-wave',
      description: 'Rainbow wave across screen'
    },
    [CHAOS_ANIMATION_TYPES.SHAKE_INTENSE]: {
      duration: 2000,
      intensity: 'very-high',
      cssClass: 'chaos-shake-intense',
      description: 'Intense shaking'
    },
    [CHAOS_ANIMATION_TYPES.SPIN_CHAOS]: {
      duration: 2500,
      intensity: 'high',
      cssClass: 'chaos-spin-chaos',
      description: 'Everything spins'
    },
    [CHAOS_ANIMATION_TYPES.COLOR_INVERT]: {
      duration: 2000,
      intensity: 'medium',
      cssClass: 'chaos-color-invert',
      description: 'Colors invert'
    },
    [CHAOS_ANIMATION_TYPES.ZOOM_IN_OUT]: {
      duration: 3000,
      intensity: 'medium',
      cssClass: 'chaos-zoom',
      description: 'Zoom in and out'
    },
    [CHAOS_ANIMATION_TYPES.ROTATE_360]: {
      duration: 2000,
      intensity: 'high',
      cssClass: 'chaos-rotate-360',
      description: '360 degree rotation'
    },
    [CHAOS_ANIMATION_TYPES.BLUR_EFFECT]: {
      duration: 2500,
      intensity: 'low',
      cssClass: 'chaos-blur',
      description: 'Blur effect'
    },
    [CHAOS_ANIMATION_TYPES.GLITCH]: {
      duration: 2000,
      intensity: 'high',
      cssClass: 'chaos-glitch',
      description: 'Glitch effect'
    },
    [CHAOS_ANIMATION_TYPES.PARTICLE_EXPLOSION]: {
      duration: 3000,
      intensity: 'very-high',
      cssClass: 'chaos-particles',
      description: 'Particle explosion'
    },
    [CHAOS_ANIMATION_TYPES.SCREEN_FLIP]: {
      duration: 2000,
      intensity: 'medium',
      cssClass: 'chaos-flip',
      description: 'Screen flips'
    }
  };

  return configs[type] || configs[CHAOS_ANIMATION_TYPES.SHAKE_INTENSE];
};

module.exports = {
  CHAOS_ANIMATION_TYPES,
  getRandomChaosAnimation,
  getChaosAnimationConfig
};

