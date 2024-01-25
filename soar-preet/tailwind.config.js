module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        darkGrey: '#24272B',
        lightBlue: '#2D3347',
        grey: '#E3E3E3',
        high: '#EC726E',
        medium: '#68C2DF',
        low: '#F0B05D',
        log: '#07A13B'
      }
    },
    screens: {
      '3xl': '3000px',

      '2xl': { max: '3840px' },
      // => @media (max-width: 1535px) { ... }
      xl: { max: '1722px' },
      // => @media (max-width: 1279px) { ... }
      lg: { max: '1023px' },
      // => @media (max-width: 1023px) { ... }
      md: { max: '767px' },
      // => @media (max-width: 767px) { ... }
      sm: { max: '639px' }
      // => @media (max-width: 639px) { ... }
    }
  },
  plugins: []
}