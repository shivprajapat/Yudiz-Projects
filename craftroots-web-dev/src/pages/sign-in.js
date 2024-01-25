import React from 'react'
import { FormattedMessage } from 'react-intl'
import Link from 'next/link'
import useSignIn from '@/hooks/useSignIn'
import {
  AuthForm,
  Button,
  Input,
  Meta,
  PasswordInput,
} from '@/components/generic'
import { allRoutes } from '@/constants/allRoutes'
import { emailRegex } from '@/helper'
import AuthBannerWrapper from '@/components/generic/AuthBannerWrapper'
import META from '@/helper/meta-constant'

const SignIn = () => {
  const {
    register,
    handleSubmit,
    errors,
    intl,
    onSubmit,
    signInResult,
    errorMessage,
    errorValidationMsg,
  } = useSignIn({ fromCheckout: false })

  return (
    <AuthBannerWrapper>
      <Meta title={META.signIn.title} description={META.signIn.description} />
      <AuthForm title="page.auth.title.signIn">
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
              errors={errors}
              validation={{
                pattern: {
                  value: emailRegex,
                  message: `${intl.formatMessage({
                    id: 'form.email.errorMessage',
                  })}`,
                },
              }}
              disabled={signInResult.state.isLoading}
            />
          </div>
          <div className="form-group">
            <PasswordInput
              placeholder={intl.formatMessage({
                id: 'form.password.placeHolder',
              })}
              name="password"
              type="text"
              register={register}
              required
              errors={errors}
              eyeBtn
              disabled={signInResult.state.isLoading}
            />
            <div className="flex justify-end font-medium text-sm mt-1">
              <Link href={allRoutes.forgotPassword} className="text-grey-700">
                <FormattedMessage id="page.auth.title.forgotPassword" />?
              </Link>
            </div>
          </div>

          {errorMessage && errorMessage.includes(errorValidationMsg) && (
            <div
              id="signIn"
              dangerouslySetInnerHTML={{
                __html: errorMessage,
              }}
            ></div>
          )}

          <div className="text-center mt-4 sm:mt-8">
            <Button
              fullWidth
              title={intl.formatMessage({
                id: 'button.signIn',
              })}
              btnLoader={signInResult.state.isLoading}
              disabled={signInResult.state.isLoading}
              type="submit"
            />
          </div>
          <div className="flex justify-center gap-1 mt-4 font-medium text-sm flex-wrap ">
            <span className="text-grey-700">
              {' '}
              <FormattedMessage id="page.auth.dontHaveAnAccount" />
            </span>
            <Link href={allRoutes.signUp} className="text-secondary-200">
              <FormattedMessage id="page.auth.title.createAccount" />
            </Link>
          </div>
        </form>
      </AuthForm>
    </AuthBannerWrapper>
  )
}

export default SignIn
