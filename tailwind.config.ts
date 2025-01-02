import type { Config } from "tailwindcss";

export default {
  content: ["./app/**/{**,.client,.server}/**/*.{js,jsx,ts,tsx}"],
  darkMode: 'class',
  theme: {
    container: {
      center: true,
      padding: '1rem', // adds padding around the container
      screens: {
        sm: '640px',
        md: '768px',
        lg: '1024px',
        xl: '1280px',
        '2xl': '1536px'
      },
    },
    extend: {
      colors: {
        // theme: '#4356A2',
        // theme: '#079946',
        theme: '#07642E',
        theme1: '#bad7c7',
        sectheme: '#ed7733',
        formbg: '#5e6466'
      },
      fontFamily: {
        sans: [
          '"Solway"',
          "ui-sans-serif",
          "system-ui",
          "sans-serif",
          '"Apple Color Emoji"',
          '"Segoe UI Emoji"',
          '"Segoe UI Symbol"',
          '"Noto Color Emoji"',
        ],
      },
      keyframes: {
        modalIn: {
          '0%': { transform: 'translateY(-300px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        shake: {
          '0%': { transform: 'rotate(90deg)' },
          '25%': { transform: 'rotate(85deg)' },
          '50%': { transform: 'rotate(95deg)' },
          '75%': { transform: 'rotate(85deg)' },
          '100%': { transform: 'rotate(90deg)' },
        },
        shake1: {
          '0%': { transform: 'rotate(0deg)' },
          '25%': { transform: 'rotate(-5deg)' },
          '50%': { transform: 'rotate(5deg)' },
          '75%': { transform: 'rotate(-5deg)' },
          '100%': { transform: 'rotate(0deg)' },
        },
        zoomInOut: {
          '0%, 100%': {
            transform: 'scale(1)', // Original size
          },
          '50%': {
            transform: 'scale(1.1)', // Zoom in effect
          },
        },
        rotateBorder: {
          '0%': {
            transform: 'rotate(0deg)',
            borderColor: '#2953F9', // Blue color at the start
          },
          '100%': {
            transform: 'rotate(360deg)',
            borderColor: '#2953F9', // Blue color at the end
          },
        },
      },
      animation: {
        modalIn: 'modalIn 0.5s ease-out',
        'shake': 'shake 0.5s ease-in-out infinite',
        'shake1': 'shake1 0.5s ease-in-out infinite',
        'zoom-in-out': 'zoomInOut 2s ease-in-out infinite',
        'rotate-border': 'rotateBorder 2s linear infinite',
      },
    },
  },
  plugins: [],
} satisfies Config;
