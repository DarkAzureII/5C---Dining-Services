/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        'Wits-DH' : "url('/Wits-DH.jpg')",
        'wits-logo' : "url('/wits-logo.png')" 
      }
    },
  },
  plugins: [],
}
