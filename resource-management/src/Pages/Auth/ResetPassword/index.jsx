import React, { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useMutation } from 'react-query'

import AuthForm from 'Components/AuthForm'
import Banner from 'Components/Banner'
import Button from 'Components/Button'
import Input from 'Components/Input'
import { checkConfirmPassword, verifyLength } from '../../../helpers/helper'
import { resetPasswordApi } from '../../../Query/Auth/auth.query'

export default function ResetPassword() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [error] = useState('')
  const [credentials, setCredentials] = useState({
    newPassword: '',
    confirmNewPassword: '',
    otp: '',
  })

  const { mutate, isLoading } = useMutation(resetPasswordApi, {
    onSuccess: () => {
      navigate('/login')
    },
  })

  function resetPassword(e) {
    e.preventDefault()
    if (checkConfirmPassword(credentials.newPassword, credentials.confirmNewPassword)) {
      mutate({
        sNewPassword: credentials.newPassword,
        sConfirmPassword: credentials.confirmNewPassword,
        token: searchParams.get('token'),
        sCode: credentials.otp,
      })
    }
  }

  const [errorNewPassword, setErrorNewPassword] = useState('')
  const [errorNewConfirmPassword, setErrorNewConfirmPassword] = useState('')
  const [errorOtp, setErrorOtp] = useState('')

  function handleChange(e, type) {
    e.preventDefault()
    // setCredentials((prev) => ({ ...prev, [e.target.name]: e.target.value }))
    switch (type) {
      case 'NewPassword':
        if (verifyLength(e.target.value, 1)) {
          setErrorNewPassword('')
        } else if (!verifyLength(e.target.value, 1)) {
          setErrorNewPassword('Required field')
        }
        setCredentials((prev) => ({ ...prev, newPassword: e.target.value }))
        break
      case 'ConfirmNewPassword':
        if (verifyLength(e.target.value, 1)) {
          setErrorNewConfirmPassword('')
        } else if (!verifyLength(e.target.value, 1)) {
          setErrorNewConfirmPassword('Required field')
        }
        setCredentials((prev) => ({
          ...prev,
          confirmNewPassword: e.target.value,
        }))
        break
      case 'OTP':
        if (verifyLength(e.target.value, 1)) {
          setErrorOtp('')
        } else if (!verifyLength(e.target.value, 1)) {
          setErrorOtp('Required field')
        }
        setCredentials((prev) => ({
          ...prev,
          otp: e.target.value,
        }))
        break
      default:
        break
    }
  }

  return (
    <>
      <section className="auth_section">
        <Banner />
        <AuthForm title="Reset Password" subTitle="Reset Your Password for login to your account" onSubmit={resetPassword}>
          {searchParams.get('type') === 'otp' && (
            <Input
              labelText={'Otp'}
              placeholder="Enter OTP"
              id={'otp'}
              type={'text'}
              name="otp"
              onChange={(e) => {
                handleChange(e, 'OTP')
              }}
              errorMessage={errorOtp}
            />
          )}
          <Input
            labelText={'New Password'}
            placeholder="Enter New Password"
            id={'newPassword'}
            type={'password'}
            name="newPassword"
            onChange={(e) => {
              handleChange(e, 'NewPassword')
            }}
            errorMessage={errorNewPassword}
          />
          <Input
            labelText={'Confirm New Password'}
            placeholder="Re-Enter New Password"
            id={'confirmNewPassword'}
            type={'password'}
            name="confirmNewPassword"
            onChange={(e) => {
              handleChange(e, 'ConfirmNewPassword')
            }}
            errorMessage={errorNewConfirmPassword}
          />
          <p>{error}</p>
          <Button className="mt-4 primary" fullWidth loading={isLoading}>
            Submit
          </Button>
        </AuthForm>
      </section>
    </>
  )
}
