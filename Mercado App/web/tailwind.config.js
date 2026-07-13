/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#ffe6e5',
          100: '#fecbc9',
          200: '#fda19d',
          300: '#fd7d78',
          400: '#fc544d',
          500: '#fb2e26',
          600: '#d52720',
          700: '#ab1f1a',
          800: '#7e1713',
          900: '#4b0e0b',
        },
      },
      animation: {
        'slide': 'slide 16s infinite',
        'fade': 'fade 1s ease-in-out',
      },
      keyframes: {
        slide: {
          '0%, 100%': { transform: 'translateX(0)' },
          '25%': { transform: 'translateX(-100%)' },
          '50%': { transform: 'translateX(-200%)' },
          '75%': { transform: 'translateX(-300%)' },
        },
        fade: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
    },
  },
  plugins: [],
};
