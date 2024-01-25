import React from 'react'
import PropTypes from 'prop-types'
import { Spinner } from 'react-bootstrap'

const Button = ({ fullWidth, loading, children, className, startIcon, ...props }) => {
  return (
    <>
      <button
        className={`btn bg-primary bg-blue-100 text-white btn-border ${className} ${fullWidth && 'w-100'}`}
        disabled={loading}
        {...props}
      >
        {loading ? (
          <div className="d-flex align-items-center justify-content-center h-100">
            <Spinner className="m-1 " animation="border" variant="light" size="sm" />
          </div>
        ) : (
          <div className="d-flex align-items-center justify-content-center">
            {startIcon && <span className="pb-1 mx-2">{startIcon}</span>}
            <div className="mx-1 fs-6 fontWeight">{children}</div>
          </div>
        )}
      </button>
    </>
  )
}

Button.propTypes = {
  children: PropTypes.string || PropTypes.element,
  className: PropTypes.string,
  fullWidth: PropTypes.bool,
  loading: PropTypes.bool,
  buttonIcon: PropTypes.bool,
  startIcon: PropTypes.element,
}

export default Button
