import React, { useState } from 'react'
import { useMutation } from 'react-query'
import AuthForm from 'Components/AuthForm'
import Banner from 'Components/Banner'
import Button from 'Components/Button'
import Input from 'Components/Input'
import { verifyLength } from '../../../helpers/helper'
import { forgotPasswordApi } from '../../../Query/Auth/auth.query'

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [errEmail, setErrEmail] = useState('')
  const { isLoading, mutate, data, error } = useMutation(forgotPasswordApi)

  function resetPassword(e) {
    e.preventDefault()
    if (verifyLength(email, 1)) {
      mutate(email)
    } else {
      setErrEmail('Required field')
    }
  }

  function handleChange(e, type) {
    e.preventDefault()
    switch (type) {
      case 'Email':
        if (verifyLength(e.target.value, 1)) {
          setErrEmail('')
        } else if (!verifyLength(e.target.value, 1)) {
          setErrEmail('Required field')
        }
        setEmail(e.target.value)
        break
    }
  }

  return (
    <>
      <section className="auth_section">
        <Banner />
        <AuthForm
          title="Forgot Password"
          subTitle="Enter the email address and we'll send you  instructions to reset your password."
          onSubmit={resetPassword}
        >
          <Input
            labelText={'Email'}
            placeholder="Enter Email Address"
            id="email"
            errorMessage={errEmail}
            onChange={(e) => {
              handleChange(e, 'Email')
            }}
          />
          <Button className="mt-4 primary" fullWidth loading={isLoading}>
            Submit
          </Button>
          {error && <p className="m-3 errorResponse">{'Email ' + error?.response?.data?.messages.slice(3)}</p>}
          {data && <p className="m-3">{data?.data?.messages}</p>}
        </AuthForm>
      </section>
    </>
  )
}
