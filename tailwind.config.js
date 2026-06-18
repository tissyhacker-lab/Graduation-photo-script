/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        paper: '#f7f3ec',
        ink: '#1d1b18',
        muted: '#766f66',
        line: '#ddd4c7',
        sage: '#9aa18c',
        clay: '#b78d78',
        film: '#2d2a26',
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        serif: ['Cormorant Garamond', 'Georgia', 'serif'],
      },
      boxShadow: {
        soft: '0 18px 48px rgba(45, 42, 38, 0.08)',
      },
    },
  },
  plugins: [],
};
