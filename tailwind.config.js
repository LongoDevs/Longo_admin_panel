/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#FFD700',
        brand: {
          yellow: '#FFD700',
        }
      }
    },
  },
  plugins: [],
};