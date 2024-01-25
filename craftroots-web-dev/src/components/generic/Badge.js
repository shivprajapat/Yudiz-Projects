import React from 'react'
import PropTypes from 'prop-types'

const Badge = ({ title, className }) => {
  return (
    <span
      className={`${className} font-medium rounded-[4px] text-xs sm:text-sm text-custom-grey2 py-1 px-2 capitalize`}
    >
      {title}
    </span>
  )
}

export default Badge
Badge.propTypes = {
  title: PropTypes.string,
  className: PropTypes.string,
}
