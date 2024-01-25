import React, { useState } from 'react'
import { useHistory } from 'react-router-dom'

// ** styles
import { Form, FormGroup, Label, Input, Button, FormFeedback } from 'reactstrap'
import '@styles/base/pages/page-auth.scss'

// ** react-hook-form
import { useForm } from 'react-hook-form'
import { FailureToastNotification, SuccessToastNotification } from '../../../components/ToastNotification'
import { isObjEmpty } from '@utils'
import axios from 'axios'

const ForgotPassword = () => {
  const history = useHistory()
  const [sEmail, setSemail] = useState('')
  const [disableBtn, setDisableBtn] = useState(false)

  const {
    handleSubmit,
    register: fields,
    formState: { errors }
  } = useForm({ mode: 'onTouched' })

  function onSubmit({ sEmail }) {
    setDisableBtn(true)
    if (isObjEmpty(errors)) {
      axios
        .post(`${process.env.REACT_APP_AUTH_URL}/auth/forgotPassword`, {
          sEmail
        })
        .then(({ data }) => {
          SuccessToastNotification(data?.message)
          setTimeout(() => {
            setDisableBtn(false)
            history.push('/login')
          }, 3000)
        })
        .catch((error) => {
          FailureToastNotification(error.response?.data?.message)
          setTimeout(() => {
            setDisableBtn(false)
          }, 3000)
        })
    }
  }

  return (
    <Form className="auth-login-form mt-2" onSubmit={handleSubmit(onSubmit)}>
      <FormGroup>
        <Label className="form-label" for="login-email">
          Email
        </Label>
        <Input
          autoFocus
          type="email"
          id="login-email"
          placeholder="john@example.com"
          name="sEmail"
          value={sEmail}
          invalid={errors.sEmail && true}
          onChange={(e) => setSemail(e.target.value)}
          innerRef={fields({
            required: true
          })}
        />
        {errors && errors.sEmail && <FormFeedback className="d-block">Please enter your email</FormFeedback>}
      </FormGroup>

      <Button.Ripple type="submit" color="primary" block disabled={disableBtn}>
        Submit
      </Button.Ripple>
    </Form>
  )
}

export default ForgotPassword
