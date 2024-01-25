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
import ToastrContext from '@shared-components/toastr/ToastrContext'
import { useRouter } from 'next/router'
import { allRoutes } from '@shared/constants/allRoutes'
import CustomFormGroup from '@shared/components/customForm/customFormGroup'
import CustomInput from '@shared/components/customForm/customInput'
import CustomFeedback from '@shared/components/customForm/customFeedback'

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
        router.replace(allRoutes.signIn)
      }
    }
  })

  const onSubmit = async (data) => {
    data.sNewPassword = await encryption(data.sNewPassword)
    data.sConfirmNewPassword = await encryption(data.sConfirmNewPassword)
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
                className={`${formStyles.formControl} ${errors.sConfirmNewPassword && formStyles.hasError}`}
                type={showConfirmPassword ? 'text' : 'password'}
                text="sConfirmNewPassword"
                name="sConfirmNewPassword"
                register={register('sConfirmNewPassword', {
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
                <CustomFeedback message={errors.sConfirmNewPassword.message} type="invalid" className={`${formStyles.invalidFeedback}`} />
              )}
            </CustomFormGroup>
            <Button className="theme-btn w-100" variant="primary" type="submit" disabled={loading}>
              {t('common:Submit')} {loading && <Spinner className="ms-2 align-middle" animation="border" />}
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
