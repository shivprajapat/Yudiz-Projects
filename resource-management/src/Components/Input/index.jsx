import React from 'react'
import PropTypes from 'prop-types'
import { useId } from 'react'

const Input = ({ type, labelText, onChange, errorMessage, id, disableError, className, startIcon, ...props }) => {
  const RandomId = useId()

  return (
    <>
      {!disableError ? (
        <div className="d-flex input">
          {labelText && <label htmlFor={id || RandomId}>{labelText}</label>}
          {startIcon && (
            <label htmlFor={id || RandomId} className="set_input_icon">
              {startIcon}
            </label>
          )}
          <input
            onChange={onChange}
            id={id || RandomId}
            className={`${className} ${!!errorMessage && 'errorInput'} ${startIcon && 'ps-5'}`}
            {...props}
            type={type}
          />
          {!disableError && <p className="errorMessage">{errorMessage}</p>}
        </div>
      ) : (
        <div className="d-flex input">
          {startIcon && (
            <label htmlFor={id || RandomId} className="set_input_icon">
              {startIcon}
            </label>
          )}
          <input
            onChange={onChange}
            id={id || RandomId}
            className={`${className} ${!!errorMessage && 'errorInput'} ${startIcon && 'ps-5'}`}
            {...props}
            type={type}
          />
        </div>
      )}
    </>
  )
}

Input.propTypes = {
  id: PropTypes.string,
  labelText: PropTypes.string,
  className: PropTypes.string,
  type: PropTypes.string,
  name: PropTypes.string,
  errorMessage: PropTypes.string,
  onChange: PropTypes.func,
  disableError: PropTypes.bool,
  startIcon: PropTypes.any,
}

export default Input
