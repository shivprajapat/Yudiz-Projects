import React, { useState, useContext, useEffect } from 'react'
import { useMutation } from '@apollo/client'
import useTranslation from 'next-translate/useTranslation'
import { Button, Form, Row, Col, Spinner } from 'react-bootstrap'
import PropTypes from 'prop-types'
import { useForm } from 'react-hook-form'
import { useRouter } from 'next/router'
import dynamic from 'next/dynamic'

import styles from '../style.module.scss'
import formStyles from '@assets/scss/components/form.module.scss'
import { TOAST_TYPE } from '@shared/constants/index'
import { SEND_OTP, VERIFY_OTP } from '@graphql/auth/otp.mutation'
import { SIGNUP } from '@graphql/auth/signup.mutation'
import { ToastrContext } from '../../toastr'
import { allRoutes } from '@shared/constants/allRoutes'

const Otp = dynamic(() => import('../otp'))

function VerifyEmail({ formData, reset }) {
  const router = useRouter()
  const { t } = useTranslation()
  const { dispatch } = useContext(ToastrContext)
  const { handleSubmit } = useForm({ mode: 'onTouched' })
  const [sCode, setSCode] = useState()
  const [count, setCount] = useState()
  const [isClear, setIsClear] = useState(false)
  let countDown

  const [verifyData, { loading: verifyLoading }] = useMutation(VERIFY_OTP, {
    onCompleted: (data) => {
      if (data && data.verifyUserOTP) {
        sessionStorage.removeItem('userData')
        dispatch({
          type: 'SHOW_TOAST',
          payload: { message: data.verifyUserOTP.message, type: TOAST_TYPE.Success }
        })
        signupData({
          variables: {
            input: {
              sCode: sCode,
              sConfirmPassword: formData.sConfirmPassword,
              sEmail: formData.sEmail?.trim(),
              sFullName: formData.sFullName,
              sPassword: formData.sPassword,
              sUserName: formData.sUserName
            }
          }
        })
      }
    }
  })

  const [sendOtp, { loading: sendOtpLoading }] = useMutation(SEND_OTP, {
    onCompleted: (data) => {
      if (data && data.sendOTP !== null) {
        startCount()
        localStorage.setItem('resendTime', +new Date() + 30000)
        dispatch({
          type: 'SHOW_TOAST',
          payload: { message: data.sendOTP.sMessage, type: TOAST_TYPE.Success }
        })
      }
    }
  })

  const [signupData, { loading: signUploading }] = useMutation(SIGNUP, {
    onCompleted: (data) => {
      if (data && data.signUp !== null) {
        dispatch({
          type: 'SHOW_TOAST',
          payload: { message: data.signUp.sMessage, type: TOAST_TYPE.Success }
        })
        reset()
        router.push(allRoutes.signIn)
      }
    }
  })

  useEffect(() => {
    startCount()
    localStorage.setItem('resendTime', +new Date() + 30000)
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
    verifyData({
      variables: {
        input: {
          eAuth: 'r',
          eType: 'e',
          sOtp: sCode,
          sLogin: formData.sEmail?.trim()
        }
      }
    })
  }

  const manageResendOtp = () => {
    setIsClear(true)
    setSCode(0)
    sendOtp({
      variables: {
        input: {
          eAuth: 'r',
          eType: 'e',
          sLogin: formData.sEmail?.trim()
        }
      }
    })
  }
  function setOtp(e) {
    setIsClear(false)
    setSCode(e)
  }

  useEffect(() => {
    router.beforePopState(({ url, as, options }) => {
      window.location.href = as
      return true
    })
  }, [router])
  return (
    <Row className="justify-content-center">
      <Col md={9} lg={6} xl={7}>
        <div className="common-box">
          <Row className="justify-content-center">
            <Col md={7} className={`${styles.innerSmall}`}>
              <h3 className="small-head text-uppercase theme-text">{t('common:VerifyEmail')}</h3>
              <p className={`${styles.infoText}`}>
                {t('common:SentOtpMessageForEmail')} <b>{formData.sEmail}</b>
                <br></br>
                {t('common:doNotRefresh')}
              </p>
              <Form autoComplete="off" onSubmit={handleSubmit(onSubmit)}>
                <Form.Group className={`${formStyles.formGroup}`} controlId="emailPhone">
                  <div className="d-flex justify-content-between">
                    <Form.Label className={`${formStyles.label}`}>{t('common:EnterOTP')}</Form.Label>
                    <b className="theme-text">
                      {count > 0 && `00:${count <= 9 ? '0' + count : count}`}
                      {count === 0 && <p onClick={manageResendOtp}>{t('common:ResendOTP')}</p>}
                    </b>
                  </div>
                  <Otp setOtp={setOtp} type="verifyEmail" isClear={isClear}/>
                </Form.Group>
                <Button
                  className="theme-btn full-btn"
                  variant="primary"
                  type="submit"
                  disabled={verifyLoading || sendOtpLoading || signUploading}
                >
                  {t('common:Submit')}
                  {(verifyLoading || sendOtpLoading || signUploading) && (
                    <Spinner className="ms-2 align-middle" animation="border" size="sm" />
                  )}
                </Button>
              </Form>
            </Col>
          </Row>
        </div>
      </Col>
    </Row>
  )
}

VerifyEmail.propTypes = {
  formData: PropTypes.object,
  reset: PropTypes.func
}

export default VerifyEmail
