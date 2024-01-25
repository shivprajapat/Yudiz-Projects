import React, { useId } from 'react'
import PropTypes from 'prop-types'
import { forwardRef } from 'react'
import CustomToolTip from 'Components/TooltipInfo'
import './_input.scss'

const Input = forwardRef(function Input(
  {
    type = 'text',
    labelText,
    onChange,
    errorMessage,
    inputContainerClass,
    inputContainerStyle,
    value,
    id,
    disableError,
    className,
    startIcon,
    endIcon,
    info,
    tooltipContent,
    pattern,
    isImportant,
    ...props
  },
  ref
) {
  const RandomId = useId()

  return (
    <>
      {!disableError ? (
        <>
          <div className={`d-flex input-box ${inputContainerClass || ''}`} style={inputContainerStyle}>
            {labelText &&
              <div className='input-info'>
                <label className='input-label' htmlFor={id || RandomId} title={labelText}>{isImportant ? <>{labelText}<span className='input-important'>*</span></> : labelText}</label>
                <CustomToolTip tooltipContent={tooltipContent} position='top'>
                  {({ target }) => (
                    <span
                      className='input-info-icon'
                      ref={target}
                    >
                      {info}
                    </span>
                  )}
                </CustomToolTip>
              </div>
            }
            <div className="input-field">
              {startIcon && (
                <div>
                  <label htmlFor={id || RandomId} className="set_input_icon">
                    {startIcon}
                  </label>
                </div>
              )}
              <input
                ref={ref}
                onChange={onChange}
                value={value}
                id={id || RandomId}
                pattern={pattern}
                className={`${className || ''} ${errorMessage ? 'errorInput' : ''} ${startIcon ? 'ps-5' : ''} `}
                {...props}
                type={type}
              />
              {endIcon && (
                <div>
                  <label htmlFor={id || RandomId} className="set_end_input_icon">
                    {endIcon}
                  </label>
                </div>
              )}
            </div>
            {errorMessage && <p className="input-errorMessage">{errorMessage}</p>}
          </div>
        </>
      ) : (
        <>
          <div className={`d-flex input-box ${inputContainerClass || ''}`} style={inputContainerStyle}>
            {labelText && <label className='input-label' htmlFor={id || RandomId}>{labelText}</label>}
            <div className="input-field">
              {startIcon && (
                <div>
                  <label htmlFor={id || RandomId} className="set_input_icon">
                    {startIcon}
                  </label>
                </div>
              )}
              <input
                ref={ref}
                onChange={onChange}
                value={value}
                id={id || RandomId}
                className={`${className || ''} ${errorMessage ? 'errorInput' : ''} ${startIcon ? 'ps-5' : ''} `}
                {...props}
                type={type}
              />
            </div>
            {errorMessage && <p className="input-errorMessage">{errorMessage}</p>}
          </div>
        </>
      )}
    </>
  )
})

Input.propTypes = {
  id: PropTypes.string,
  labelText: PropTypes.string,
  className: PropTypes.string,
  pattern: PropTypes.string,
  type: PropTypes.string,
  name: PropTypes.string,
  errorMessage: PropTypes.string,
  value: PropTypes.any,
  inputContainerClass: PropTypes.string,
  tooltipContent: PropTypes.string,
  inputContainerStyle: PropTypes.object,
  onChange: PropTypes.func,
  disableError: PropTypes.bool,
  startIcon: PropTypes.any,
  endIcon: PropTypes.any,
  info: PropTypes.any,
  isImportant: PropTypes.bool
}

export default Input
