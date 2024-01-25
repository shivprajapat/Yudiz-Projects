import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Button, Form, Spinner } from 'react-bootstrap'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { FormattedMessage, useIntl } from 'react-intl'

import { eyeHideIcon, eyeShowIcon } from 'assets/images'
import { validationErrors } from 'shared/constants/validationErrors'
import { EMAIL } from 'shared/constants'
import { loginUser } from 'modules/auth/redux/service'
import 'layouts/auth-layout/style.scss'
import { allRoutes } from 'shared/constants/allRoutes'

const Login = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { state } = useLocation()

  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)

  const resStatus = useSelector((state) => state.auth.resStatus)
  const resMessage = useSelector((state) => state.auth.resMessage)

  const labels = {
    emailId: useIntl().formatMessage({ id: 'emailId' }),
    enterEmailId: useIntl().formatMessage({ id: 'enterYourEmailId' }),
    password: useIntl().formatMessage({ id: 'password' })
  }

  useEffect(() => {
    if (!resStatus && resMessage) {
      setLoading(false)
    }
  }, [resMessage, resStatus])

  const {
    register,
    formState: { errors },
    handleSubmit,
    setValue
  } = useForm({ mode: 'onTouched' })

  const showPasswordHandle = () => {
    setShowPassword(!showPassword)
  }

  const onSubmit = (e) => {
    const payload = { ...e, timezone: Intl.DateTimeFormat().resolvedOptions().timeZone }
    setLoading(true)
    dispatch(
      loginUser(payload, () => {
        if (state && state.previousPath) {
          navigate(state.previousPath, { replace: true })
        } else {
          navigate(allRoutes.home, { replace: true })
        }
      })
    )
  }

  return (
    <>
      <h5>
        <FormattedMessage id="loginToNuuway" />
      </h5>
      <p>
        <FormattedMessage id="PleaseEnterTheFormBelowToLoginToNuuway" />.
      </p>
      <Form autoComplete="off" onSubmit={handleSubmit(onSubmit)}>
        <Form.Group className="form-group">
          <Form.Label>{labels.emailId}</Form.Label>
          <Form.Control
            type="email"
            name="email"
            className={errors.email && 'error'}
            placeholder={labels.enterEmailId}
            {...register('email', {
              required: validationErrors.required,
              maxLength: {
                value: 50,
                message: validationErrors.maxLength(50)
              },
              pattern: {
                value: EMAIL,
                message: validationErrors.email
              },
              validate: (value) => setValue('email', value.toLowerCase())
            })}
          />
          {errors.email && (
            <Form.Control.Feedback type="invalid" className="invalidFeedback">
              {errors.email.message}
            </Form.Control.Feedback>
          )}
        </Form.Group>

        <Form.Group className="form-group">
          <Form.Label>{labels.password}</Form.Label>
          <div className="eye-icons">
            <Form.Control
              name="password"
              className={errors.password && 'error'}
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              {...register('password', {
                required: validationErrors.required
              })}
            />
            <Button className="eye-btn" onClick={showPasswordHandle}>
              <img src={showPassword ? eyeShowIcon : eyeHideIcon} alt="password" className="img-fluid" />
            </Button>
          </div>
          {errors.password && (
            <Form.Control.Feedback type="invalid" className="invalidFeedback">
              {errors.password.message}
            </Form.Control.Feedback>
          )}
        </Form.Group>
        <Link to={allRoutes.forgotPassword} className="forgot-pass-link">
          <FormattedMessage id="forgotPassword" /> ?
        </Link>
        <Button className="white-btn" type="submit" disabled={loading}>
          <FormattedMessage id="login" />
          {loading && <Spinner animation="border" size="sm" />}
        </Button>
      </Form>
      <p className="end-text text-center">
        <FormattedMessage id="dontHaveAnAccount" />?
        <Link to={allRoutes.signUp}>
          <FormattedMessage id="signUp" />
        </Link>
      </p>
    </>
  )
}

export default Login
