/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    container: {
      center: true,
      padding: '16px',
      screens: {
        xl: '1280px',
      },
    },
    extend: {
      colors: {
        primary: '#9F5C15',
        success: '#609966',
        white: '#FFFFFF',
        error: '#DE634C',
        grey: {
          100: '#FAFAFA',
          200: '#EBEBEA',
          300: '#DAD9D8',
          400: '#CAC9C8',
          500: '#AFADAC',
          600: '#918F8D',
          700: '#7D7A78',
          800: '#53514F',
          900: '#323130',
        },
        secondary: {
          100: '#704E2A',
          200: '#E59238',
          300: '#C8AA5D',
          400: '#F8E099',
          500: '#FBE6D7',
          600: '#FEFAF6',
          700: '#4A5259',
          800: '#2C3135',
          900: '#C27F33',
        },
        custom: {
          black: '#2A2A27',
          black1: '#5A5853',
          black2: '#42413D',
          black3: '#75726C',
          black4: '#2b31358f',
          grey1: '#BFBEBA',
          grey2: '#F5F5F4',
          grey3: '#ffffff80',
          grey4: '#d0d4d8',
          red: '#E65B56',
        },
      },
      keyframes: {
        fadeInUp: {
          '0%': {
            opacity: '0',
            visibility: 'hidden',
            transform: 'translate3d(0,50%,0)',
          },
          '100%': {
            opacity: '1',
            visibility: 'visible',
            transform: 'translateZ(0)',
          },
        },
        fadeOutUp: {
          '0%': {
            opacity: '1',
            visibility: 'visible',
            transform: 'translateZ(0)',
          },
          '100%': {
            opacity: '0',
            visibility: 'hidden',
            transform: 'translate3d(0,-50%,0)',
          },
        },
        fadeIn: {
          '0%': {
            opacity: '0',
            visibility: 'hidden',
          },
          '100%': {
            opacity: '1',
            visibility: 'visible',
          },
        },
        fadeOut: {
          '0%': {
            opacity: '1',
            visibility: 'visible',
          },
          '100%': {
            opacity: '0',
            visibility: 'hidden',
          },
        },
        expandHeightUp: {
          '0%': {
            top: '100%',
          },
          '100%': { top: 0 },
        },
        collapseHeightDown: {
          '0%': {
            top: 0,
            bottom: 0,
          },
          '100%': {
            bottom: '100%',
            top: 0,
          },
        },
      },
      animation: {
        fadeInUp: 'fadeInUp 1s ease-in-out',
        fadeOutUp: 'fadeOutUp 1s ease-in-out',
        fadeIn: 'fadeIn 1s ease-in-out',
        fadeOut: 'fadeOut 1s ease-in-out',
      },
      transitionDelay: {
        1500: '1500ms',
        2000: '2000ms',
        2500: '2500ms',
      },
      fontFamily: {
        arimo: ['Arimo', 'sans-serif'],
        jost: ['Jost', 'sans-serif'],
        josefinSans: ['Josefin Sans', 'sans-serif'],
        playfairDisplay: ['Playfair Display', 'sans-serif'],
      },
      dropShadow: {
        '3xl': ' 0px 12px 30px rgba(218, 217, 216, 0.25)',
      },
      screens: {
        xs: '375px',
        '3xl': '1920px',
      },
    },
  },
}
