import React, { useState, useRef, useContext } from 'react'
import PropTypes from 'prop-types'
import { useMutation } from '@apollo/client'
import { useForm } from 'react-hook-form'
import { Button, Form, Row, Col, Spinner, Container } from 'react-bootstrap'

import styles from '../style.module.scss'
import useTranslation from 'next-translate/useTranslation'
import formStyles from '@assets/scss/components/form.module.scss'
import { validationErrors } from '@shared/constants/ValidationErrors'
import { PASSWORD, TOAST_TYPE } from '@shared/constants/index'
import { encryption } from '../../../utils'
import { RESET_PASSWORD } from '@graphql/auth/resetPassword.mutation'
import { ToastrContext } from '@shared-components/toastr'
import { useRouter } from 'next/router'
import { allRoutes } from '@shared/constants/allRoutes'

function ResetPassword({ resetData }) {
  const router = useRouter()
  const { t } = useTranslation()
  const { dispatch } = useContext(ToastrContext)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const sNewPassword = useRef({})
  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
    watch
  } = useForm({ mode: 'onTouched' })
  sNewPassword.current = watch('sNewPassword')

  const [resetPassword, { loading }] = useMutation(RESET_PASSWORD, {
    onCompleted: (data) => {
      if (data && data.resetUserPassword !== null) {
        dispatch({
          type: 'SHOW_TOAST',
          payload: { message: data.resetUserPassword.sMessage, type: TOAST_TYPE.Success }
        })
        reset()
        router.push(allRoutes.signIn)
      }
    }
  })

  const onSubmit = (data) => {
    data.sNewPassword = encryption(data.sNewPassword)
    data.sConfirmNewPassword = encryption(data.sConfirmNewPassword)
    resetPassword({
      variables: {
        input: {
          sCode: resetData.sCode,
          sConfirmNewPassword: data.sNewPassword,
          sLogin: resetData.sLogin,
          sNewPassword: data.sNewPassword
        }
      }
    })
  }

  const showNewPasswordHandle = () => {
    setShowPassword(!showPassword)
  }

  const showConfirmNewPasswordHandle = () => {
    setShowConfirmPassword(!showConfirmPassword)
  }

  return (
    <Container>
      <Row className="justify-content-center">
        <Col md={7} className={`${styles.innerSmall}`}>
          <h3 className="small-head text-uppercase theme-text">{t('common:ResetPassword')}</h3>
          <p className={`${styles.infoText}`}></p>
          <Form autoComplete="off" onSubmit={handleSubmit(onSubmit)}>
            <Form.Group className={`${formStyles.formGroup}`} controlId="nPassword">
              <Form.Label className={`${formStyles.label}`}>{t('common:NewPassword')} *</Form.Label>
              <Form.Control
                className={`${formStyles.formControl} ${formStyles.password} ${errors.sNewPassword && formStyles.hasError}`}
                type={showPassword ? 'text' : 'password'}
                name="sNewPassword"
                {...register('sNewPassword', {
                  required: validationErrors.required,
                  pattern: {
                    value: PASSWORD,
                    message: validationErrors.passwordRegEx
                  },
                  maxLength: { value: 12, message: validationErrors.rangeLength(8, 12) },
                  minLength: { value: 8, message: validationErrors.rangeLength(8, 12) }
                })}
              />
              <Button
                variant="link"
                className={showPassword ? `${formStyles.icon} ${formStyles.active}` : `${formStyles.icon}`}
                onClick={showNewPasswordHandle}
              ></Button>
              {errors.sNewPassword && (
                <Form.Control.Feedback type="invalid" className={`${formStyles.invalidFeedback}`}>
                  {errors.sNewPassword.message}
                </Form.Control.Feedback>
              )}
            </Form.Group>
            <Form.Group className={`${formStyles.formGroup}`} controlId="cNewPassword">
              <Form.Label className={`${formStyles.label}`}>{t('common:ConfirmNewPassword')} *</Form.Label>
              <Form.Control
                className={`${formStyles.formControl} ${errors.sConfirmNewPassword && formStyles.hasError}`}
                type={showConfirmPassword ? 'text' : 'password'}
                text="sConfirmNewPassword"
                {...register('sConfirmNewPassword', {
                  required: validationErrors.required,
                  validate: (value) => value === sNewPassword.current || validationErrors.passwordNotMatch
                })}
              />
              <Button
                variant="link"
                className={showConfirmPassword ? `${formStyles.icon} ${formStyles.active}` : `${formStyles.icon}`}
                onClick={showConfirmNewPasswordHandle}
              ></Button>
              {errors.sConfirmNewPassword && (
                <Form.Control.Feedback type="invalid" className={`${formStyles.invalidFeedback}`}>
                  {errors.sConfirmNewPassword.message}
                </Form.Control.Feedback>
              )}
            </Form.Group>
            <Button className="theme-btn full-btn" variant="primary" type="submit" disabled={loading}>
              {t('common:Submit')} {loading && <Spinner className="ms-2 align-middle" animation="border" size="sm" />}
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  )
}

ResetPassword.propTypes = {
  resetData: PropTypes.object
}

export default ResetPassword
