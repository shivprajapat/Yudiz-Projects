import * as yup from 'yup'
import classnames from 'classnames'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { Form, FormGroup, Row, Col, Button, FormFeedback } from 'reactstrap'
import InputPasswordToggle from '@components/input-password-toggle'
import { useState } from 'react'
import axios from 'axios'

import { FailureToastNotification, SuccessToastNotification } from '../../../components/ToastNotification'

const token = `Bearer ${localStorage.getItem('adminAuthToken')}`

const PasswordTabContent = () => {
  const [disableBtn, setDisableBtn] = useState(false)
  const changePasswordSchema = yup.object().shape({
    sOldPassword: yup.string().required('Please enter current password'),
    sNewPassword: yup.string().required('Please enter new password')
  })

  const { register, errors, handleSubmit, setValue, reset } = useForm({
    mode: 'onChange',
    resolver: yupResolver(changePasswordSchema)
  })

  const onSubmit = async (value) => {
    setDisableBtn(true)
    const { sOldPassword, sNewPassword } = value

    const changePassword = {
      sNewPassword,
      sOldPassword
    }

    await axios
      .post(`${process.env.REACT_APP_AUTH_URL}/profile/changePassword`, changePassword, {
        headers: {
          Authorization: `${token}`
        }
      })
      .then(({ data }) => {
        SuccessToastNotification(data?.message)
        reset({})
        setTimeout(() => {
          setDisableBtn(false)
        }, 3000)
      })
      .catch((error) => {
        FailureToastNotification(error?.response?.data?.message)
        setTimeout(() => {
          setDisableBtn(false)
        }, 3000)
      })
  }

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <Row>
        <Col sm="6">
          <FormGroup>
            <InputPasswordToggle
              label="Old Password"
              htmlFor="old-password"
              name="sOldPassword"
              innerRef={register({ required: true })}
              className={classnames('input-group-merge', {
                'is-invalid': errors.sOldPassword
              })}
              onChange={(e) => {
                setValue('sOldPassword', e.target.value.split(' ').join(''))
              }}
            />
            {errors && errors.sOldPassword && <FormFeedback>{errors.sOldPassword.message}</FormFeedback>}
          </FormGroup>
        </Col>
      </Row>
      <Row>
        <Col sm="6">
          <FormGroup>
            <InputPasswordToggle
              label="New Password"
              htmlFor="new-password"
              name="sNewPassword"
              innerRef={register({ required: true })}
              className={classnames('input-group-merge', {
                'is-invalid': errors.sNewPassword
              })}
              onChange={(e) => {
                setValue('sNewPassword', e.target.value.split(' ').join(''))
              }}
            />
            {errors && errors.sNewPassword && <FormFeedback>{errors.sNewPassword.message}</FormFeedback>}
          </FormGroup>
        </Col>
        {/* <Col sm="6">
          <FormGroup>
            <InputPasswordToggle
              label="Retype New Password"
              htmlFor="retype-new-password"
              name="retype-new-password"
              innerRef={register({ required: true })}
              className={classnames('input-group-merge', {
                'is-invalid': errors['retype-new-password']
              })}
            />
          </FormGroup>
        </Col> */}
        <Col className="mt-1" sm="12">
          <Button.Ripple type="submit" className="mr-1" color="primary" disabled={disableBtn}>
            Save changes
          </Button.Ripple>
          {/* <Button.Ripple color="secondary" outline>
            Cancel
          </Button.Ripple> */}
        </Col>
      </Row>
    </Form>
  )
}

export default PasswordTabContent
