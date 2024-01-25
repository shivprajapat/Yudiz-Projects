import React, { useContext } from 'react'
import { Button, Form } from 'react-bootstrap'
import { useForm } from 'react-hook-form'
import { Link, useHistory } from 'react-router-dom'
import { FormattedMessage } from 'react-intl'

import { EMAIL, TOAST_TYPE } from 'shared/constants'
import { allRoutes } from 'shared/constants/AllRoutes'
import { validationErrors } from 'shared/constants/ValidationErrors'
import { forgotPassword } from 'shared/apis/auth'
import { ToastrContext } from 'shared/components/toastr'

function ForgotPassword() {
  const history = useHistory()
  const { dispatch } = useContext(ToastrContext)

  const {
    register: fields,
    handleSubmit,
    formState: { errors }
  } = useForm({ mode: 'onTouched' })

  async function onSubmit(data) {
    const response = await forgotPassword(data)
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
    <>
      <Form noValidate onSubmit={handleSubmit(onSubmit)} className="login-form">
        <div className="title-b">
          <h2 className="title">
            <FormattedMessage id="forgotPassword" />
          </h2>
          <p>
            <FormattedMessage id="forgotPasswordPageText" />
          </p>
        </div>
        <Form.Group className="form-group">
          <Form.Label>
            <FormattedMessage id="emailAddress" />
          </Form.Label>
          <Form.Control
            type="text"
            required
            name="sLogin"
            className={errors.sLogin && 'error'}
            {...fields('sLogin', { required: validationErrors.required, pattern: { value: EMAIL, message: validationErrors.email } })}
          />
          {errors.sLogin && <Form.Control.Feedback type="invalid">{errors.sLogin.message}</Form.Control.Feedback>}
        </Form.Group>
        <Button variant="primary" type="submit">
          <FormattedMessage id="submit" />
        </Button>
      </Form>
      <Link to={allRoutes.login} className="b-link">
        <FormattedMessage id="backToLogin" />
      </Link>
    </>
  )
}

export default ForgotPassword
