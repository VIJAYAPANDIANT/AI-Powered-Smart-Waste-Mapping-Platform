/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        dark: {
          bg: '#030712',      // Deep space black
          card: 'rgba(17, 24, 39, 0.7)', // Semi-transparent grey
          border: 'rgba(255, 255, 255, 0.08)'
        },
        neon: {
          blue: '#00f0ff',
          teal: '#00f5d4',
          pink: '#ff007f',
          purple: '#bd00ff'
        }
      },
      boxShadow: {
        'neon-blue': '0 0 15px rgba(0, 240, 255, 0.3)',
        'neon-glow': '0 0 25px rgba(0, 240, 255, 0.5)',
      }
    },
  },
  plugins: [],
}
