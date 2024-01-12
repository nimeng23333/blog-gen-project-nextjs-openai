/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    // Or if using `src` directory:
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend:{
      fontFamily:{
        heading:"var(--font-dm-serif)",
        body:"var(--font-dm-sans)",
      },

      animation: {
        'ripple': 'ripple 0.5s ease-out',
        'loading':'loading 1s infinite',
        'hero': 'hero 20s cubic-bezier(.68,-0.55,.26,1.55) infinite',
        'blur': 'blur 5s ease-in-out infinite'
      },

      keyframes: {
        ripple: {
          '0%': { transform: 'translate(-50%,-50%) scale(0)',opacity:'1' },
          '100%': {transform: 'translate(-50%,-50%) scale(5)',opacity:'0' },
        },

        loading:{
          '0%, 100%': {
            transform: 'translateY(0)',
            'animation-timing-function': 'cubic-bezier(0.8, 0, 1, 1)'
          },
          '50%': {
            transform: 'translateY(25%)',
            'animation-timing-function': 'cubic-bezier(0, 0, 0.2, 1)'
          }
        },

        hero:{
          '0%,100%':{
            transform: 'translate(0)',

          },
          '50%':{
            transform:'translate(1%,-1%)',

          },
        },
        blur:{
          '0%, 100%': {
            filter: 'blur(4px)',
          },
          '50%': {
            filter: 'blur(0)',
          }
        }
      }
    },
  },
  plugins: [],
};
