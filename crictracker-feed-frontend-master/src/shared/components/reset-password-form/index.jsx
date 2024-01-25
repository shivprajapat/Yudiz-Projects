import React, { useContext, useRef, useState } from 'react'
import PropTypes from 'prop-types'
import { Button, Form, InputGroup } from 'react-bootstrap'
import { useForm } from 'react-hook-form'
import { FormattedMessage } from 'react-intl'
import { useHistory } from 'react-router-dom'

import { PASSWORD, TOAST_TYPE } from 'shared/constants'
import { validationErrors } from 'shared/constants/ValidationErrors'
import { resetPassword } from 'shared/apis/auth'
import { ToastrContext } from '../toastr'
import { allRoutes } from 'shared/constants/AllRoutes'

function ResetPasswordForm({ sToken }) {
  const history = useHistory()
  const [showPassword, setShowPassword] = useState({ sPassword: true, confirmPassword: true })
  const sPassword = useRef({})
  const { dispatch } = useContext(ToastrContext)

  const {
    register: fields,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm({ mode: 'onTouched' })
  sPassword.current = watch('sPassword')

  function handlePasswordToggle(name) {
    if (name === 'sPassword') {
      setShowPassword({ ...showPassword, sPassword: !showPassword.sPassword })
    } else {
      setShowPassword({ ...showPassword, confirmPassword: !showPassword.confirmPassword })
    }
  }

  async function onSubmit(data) {
    data.sVerificationToken = sToken
    const response = await resetPassword(data)
    if (response?.status === 200) {
      dispatch({
        type: 'SHOW_TOAST',
        payload: { message: response.message, type: TOAST_TYPE.Success, btnTxt: 'Close' }
      })
      history.push(allRoutes.login)
    } else {
      dispatch({
        type: 'SHOW_TOAST',
        payload: { message: response.data.message, type: TOAST_TYPE.Error, btnTxt: 'Close' }
      })
    }
  }

  return (
    <Form noValidate onSubmit={handleSubmit(onSubmit)} className="login-form">
      <div className="title-b">
        <h2 className="title">
          <FormattedMessage id="resetPassword" />
        </h2>
      </div>
      <Form.Group className="form-group">
        <Form.Label>
          <FormattedMessage id="newPassword" />
        </Form.Label>
        <InputGroup>
          <Form.Control
            type={showPassword.sPassword ? 'password' : 'text'}
            required
            name="sPassword"
            className={errors.sPassword && 'error'}
            {...fields('sPassword', {
              required: validationErrors.required,
              pattern: {
                value: PASSWORD,
                message: validationErrors.passwordRegEx
              },
              maxLength: { value: 12, message: validationErrors.rangeLength(8, 12) },
              minLength: { value: 8, message: validationErrors.rangeLength(8, 12) }
            })}
          />
          <Button onClick={() => handlePasswordToggle('sPassword')} variant="link" className="icon-right">
            <i className={showPassword.sPassword ? 'icon-visibility' : 'icon-visibility-off'}></i>
          </Button>
        </InputGroup>
        {errors.sPassword && <Form.Control.Feedback type="invalid">{errors.sPassword.message}</Form.Control.Feedback>}
      </Form.Group>
      <Button variant="primary" type="submit">
        <FormattedMessage id="submit" />
      </Button>
    </Form>
  )
}
ResetPasswordForm.propTypes = {
  sToken: PropTypes.string
}
export default ResetPasswordForm
