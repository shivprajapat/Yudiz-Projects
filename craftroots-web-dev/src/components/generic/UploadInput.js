import React from 'react'
import PropTypes from 'prop-types'
import Image from 'next/image'
import { useIntl } from 'react-intl'
import { validator } from '@/helper'
import { iconUpload } from '@/assets/images'

const UploadInput = ({
  name,
  required,
  accept,
  register,
  validation,
  errors,
  multiple,
  handleImage,
  disabled,
}) => {
  const setRegister = register(name, validator(required, validation, name))
  const intl = useIntl()
  return (
    <>
      <div className="flex items-center justify-center w-full">
        <label
          htmlFor="dropzone-file"
          className={`border flex flex-col items-center justify-center w-full h-[46px] cursor-pointer ${
            errors[name] ? 'border-error' : 'border-grey-900'
          }`}
        >
          <div className="flex items-center justify-between w-full py-3 px-4">
            <p className="text-sm font-jost font-medium text-grey-700">
              {intl.formatMessage({ id: 'form.uploadCatalogue.placeHolder' })}
            </p>

            <Image src={iconUpload} alt="iconUpload" className="w-5 h-5" />
          </div>
          <input
            id="dropzone-file"
            type="file"
            className="hidden"
            accept={accept}
            multiple={multiple}
            disabled={disabled}
            {...setRegister}
            onChange={(e) => {
              setRegister.onChange(e)
              const files = e.target.files
              handleImage(files)
            }}
          />
        </label>
      </div>
      <span
        className={`block ${
          errors?.[name] ? 'text-error' : ''
        } mt-1 text-xs md:text-sm capitalize leading-4`}
      >
        {errors?.[name] ? errors?.[name]?.message : ''}
      </span>
    </>
  )
}

export default UploadInput
UploadInput.propTypes = {
  name: PropTypes.string,
  required: PropTypes.bool,
  accept: PropTypes.string,
  register: PropTypes.func,
  validation: PropTypes.object,
  errors: PropTypes.object,
  multiple: PropTypes.bool,
  handleImage: PropTypes.func,
  disabled: PropTypes.bool,
}

UploadInput.defaultProps = {
  multiple: false,
  disabled: false,
  handleImage: () => {},
}
