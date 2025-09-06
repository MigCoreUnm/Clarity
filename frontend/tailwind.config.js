/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // Add your custom font family here
      fontFamily: {
        bergesss: ['"bergesss"', 'sans-serif'], // Add 'bergesss'
      },
      // Add your custom color here
      colors: {
        'brand-blue': '#221de4', // Add your main color
      },
    },
  },
  plugins: [],
}