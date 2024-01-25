import React, { useState, useContext, useEffect, useRef } from 'react'
import { useMutation } from '@apollo/client'
import { useForm } from 'react-hook-form'
import { Button, Form, Row, Col, Spinner, Container } from 'react-bootstrap'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import useTranslation from 'next-translate/useTranslation'

import styles from '../style.module.scss'
import formStyles from '@assets/scss/components/form.module.scss'
import { validationErrors } from '../../../constants/ValidationErrors'
import { SEND_OTP, VERIFY_OTP } from '@graphql/auth/otp.mutation'
import { ToastrContext } from '@shared-components/toastr'
import { EMAIL, TOAST_TYPE } from '../../../constants/index'
import { allRoutes } from '../../../constants/allRoutes'

const Skeleton = dynamic(() => import('@shared-components/skeleton'), { ssr: false })
const ResetPassword = dynamic(() => import('@shared-components/auth/resetPassword'))
const Otp = dynamic(() => import('@shared/components/auth/otp'), {
  loading: () => (
    <div>
      <Skeleton height={'10px'} width={'100px'} />
      <Skeleton height={'35px'} className={'mt-2'} />
    </div>
  )
})

function ForgotPassword() {
  const { t } = useTranslation()
  const [openOtp, setOpenOtp] = useState(false)
  const { dispatch } = useContext(ToastrContext)
  const resetData = useRef()
  const resendData = useRef({})
  const [count, setCount] = useState()
  const [showResetPassword, setShowResetPassword] = useState(false)
  const [sCode, setSCode] = useState()
  const sLogin = useRef()
  const [isClear, setIsClear] = useState(false)
  let countDown
  const {
    register,
    formState: { errors },
    handleSubmit,
    reset
  } = useForm({ mode: 'onTouched' })

  const [sendOtp, { loading: sendOtpLoading }] = useMutation(SEND_OTP, {
    onCompleted: (data) => {
      if (data && data.sendOTP !== null) {
        if (!openOtp) {
          setOpenOtp(!openOtp)
        } else {
          startCount()
          localStorage.setItem('resendTime', +new Date() + 30000)
        }
        dispatch({
          type: 'SHOW_TOAST',
          payload: { message: data.sendOTP.sMessage, type: TOAST_TYPE.Success }
        })
      }
    }
  })

  const [verifyOtp, { loading: verifyOtpLoading }] = useMutation(VERIFY_OTP, {
    onCompleted: (data) => {
      if (data && data.verifyUserOTP !== null) {
        dispatch({
          type: 'SHOW_TOAST',
          payload: { message: data.verifyUserOTP.sMessage, type: TOAST_TYPE.Success }
        })
        setOpenOtp(!openOtp)
        reset()
        resetData.current = { sCode: sCode, sLogin: sLogin.current }
        setShowResetPassword(!showResetPassword)
      }
    }
  })

  useEffect(() => {
    startCount()
    return () => {
      clearInterval(countDown)
      setCount(0)
    }
  }, [])

  function startCount() {
    countDown = setInterval(() => {
      const fTime = localStorage.getItem('resendTime')
      const diffTime = (fTime - +new Date()) / 1000
      setCount(Math.ceil(diffTime))
      if (diffTime <= 0) {
        clearInterval(countDown)
        localStorage.removeItem('resendTime')
        setCount(0)
      }
    }, 1000)
  }

  const onSubmit = (data) => {
    sLogin.current = data.sLogin
    let CheckLoginType = ''
    isNaN(Number(data.sLogin)) ? (CheckLoginType = 'e') : (CheckLoginType = 'm')
    if (openOtp && sCode && sCode.length === 4) {
      verifyOtp({
        variables: {
          input: {
            eAuth: 'f',
            eType: CheckLoginType,
            sOtp: sCode,
            sLogin: data.sLogin
          }
        }
      })
    } else {
      startCount()
      localStorage.setItem('resendTime', +new Date() + 30000)
      sendOtp({
        variables: {
          input: {
            eAuth: 'f',
            eType: CheckLoginType,
            sLogin: data.sLogin
          }
        }
      })
      resendData.current = { eAuth: 'f', eType: CheckLoginType, sLogin: data.sLogin }
    }
  }

  const handleChange = () => {
    setOpenOtp(!openOtp)
    reset()
  }

  const manageResendOtp = () => {
    setIsClear(true)
    setSCode(0)
    sendOtp({
      variables: {
        input: {
          eAuth: resendData.current.eAuth,
          eType: resendData.current.eType,
          sLogin: resendData.current.sLogin
        }
      }
    })
  }
  function setOtp(e) {
    setIsClear(false)
    setSCode(e)
  }
  return (
    <section className="common-section">
      <Container>
        <Row className="justify-content-center">
          <Col md={9} lg={6} xl={7}>
            <div className="common-box">
              {!showResetPassword && (
                <Row className="justify-content-center">
                  <Col md={7} className={`${styles.innerSmall}`}>
                    <h3 className="small-head text-uppercase theme-text">{t('common:ForgotPassword')}</h3>
                    <p className={`${styles.infoText}`}>{t('common:ForgotPasswordInfo')}</p>
                    <Form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
                      <Form.Group className={`${formStyles.formGroup}`} controlId="emailPhone">
                        <div className="d-flex justify-content-between">
                          <Form.Label className={`${formStyles.label}`}>{t('common:Email')} *</Form.Label>
                          {openOtp && (
                            <b className={`${styles.pointerBtn} theme-text`} onClick={handleChange}>
                              {t('common:Change')}
                            </b>
                          )}
                        </div>
                        <Form.Control
                          className={`${formStyles.formControl} ${errors.sLogin && formStyles.hasError}`}
                          type="text"
                          name="sLogin"
                          {...register('sLogin', {
                            required: validationErrors.required,
                            pattern: { value: EMAIL, message: validationErrors.email }
                          })}
                        />
                        {errors.sLogin && (
                          <Form.Control.Feedback type="invalid" className={`${formStyles.invalidFeedback}`}>
                            {errors.sLogin.message}
                          </Form.Control.Feedback>
                        )}
                      </Form.Group>
                      {openOtp && (
                        <Form.Group className={`${formStyles.formGroup}`} controlId="emailPhone">
                          <div className="d-flex justify-content-between">
                            <Form.Label className={`${formStyles.label}`}>{t('common:EnterOTP')}</Form.Label>
                            <b className="theme-text">
                              {count > 0 && `00:${count <= 9 ? '0' + count : count}`}
                              {count === 0 && <p className={`${styles.pointerBtn} mb-0`} onClick={manageResendOtp}>{t('common:ResendOTP')}</p>}
                            </b>
                          </div>
                          <Otp setOtp={setOtp} type="forgotPassword" isClear={isClear}/>
                        </Form.Group>
                      )}
                      <Button
                        className="theme-btn full-btn"
                        variant="primary"
                        type="submit"
                        disabled={sendOtpLoading || verifyOtpLoading}
                      >
                        {t('common:Submit')}
                        {(sendOtpLoading || verifyOtpLoading) && <Spinner className="ms-2 align-middle" animation="border" size="sm" />}
                      </Button>
                      <div className={`${styles.orBlock} ${styles.orHLine} text-center`}>
                        <p>{t('common:OR')}</p>
                      </div>
                      <p className="mb-0 font-semi text-center">
                        {t('common:Gobackto')}{' '}
                        <Link href={allRoutes.signIn} prefetch={false}>
                          <a className="theme-text">{t('common:SignIn')}</a>
                        </Link>
                      </p>
                    </Form>
                  </Col>
                </Row>
              )}
              {showResetPassword && <ResetPassword resetData={resetData.current} />}
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  )
}

export default ForgotPassword
