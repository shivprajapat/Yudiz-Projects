import React from 'react'
import { AuthForm, Button, Input, Meta } from '@/components/generic'
import AuthBannerWrapper from '@/components/generic/AuthBannerWrapper'
import { emailRegex } from '@/helper'
import useResetPassword from '@/hooks/useResetPassword'
import PasswordFields from '@/components/generic/form/PasswordFields'
import META from '@/helper/meta-constant'

const ResetPassword = () => {
  const {
    register,
    handleSubmit,
    errors,
    validateConfirmPassword,
    onSubmit,
    intl,
    resetPasswordResult,
    handlePassword,
    email,
    passwordState,
    hasRequiredFieldError,
  } = useResetPassword()

  return (
    <AuthBannerWrapper>
      <Meta
        title={META.resetPassword.title}
        description={META.resetPassword.description}
      />
      <AuthForm title="page.auth.title.resetPassword">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="form-group">
            <Input
              placeholder={intl.formatMessage({
                id: 'form.emailAddress.placeHolder',
              })}
              name="email"
              type="text"
              register={register}
              required
              disabled
              value={email}
              errors={errors}
              validation={{
                pattern: {
                  value: emailRegex,
                  message: `${intl.formatMessage({
                    id: 'form.email.errorMessage',
                  })}`,
                },
              }}
            />
          </div>
          <PasswordFields
            intl={intl}
            register={register}
            handlePassword={handlePassword}
            PasswordResult={resetPasswordResult}
            errors={errors}
            errorFieldName="confirm new password"
            passwordState={passwordState}
            hasRequiredFieldError={hasRequiredFieldError}
            validateConfirmPassword={validateConfirmPassword}
          />
          <div className="text-center mt-8">
            <Button
              fullWidth
              title={intl.formatMessage({
                id: 'button.submit',
              })}
              type="submit"
              btnLoader={resetPasswordResult.state.isLoading}
              disabled={resetPasswordResult.state.isLoading}
            />
          </div>
        </form>
      </AuthForm>
    </AuthBannerWrapper>
  )
}

export default ResetPassword
