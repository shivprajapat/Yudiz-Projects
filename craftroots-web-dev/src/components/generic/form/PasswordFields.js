import React from 'react'
import PropTypes from 'prop-types'
import { PasswordInput } from '@/components/generic'
import PasswordRequirements from '@/components/generic/form/PasswordRequirements'

function PasswordFields({
  intl,
  register,
  handlePassword,
  PasswordResult,
  errors,
  passwordState,
  hasRequiredFieldError,
  validateConfirmPassword,
}) {
  const { char, lowerCase, uppercase, number } = passwordState

  return (
    <>
      <div className="form-group">
        <PasswordInput
          placeholder={intl.formatMessage({
            id: 'form.newPassword.placeHolder',
          })}
          name="newPassword"
          type="text"
          errorFieldName="New Password"
          eyeBtn
          required
          register={register}
          passwordVal={handlePassword}
          disabled={PasswordResult?.state?.isLoading}
          hideErrorMessage={true}
          errors={errors}
        />
        <PasswordRequirements
          char={char}
          uppercase={uppercase}
          lowerCase={lowerCase}
          number={number}
          hasRequiredFieldError={hasRequiredFieldError}
        />
      </div>
      <div className="form-group">
        <PasswordInput
          placeholder={intl.formatMessage({
            id: 'form.confirmNewPassword.placeHolder',
          })}
          name="confirmNewPassword"
          errorFieldName="confirm new password"
          type="text"
          register={register}
          required
          disabled={PasswordResult?.state?.isLoading}
          validation={{
            validate: validateConfirmPassword,
          }}
          errors={errors}
        />
      </div>
    </>
  )
}

PasswordFields.propTypes = {
  intl: PropTypes.object,
  register: PropTypes.func,
  handlePassword: PropTypes.func,
  PasswordResult: PropTypes.any,
  errors: PropTypes.object,
  passwordState: PropTypes.any,
  hasRequiredFieldError: PropTypes.bool,
  validateConfirmPassword: PropTypes.func,
}

export default PasswordFields
