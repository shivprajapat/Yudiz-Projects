import React from 'react'
import PropTypes from 'prop-types'
const HEIGHT_RATIO_PERC = 0.8452
function InstagramIcon({ size, className, filled }) {
  const svgSize = {
    width: size,
    height: size * HEIGHT_RATIO_PERC,
  }

  const iconStyles = {
    fill: filled ? 'currentColor' : 'none',
    stroke: filled ? 'none' : 'currentColor',
    strokeWidth: '2',
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
  }

  return (
    <svg
      viewBox="0 0 32 32"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={iconStyles}
      {...svgSize}
    >
      <path d="M5.33 10.67a5.33 5.33 0 0 1 5.34-5.34h10.66a5.33 5.33 0 0 1 5.34 5.34v10.66a5.33 5.33 0 0 1-5.34 5.34H10.67a5.33 5.33 0 0 1-5.34-5.34V10.67Z" />
      <path d="M12 16a4 4 0 1 0 8 0 4 4 0 0 0-8 0ZM22 10v.01" />
    </svg>
  )
}

export default InstagramIcon
InstagramIcon.propTypes = {
  className: PropTypes.string,
  size: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  filled: PropTypes.bool,
}
InstagramIcon.defaultProps = {
  className: '',
  size: '18',
  filled: false,
}
