import React, { useState, useMemo } from 'react'
import PropTypes from 'prop-types'
import Image from 'next/image'
import { iconEyeFill, iconEyeSlashFill } from '@/assets/images'
import { validator } from '@/helper'

const PasswordInput = ({
  placeholder,
  name,
  register,
  required,
  errors,
  validation,
  disabled,
  passwordVal,
  errorFieldName,
  hideErrorMessage,
  eyeBtn,
}) => {
  const [show, setShow] = useState(false)
  const handleOpen = () => {
    setShow(!show)
  }

  const setRegister = useMemo(
    () => register(name, validator(required, validation, name, errorFieldName)),
    [register, name, required, validation]
  )

  return (
    <div>
      <div className="relative w-full">
        <div className="absolute inset-y-0 right-1 flex items-center px-2">
          {eyeBtn && (
            <button
              onClick={handleOpen}
              className="cursor-pointer"
              type="button"
            >
              <Image
                src={show ? iconEyeFill : iconEyeSlashFill}
                alt="password"
              />
            </button>
          )}
        </div>
        <input
          className={`form-control ${errors[name] ? 'border-error' : ''}`}
          name={name}
          type={show ? 'text' : 'password'}
          placeholder={placeholder}
          {...setRegister}
          onChange={(e) => {
            setRegister.onChange(e)
            passwordVal(e)
          }}
          disabled={disabled}
        />
      </div>
      {!hideErrorMessage && (
        <span
          className={`block ${
            errors[name] ? 'text-error' : ''
          } mt-1 text-xs md:text-sm capitalize leading-4`}
        >
          {errors?.[name] ? errors?.[name]?.message : ''}
        </span>
      )}
    </div>
  )
}

export default PasswordInput
PasswordInput.propTypes = {
  name: PropTypes.string.isRequired,
  error: PropTypes.object,
  success: PropTypes.object,
  placeholder: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  register: PropTypes.func,
  required: PropTypes.bool,
  validation: PropTypes.object,
  errors: PropTypes.object,
  disabled: PropTypes.bool,
  passwordVal: PropTypes.func,
  errorFieldName: PropTypes.string,
  hideErrorMessage: PropTypes.bool,
  eyeBtn: PropTypes.bool,
}

PasswordInput.defaultProps = {
  hideErrorMessage: false,
  disabled: false,
  passwordVal: () => {},
  errorFieldName: '',
  eyeBtn: false,
}
