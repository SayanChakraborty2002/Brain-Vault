/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors:{
        blue:{
          800:"#5048dc",
          300:"#e1e7fd",
          600:"#4138c2",
          700:"#6760d2"
        }
      }
    },
  },
  plugins: [],
}

