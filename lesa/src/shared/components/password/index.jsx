import React, { useEffect, useRef, useState } from 'react'
import { Form, Button, Spinner } from 'react-bootstrap'
import { validationErrors } from 'shared/constants/validationErrors'
import { useForm } from 'react-hook-form'
import { FormattedMessage, useIntl } from 'react-intl'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import PropTypes from 'prop-types'

import { eyeHideIcon, eyeShowIcon } from 'assets/images'
import { ForgotPasswordEmail, ForgotPasswordRequest, setPassword as setPasswordMethod } from 'modules/auth/redux/service'
import { allRoutes } from 'shared/constants/allRoutes'
import { PASSWORD, EMAIL } from 'shared/constants'

const Password = ({ changePassword, setPassword, forgotPassword, forgotPasswordEmail }) => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)

  const resMessage = useSelector((state) => state.auth.resMessage)
  const resStatus = useSelector((state) => state.auth.resStatus)

  useEffect(() => {
    if ((!resStatus, resMessage)) {
      setLoading(false)
    }
  }, [resStatus, resMessage])

  const showPasswordHandle = () => {
    setShowPassword(!showPassword)
  }
  const showConfirmPasswordHandle = () => {
    setShowConfirmPassword(!showConfirmPassword)
  }

  const {
    register,
    formState: { errors },
    handleSubmit,
    watch,
    setValue
  } = useForm({ mode: 'onTouched' })

  const password = useRef({})
  password.current = watch('password')

  const labels = {
    enterPassword: useIntl().formatMessage({ id: 'enterPassword' }),
    enterConfirmPassword: useIntl().formatMessage({ id: 'enterYourConfirmPassword' }),
    enterEmailId: useIntl().formatMessage({ id: 'enterEmailId' })
  }

  const onSubmit = (data) => {
    setLoading(true)
    if (forgotPasswordEmail) {
      dispatch(
        ForgotPasswordEmail(data, () => {
          navigate(allRoutes.login)
        })
      )
    }
    if (setPassword || changePassword) {
      dispatch(
        setPasswordMethod(data, () => {
          navigate(allRoutes.home, { replace: true })
        })
      )
    } else if (forgotPassword) {
      dispatch(
        ForgotPasswordRequest(data, () => {
          navigate(allRoutes.home, { replace: true })
        })
      )
    }
  }
  return (
    <div>
      <h5>
        {changePassword && <FormattedMessage id="changePassword" />}
        {setPassword && <FormattedMessage id="setPassword" />}
        {forgotPassword && <FormattedMessage id="forgotPassword" />}
      </h5>
      <p>
        <FormattedMessage id="enterYourNewPassword" />
      </p>
      <Form autoComplete="off" onSubmit={handleSubmit(onSubmit)}>
        {!forgotPassword && (
          <>
            <Form.Group className="form-group">
              <Form.Label>
                <FormattedMessage id="password" />
              </Form.Label>
              <div className="eye-icons">
                <Form.Control
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  className={errors.password && 'error'}
                  placeholder={labels.enterPassword}
                  {...register('password', {
                    required: validationErrors.required,
                    pattern: {
                      value: PASSWORD,
                      message: validationErrors.password
                    },
                    minLength: {
                      value: 8,
                      message: validationErrors.minLength(8)
                    }
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
            <Form.Group className="form-group">
              <Form.Label>
                <FormattedMessage id="confirmPassword" />
              </Form.Label>
              <div className="eye-icons">
                <Form.Control
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  className={errors.confirmPassword && 'error'}
                  placeholder={labels.enterConfirmPassword}
                  {...register('confirmPassword', {
                    required: validationErrors.required,
                    pattern: {
                      value: PASSWORD,
                      message: validationErrors.password
                    },
                    minLength: {
                      value: 8,
                      message: validationErrors.minLength(8)
                    },
                    validate: (value) => value === password.current || validationErrors.passwordNotMatch
                  })}
                />
                <Button className="eye-btn" onClick={showConfirmPasswordHandle}>
                  <img src={showConfirmPassword ? eyeShowIcon : eyeHideIcon} alt="password" className="img-fluid" />
                </Button>
              </div>
              {errors.confirmPassword && (
                <Form.Control.Feedback type="invalid" className="invalidFeedback">
                  {errors.confirmPassword.message}
                </Form.Control.Feedback>
              )}
            </Form.Group>
          </>
        )}
        {forgotPassword && (
          <Form.Group className="form-group">
            <Form.Label>
              <FormattedMessage id="emailId" />
            </Form.Label>
            <Form.Control
              name="email"
              type="text"
              placeholder={labels.enterEmailId}
              className={errors.email && 'error'}
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
        )}
        <Button className="white-btn" type="submit" disabled={loading}>
          <FormattedMessage id="submit" />
          {loading && <Spinner animation="border" size="sm" />}
        </Button>
      </Form>
    </div>
  )
}
Password.propTypes = {
  changePassword: PropTypes.bool,
  setPassword: PropTypes.bool,
  forgotPassword: PropTypes.bool,
  forgotPasswordEmail: PropTypes.bool
}
export default Password
