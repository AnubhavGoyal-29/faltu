/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      animation: {
        'shake': 'shake 0.5s ease-in-out infinite',
        'rotate-quick': 'rotate-quick 0.3s ease-in-out',
        'move-random': 'move-random 2s ease-in-out infinite',
        'disco': 'disco 1s linear infinite',
        'bounce-silly': 'bounce-silly 1s ease-in-out infinite',
        'float': 'float 3s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite',
        'wiggle': 'wiggle 0.5s ease-in-out infinite',
        'spin-slow': 'spin 3s linear infinite',
        'pulse-crazy': 'pulse-crazy 1s ease-in-out infinite',
      },
      keyframes: {
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '25%': { transform: 'translateX(-10px) rotate(-5deg)' },
          '75%': { transform: 'translateX(10px) rotate(5deg)' },
        },
        'rotate-quick': {
          '0%': { transform: 'rotate(0deg)' },
          '50%': { transform: 'rotate(180deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        'move-random': {
          '0%, 100%': { transform: 'translate(0, 0) rotate(0deg)' },
          '25%': { transform: 'translate(10px, -10px) rotate(5deg)' },
          '50%': { transform: 'translate(-10px, 10px) rotate(-5deg)' },
          '75%': { transform: 'translate(5px, 5px) rotate(3deg)' },
        },
        disco: {
          '0%': { filter: 'hue-rotate(0deg) brightness(1)' },
          '25%': { filter: 'hue-rotate(90deg) brightness(1.2)' },
          '50%': { filter: 'hue-rotate(180deg) brightness(1)' },
          '75%': { filter: 'hue-rotate(270deg) brightness(1.2)' },
          '100%': { filter: 'hue-rotate(360deg) brightness(1)' },
        },
        'bounce-silly': {
          '0%, 100%': { transform: 'translateY(0) scale(1)' },
          '25%': { transform: 'translateY(-20px) scale(1.1) rotate(5deg)' },
          '50%': { transform: 'translateY(0) scale(0.9) rotate(-5deg)' },
          '75%': { transform: 'translateY(-10px) scale(1.05) rotate(3deg)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        glow: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(255, 0, 0, 0.5)' },
          '50%': { boxShadow: '0 0 40px rgba(0, 255, 0, 0.8), 0 0 60px rgba(0, 0, 255, 0.6)' },
        },
        wiggle: {
          '0%, 100%': { transform: 'rotate(-3deg)' },
          '50%': { transform: 'rotate(3deg)' },
        },
        'pulse-crazy': {
          '0%, 100%': { transform: 'scale(1)', opacity: '1' },
          '50%': { transform: 'scale(1.2)', opacity: '0.8' },
        },
      },
    },
  },
  plugins: [],
}

