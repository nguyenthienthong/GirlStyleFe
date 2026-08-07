/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          red: '#C21A27',
          redHover: '#a5131f',
          beige: '#EDE8E2',
          black: '#000000',
          white: '#ffffff',
        },
        fashion: {
          primary: '#C21A27',
          primaryHover: '#a5131f',
          dark: '#000000',
          beige: '#EDE8E2',
          white: '#ffffff'
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
