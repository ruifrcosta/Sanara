/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#006397',
          dark: '#005483',
          light: '#0077B5',
        },
        secondary: {
          DEFAULT: '#42474E',
          dark: '#2D3238',
          light: '#5C6269',
        },
        surface: {
          DEFAULT: '#FFFFFF',
          variant: '#F1F4F9',
        },
        text: {
          primary: '#42474E',
          secondary: '#6C7278',
          tertiary: '#9AA0A6',
        },
        border: {
          DEFAULT: '#E1E4E8',
          color: '#D1D5DB',
        },
      },
      fontFamily: {
        archivo: ['Archivo', 'sans-serif'],
        figtree: ['Figtree', 'sans-serif'],
        roboto: ['Roboto', 'sans-serif'],
      },
      spacing: {
        18: '4.5rem',
        112: '28rem',
        120: '30rem',
      },
      maxWidth: {
        '8xl': '88rem',
        '9xl': '96rem',
      },
      borderRadius: {
        '4xl': '2rem',
      },
      boxShadow: {
        'custom-sm': '0 1px 2px rgba(0, 0, 0, 0.05)',
        'custom-md': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'custom-lg': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      },
    },
  },
  plugins: [require('@tailwindcss/forms')],
} 