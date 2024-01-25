import React, { useState, useEffect, useRef } from 'react'
import { connect, useDispatch, useSelector } from 'react-redux'
import {
  Button, Form, FormGroup, Label, Input, UncontrolledAlert
} from 'reactstrap'
import PropTypes from 'prop-types'
import { NavLink } from 'react-router-dom'
import { verifyPassword, verifyLength } from '../../../helpers/helper'
import { resetPassword } from '../../../actions/auth'
import Loading from '../../../components/Loading'

function ResetPasswordForm (props) {
  const [confirmPassword, setConfirmPassword] = useState('')
  const [password, setPassword] = useState('')
  const [errPassword, setErrPassword] = useState('')
  const [errConfirmPassword, setErrConfirmPassword] = useState('')
  const [message, setMessage] = useState('')
  const [token, setToken] = useState('')
  const [loading, setLoading] = useState(false)

  const dispatch = useDispatch()
  const resStatus = useSelector(state => state.auth.resetpwdStatus)
  const resMessage = useSelector(state => state.auth.resetpwdMessage)
  const previousProps = useRef({ resMessage }).current

  useEffect(() => {
    const { match } = props
    setToken(match.params.token)
  }, [])

  useEffect(() => {
    if (previousProps.resMessage !== resMessage) {
      if (resMessage) {
        if (resStatus) {
          props.history.push('/auth/login', { message: resMessage })
        } else {
          setMessage(resMessage)
        }
      }
    }
    setLoading(false)
    return () => {
      previousProps.resMessage = resMessage
    }
  }, [resMessage])

  function handleChange (event, type) {
    switch (type) {
      case 'Password':
        if (verifyPassword(event.target.value)) {
          setErrPassword('')
        } else {
          setErrPassword('Must contain minimum 5 characters and maximum 14 characters')
        }
        setPassword(event.target.value)
        break
      case 'ConfirmPassword':
        if (password === event.target.value) {
          setErrConfirmPassword('')
        } else {
          setErrConfirmPassword('Must match with new password')
        }
        setConfirmPassword(event.target.value)
        break
      default:
        break
    }
  }

  function onResetPassword (e) {
    e.preventDefault()
    if (verifyLength(confirmPassword, 1) && verifyLength(password, 1) && !errConfirmPassword && !errPassword) {
      dispatch(resetPassword(token, password))
      setLoading(true)
    } else {
      if (!verifyLength(confirmPassword, 1)) {
        setErrConfirmPassword('Required field')
      }
      if (!verifyLength(password, 1)) {
        setErrPassword('Required field')
      }
    }
  }

  return (
    <div className="form-section">
    {loading && <Loading />}
       { !resStatus && message && (
        <UncontrolledAlert color="danger alert">
          {message}
        </UncontrolledAlert>
       )}
           <Form onSubmit={onResetPassword}>
            <FormGroup>
              <Label for="password">New Password</Label>
              <Input type="password" name="password" id="password" placeholder="New Password" value={password} onChange={(e) => { handleChange(e, 'Password') }} />
              <p className="error-text">{errPassword}</p>
            </FormGroup>
            <FormGroup>
              <Label for="confirmpassword">Confirm Password</Label>
              <Input type="password" name="confirmpassword" id="confirmpassword" placeholder="Confirm Password" value={confirmPassword} onChange={(e) => { handleChange(e, 'ConfirmPassword') }} />
              <p className="error-text">{errConfirmPassword}</p>
            </FormGroup>
            <Button type="submit" className="theme-btn full-btn">Reset Password</Button>
           </Form>
      <div className="form-footer text-center small-text">
        <NavLink to="/auth/login">Back to Log In</NavLink>
      </div>
    </div>
  )
}

ResetPasswordForm.defaultProps = {
  history: {}
}

ResetPasswordForm.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func,
    location: PropTypes.shape({
      pathname: PropTypes.string
    })
  }),
  match: PropTypes.shape({
    params: PropTypes.shape({
      token: PropTypes.string
    }).isRequired
  }).isRequired
}

export default connect()(ResetPasswordForm)
