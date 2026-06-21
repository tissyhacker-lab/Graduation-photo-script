/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        paper: '#f3f8f7',
        ink: '#102a2e',
        muted: '#5d7378',
        line: '#c9dde0',
        sage: '#7fb6a8',
        clay: '#4a9ed8',
        film: '#173d45',
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        serif: ['Cormorant Garamond', 'Georgia', 'serif'],
      },
      boxShadow: {
        soft: '0 18px 48px rgba(16, 42, 46, 0.08)',
      },
    },
  },
  plugins: [],
};
