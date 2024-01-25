import React, { useEffect, useState } from 'react'
import { FormattedMessage, useIntl } from 'react-intl'
import Link from 'next/link'
import PropTypes from 'prop-types'
import { Button, Input, PasswordInput } from './generic'
import { allRoutes } from '@/constants/allRoutes'
import { emailRegex } from '@/helper'
import useAsync from '@/hooks/useAsync'
import { request } from '@/services/api.service'
import { EmailExist } from '@/queries/checkoutQueries'
import useSignIn from '@/hooks/useSignIn'

const ShippingGuestForm = ({ setEmail, email }) => {
  const intl = useIntl()
  const emailChecker = useAsync(null, null)
  const [isGuest, setIsGuest] = useState(true)
  const [hidePassField, setHidePassField] = useState(true)
  const { handleSubmit, errors, onSubmit, register, setValue, loading } =
    useSignIn({ fromCheckout: true })

  useEffect(() => {
    let delayTimer
    setValue('email', email)
    const handleEmailChange = (value) => {
      if (emailRegex.test(value)) {
        // Call your API or any expensive operation here
        emailChecker.run(request, {
          ...EmailExist,
          variables: {
            email: value,
          },
        })
      }
    }

    delayTimer = setTimeout(() => {
      handleEmailChange(email)
    }, 200)

    return () => {
      clearTimeout(delayTimer)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [email])

  const handleEmail = (value) => {
    setEmail(value)
  }

  useEffect(() => {
    if (emailChecker.state.isSuccess) {
      if (emailChecker.state.data?.isEmailAvailable?.is_email_available) {
        setIsGuest(true)
        setHidePassField(false)
      } else {
        setIsGuest(false)
        setHidePassField(true)
      }
    }
  }, [emailChecker.state.isSuccess])

  return (
    <div className="border-b border-grey-400 mb-6">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="form-group ">
          <Input
            placeholder={intl.formatMessage({
              id: 'form.email.placeHolder',
            })}
            name="email"
            type="email"
            register={register}
            required
            errors={errors}
            value={email}
            handleText={handleEmail}
            validation={{
              pattern: {
                value: emailRegex,
                message: `${intl.formatMessage({
                  id: 'form.email.errorMessage',
                })}`,
              },
            }}
          />
          {!isGuest && !hidePassField && (
            <div className="mt-4">
              <Button
                onClick={() => setHidePassField(true)}
                title={intl.formatMessage({ id: 'button.login' })}
                className="!py-[8px] !px-3"
              />
            </div>
          )}
          <span className="text-grey-700 text-sm font-medium mt-1">
            {isGuest && 'You can create a account after checkout'}
          </span>
        </div>
        {hidePassField && !isGuest && (
          <>
            <div className="form-group">
              <PasswordInput
                placeholder={intl.formatMessage({
                  id: 'form.password.placeHolder',
                })}
                name="password"
                type="text"
                errorFieldName="Password"
                register={register}
                required
                eyeBtn
                errors={errors}
              />
              <span className="text-grey-700 text-sm font-medium mt-1">
                You already have an account with us. Sign in or continue as
                guest.{' '}
              </span>
            </div>
            <div className="mb-4 flex items-center gap-4 flex-wrap">
              <Button
                className="!py-[8px] !px-3"
                title={intl.formatMessage({ id: 'button.login' })}
                type="submit"
                btnLoader={loading}
              />
              <Button
                className="!py-[8px] !px-3"
                border
                type="button"
                title={intl.formatMessage({ id: 'button.continueAsGuest' })}
                onClick={() => setHidePassField(false)}
              />

              <Link
                href={allRoutes.forgotPassword}
                className="text-secondary-200"
              >
                <FormattedMessage id="page.auth.title.forgotPassword" />?
              </Link>
            </div>
          </>
        )}
      </form>
    </div>
  )
}

export default ShippingGuestForm

ShippingGuestForm.propTypes = {
  setEmail: PropTypes.func,
  email: PropTypes.string,
}

ShippingGuestForm.defaultProps = {
  setEmail: () => {},
  email: '',
}
