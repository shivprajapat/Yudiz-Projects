import React, { useState, useContext } from 'react'
import { Button, Form, Row, Col, Spinner } from 'react-bootstrap'
import { useForm } from 'react-hook-form'
import { useMutation } from '@apollo/client'
import { useRouter } from 'next/router'
import useTranslation from 'next-translate/useTranslation'

import styles from '../style.module.scss'
import formStyles from '@assets/scss/components/form.module.scss'
// import { FacebookBrand, GoogleBrand } from '../../ctIcons'
import { EMAIL, TOAST_TYPE } from '@shared/constants/index'
import { validationErrors } from '@shared/constants/ValidationErrors'
import { LOGIN } from '@graphql/auth/login.mutation'
import { encryption } from '@utils'
import ToastrContext from '@shared-components/toastr/ToastrContext'
import { allRoutes } from '@shared/constants/allRoutes'
import CustomLink from '@shared/components/customLink'
import { setToken } from '@shared/libs/token'
import CustomFormGroup from '@shared/components/customForm/customFormGroup'
import CustomInput from '@shared/components/customForm/customInput'
import CustomFeedback from '@shared/components/customForm/customFeedback'
import dynamic from 'next/dynamic'

const CtToolTip = dynamic(() => import('@shared/components/ctToolTip'))

function SignIn() {
  const router = useRouter()
  const { t } = useTranslation()
  const { dispatch } = useContext(ToastrContext)
  const [showPassword, setShowPassword] = useState(false)

  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
    setValue
  } = useForm({ mode: 'onTouched' })
  const [login, { loading }] = useMutation(LOGIN, {
    onCompleted: (data) => {
      if (data && data.userLogin !== null) {
        setToken(data.userLogin.oData.sToken)
        router.back()
        dispatch({
          type: 'SHOW_TOAST',
          payload: { message: data.userLogin.sMessage, type: TOAST_TYPE.Success }
        })
        reset()
        // router.back()
      }
    }
  })

  const onSubmit = async (data) => {
    data.sPassword = await encryption(data.sPassword)
    login({
      variables: {
        input: {
          sLogin: data.sLogin.trim(),
          sPassword: data.sPassword
        }
      }
    })
  }

  const showPasswordHandle = () => {
    setShowPassword(!showPassword)
  }

  return (
    <Row className="justify-content-center">
      <Col md={9} lg={8} xl={7} xxl={6}>
        <div className={`common-box ${styles.login}`}>
          <div className={`${styles.lineTitle} line-title mb-2 mb-md-4 mx-auto text-uppercase text-center overflow-hidden`}>
            <h4 className="rounded-pill position-relative d-inline-block">{t('common:SignIn')}</h4>
          </div>
          <div className={`${styles.innerCol}`}>
            <Form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
              <CustomFormGroup className={`${formStyles.formGroup}`} controlId="emailPhone">
                <Form.Label className={`${formStyles.label}`}>{t('common:Email')}*</Form.Label>
                <CustomInput
                  className={`${formStyles.formControl} ${errors.sLogin && formStyles.hasError}`}
                  type="text"
                  name="sLogin"
                  register={register('sLogin', {
                    required: validationErrors.required,
                    maxLength: { value: 50, message: validationErrors.maxLength(50) },
                    pattern: { value: EMAIL, message: validationErrors.email },
                    validate: (value) => setValue('sLogin', value.toLowerCase())
                  })}
                />
                {errors.sLogin && (
                  <CustomFeedback message={errors.sLogin.message} type="invalid" className={`${formStyles.invalidFeedback}`} />
                )}
              </CustomFormGroup>
              <CustomFormGroup className={`${formStyles.formGroup}`} controlId="password">
                <Form.Label className={`${formStyles.label}`}>{t('common:Password')} *</Form.Label>
                <CustomInput
                  className={`${formStyles.formControl} ${formStyles.password} ${errors.sPassword && formStyles.hasError}`}
                  type={showPassword ? 'text' : 'password'}
                  name="sPassword"
                  register={register('sPassword', {
                    required: validationErrors.required
                  })}
                />
                <CtToolTip tooltip={showPassword ? t('common:Hide') : t('common:Show')}>
                  <Button
                    variant="link"
                    className={showPassword ? `${formStyles.icon} ${formStyles.active}` : `${formStyles.icon}`}
                    onClick={showPasswordHandle}
                  ></Button>
                </CtToolTip>
                {errors.sPassword && (
                  <CustomFeedback message={errors.sPassword.message} type="invalid" className={`${formStyles.invalidFeedback}`} />
                )}
              </CustomFormGroup>
              <div className="d-flex justify-content-end align-items-center mb-3" >
                <p className="theme-text mb-0">
                  <CustomLink href={allRoutes.forgotPassword} prefetch={false} replace>
                    <a>{t('common:ForgotPassword')}?</a>
                  </CustomLink>
                </p>
              </div>
              <Button className="theme-btn w-100" variant="primary" type="submit" disabled={loading}>
                {t('common:SignIn')}
                {loading && <Spinner className="ms-2 align-middle" animation="border" />}
              </Button>
            </Form>
            <p className="mt-3 mb-1 text-center">
              {t('common:Donthaveanaccount?')}{' '}
              <CustomLink href={allRoutes.signUp} prefetch={false} replace>
                <a className="theme-text">{t('common:SignUp')}</a>
              </CustomLink>
            </p>
          </div>
          {/* <Col md={6} className={`${styles.innerCol} ${styles.infoBlock} font-semi text-center d-flex flex-column justify-content-center`}>
          <p className={`${styles.joinText} text-uppercase`}>{t('common:SignInWith')}</p>
          <div className={`${styles.shareList} d-flex d-md-block`}>
            <Button className={`${styles.shareBtn} ${styles.facebook} mb-3`} variant="link d-block">
              <FacebookBrand />
              <span>{t('common:Facebook')}</span>
            </Button>
            <Button className={`${styles.shareBtn} ${styles.google} mb-3`} variant="link d-block">
              <GoogleBrand name="google-brand" />
              <span>{t('common:Google')}</span>
            </Button>
          </div>
          <p>
            {t('common:Donthaveanaccount?')}{' '}
            <CustomLink href={allRoutes.signUp}>
              <a className="theme-text">{t('common:SignUp')}</a>
            </Link>
          </p>
          <div className={`${styles.orBlock} d-flex align-items-center justify-content-center`}>
            <p className="mb-0">{t('common:OR')}</p>
          </div>
        </Col> */}
        </div>
      </Col>
    </Row>
  )
}

export default SignIn
