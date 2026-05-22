/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        bg: { light: '#ffffff', dark: '#0b0d10' },
        panel: { light: '#f5f6f8', dark: '#13161b' },
        border: { light: '#e4e6eb', dark: '#262a31' },
      },
    },
  },
  plugins: [],
};
