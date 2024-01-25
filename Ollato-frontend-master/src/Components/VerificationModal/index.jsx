import React, { useRef, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { useSnackbar } from 'react-notistack'
import PropTypes from 'prop-types'

// Components
import { Form, Button, Modal } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'

// Action Files
import { otpVerification, mobileOTPVerification } from '../../Actions/auth'

// Validation-Scheme for fields
import { validationOTPSchema } from '../../Shared/ValidationSchemes/validation'

const Index = (props) => {
  const dispatch = useDispatch()
  const { enqueueSnackbar } = useSnackbar()
  const { show, setShow } = props

  // useState
  const [type, setType] = useState('')

  // useSelector
  const isVerified = useSelector(state => state.auth.isOTPSignupVerified)
  const isOtpVerified = useSelector(state => state.auth.isMobileOTPSend)
  const isMobileVerified = useSelector(state => state.auth.isMobileOTPVerification)
  const isAuthMessage = useSelector(state => state.auth.resMessage)
  const isSend = useSelector(state => state.auth.isEmailAddressVerified)
  const previousProps = useRef({ isVerified, isMobileVerified, isAuthMessage, isSend, isOtpVerified }).current

  // Toastify Notification for OTP Verified
  useEffect(() => {
    if (previousProps?.isOtpVerified !== isOtpVerified) {
      if (isOtpVerified === true) {
        enqueueSnackbar(`${isAuthMessage}`, {
          variant: 'success',
          autoHide: true,
          hide: 3000
        })
        setShow(false)
        // setShowEmailMobile(false)
      } else if (isOtpVerified === false) {
        enqueueSnackbar(`${isAuthMessage}`, {
          variant: 'error',
          autoHide: true,
          hide: 3000
        }
        )
      }
    }
    return () => {
      previousProps.isOtpVerified = isOtpVerified
    }
  }, [isOtpVerified])

  // Mobile Verified useEffect
  useEffect(() => {
    if (previousProps?.isMobileVerified !== isMobileVerified) {
      if (isMobileVerified === true) {
        enqueueSnackbar(`${isAuthMessage}`, {
          variant: 'success',
          autoHide: true,
          hide: 3000
        })
        setShow(true)
        // setShowEmailMobile(true)
      } else if (isMobileVerified === false) {
        enqueueSnackbar(`${isAuthMessage}`, {
          variant: 'error',
          autoHide: true,
          hide: 3000
        }
        )
        setShow(false)
      }
    }
    return () => {
      previousProps.isMobileVerified = isMobileVerified
    }
  }, [isMobileVerified])

  // Toastify Notification for OTP send
  useEffect(() => {
    if (previousProps?.isSend !== isSend) {
      if (isSend) {
        enqueueSnackbar(`${isAuthMessage}`, {
          variant: 'success',
          autoHide: true,
          hide: 3000
        })
        setShow(true)
        // setShowEmailMobile(true)
      } else if (isSend === false) {
        enqueueSnackbar(`${isAuthMessage}`, {
          variant: 'error',
          autoHide: true,
          hide: 3000
        }
        )
        setShow(false)
      }
    }
    return () => {
      previousProps.isSend = isSend
    }
  }, [isSend])

  // useForm
  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: yupResolver(validationOTPSchema)
  })
  const { onChange, name } = register('emailMob')

  // HandleModal close Method
  const handleClose = () => {
    setShow(false)
  }

  // HandleSubmit Method for Verification
  const onSubmit = data => {
    // eslint-disable-next-line no-useless-escape
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    re.test(props.email)
    let userData = {}
    // eslint-disable-next-line react/prop-types
    if (props.fieldType === 'email') {
      setType('Email')
      userData = {
        login: props.email,
        otp: data.input1 + data.input2 + data.input3 + data.input4
      }
      if (userData) {
        dispatch(otpVerification(userData))
      }
      props.parentCallback(data.input1 + data.input2 + data.input3 + data.input4)
    } else {
      setType('Mobile')
      userData = {
        login: props.mobile,
        otp: data.input1 + data.input2 + data.input3 + data.input4
      }
      if (userData) {
        dispatch(mobileOTPVerification(userData))
      }
      props.emailOTP(data.input1 + data.input2 + data.input3 + data.input4)
    }
    reset()
  }

  useEffect(() => {
    if (type) {
      // props.parentCallback2(type)
    }
  }, [type])

  // Toastify Notification for OTP Verification
  useEffect(() => {
    if (previousProps?.isVerified !== isVerified) {
      if (isVerified) {
        enqueueSnackbar(`${isAuthMessage}`, {
          variant: 'success',
          autoHide: true,
          hide: 3000
        })
        setShow(false)
        // setShowEmailMobile(false)
      } else if (isVerified === false) {
        enqueueSnackbar(`${isAuthMessage}`, {
          variant: 'error',
          autoHide: true,
          hide: 3000
        }
        )
      }
    }
    return () => {
      previousProps.isVerified = isVerified
    }
  }, [isVerified])

  // Auto next to next input field
  const inputfocus = (elmnt) => {
    if (elmnt.key === 'Delete' || elmnt.key === 'Backspace') {
      const next = elmnt.target.tabIndex - 2

      if (next > -1) {
        elmnt.target.form.elements[next].focus()
      }
    } else {
      const next = elmnt.target.tabIndex

      if (next <= 4) {
        elmnt.target.form.elements[next].focus()
      }
    }
  }

  return (
       <>
        <Modal show={show} onHide={handleClose} aria-labelledby="contained-modal-title-vcenter"
          centered>
          <Modal.Header closeButton>
          </Modal.Header>
          <Modal.Body>
            <div className="title-box has-subtitle">
              <h2>One Time Password </h2>
              <h4>We sent you 4 digit OTP code in your
                    {
                      props.fieldType === 'mobile' ? <a href="" style={{ paddingLeft: 10 }} >{props?.mobile}</a> : <a href="" style={{ paddingLeft: 10 }} >{props?.email}</a>
                    }
              </h4>
            </div>
            <Form onSubmit={handleSubmit(onSubmit)}>
              <Form.Group className="form-group " controlId="formBasicotp">
                  <Form.Label>One Time Password</Form.Label>
                    <div className="otp-input-fields">
                      <Form.Group
                        className={`form-group ${errors.input1?.message ? 'error-occured' : ''}`}
                        controlId="formBasicotp"
                      >
                        <Form.Control
                          type="text"
                          name={name}
                          placeholder="X"
                          tabIndex="1" maxLength="1" onKeyUp={e => inputfocus(e)}
                          onChange={(e) => {
                            onChange(e)
                          }}
                          {...register('input1', { required: true })}
                        />
                      </Form.Group>
                      <Form.Group
                        className={`form-group ${errors.input2?.message ? 'error-occured' : ''}`}
                        controlId="formBasicotp">
                        <Form.Control
                          type="text"
                          name={name}
                          placeholder="X"
                          tabIndex="2" maxLength="1" onKeyUp={e => inputfocus(e)}
                          onChange={(e) => {
                            onChange(e)
                          }}
                          {...register('input2', { required: true })}
                        />
                      </Form.Group>
                      <Form.Group
                        className={`form-group ${errors.input3?.message ? 'error-occured' : ''}`}
                        controlId="formBasicotp">
                        <Form.Control
                          type="text"
                          name={name}
                          placeholder="X"
                          tabIndex="3" maxLength="1" onKeyUp={e => inputfocus(e)}
                          onChange={(e) => {
                            onChange(e)
                          }}
                          {...register('input3', { required: true })}
                        />
                      </Form.Group>
                      <Form.Group
                        className={`form-group ${errors.input4?.message ? 'error-occured' : ''}`}
                        controlId="formBasicotp"
                      >
                        <Form.Control
                          type="text"
                          name={name}
                          placeholder="X"
                          tabIndex="4" maxLength="1" onKeyUp={e => inputfocus(e)}
                          onChange={(e) => {
                            onChange(e)
                          }}
                          {...register('input4', { required: true })}
                            />
                      </Form.Group>
                      </div>
                        {
                          ((errors.input1?.message) ||
                          (errors.input2?.message) ||
                          (errors.input3?.message) ||
                          (errors.input4?.message)) &&
                          <Form.Text className="error-msg">{errors.input1?.message || errors.input2?.message || errors.input3?.message || errors.input4?.message}</Form.Text>
                        }
                      </Form.Group>
                      <Button variant="primary" type="submit" className='theme-btn large-btn'>
                        Send
                      </Button>
                </Form>
          </Modal.Body>
        <Modal.Footer>
        </Modal.Footer>
       </Modal>
       </>
  )
}

export default Index

Index.propTypes = {
  show: PropTypes.bool,
  setShow: PropTypes.func,
  email: PropTypes.string,
  parentCallback: PropTypes.func,
  parentCallback2: PropTypes.func,
  emailOTP: PropTypes.func,
  mobile: PropTypes.string,
  fieldType: PropTypes.string
}
