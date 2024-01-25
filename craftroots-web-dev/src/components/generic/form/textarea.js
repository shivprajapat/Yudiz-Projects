import React from 'react'
import PropTypes from 'prop-types'
import { validator } from '@/helper'

function TextArea({
  placeholder,
  name,
  type,
  register,
  required,
  errors,
  validation,
  className,
  disabled,
}) {
  const setRegister = register(name, validator(required, validation, name))
  return (
    <div>
      <div className="relative w-full">
        <textarea
          className={`form-control h-20 ${
            errors[name] ? 'border-error' : ''
          } ${className}`}
          type={type}
          placeholder={placeholder}
          {...setRegister}
          onChange={(e) => {
            setRegister.onChange(e)
          }}
          disabled={disabled}
        />
      </div>
      <span
        className={`block ${
          errors[name] ? 'text-error' : ''
        } mt-1 text-xs md:text-sm capitalize leading-4`}
      >
        {errors?.[name] ? `${errors?.[name]?.message}` : ''}
      </span>
    </div>
  )
}

export default TextArea
TextArea.propTypes = {
  placeholder: PropTypes.string,
  name: PropTypes.string,
  type: PropTypes.string,
  register: PropTypes.func,
  required: PropTypes.bool,
  validation: PropTypes.object,
  errors: PropTypes.object,
  className: PropTypes.string,
  disabled: PropTypes.bool,
}

TextArea.defaultProps = {
  disabled: false,
}
