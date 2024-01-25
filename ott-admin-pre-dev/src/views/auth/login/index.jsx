/* eslint-disable no-unused-vars */
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Button, Form, InputGroup, Spinner } from 'react-bootstrap'
import { Link, useNavigate } from 'react-router-dom'
import { FormattedMessage } from 'react-intl'
import { login } from 'query/auth/auth.query'
import { route } from 'shared/constants/AllRoutes'
import { validationErrors } from 'shared/constants/ValidationErrors'
import { useMutation } from 'react-query'
import { toaster } from 'helper/helper'

function Login() {
  const navigate = useNavigate()
  const {
    register: fields,
    handleSubmit,
    formState: { errors }
  } = useForm({ mode: 'onTouched' })
  const [showPassword, setShowPassword] = useState(true)

  function handlePasswordToggle() {
    setShowPassword(!showPassword)
  }

  const { mutate, isLoading } = useMutation(login, {
    onSuccess: (response) => {
      console.log({ response })
      localStorage.setItem('token', response.headers.authorization)
      navigate(route.dashboard)
      toaster(response?.data?.message)
    }
  })

  function onSubmit(data) {
    mutate({ sEmail: data.sEmail, sPassword: data.sPassword })
  }

  return (
    <>
      <Form noValidate onSubmit={handleSubmit(onSubmit)} className='login-form'>
        <div className='title-b'>
          <h2 className='title'>
            <FormattedMessage id='letsGo' />
          </h2>
        </div>
        <Form.Group className='form-group'>
          <Form.Label>
            <FormattedMessage id='emailAddress' />
          </Form.Label>
          <Form.Control
            type='text'
            required
            name='sUserName'
            className={errors.sUserName && 'error'}
            {...fields('sEmail', { required: validationErrors.required })}
          />
          {errors.sUserName && <Form.Control.Feedback type='invalid'>{errors.sUserName.message}</Form.Control.Feedback>}
        </Form.Group>
        <Form.Group className='form-group'>
          <Form.Label>
            <FormattedMessage id='password' />
          </Form.Label>
          <InputGroup>
            <Form.Control
              type={showPassword ? 'password' : 'text'}
              required
              name='sPassword'
              className={errors.sPassword && 'error'}
              {...fields('sPassword', { required: validationErrors.required })}
            />
            <Button onClick={handlePasswordToggle} variant='link' className='icon-right'>
              <i className={showPassword ? 'icon-visibility' : 'icon-visibility-off'}></i>
            </Button>
          </InputGroup>
          {errors.sPassword && <Form.Control.Feedback type='invalid'>{errors.sPassword.message}</Form.Control.Feedback>}
        </Form.Group>
        <Button variant='primary' type='submit'>
          <FormattedMessage id='Login' /> {isLoading && <Spinner animation='border' size='sm' />}
        </Button>
      </Form>
      <Link to={route.forgotPassword} className='b-link'>
        <FormattedMessage id='forgotPassword' />?
      </Link>
    </>
  )
}

export default Login
