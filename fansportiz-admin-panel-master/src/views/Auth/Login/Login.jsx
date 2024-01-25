import React, { useState, useEffect } from 'react'
import { connect, useDispatch, useSelector } from 'react-redux'
import {
  Button,
  Form,
  FormGroup,
  Label,
  Input,
  UncontrolledAlert
} from 'reactstrap'
import { verifyEmail, verifyPassword, verifyLength } from '../../../helpers/helper'
import { login } from '../../../actions/auth'
import Loading from '../../../components/Loading'
import PropTypes from 'prop-types'
// import qs from 'query-string'
// import { useHistory } from 'react-router-dom'

// Login form

function LoginForm (props) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errPassword, setErrPassword] = useState('')
  const [errEmail, setErrEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [modalMessage, setModalMessage] = useState(true)
  const dispatch = useDispatch()
  const resStatus = useSelector((state) => state.auth.resStatus)
  const resMessage = useSelector((state) => state.auth.resMessage)
  // const history2 = useHistory()

  useEffect(() => {
    if (props.location.state) {
      setModalMessage(true)
      props.history.replace()
    }
  }, [])

  useEffect(() => {
    setModalMessage(resStatus)
    // setLoading(false)
    if (resMessage) {
      setLoading(false)
    }
  }, [resStatus, resMessage])

  useEffect(() => {
    // setLoading(false)
    if (!modalMessage) {
      setTimeout(() => {
        setModalMessage(true)
      }, 2000)
    }
  }, [modalMessage])

  function handleChange (event, type) {
    switch (type) {
      case 'Email':
        if (
          verifyLength(event.target.value, 1) &&
          verifyEmail(event.target.value)
        ) {
          setErrEmail('')
        } else if (!verifyLength(event.target.value, 1)) {
          setErrEmail('Required field')
        } else {
          setErrEmail('Invalid email')
        }
        setEmail(event.target.value)
        break
      case 'Password':
        if (verifyPassword(event.target.value)) {
          setErrPassword('')
        } else {
          setErrPassword(
            'Must contain minimum 5 characters and maximum 14 characters'
          )
        }
        setPassword(event.target.value)
        break
      default:
        break
    }
  }

  function logIn (e) {
    e.preventDefault()
    if (
      verifyLength(email, 1) &&
      verifyLength(password, 1) &&
      verifyEmail(email) &&
      verifyPassword(password)
    ) {
      setLoading(true)
      dispatch(login(email, password))
      // const redirectTo = props.location.search
      // const redirectTo = qs.parse(props.location.search)
      // console.log('redirectTooooooo', redirectTo)
      // history2.push(redirectTo.redirectTo === null ? '/dashboard' : redirectTo.redirectTo)
    } else {
      if (!verifyLength(email, 1)) {
        setErrEmail('Required field')
      }
      if (!verifyLength(password, 1)) {
        setErrPassword('Required field')
      }
    }
  }

  return (
    <div className='form-section'>
      {loading && <Loading />}
      {!resStatus && resMessage && (
        <UncontrolledAlert color='danger alert' isOpen={!modalMessage}>
          {resMessage}
        </UncontrolledAlert>
      )}
      <Form onSubmit={logIn}>
        <FormGroup>
          <Label for='email'>Email</Label>
          <Input
            type='email'
            name='email'
            id='email'
            placeholder='Enter Your Email'
            value={email}
            onChange={(e) => {
              handleChange(e, 'Email')
            }}
          />
          <p className='error-text'>{errEmail}</p>
        </FormGroup>
        <FormGroup>
          <Label for='password'>Password</Label>
          <Input
            type='password'
            name='password'
            id='password'
            placeholder='Enter Your Password'
            value={password}
            onChange={(e) => {
              handleChange(e, 'Password')
            }}
          />
          <p className='error-text'>{errPassword}</p>
        </FormGroup>
        <Button type='submit' className='theme-btn full-btn' disabled={loading}>
          login
        </Button>
      </Form>
    </div>
  )
}

LoginForm.propTypes = {
  location: PropTypes.object,
  history: PropTypes.object
}

export default connect()(LoginForm)
