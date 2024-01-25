import React, {
  useState, useEffect, useRef
} from 'react'
import { connect, useDispatch, useSelector } from 'react-redux'
import {
  Button, Form, FormGroup, Label, Input, Modal, ModalBody
} from 'reactstrap'
import { NavLink } from 'react-router-dom'
import warningIcon from '../../../assets/images/warning-icon.svg'
import checkIcon from '../../../assets/images/check-round-icon.svg'
import { verifyLength, verifyPassword } from '../../../helpers/helper'
import { changePassword } from '../../../actions/account'
import Loading from '../../../components/Loading'

function ChangePasswordContent () {
  const [oldPassword, setOldPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [errOldPassword, setErrOldPassword] = useState('')
  const [errNewPassword, setErrNewPassword] = useState('')
  const [errConfirmPassword, setErrConfirmPassword] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const dispatch = useDispatch()
  const token = useSelector(state => state.auth.token)
  const resStatus = useSelector(state => state.account.resStatus)
  const resMessage = useSelector(state => state.account.resMessage)
  const previousProps = useRef({ resStatus, resMessage }).current

  const [modalMessage, setModalMessage] = useState(false)
  const toggleMessage = () => setModalMessage(!modalMessage)

  useEffect(() => {
    if (previousProps.resMessage !== resMessage) {
      if (resMessage) {
        setMessage(resMessage)
        setModalMessage(true)
      }
      setOldPassword('')
      setNewPassword('')
      setConfirmPassword('')
      setLoading(false)
    }
    return () => {
      previousProps.resMessage = resMessage
    }
  }, [resStatus, resMessage])

  function handleChange (event, type) {
    switch (type) {
      case 'OldPassword':
        if (verifyLength(event.target.value, 1)) {
          setErrOldPassword('')
        } else {
          setErrOldPassword('Required field')
        }
        setOldPassword(event.target.value)
        break
      case 'NewPassword':
        if (verifyLength(event.target.value, 1) && verifyPassword(event.target.value)) {
          setErrNewPassword('')
        } else if (!verifyPassword(event.target.value)) {
          setErrNewPassword('Must contain minimum 5 characters and maximum 14 characters')
        } else {
          setErrNewPassword('Required field')
        }
        setNewPassword(event.target.value)
        break
      case 'ConfirmPassword':
        if (verifyLength(event.target.value, 1) && (newPassword === event.target.value)) {
          setErrConfirmPassword('')
        } else if (newPassword !== event.target.value) {
          setErrConfirmPassword('Must match with new password')
        } else {
          setErrConfirmPassword('Required field')
        }
        setConfirmPassword(event.target.value)
        break
      default:
        break
    }
  }

  function onSubmit (e) {
    e.preventDefault()
    if (!errConfirmPassword && !errNewPassword && !errOldPassword && verifyLength(oldPassword, 1) && verifyLength(newPassword, 1) && verifyLength(confirmPassword, 1)) {
      dispatch(changePassword(oldPassword, newPassword, token))
      setLoading(true)
    } else {
      if (!verifyLength(oldPassword, 1)) {
        setErrOldPassword('Required field')
      }
      if (!verifyLength(newPassword, 1)) {
        setErrNewPassword('Required field')
      }
      if (!verifyLength(confirmPassword, 1)) {
        setErrConfirmPassword('Required field')
      }
    }
  }

  return (
    <main className="main-content">
      {loading && <Loading />}
      <section className="common-form-block">
        <h2>Change Password</h2>
        <Form onSubmit={onSubmit}>
          <FormGroup>
            <Label for="oldPassword">Old Password</Label>
            <Input type="password" name="oldPassword" placeholder="Old Password" value={oldPassword} onChange={event => handleChange(event, 'OldPassword')} />
            <p className="error-text">{errOldPassword}</p>
          </FormGroup>
          <FormGroup>
            <Label for="newPassword">New Password</Label>
            <Input type="password" name="newPassword" placeholder="New Password" value={newPassword} onChange={event => handleChange(event, 'NewPassword')} />
            <p className="error-text">{errNewPassword}</p>
          </FormGroup>
          <FormGroup>
            <Label for="confirmPassword">Confirm New Password</Label>
            <Input type="password" name="confirmPassword" placeholder="Confirm New Password" value={confirmPassword} onChange={event => handleChange(event, 'ConfirmPassword')} />
            <p className="error-text">{errConfirmPassword}</p>
          </FormGroup>
          <Button className="theme-btn full-btn">Submit</Button>
        </Form>
        <div className="form-footer text-center small-text">
          <NavLink to="/dashboard">Cancel</NavLink>
        </div>
      </section>
      <Modal isOpen={modalMessage} toggle={toggleMessage} className="modal-approve">
        <ModalBody className="text-center">
          <img className="info-icon" src={resStatus ? checkIcon : warningIcon} alt="check" />
          <h2>{resStatus ? 'Success' : 'Failed'}</h2>
          <p className="small-text light-text">{message}</p>
          <Button type="submit" className={resStatus ? 'theme-btn success-btn full-btn' : 'theme-btn danger-btn full-btn'} onClick={toggleMessage}>OK</Button>
        </ModalBody>
      </Modal>
    </main>
  )
}
export default connect()(ChangePasswordContent)
