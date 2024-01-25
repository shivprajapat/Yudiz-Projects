import React from 'react'
import { emailRegex } from '@/helper'
import useForgotPassword from '@/hooks/useForgotPassword'
import { AuthForm, Button, Input, Meta } from '@/components/generic'
import AuthBannerWrapper from '@/components/generic/AuthBannerWrapper'
import META from '@/helper/meta-constant'

const ForgotPassword = () => {
  const {
    register,
    handleSubmit,
    errors,
    intl,
    onSubmit,
    forgotPasswordResult,
  } = useForgotPassword()

  return (
    <AuthBannerWrapper>
      <Meta
        title={META.forgotPassword.title}
        description={META.forgotPassword.description}
      />
      <AuthForm title="page.auth.title.forgotPassword">
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
              disabled={forgotPasswordResult.state.isLoading}
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
          <div className="text-center mt-8">
            <Button
              fullWidth
              title={intl.formatMessage({
                id: 'button.submit',
              })}
              btnLoader={forgotPasswordResult.state.isLoading}
              disabled={forgotPasswordResult.state.isLoading}
              type="submit"
            />
          </div>
        </form>
      </AuthForm>
    </AuthBannerWrapper>
  )
}
export default ForgotPassword
