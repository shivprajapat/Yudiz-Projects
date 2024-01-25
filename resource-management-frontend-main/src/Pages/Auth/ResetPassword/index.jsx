import React, { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useMutation } from 'react-query'
import { resetPasswordApi } from 'Query/Auth/auth.query'
import AuthForm from 'Components/AuthForm'
import Banner from 'Components/Banner'
import Button from 'Components/Button'
import Input from 'Components/Input'
import { checkConfirmPassword, passwordRegex, toaster, verifyLength } from 'helpers'

export default function ResetPassword() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [error] = useState('')
  const [credentials, setCredentials] = useState({
    newPassword: '',
    confirmNewPassword: '',
    otp: '',
  })
  const [errorNewPassword, setErrorNewPassword] = useState('')
  const [errorNewConfirmPassword, setErrorNewConfirmPassword] = useState('')
  const [errorOtp, setErrorOtp] = useState('')
  const isSetPassword = searchParams.get('type') === 'set-link'

  useEffect(() => {
    if (!searchParams.get('token')) {
      navigate('/login')
    }
  }, [searchParams])

  const { mutate, isLoading } = useMutation(resetPasswordApi, {
    onSuccess: () => {
      navigate('/login')
      toaster('password update successfully')
    },
  })
  function resetPassword(e) {
    e.preventDefault()

    !credentials.newPassword && setErrorNewPassword('Enter New password')
    !credentials.confirmNewPassword && setErrorNewConfirmPassword('Enter Confirm password')
    if (credentials.newPassword.length > 0 && credentials.confirmNewPassword.length > 0) {
      if (passwordRegex.test(credentials.newPassword)) {
        if (checkConfirmPassword(credentials.newPassword, credentials.confirmNewPassword)) {
          mutate({
            sNewPassword: credentials.newPassword,
            sConfirmPassword: credentials.confirmNewPassword,
            token: searchParams.get('token'),
            sCode: credentials.otp,
            isSetPassword,
          })
        } else {
          setErrorNewConfirmPassword("Password and confirm password does not match")
        }
      }
      else {
        setErrorNewPassword('Password must be at least 8 characters long and contain one uppercase letter, one lowercase letter, one number, and one special character')
      }
    }
  }

  function handleChange(e, type) {
    e.preventDefault()
    // setCredentials((prev) => ({ ...prev, [e.target.name]: e.target.value }))
    switch (type) {
      case 'NewPassword':
        if (verifyLength(e.target.value, 1)) {
          setErrorNewPassword('')
        } else if (!verifyLength(e.target.value, 1)) {
          setErrorNewPassword('Enter New password')
        }
        setCredentials((prev) => ({ ...prev, newPassword: e.target.value }))
        break
      case 'ConfirmNewPassword':
        if (verifyLength(e.target.value, 1)) {
          setErrorNewConfirmPassword('')
        } else if (!verifyLength(e.target.value, 1)) {
          setErrorNewConfirmPassword('Enter Confirm password')
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
          setErrorOtp('Enter OTP')
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
        <AuthForm
          title={`${isSetPassword ? 'Set' : 'Reset'} Password`}
          subTitle={`${isSetPassword ? 'Set' : 'Reset'} Your Password for login to your account`}
          onSubmit={resetPassword}
        >
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
            inputContainerClass="mb-4"
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
          <Button className="mt-3 primary" fullWidth loading={isLoading}>
            Submit
          </Button>
        </AuthForm>
      </section>
    </>
  )
}
