/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#0077B6',
        safe: '#00E400',
        caution: '#FFFF00',
        danger: '#FF0000',
        warning: '#FF7E00',
      },
    },
  },
  plugins: [],
}
