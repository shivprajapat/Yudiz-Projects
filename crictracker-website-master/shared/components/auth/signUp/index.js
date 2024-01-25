import React, { useRef, useState, useContext, useEffect } from 'react'
import { useMutation } from '@apollo/client'
import { Button, Form, Row, Col, Spinner } from 'react-bootstrap'
import { useForm } from 'react-hook-form'
import { useRouter } from 'next/router'
import useTranslation from 'next-translate/useTranslation'
import dynamic from 'next/dynamic'

import styles from '../style.module.scss'
import formStyles from '@assets/scss/components/form.module.scss'
// import { FacebookBrand, GoogleBrand } from '../../ctIcons'
import { validationErrors } from '@shared/constants/ValidationErrors'
import { NO_SPACE, EMAIL, PASSWORD, TOAST_TYPE, queryParamOtp } from '@shared/constants/index'
import { encryption } from '@utils'
import { SEND_OTP } from '@graphql/auth/otp.mutation'
import ToastrContext from '@shared-components/toastr/ToastrContext'
import { allRoutes } from '@shared/constants/allRoutes'
import { USER_EXISTS } from '@graphql/auth/signup.mutation'
import CustomLink from '@shared/components/customLink'
import CustomFormGroup from '@shared/components/customForm/customFormGroup'
import CustomInput from '@shared/components/customForm/customInput'
import CustomFeedback from '@shared/components/customForm/customFeedback'

const VerifyEmail = dynamic(() => import('../verifyEmail'))

