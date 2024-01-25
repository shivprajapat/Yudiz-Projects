import React from 'react'
import { FormattedMessage } from 'react-intl'
import Link from 'next/link'
import {
  AuthForm,
  Button,
  Input,
  Meta,
  PasswordInput,
} from '@/components/generic'
import { allRoutes } from '@/constants/allRoutes'
import { emailRegex, nameRegex, phoneRegex } from '@/helper'
import useSignUp from '@/hooks/useSignUp'
import AuthBannerWrapper from '@/components/generic/AuthBannerWrapper'
import PasswordRequirements from '@/components/generic/form/PasswordRequirements'
import META from '@/helper/meta-constant'

const SignUp = () => {
  const {
    register,
    handleSubmit,
    errors,
    validateConfirmPassword,
    onSubmit,
    intl,
    signUpResult,
    handlePassword,
    passwordState,
    hasRequiredFieldError,
  } = useSignUp()

  const { char, lowerCase, uppercase, number } = passwordState

  return (
    <AuthBannerWrapper>
      <Meta title={META.signUp.title} description={META.signUp.description} />
      <AuthForm title="page.auth.title.createAccount">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 sm:grid-cols-2 sm:gap-4">
            <div className="form-group">
              <Input
                placeholder={intl.formatMessage({
                  id: 'form.firstName.placeHolder',
                })}
                name="firstname"
                type="text"
                register={register}
                required
                disabled={signUpResult.state.isLoading}
                errors={errors}
                errorFieldName="First Name"
                isMaxLength
                validation={{
                  pattern: {
                    value: nameRegex,
                    message: `${intl.formatMessage({
                      id: 'form.firstName.errorMessage',
                    })}`,
                  },
                }}
              />
            </div>
            <div className="form-group">
              <Input
                placeholder={intl.formatMessage({
                  id: 'form.lastName.placeHolder',
                })}
                name="lastname"
                type="text"
                register={register}
                required
                disabled={signUpResult.state.isLoading}
                errors={errors}
                errorFieldName="Last Name"
                isMaxLength
                validation={{
                  pattern: {
                    value: nameRegex,
                    message: `${intl.formatMessage({
                      id: 'form.lastName.errorMessage',
                    })}`,
                  },
                }}
              />
            </div>
          </div>
          <div className="form-group">
            <Input
              placeholder={intl.formatMessage({
                id: 'form.mobileNumber.placeHolder',
              })}
              name="mobilenumber"
              type="text"
              register={register}
              required
              errorFieldName="Mobile Number"
              disabled={signUpResult.state.isLoading}
              errors={errors}
              validation={{
                pattern: {
                  value: phoneRegex,
                  message: `${intl.formatMessage({
                    id: 'form.mobileNumber.errorMessage',
                  })}`,
                },
              }}
            />
          </div>
          <div className="form-group">
            <Input
              placeholder={intl.formatMessage({
                id: 'form.emailAddress.placeHolder',
              })}
              name="email"
              type="text"
              register={register}
              required
              disabled={signUpResult.state.isLoading}
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
          <div className="form-group">
            <PasswordInput
              placeholder={intl.formatMessage({
                id: 'form.password.placeHolder',
              })}
              name="password"
              type="text"
              register={register}
              required
              eyeBtn
              passwordVal={handlePassword}
              hideErrorMessage={true}
              disabled={signUpResult.state.isLoading}
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
                id: 'form.confirmPassword.placeHolder',
              })}
              name="confirmPassword"
              errorFieldName="confirm password"
              type="text"
              register={register}
              validation={{
                validate: validateConfirmPassword,
              }}
              required
              errors={errors}
              disabled={signUpResult.state.isLoading}
            />
          </div>
          <div className="text-center mt-4 sm:mt-8">
            <Button
              fullWidth
              title={intl.formatMessage({
                id: 'page.auth.title.createAccount',
              })}
              disabled={signUpResult.state.isLoading}
              btnLoader={signUpResult.state.isLoading}
              type="submit"
            />
          </div>
          <div className="flex justify-center gap-1 mt-4 font-medium text-sm flex-wrap">
            <span className="text-grey-700">
              <FormattedMessage id="page.auth.alreadyHaveAnAccount" />
            </span>
            <Link href={allRoutes.signIn} className="text-secondary-200">
              <FormattedMessage id="page.auth.title.signIn" />
            </Link>
          </div>
        </form>
      </AuthForm>
    </AuthBannerWrapper>
  )
}

export default SignUp
