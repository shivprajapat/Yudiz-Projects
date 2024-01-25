import React, { useRef, useState } from 'react'
import PropTypes from 'prop-types'
import { Button, Form, InputGroup, Spinner } from 'react-bootstrap'
import { useForm } from 'react-hook-form'
import { FormattedMessage } from 'react-intl'
import { ONLY_NUMBER, PASSWORD } from 'shared/constants'
import { validationErrors } from 'shared/constants/ValidationErrors'
import { useMutation } from 'react-query'
import { resetPassWord } from 'query/auth/auth.query'
import { useNavigate } from 'react-router-dom'
import { toaster } from 'helper/helper'
// import { route } from 'shared/constants/AllRoutes'

function ResetPasswordForm({ sEmail }) {
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState({ newPassword: true, confirmPassword: true })
  const sNewPassword = useRef({})

  const {
    register: fields,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm({ mode: 'onTouched' })
  sNewPassword.current = watch('sNewPassword')

  function handlePasswordToggle(name) {
    if (name === 'newPassword') {
      setShowPassword({ ...showPassword, newPassword: !showPassword.newPassword })
    } else {
      setShowPassword({ ...showPassword, confirmPassword: !showPassword.confirmPassword })
    }
  }

  const { mutate, isLoading } = useMutation(resetPassWord, {
    onSuccess: (response) => {
      navigate('/login')
      toaster(response?.data?.message)
    }
  })

  function onSubmit(data) {
    mutate({ sEmail: sEmail, otp: data.nOtp, sNewPassword: data.sConfirmNewPassword })
  }

  return (
    <Form noValidate onSubmit={handleSubmit(onSubmit)} className='login-form'>
      <div className='title-b'>
        <h2 className='title'>
          <FormattedMessage id='resetPassword' />
        </h2>
        <p>
          <FormattedMessage id='pleaseDoNotHitRefresh' />
        </p>
      </div>
      <Form.Group className='form-group'>
        <Form.Label>
          <FormattedMessage id='otp' />
        </Form.Label>
        <Form.Control
          type='text'
          required
          name='nOtp'
          mask='9999 9999 9999 9999'
          className={errors.nOtp && 'error'}
          {...fields('nOtp', {
            required: validationErrors.required,
            maxLength: { value: 6, message: validationErrors.maxLength(6) },
            pattern: { value: ONLY_NUMBER, message: validationErrors.number }
          })}
        />
        {errors.nOtp && <Form.Control.Feedback type='invalid'>{errors.nOtp.message}</Form.Control.Feedback>}
      </Form.Group>
      <Form.Group className='form-group'>
        <Form.Label>
          <FormattedMessage id='newPassword' />
        </Form.Label>
        <InputGroup>
          <Form.Control
            type={showPassword.newPassword ? 'password' : 'text'}
            required
            name='sNewPassword'
            className={errors.sNewPassword && 'error'}
            {...fields('sNewPassword', {
              required: validationErrors.required,
              pattern: {
                value: PASSWORD,
                message: validationErrors.passwordRegEx
              },
              maxLength: { value: 15, message: validationErrors.rangeLength(8, 15) },
              minLength: { value: 8, message: validationErrors.rangeLength(8, 15) }
            })}
          />
          <Button onClick={() => handlePasswordToggle('newPassword')} variant='link' className='icon-right'>
            <i className={showPassword.newPassword ? 'icon-visibility' : 'icon-visibility-off'}></i>
          </Button>
        </InputGroup>
        {errors.sNewPassword && <Form.Control.Feedback type='invalid'>{errors.sNewPassword.message}</Form.Control.Feedback>}
      </Form.Group>
      <Form.Group className='form-group'>
        <Form.Label>
          <FormattedMessage id='confirmNewPassword' />
        </Form.Label>
        <InputGroup>
          <Form.Control
            type={showPassword.confirmPassword ? 'password' : 'text'}
            required
            name='sConfirmNewPassword'
            className={errors.sConfirmNewPassword && 'error'}
            {...fields('sConfirmNewPassword', {
              required: validationErrors.required,
              validate: (value) => value === sNewPassword.current || validationErrors.passwordNotMatch
            })}
          />
          <Button onClick={() => handlePasswordToggle('confirmPassword')} variant='link' className='icon-right'>
            <i className={showPassword.confirmPassword ? 'icon-visibility' : 'icon-visibility-off'}></i>
          </Button>
        </InputGroup>
        {errors.sConfirmNewPassword && <Form.Control.Feedback type='invalid'>{errors.sConfirmNewPassword.message}</Form.Control.Feedback>}
      </Form.Group>
      <Button variant='primary' type='submit'>
        <FormattedMessage id='submit' /> {isLoading && <Spinner animation='border' size='sm' />}
      </Button>
    </Form>
  )
}
ResetPasswordForm.propTypes = {
  sEmail: PropTypes.string
}
export default ResetPasswordForm
