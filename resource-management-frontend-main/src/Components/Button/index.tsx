import React from 'react'
import { Spinner } from 'react-bootstrap'
import { IButtonProps } from 'types/interfaces/Button.types'

const Button = ({ fullWidth, loading, children, className, startIcon, cancel, ...props }:IButtonProps) => {
  return (
    <>
      <button
        className={`btn bg-primary bg-blue-100 text-white btn-border main-Button main-btn active-btn ${className} ${fullWidth && 'w-100'}`}
        disabled={loading}
        {...props}
      >
        {loading ? (
          <div className="d-flex align-items-center justify-content-center h-100">
            <Spinner className="m-1 " animation="border" variant="light" size="sm" />
          </div>
        ) : (
          <div className="d-flex align-items-center justify-content-center main-btn">
            {startIcon && <span className="pb-1 startIcon">{startIcon}</span>}
            <div className={'fontWeight'} style={{ color: cancel ? '#b2bfd2' : '', fontSize: '15px' }}>
              {children}
            </div>
          </div>
        )}
      </button>
    </>
  )
}

export default Button
