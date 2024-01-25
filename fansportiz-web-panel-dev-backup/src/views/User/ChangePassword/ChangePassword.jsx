import React, { Fragment, useState, useEffect, useRef } from 'react'
import PropTypes from 'prop-types'
import { verifyPassword } from '../../../utils/helper'
import { Button, Form, FormGroup, Input, Label, Alert } from 'reactstrap'
import { FormattedMessage } from 'react-intl'
import Loading from '../../../component/Loading'
import hidePassword from '../../../assests/images/hidePasswordEye.svg'
import eye from '../../../assests/images/showPasswordEye.svg'
import Profile from '../../../HOC/Auth/Profile'
import { useNavigate } from 'react-router-dom'
const classNames = require('classnames')

function ChangePasswordPage (props) {
  const { modalMessage, message, loading, ChangePassword, nChangedPassword, resMessage } = props
  const [oldPassword, setOldPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [errOldPassword, setErrOldPassword] = useState('')
  const [errNewPassword, setErrNewPassword] = useState('')
  const [errConfirmPassword, setErrConfirmPassword] = useState('')
  const [showOldPassword, setShowOldPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showRePassword, setShowRePassword] = useState(false)

  const previousProps = useRef({ nChangedPassword }).current
  const navigate = useNavigate()

  useEffect(() => { // handle the response
    if (previousProps.nChangedPassword !== nChangedPassword) {
      if (nChangedPassword) {
        navigate('/profile', { state: { message: resMessage } })
      }
    }
    return () => {
      previousProps.nChangedPassword = nChangedPassword
    }
  }, [nChangedPassword])

  function handleChange (event, type) { // set the values
    switch (type) {
      case 'OLDPASSWORD':
        if (verifyPassword(event.target.value)) {
          setErrOldPassword('')
        } else {
          setErrOldPassword(<FormattedMessage id="Password_must_be_8_to_15_characters" />)
        }
        setOldPassword(event.target.value)
        break
      case 'NEWPASSWORD':
        if (verifyPassword(event.target.value)) {
          setErrNewPassword('')
        } else {
          setErrNewPassword(<FormattedMessage id="Password_must_be_8_to_15_characters" />)
        }
        setNewPassword(event.target.value)
        break
      case 'CONFIRMPASSWORD':
        if (event.target.value === newPassword) {
          setErrConfirmPassword('')
        } else {
          setErrConfirmPassword(<FormattedMessage id="Password_and_confirm_password_must_be_same" />)
        }
        setConfirmPassword(event.target.value)
        break
      default:
        break
    }
  }

  function ChangePasswordClick (e) { // change password
    e.preventDefault()
    if (verifyPassword(oldPassword) && verifyPassword(newPassword) && (newPassword === confirmPassword)) {
      ChangePassword(oldPassword, newPassword)
    } else {
      if (!(newPassword === confirmPassword)) {
        setErrConfirmPassword(<FormattedMessage id="Password_and_confirm_password_must_be_same" />)
      }
      if (!verifyPassword(oldPassword)) {
        setErrOldPassword(<FormattedMessage id="Current_Password_is_required" />)
      }
      if (!verifyPassword(newPassword)) {
        setErrNewPassword(<FormattedMessage id="Password_is_required" />)
      }
      if (!verifyPassword(confirmPassword)) {
        setErrConfirmPassword(<FormattedMessage id="Confirm_Password_is_required" />)
      }
    }
  }

  return (
    <>
      {
        modalMessage
          ? (
            <Fragment>
              <Alert color="primary" isOpen={modalMessage}>{message}</Alert>
            </Fragment>
            )
          : ''
      }
      {loading && <Loading />}
      <div className="user-container bg-white no-footer">
        <Form className="form">
          <FormGroup className="c-input">
            <Input autoComplete='off' className={classNames({ 'hash-contain': oldPassword, error: errOldPassword })} id="Old" onChange={(e) => { handleChange(e, 'OLDPASSWORD') }} type={showOldPassword ? 'text' : 'password'} />
            <div className='class-eye' onClick={() => setShowOldPassword(!showOldPassword)}>
              <img src={showPassword ? eye : hidePassword} />
            </div>
            <Label className="label m-0" for="Old"><FormattedMessage id="Old_Password" /></Label>
            <p className="error-text">{errOldPassword}</p>
          </FormGroup>
          <FormGroup className="c-input">
            <Input autoComplete='off' className={classNames({ 'hash-contain': newPassword, error: errNewPassword })} id="New" onChange={(e) => { handleChange(e, 'NEWPASSWORD') }} type={showPassword ? 'text' : 'password'} />
            <div className='class-eye' onClick={() => setShowPassword(!showPassword)}>
              <img src={showPassword ? eye : hidePassword} />
            </div>
            <Label className="label m-0" for="New"><FormattedMessage id="New_Password" /></Label>
            <p className="error-text">{errNewPassword}</p>
          </FormGroup>
          <FormGroup className="c-input">
            <Input autoComplete='off' className={classNames({ 'hash-contain': confirmPassword, error: errConfirmPassword })} id="Confirm" onChange={(e) => { handleChange(e, 'CONFIRMPASSWORD') }} type={showRePassword ? 'text' : 'password'} />
            <div className='class-eye' onClick={() => setShowRePassword(!showRePassword)}>
              <img src={showRePassword ? eye : hidePassword} />
            </div>
            <Label className="label m-0" for="Confirm"><FormattedMessage id="Confirm_Password" /></Label>
            <p className="error-text">{errConfirmPassword}</p>
          </FormGroup>
          <div className="btn-bottom text-center position-relative my-3">
            <Button className="w-100 d-block" color="primary" onClick={ChangePasswordClick} type="submit"><FormattedMessage id="Submit" /></Button>
          </div>
        </Form>
      </div>
    </>
  )
}
ChangePasswordPage.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func
  }),
  ChangePassword: PropTypes.func,
  resMessage: PropTypes.string,
  resStatus: PropTypes.bool,
  nChangedPassword: PropTypes.bool,
  oldPassword: PropTypes.string,
  newPassword: PropTypes.string,
  confirmPassword: PropTypes.string,
  modalMessage: PropTypes.string,
  message: PropTypes.string,
  errOldPassword: PropTypes.string,
  errNewPassword: PropTypes.string,
  errConfirmPassword: PropTypes.string,
  loading: PropTypes.bool,
  handleChange: PropTypes.func,
  ChangePasswordClick: PropTypes.func
}
export default Profile(ChangePasswordPage)
