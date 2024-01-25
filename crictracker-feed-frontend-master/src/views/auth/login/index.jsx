import React, { useContext, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Button, Form, InputGroup, Spinner } from 'react-bootstrap'
import { Link, useHistory, useLocation } from 'react-router-dom'
import { FormattedMessage } from 'react-intl'

import { allRoutes } from 'shared/constants/AllRoutes'
import { validationErrors } from 'shared/constants/ValidationErrors'
import { login } from 'shared/apis/auth'
import { TOAST_TYPE } from 'shared/constants'
import { ToastrContext } from 'shared/components/toastr'
import { storeInLocalStorage } from 'shared/helper/localStorage'

function Login() {
  const history = useHistory()
  const { dispatch } = useContext(ToastrContext)
  const { state } = useLocation()
  const {
    register: fields,
    handleSubmit,
    formState: { errors }
  } = useForm({ mode: 'onTouched' })
  const [showPassword, setShowPassword] = useState(true)
  const [loading, setLoading] = useState(false)
  const [path, setPath] = useState()

  useEffect(() => {
    const path = window.location.pathname
    setPath(path)
  }, [])

  function handlePasswordToggle() {
    setShowPassword(!showPassword)
  }

  async function onSubmit(data) {
    setLoading(true)
    const response = await login(data, path);
    (path === '/admin') ? response.role = 'admin' : response.role = 'client'
    if (response?.data?.sLoginToken) {
      storeInLocalStorage('token', response?.data?.sLoginToken)
      storeInLocalStorage('role', response?.role)
      if (state && state.previousPath) {
        history.replace(state.previousPath)
        setLoading(false)
      } else {
        dispatch({
          type: 'SHOW_TOAST',
          payload: { message: response.message, type: TOAST_TYPE.Success, btnTxt: 'Close' }
        })
        setLoading(false)
        history.replace(allRoutes.dashboard, { role: response?.role })
      }
    } else {
      setLoading(false)
      dispatch({
        type: 'SHOW_TOAST',
        payload: { message: response.message, type: TOAST_TYPE.Error, btnTxt: 'Close' }
      })
    }
  }

  return (
    <>
      <Form noValidate onSubmit={handleSubmit(onSubmit)} className="login-form">
        <div className="title-b">
          <h2 className="title">
            <FormattedMessage id="letsGo" />
          </h2>
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
            {...fields('sLogin', { required: validationErrors.required, email: validationErrors.email })}
          />
          {errors.sLogin && <Form.Control.Feedback type="invalid">{errors.sLogin.message}</Form.Control.Feedback>}
        </Form.Group>
        <Form.Group className="form-group">
          <Form.Label>
            <FormattedMessage id="password" />
          </Form.Label>
          <InputGroup>
            <Form.Control
              type={showPassword ? 'password' : 'text'}
              required
              name="sPassword"
              className={errors.sPassword && 'error'}
              {...fields('sPassword', { required: validationErrors.required })}
            />
            <Button onClick={handlePasswordToggle} variant="link" className="icon-right">
              <i className={showPassword ? 'icon-visibility' : 'icon-visibility-off'}></i>
            </Button>
          </InputGroup>
          {errors.sPassword && <Form.Control.Feedback type="invalid">{errors.sPassword.message}</Form.Control.Feedback>}
        </Form.Group>
        <Button variant="primary" type="submit" disabled={loading}>
          <FormattedMessage id="login" /> {loading && <Spinner animation="border" size="sm" />}
        </Button>
      </Form>
      <Link to={allRoutes.forgotPassword} className="b-link">
        <FormattedMessage id="forgotPassword" />?
      </Link>
    </>
  )
}

export default Login
