import React, { useEffect, useState, useRef } from 'react'
import { connect, useDispatch, useSelector } from 'react-redux'
import {
  Button, Form, FormGroup, Label, Input, UncontrolledAlert
} from 'reactstrap'
import { NavLink } from 'react-router-dom'
import { verifyLength, verifyEmail } from '../../../helpers/helper'
import { sendOtp } from '../../../actions/auth'
import Loading from '../../../components/Loading'

function ForgotPasswordForm () {
  const [email, setEmail] = useState('')
  const [errEmail, setErrEmail] = useState('')
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState(true)
  const [loading, setLoading] = useState(false)

  const dispatch = useDispatch()
  const resStatus = useSelector(state => state.auth.sendotpStatus)
  const resMessage = useSelector(state => state.auth.sendotpMessage)
  const previousProps = useRef({ resMessage }).current

  useEffect(() => {
    if (previousProps.resMessage !== resMessage) {
      setMessage(resMessage)
      setStatus(resStatus)
    }
    setLoading(false)
    return () => {
      previousProps.resMessage = resMessage
    }
  }, [resMessage])

  function handleChange (event) {
    if (verifyLength(event.target.value, 1) && verifyEmail(event.target.value)) {
      setErrEmail('')
    } else if (!verifyLength(event.target.value, 1)) {
      setErrEmail('Required field')
    } else {
      setErrEmail('Invalid email')
    }
    setEmail(event.target.value)
  }

  function onSubmit (e) {
    e.preventDefault()
    if (verifyLength(email, 1) && !errEmail) {
      dispatch(sendOtp(email))
      setLoading(true)
    } else if (!verifyLength(email, 1)) {
      setErrEmail('Required field')
    } else if (!verifyEmail(email)) {
      setErrEmail('Invalid email')
    } else {
      setErrEmail('')
    }
  }

  return (
    <div className="form-section">
      {loading && <Loading />}
      {
          message && (
          <UncontrolledAlert color={status ? 'success alert' : 'danger alert'}>
            {resMessage}
          </UncontrolledAlert>
          )
        }
      <Form onSubmit={onSubmit}>
        <FormGroup>
          <Label for="email">Email</Label>
          <Input type="email" name="email" id="email" placeholder="Enter Your Email" value={email} onChange={handleChange} />
          <p className="error-text">{errEmail}</p>
        </FormGroup>
        <Button className="theme-btn full-btn">Submit</Button>
      </Form>
      <div className="form-footer text-center small-text">
        <NavLink to="/auth/login">Back to Log In</NavLink>
      </div>
    </div>
  )
}
export default connect()(ForgotPasswordForm)
