/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        neonPurple: '#9D4EDD',
        neonBlue: '#3BE8B0',
      },
      boxShadow: {
        neon: '0 0 20px #9D4EDD, 0 0 40px #3BE8B0',
      },
    },
  },
  plugins: [],
}
