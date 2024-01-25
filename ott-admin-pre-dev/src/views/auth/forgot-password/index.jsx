import React from 'react'
import { Button, Form, Spinner } from 'react-bootstrap'
import { useForm } from 'react-hook-form'
import { FormattedMessage } from 'react-intl'
import { useMutation } from 'react-query'
import { Link, useNavigate } from 'react-router-dom'
import { forgotPassword } from 'query/auth/auth.query'
import { EMAIL } from 'shared/constants'
import { validationErrors } from 'shared/constants/ValidationErrors'
import { route } from 'shared/constants/AllRoutes'
import { toaster } from 'helper/helper'

function ForgotPassword() {
  const navigate = useNavigate()
  const {
    register: fields,
    handleSubmit,
    formState: { errors }
  } = useForm({ mode: 'onTouched' })

  const { mutate, isLoading } = useMutation(forgotPassword, {
    onSuccess: (response) => {
      const sEmail = JSON.parse(response?.config?.data)
      navigate(route.resetPassword, { state: { sEmail: sEmail?.sEmail } })
      toaster(response?.data?.message)
    }
  })
  function onSubmit(data) {
    mutate({ sEmail: data?.sEmail })
  }
  return (
    <>
      <Form noValidate className='login-form' onSubmit={handleSubmit(onSubmit)}>
        <div className='title-b'>
          <h2 className='title'>
            <FormattedMessage id='forgotPassword' />
          </h2>
          <p>
            <FormattedMessage id='forgotPasswordPageText' />
          </p>
        </div>
        <Form.Group className='form-group'>
          <Form.Label>
            <FormattedMessage id='emailAddress' />
          </Form.Label>
          <Form.Control
            type='text'
            required
            name='sEmail'
            className={errors.sEmail && 'error'}
            {...fields('sEmail', { required: validationErrors.required, pattern: { value: EMAIL, message: validationErrors.email } })}
          />
          {errors.sEmail && <Form.Control.Feedback type='invalid'>{errors.sEmail.message}</Form.Control.Feedback>}
        </Form.Group>
        <Button variant='primary' type='submit'>
          <FormattedMessage id='submit' /> {isLoading && <Spinner animation='border' size='sm' />}
        </Button>
      </Form>
      <Link to={'/login'} className='b-link'>
        <FormattedMessage id='backToLogin' />
      </Link>
    </>
  )
}

export default ForgotPassword
