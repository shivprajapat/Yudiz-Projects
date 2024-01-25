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
import ToastrContext from '@shared/components/toastr/ToastrContext'
import { allRoutes } from '@shared/constants/allRoutes'
import CustomFormGroup from '@shared/components/customForm/customFormGroup'
import CustomInput from '@shared/components/customForm/customInput'
import CustomFeedback from '@shared/components/customForm/customFeedback'

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

  const onSubmit = async (data) => {
    const newTrimData = trimAllValues(data)
    newTrimData.sNewPassword = await encryption(newTrimData.sNewPassword)
    newTrimData.sConfirmPassword = await encryption(newTrimData.sConfirmPassword)
    newTrimData.sCurrentPassword = await encryption(newTrimData.sCurrentPassword)
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
                  <CustomFormGroup className={`${formStyles.formGroup}`} controlId="cPassword">
                    <Form.Label className={`${formStyles.label}`}>{t('common:CurrentPassword')} *</Form.Label>
                    <CustomInput
                      className={`${formStyles.formControl} ${formStyles.password} ${errors.sCurrentPassword && formStyles.hasError}`}
                      type={showCurrentPassword ? 'text' : 'password'}
                      name="sCurrentPassword"
                      register={register('sCurrentPassword', {
                        required: validationErrors.required
                      })}
                    />
                    <Button
                      variant="link"
                      className={showCurrentPassword ? `${formStyles.icon} ${formStyles.active}` : `${formStyles.icon}`}
                      onClick={showCurrentPasswordHandle}
                    ></Button>
                    {errors.sCurrentPassword && (
                      <CustomFeedback message={errors.sCurrentPassword.message} type="invalid" className={`${formStyles.invalidFeedback}`} />
                    )}
                  </CustomFormGroup>
                  <CustomFormGroup className={`${formStyles.formGroup}`} controlId="nPassword">
                    <Form.Label className={`${formStyles.label}`}>{t('common:NewPassword')} *</Form.Label>
                    <CustomInput
                      className={`${formStyles.formControl} ${formStyles.password} ${errors.sNewPassword && formStyles.hasError}`}
                      type={showPassword ? 'text' : 'password'}
                      name="sNewPassword"
                      register={register('sNewPassword', {
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
                      <CustomFeedback message={errors.sNewPassword.message} type="invalid" className={`${formStyles.invalidFeedback}`} />
                    )}
                  </CustomFormGroup>
                  <CustomFormGroup className={`${formStyles.formGroup}`} controlId="cNewPassword">
                    <Form.Label className={`${formStyles.label}`}>{t('common:ConfirmNewPassword')} *</Form.Label>
                    <CustomInput
                      className={`${formStyles.formControl} ${formStyles.password} ${errors.sConfirmPassword && formStyles.hasError}`}
                      type={showConfirmPassword ? 'text' : 'password'}
                      text="sConfirmPassword"
                      name="sConfirmPassword"
                      register={register('sConfirmPassword', {
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
                      <CustomFeedback message={errors.sConfirmPassword.message} type="invalid" className={`${formStyles.invalidFeedback}`} />
                    )}
                  </CustomFormGroup>
                  <Button className="theme-btn w-100" variant="primary" type="submit" disabled={loading}>
                    {t('common:Submit')} {loading && <Spinner className="ms-2 align-middle" animation="border" />}
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
