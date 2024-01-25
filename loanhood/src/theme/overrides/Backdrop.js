import { hexToRGB } from 'theme/palette'

// ----------------------------------------------------------------------

export default function Backdrop(theme) {
  const varLow = hexToRGB(theme.palette.grey[900], 0.48)
  const varHigh = hexToRGB(theme.palette.grey[900], 1)

  return {
    MuiBackdrop: {
      root: {
        background: [
          'rgb(22,28,36)',
          `-moz-linear-gradient(75deg, ${varLow} 0%, ${varHigh} 100%)`,
          `-webkit-linear-gradient(75deg, ${varLow} 0%, ${varHigh} 100%)`,
          `linear-gradient(75deg, ${varLow} 0%, ${varHigh} 100%)`
        ],
        '&.MuiBackdrop-invisible': {
          background: 'transparent'
        }
      }
    }
  }
}
