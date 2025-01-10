/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      animation: {
        wobble: 'wobble 1s ease-in-out infinite',
      },
      keyframes: {
        wobble: {
          '0%': { transform: 'rotate(-5deg)' },
          '15%': { transform: 'rotate(5deg)' },
          '30%': { transform: 'rotate(-5deg)' },
          '45%': { transform: 'rotate(5deg)' },
          '60%': { transform: 'rotate(-5deg)' },
          '75%': { transform: 'rotate(5deg)' },
          '100%': { transform: 'rotate(0)' },
        },
      },
    },
  },
  plugins: [],
}

