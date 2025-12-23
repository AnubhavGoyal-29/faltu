/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'faltu-purple': '#8B5CF6',
        'faltu-pink': '#EC4899',
      }
    },
  },
  plugins: [],
}

