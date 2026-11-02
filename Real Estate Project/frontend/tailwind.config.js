/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#56B4E9',
        secondary: '#161A29',
        lightBg: '#F8F9FA',
        subBg: '#F5F5F7',
        primaryText: '#111111',
        secondaryText: '#666666'
      },
      fontFamily: {
        sans: ['Space Grotesk', 'sans-serif']
      }
    },
  },
  plugins: [],
}
