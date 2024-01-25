import React, { useState, useRef, useContext } from 'react'
import PropTypes from 'prop-types'
import { useMutation } from '@apollo/client'
import { useForm } from 'react-hook-form'
import { Button, Form, Row, Col, Spinner } from 'react-bootstrap'
import useTranslation from 'next-translate/useTranslation'
import { useRouter } from 'next/router'

import styles from '../style.module.scss'
import formStyles from '@assets/scss/components/form.module.scss'
import { validationErrors } from '../../../constants/ValidationErrors'
import { PASSWORD, TOAST_TYPE } from '../../../constants/index'
import { encryption, trimAllValues } from '@utils'
import { CHANGE_PASSWORD } from '@graphql/auth/changePassword.mutation'
import { ToastrContext } from '@shared/components/toastr'
import { allRoutes } from '@shared/constants/allRoutes'

function ChangePassword(props) {
  const { t } = useTranslation()
  const { dispatch } = useContext(ToastrContext)
  const router = useRouter()
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const showCurrentPasswordHandle = () => {
    setShowCurrentPassword(!showCurrentPassword)
  }
  const showNewPasswordHandle = () => {
    setShowPassword(!showPassword)
  }
  const showConfirmPasswordHandle = () => {
    setShowConfirmPassword(!showConfirmPassword)
  }

  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
    watch
  } = useForm({ mode: 'onTouched' })

  const sNewPassword = useRef({})
  sNewPassword.current = watch('sNewPassword')

  const onSubmit = (data) => {
    const newTrimData = trimAllValues(data)
    newTrimData.sNewPassword = encryption(newTrimData.sNewPassword)
    newTrimData.sConfirmPassword = encryption(newTrimData.sConfirmPassword)
    newTrimData.sCurrentPassword = encryption(newTrimData.sCurrentPassword)
    changePassword({
      variables: {
        input: {
          sConfirmPassword: newTrimData.sConfirmPassword,
          sCurrentPassword: newTrimData.sCurrentPassword,
          sNewPassword: newTrimData.sNewPassword
        }
      }
    })
  }
  const [changePassword, { loading }] = useMutation(CHANGE_PASSWORD, {
    onCompleted: (data) => {
      if (data && data.userChangePassword !== null) {
        showCurrentPassword && setShowCurrentPassword(!showCurrentPassword)
        showPassword && setShowPassword(!showPassword)
        showConfirmPassword && setShowConfirmPassword(!showConfirmPassword)
        reset()
        dispatch({
          type: 'SHOW_TOAST',
          payload: { message: data.userChangePassword.sMessage, type: TOAST_TYPE.Success }
        })
        router.push(allRoutes.home)
      }
    }
  })

  return (
    <>
      <Row className="justify-content-center">
        <Col xl={6} lg={7} md={8} sm={10}>
          <div className={`common-box ${styles.login}`}>
            <Row className="justify-content-center">
              <Col sm={9} className={`${styles.innerSmall}`}>
                <h3 className="small-head text-uppercase theme-text">{t('common:ChangePassword')}</h3>
                <p className={`${styles.infoText}`}></p>
                <Form autoComplete="off" onSubmit={handleSubmit(onSubmit)}>
                  <Form.Group className={`${formStyles.formGroup}`} controlId="cPassword">
                    <Form.Label className={`${formStyles.label}`}>{t('common:CurrentPassword')} *</Form.Label>
                    <Form.Control
                      className={`${formStyles.formControl} ${errors.sCurrentPassword && formStyles.hasError}`}
                      type={showCurrentPassword ? 'text' : 'password'}
                      name="sCurrentPassword"
                      {...register('sCurrentPassword', {
                        required: validationErrors.required
                      })}
                    />
                    <Button
                      variant="link"
                      className={showCurrentPassword ? `${formStyles.icon} ${formStyles.active}` : `${formStyles.icon}`}
                      onClick={showCurrentPasswordHandle}
                    ></Button>
                    {errors.sCurrentPassword && (
                      <Form.Control.Feedback type="invalid" className={`${formStyles.invalidFeedback}`}>
                        {errors.sCurrentPassword.message}
                      </Form.Control.Feedback>
                    )}
                  </Form.Group>
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
                      className={`${formStyles.formControl} ${errors.sConfirmPassword && formStyles.hasError}`}
                      type={showConfirmPassword ? 'text' : 'password'}
                      text="sConfirmPassword"
                      {...register('sConfirmPassword', {
                        required: validationErrors.required,
                        validate: (value) => value === sNewPassword.current || validationErrors.passwordNotMatch
                      })}
                    />
                    <Button
                      variant="link"
                      className={showConfirmPassword ? `${formStyles.icon} ${formStyles.active}` : `${formStyles.icon}`}
                      onClick={showConfirmPasswordHandle}
                    ></Button>
                    {errors.sConfirmPassword && (
                      <Form.Control.Feedback type="invalid" className={`${formStyles.invalidFeedback}`}>
                        {errors.sConfirmPassword.message}
                      </Form.Control.Feedback>
                    )}
                  </Form.Group>
                  <Button className="theme-btn full-btn" variant="primary" type="submit" disabled={loading}>
                    {t('common:Submit')} {loading && <Spinner className="ms-2 align-middle" animation="border" size="sm" />}
                  </Button>
                </Form>
              </Col>
            </Row>
          </div>
        </Col>
      </Row>
    </>
  )
}

ChangePassword.propTypes = {
  openChangePass: PropTypes.any,
  handleChangePass: PropTypes.func
}

export default ChangePassword
