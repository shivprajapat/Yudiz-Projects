import { Fragment, useState } from 'react'
import classnames from 'classnames'
import { useForm } from 'react-hook-form'
import { Button, Label, Row, Col, Input, FormGroup, Form, FormFeedback } from 'reactstrap'
import axios from 'axios'

import { FailureToastNotification, SuccessToastNotification } from '../../../components/ToastNotification'
import { getDirtyFormValues } from '../../../utility/Utils'
import { EMAIL_ADDRESS, NO_SPECIAL_CHARACTER_EXCEPT_UNDERSCORE } from '../../../utility/Constant'

const token = `Bearer ${localStorage.getItem('adminAuthToken')}`

const GeneralTabs = ({ data }) => {
  const {
    register,
    errors,
    handleSubmit,
    setValue,
    formState: { dirtyFields }
  } = useForm({ mode: 'onChange' })
  const [disableBtn, setDisableBtn] = useState(true)
  // const onChange = (e) => {
  //   const reader = new FileReader()
  //   const files = e.target.files
  //   reader.onload = function () {
  //     setAvatar(reader.result)
  //   }
  //   reader.readAsDataURL(files[0])
  // }
  const onSubmit = async (data) => {
    const payload = getDirtyFormValues(dirtyFields, data)
    payload.sMobile = payload.sMobile && (!payload.sMobile.includes('+') ? `+91${payload.sMobile}` : payload.sMobile)
    await axios
      .put(`${process.env.REACT_APP_AUTH_URL}/profile/update`, payload, {
        headers: {
          Authorization: `${token}`
        }
      })
      .then(({ data }) => {
        localStorage.setItem('userData', JSON.stringify(data?.data?.data))
        SuccessToastNotification(data?.message)
        setTimeout(() => {
          setDisableBtn(false)
        }, 3000)
      })
      .catch((error) => {
        FailureToastNotification(error.response?.data?.message)
      })
  }

  return (
    <Fragment>
      <Form className="mt-2" onSubmit={handleSubmit(onSubmit)}>
        <Row>
          <Col sm="6">
            <FormGroup>
              <Label for="username">Username</Label>
              <Input
                defaultValue={data?.sUserName}
                id="sUserName"
                name="sUserName"
                placeholder="Username"
                innerRef={register({
                  required: true,
                  pattern: { value: NO_SPECIAL_CHARACTER_EXCEPT_UNDERSCORE, message: 'Please enter a valid username' },
                  maxLength: { value: 10, message: 'Username must be less than 10 characters' }
                })}
                onChange={((e) => setValue('sUserName', e.target.value), () => setDisableBtn(false))}
                className={classnames({
                  'is-invalid': errors.sUserName
                })}
              />
              {errors && errors.sUserName && <FormFeedback>{errors.sUserName.message}</FormFeedback>}
            </FormGroup>
          </Col>

          <Col sm="6">
            <FormGroup>
              <Label for="email">E-mail</Label>
              <Input
                defaultValue={data?.sEmail}
                type="email"
                id="sEmail"
                name="sEmail"
                disabled
                placeholder="Email"
                innerRef={register({ required: true, pattern: { value: EMAIL_ADDRESS, message: 'Please enter valid email address' } })}
                onChange={((e) => setValue('sEmail', e.target.value), () => setDisableBtn(false))}
                className={classnames({
                  'is-invalid': errors.sEmail
                })}
              />
              {errors && errors.sEmail && <FormFeedback>{errors.sEmail.message}</FormFeedback>}
            </FormGroup>
          </Col>
          <Col sm="6">
            <FormGroup>
              <Label for="email">Contact Number(Without +91)</Label>
              <Input
                defaultValue={data?.sMobile?.substring(3)}
                id="sMobile"
                name="sMobile"
                placeholder="Enter your mobile number"
                innerRef={register({
                  required: true,
                  maxLength: { value: 10, message: 'Mobile number should be 10 characters long' },
                  minLength: { value: 10, message: 'Mobile number should be 10 characters long' }
                })}
                onChange={((e) => setValue('sMobile', e.target.value), () => setDisableBtn(false))}
                className={classnames({
                  'is-invalid': errors.sMobile
                })}
              />
              {errors && errors.sMobile && <FormFeedback>{errors.sMobile.message}</FormFeedback>}
            </FormGroup>
          </Col>

          <Col className="mt-2" sm="12">
            <Button.Ripple type="submit" className="mr-1" color="primary" disabled={disableBtn}>
              Save changes
            </Button.Ripple>
            {/* <Button.Ripple color="secondary" outline onClick={() => reset({})}>
              Reset
            </Button.Ripple> */}
          </Col>
        </Row>
      </Form>
    </Fragment>
  )
}

export default GeneralTabs
