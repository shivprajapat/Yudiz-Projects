import React from 'react'
import PropTypes from 'prop-types'
const HEIGHT_RATIO_PERC = 0.8452
const IconHeart = ({ size, className, filled }) => {
  return (
    <svg
      width={size}
      height={size * HEIGHT_RATIO_PERC}
      viewBox="0 0 16.59 14.02"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      fill={filled ? 'currentColor' : 'none'}
      stroke={filled ? 'none' : 'currentColor'}
    >
      <path d="M4.95.75a4.16 4.16 0 0 1 3.42 1.79c.16-.22.33-.42.52-.6A4.01 4.01 0 0 1 11.64.74c2.33 0 4.2 1.87 4.2 4.2 0 1.01-.16 2.57-1.56 3.97-.94 1-3.53 2.8-4.8 3.68l-.72.52c-.15.07-.31.15-.47.15-.15 0-.3-.08-.46-.15l-.81-.6c-1.3-.92-3.8-2.68-4.71-3.6A5.32 5.32 0 0 1 .75 4.95c0-2.33 1.94-4.2 4.2-4.2Z" />
    </svg>
  )
}

export default IconHeart
IconHeart.propTypes = {
  className: PropTypes.string,
  size: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  filled: PropTypes.bool,
}
IconHeart.defaultProps = {
  className: '',
  size: '18',
  filled: false,
}
