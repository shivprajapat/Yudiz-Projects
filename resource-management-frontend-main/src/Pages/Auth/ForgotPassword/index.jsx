import React, { useState } from 'react'

// component
import AuthForm from 'Components/AuthForm'
import Button from 'Components/Button'
import Banner from 'Components/Banner'
import Input from 'Components/Input'

// query
import { forgotPasswordApi } from 'Query/Auth/auth.query'
import { useMutation } from 'react-query'

import { toaster, verifyLength } from 'helpers'
import { Link } from 'react-router-dom'

export default function ForgotPassword() {

  const [errEmail, setErrEmail] = useState('')
  const [email, setEmail] = useState('')

  // post forgot password
  const { isLoading, mutate } = useMutation(forgotPasswordApi, {
    onSuccess: (data) => {
      toaster(data?.data?.messages)
    },
    onError: (error) => {
      console.log('error :>> ', error?.response?.data?.messages)
      toaster(error?.response?.data?.messages, 'error')
    }
  })

  function resetPassword(e) {
    e.preventDefault()
    if (verifyLength(email, 1)) {
      mutate(email)
    } else {
      setErrEmail('Enter a valid email')
    }
  }

  function handleChange(e, type) {
    e.preventDefault()
    switch (type) {
      case 'Email':
        if (verifyLength(e.target.value, 1)) {
          setErrEmail('')
        } else if (!verifyLength(e.target.value, 1)) {
          setErrEmail('Enter a valid email')
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
          <div className='back_to_signIn'>
            <p>OR</p>
          </div>
          <div className='d-flex justify-content-between'><p className='me-1'>Go Back to</p><Link to='/login'> Sign In</Link></div>
          {/* {error?.response?.data?.messages && <p className="m-3 errorResponse">{error?.response?.data?.messages}</p>} */}
          {/* {data && <p className="m-3 text-success">{data?.data?.messages}</p>} */}
        </AuthForm>
      </section>
    </>
  )
}
