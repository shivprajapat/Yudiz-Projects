import React from 'react'
import PropTypes from 'prop-types'
import { useId } from 'react'

const Search = ({ onChange, errorMessage, id, className, startIcon, ...props }) => {
  const RandomId = useId()

  return (
    <>
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
          type="search"
          {...props}
        />
      </div>
    </>
  )
}

Search.propTypes = {
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

export default Search