function SignUp() {
  const { t } = useTranslation()
  const router = useRouter()
  const { dispatch } = useContext(ToastrContext)
  const [openOtp, setOpenOtp] = useState(false)
  const [signupData, setSignupData] = useState({})
  const {
    register,
    formState: { errors },
    handleSubmit,
    watch,
    setValue,
    reset
  } = useForm({ mode: 'onTouched' })
  const sPassword = useRef({})
  sPassword.current = watch('sPassword')
  const sEmail = watch('sEmail')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [checkChange, setCheckChange] = useState(false)

  const [sendOtp, { loading: sendOtpLoading }] = useMutation(SEND_OTP, {
    onCompleted: (data) => {
      if (data && data.sendOTP) {
        sessionStorage.setItem('userData', JSON.stringify({
          sUserName: signupData.sUserName,
          sFullName: signupData.sFullName,
          sEmail: signupData.sEmail?.trim()
        }))
        setOpenOtp(!openOtp)
        router.push(allRoutes.signUp + queryParamOtp)
        dispatch({
          type: 'SHOW_TOAST',
          payload: { message: data.sendOTP.sMessage, type: TOAST_TYPE.Success }
        })
      }
    }
  })
  const [userExists, { loading: userExistsLoading }] = useMutation(USER_EXISTS, {
    onCompleted: (data) => {
      if (data && data.userExists) {
        sendOtp({
          variables: {
            input: {
              eAuth: 'r',
              eType: 'e',
              sLogin: sEmail?.trim()
            }
          }
        })
      }
    }
  })
  const showPasswordHandle = () => {
    setShowPassword(!showPassword)
  }

  const showConfirmPasswordHandle = () => {
    setShowConfirmPassword(!showConfirmPassword)
  }

  const checkChangeHandle = () => {
    setCheckChange(!checkChange)
  }

  const onSubmit = async (data) => {
    data.sConfirmPassword = await encryption(data.sConfirmPassword)
    data.sPassword = await encryption(data.sPassword)
    setSignupData({ ...data })
    userExists({
      variables: {
        input: {
          sUserName: data.sUserName,
          sLogin: data.sEmail.trim()
        }
      }
    })
  }

  useEffect(() => {
    if (sessionStorage.getItem('userData') !== null) {
      setSignupData(JSON.parse(sessionStorage.getItem('userData')))
    }
  }, [])

  useEffect(() => {
    reset({
      sUserName: signupData.sUserName,
      sFullName: signupData.sFullName,
      sEmail: signupData.sEmail?.trim()
    })
  }, [signupData])

  return (
    <>
      {!openOtp && (
        <Row className="justify-content-center">
          <Col md={9} lg={8} xl={7} xxl={6}>
            <div className={`common-box ${styles.login}`}>
              <div className={`${styles.lineTitle} line-title mb-2 mb-md-4 mx-auto text-uppercase text-center overflow-hidden`}>
                <h4 className="rounded-pill position-relative d-inline-block">{t('common:SignUp')}</h4>
              </div>
              {/* <Row className="align-items-center flex-column-reverse flex-md-row"> */}
              <div md={6} className={styles.innerCol}>
                <Form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
                  <CustomFormGroup className={formStyles.formGroup} controlId="fullName">
                    <Form.Label className={`${formStyles.label}`} >{t('common:FullName')} *</Form.Label>
                    <CustomInput
                      className={`${formStyles.formControl} ${errors.sFullName && formStyles.hasError}`}
                      name="sFullName"
                      register={register('sFullName', {
                        required: validationErrors.required,
                        minLength: { value: 3, message: validationErrors.minLength(3) }
                      })}
                      type="text" />
                    {errors.sFullName && (
                      <CustomFeedback message={errors.sFullName.message} type="invalid" className={`${formStyles.invalidFeedback}`} />
                    )}
                  </CustomFormGroup>
                  <CustomFormGroup className={formStyles.formGroup} controlId="userName">
                    <Form.Label className={`${formStyles.label}`}>{t('common:UserName')} *</Form.Label>
                    <CustomInput
                      className={`${formStyles.formControl} ${errors.sUserName && formStyles.hasError}`}
                      type="text"
                      name="sUserName"
                      register={register('sUserName', {
                        required: validationErrors.required,
                        minLength: { value: 3, message: validationErrors.minLength(3) },
                        maxLength: { value: 30, message: validationErrors.maxLength(30) },
                        pattern: {
                          value: NO_SPACE,
                          message: validationErrors.noSPace
                        }
                      })}
                    />
                    {errors.sUserName && (
                      <CustomFeedback message={errors.sUserName.message} type="invalid" className={`${formStyles.invalidFeedback}`} />
                    )}
                  </CustomFormGroup>
                  <CustomFormGroup className={formStyles.formGroup} controlId="email">
                    <Form.Label className={`${formStyles.label}`}>{t('common:Email')} *</Form.Label>
                    <CustomInput
                      className={`${formStyles.formControl} ${errors.sEmail && formStyles.hasError}`}
                      type="text"
                      name="sEmail"
                      register={register('sEmail', {
                        required: validationErrors.required,
                        pattern: { value: EMAIL, message: validationErrors.email },
                        validate: (value) => setValue('sEmail', value.toLowerCase())
                      })}
                    />
                    {errors.sEmail && (
                      <CustomFeedback message={errors.sEmail.message} type="invalid" className={`${formStyles.invalidFeedback}`} />
                    )}
                  </CustomFormGroup>
                  <CustomFormGroup className={formStyles.formGroup} controlId="password">
                    <Form.Label className={`${formStyles.label}`}>{t('common:Password')} *</Form.Label>
                    <CustomInput
                      className={`${formStyles.formControl} ${formStyles.password} ${errors.sPassword && formStyles.hasError}`}
                      type={showPassword ? 'text' : 'password'}
                      name="sPassword"
                      register={register('sPassword', {
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
                      onClick={showPasswordHandle}
                    ></Button>
                    {errors.sPassword && (
                      <CustomFeedback message={errors.sPassword.message} type="invalid" className={`${formStyles.invalidFeedback}`} />
                    )}
                  </CustomFormGroup>
                  <CustomFormGroup className={formStyles.formGroup} controlId="cPassword">
                    <Form.Label className={`${formStyles.label}`}>{t('common:ConfirmPassword')} *</Form.Label>
                    <CustomInput
                      className={`${formStyles.formControl} ${formStyles.password} ${errors.sConfirmPassword && formStyles.hasError}`}
                      type={showConfirmPassword ? 'text' : 'password'}
                      name="sConfirmPassword"
                      register={register('sConfirmPassword', {
                        required: validationErrors.required,
                        validate: (value) => value === sPassword.current || validationErrors.passwordNotMatch
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
                  <CustomFormGroup className={`${formStyles.formGroup} ${formStyles.formCheck} ${formStyles.formRadioCheck}`} controlId="acceptCheckbox">
                    <Form.Check.Input type="checkbox" onChange={checkChangeHandle} />
                    <Form.Check.Label>
                      {t('common:Iaccept')}{' '}
                      <CustomLink href={allRoutes.termsAndConditions} prefetch={false}>
                        <a target="_blank" className="theme-text">{t('common:TermsandConditions')}</a>
                      </CustomLink>
                    </Form.Check.Label>
                  </CustomFormGroup>
                  <Button
                    type="submit"
                    className="theme-btn w-100"
                    variant="primary"
                    disabled={!checkChange || sendOtpLoading || userExistsLoading}
                  >
                    {t('common:SignUp')}
                    {(sendOtpLoading || userExistsLoading) && <Spinner className="ms-2 align-middle" animation="border" />}
                  </Button>
                  <p className="mt-3 mb-1 text-center">
                    {t('common:Alreadyhaveanaccount?')}{' '}
                    <CustomLink href={allRoutes.signIn} prefetch={false} replace>
                      <a className="theme-text">{t('common:SignIn')}</a>
                    </CustomLink>
                  </p>
                </Form>
              </div>
              {/* <Col
                  md={6}
                  className={`${styles.innerCol} ${styles.infoBlock} font-semi text-center d-flex flex-column justify-content-center`}
                >
                  <p className={`${styles.joinText} text-uppercase`}>{t('common:JoinWith')}</p>
                  <div className={`${styles.shareList} d-flex d-md-block`}>
                    <Button className={`${styles.shareBtn} ${styles.facebook} mb-3`} variant="link d-block">
                      <FacebookBrand />
                      <span className="d-none d-sm-inline">{t('common:Facebook')}</span>
                    </Button>
                    <Button className={`${styles.shareBtn} ${styles.google} mb-3`} variant="link d-block">
                      <GoogleBrand />
                      <span className="d-none d-sm-inline">{t('common:Google')}</span>
                    </Button>
                  </div>
                  <p>
                    {t('common:Alreadyhaveanaccount?')}{' '}
                    <CustomLink href={allRoutes.signIn}>
                      <a className="theme-text">{t('common:SignIn')}</a>
                    </Link>
                  </p>
                  <div className={`${styles.orBlock} d-flex align-items-center justify-content-center`}>
                    <p className="mb-0">{t('common:OR')}</p>
                  </div>
                </Col> */}
              {/* </Row> */}
            </div>
          </Col>
        </Row>
      )}
      {openOtp && <VerifyEmail formData={signupData} reset={reset} />}
    </>
  )
}

export default SignUp
