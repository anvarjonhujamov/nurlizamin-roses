/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,ts,jsx,tsx}', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        nursery: {
          50: '#f4f7f2',
          100: '#e8efe3',
          200: '#d0dfc6',
          300: '#a8c497',
          400: '#7da66a',
          500: '#5a8648',
          600: '#3d6b3d',
          700: '#2f552f',
          800: '#274427',
          900: '#1f381f',
        },
        cream: {
          50: '#fdfcf9',
          100: '#f9f6f0',
          200: '#f3ede3',
        },
        rose: {
          50: '#fff1f5',
          100: '#ffe4ed',
          200: '#fec7d8',
          300: '#fea3bf',
          400: '#fd6e96',
          500: '#f43f6b',
          600: '#e11a4a',
          700: '#be123c',
          800: '#9f1235',
          900: '#881337',
        },
      },
      fontFamily: {
        display: ['var(--font-playfair)', 'Georgia', 'serif'],
        sans: ['var(--font-source)', 'system-ui', 'sans-serif'],
        rose: ['var(--font-rose)', 'Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
