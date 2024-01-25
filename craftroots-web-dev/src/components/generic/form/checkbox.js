import React from 'react'
import PropTypes from 'prop-types'

const Checkbox = ({
  className,
  title,
  value,
  checked,
  mainCat,
  onCheckHandler,
  isMobile,
}) => {
  return (
    <label className={`checkbox ${className}`}>
      {title}
      <input
        type="checkbox"
        value={value}
        checked={checked}
        onChange={(e) =>
          onCheckHandler(e.target.checked, mainCat, value, isMobile)
        }
      />
      <span className="checkmark w-5 h-5 rounded-[5px] absolute top-0 left-0" />
    </label>
  )
}

export default Checkbox
Checkbox.propTypes = {
  className: PropTypes.string,
  title: PropTypes.string.isRequired,
  value: PropTypes.string,
  checked: PropTypes.bool.isRequired,
  mainCat: PropTypes.string,
  onCheckHandler: PropTypes.func,
  isMobile: PropTypes.func,
  isMobile: PropTypes.bool,
}

Checkbox.defaultProps = {
  className: '',
  isMobile: false,
  mainCat: '',
}
