import React from 'react'
import PropTypes from 'prop-types'

const Radio = ({ title, className }) => {
  const defaultClass = 'radio text-grey-700 text-sm font-medium mb-0 pl-6'
  return (
    <label className={`${defaultClass} ${className}`} htmlFor={title}>
      {title}
      <input type="radio" name="radio" id={title} />
      <span className="checkmark w-4 h-4 rounded-full absolute top-0 left-0" />
    </label>
  )
}

export default Radio
Radio.propTypes = {
  title: PropTypes.string,
  className: PropTypes.string,
}
