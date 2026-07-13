/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        gold: '#FFD700',
        'gold-dark': '#B8860B',
        'gold-light': '#FFF44F',
        dark: {
          50: '#1a1a1a',
          100: '#151515',
          200: '#111111',
          300: '#0d0d0d',
          400: '#0a0a0a',
          500: '#080808',
          600: '#050505',
          700: '#030303',
          800: '#000000',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'float': 'float 3s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        glow: {
          '0%': { boxShadow: '0 0 5px rgba(255,215,0,0.2), 0 0 10px rgba(255,215,0,0.2)' },
          '100%': { boxShadow: '0 0 10px rgba(255,215,0,0.4), 0 0 20px rgba(255,215,0,0.4), 0 0 40px rgba(255,215,0,0.2)' },
        }
      }
    },
  },
  plugins: [],
}
