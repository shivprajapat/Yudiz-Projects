import React from 'react'
import PropTypes from 'prop-types'
import { validator } from '@/helper'

const Input = ({
  placeholder,
  name,
  type,
  register,
  required,
  errors,
  validation,
  className,
  disabled,
  errorFieldName,
  handleText,
  defaultValue,
  isMaxLength,
}) => {
  const setRegister = register(
    name,
    validator(required, validation, name, errorFieldName, isMaxLength)
  )

  return (
    <div>
      <div className="relative w-full">
        <input
          defaultValue={defaultValue}
          className={`form-control ${
            errors[name] ? 'border-error' : ''
          } ${className}`}
          type={type}
          placeholder={placeholder}
          {...setRegister}
          onChange={(e) => {
            setRegister.onChange(e)
            handleText(e.target.value)
          }}
          disabled={disabled}
        />
      </div>
      <span
        className={`block ${
          errors[name] ? 'text-error mt-1' : ''
        } text-xs md:text-sm capitalize leading-4`}
      >
        {errors?.[name] ? errors?.[name]?.message : ''}
      </span>
    </div>
  )
}

export default Input
Input.propTypes = {
  placeholder: PropTypes.string,
  name: PropTypes.string,
  type: PropTypes.string,
  register: PropTypes.func,
  required: PropTypes.bool,
  validation: PropTypes.object,
  errors: PropTypes.object,
  className: PropTypes.string,
  disabled: PropTypes.bool,
  errorFieldName: PropTypes.string,
  handleText: PropTypes.func,
  value: PropTypes.string,
  defaultValue: PropTypes.string,
  isMaxLength: PropTypes.bool,
  isMinLength: PropTypes.bool,
}

Input.defaultProps = {
  disabled: false,
  validation: {},
  className: '',
  errorFieldName: '',
  handleText: () => {},
  defaultValue: '',
  isMaxLength: false,
  isMinLength: false,
}
