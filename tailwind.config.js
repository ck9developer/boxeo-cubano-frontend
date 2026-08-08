/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,ts}'],
  theme: {
    extend: {
      colors: {
        brand: {
          red: '#dc2626',
          'red-dark': '#b91c1c',
          black: '#171717',
        },
      },
    },
  },
  plugins: [],
}

