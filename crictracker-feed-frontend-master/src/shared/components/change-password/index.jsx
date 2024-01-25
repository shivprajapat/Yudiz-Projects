import React, { useContext, useRef, useState } from 'react'
import PropTypes from 'prop-types'
import { useForm } from 'react-hook-form'
import { Form, Row, Col, Button, InputGroup } from 'react-bootstrap'
import { FormattedMessage } from 'react-intl'

import { validationErrors } from 'shared/constants/ValidationErrors'
import { PASSWORD, TOAST_TYPE } from 'shared/constants'
import { changePassword } from 'shared/apis/auth'
import { ToastrContext } from '../toastr'

function ChangePassword({ onClose }) {
  const [showCurrentPassword, setShowCurrentPassword] = useState(true)
  const [showNewPassword, setShowNewPassword] = useState(true)
  const [showConfirmPassword, setConfirmPassword] = useState(true)
  const { dispatch } = useContext(ToastrContext)

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm({
    mode: 'onTouched'
  })

  const onSubmit = async (formData) => {
    const data = { sOldPassword: formData.sCurrentPassword, sNewPassword: formData.sNewPassword }
    const response = await changePassword(data)
    if (response?.status === 200) {
      dispatch({
        type: 'SHOW_TOAST',
        payload: { message: response.message, type: TOAST_TYPE.Success, btnTxt: 'Close' }
      })
    } else {
      dispatch({
        type: 'SHOW_TOAST',
        payload: { message: response.data.message, type: TOAST_TYPE.Error, btnTxt: 'Close' }
      })
    }
    onClose()
  }

  const sNewPassword = useRef({})
  sNewPassword.current = watch('sNewPassword')

  const handleCurrentPasswordToggle = () => {
    setShowCurrentPassword(!showCurrentPassword)
  }
  const handleNewPasswordToggle = () => {
    setShowNewPassword(!showNewPassword)
  }
  const handleConfirmPasswordToggle = () => {
    setConfirmPassword(!showConfirmPassword)
  }

  return (
    <>
      <Row>
        <Col>
          <Form autoComplete='off' onSubmit={handleSubmit(onSubmit)}>
            <Form.Group className='form-group'>
              <Form.Label>
                <FormattedMessage id='currentPassword' />*
              </Form.Label>
              <InputGroup>
                <Form.Control
                  className={`form-control ${errors.sCurrentPassword && 'error'}`}
                  type={showCurrentPassword ? 'password' : 'text'}
                  name='sCurrentPassword'
                  {...register('sCurrentPassword', { required: validationErrors.required })}
                />
                <Button onClick={handleCurrentPasswordToggle} variant='link' className='icon-right'>
                  <i className={showCurrentPassword ? 'icon-visibility' : 'icon-visibility-off'}></i>
                </Button>
              </InputGroup>
              {errors.sCurrentPassword && <Form.Control.Feedback type='invalid'>{errors.sCurrentPassword.message}</Form.Control.Feedback>}
            </Form.Group>
            <Form.Group className='form-group'>
              <Form.Label>
                <FormattedMessage id='newPassword' />*
              </Form.Label>
              <InputGroup>
                <Form.Control
                  className={`form-control ${errors.sNewPassword && 'error'}`}
                  type={showNewPassword ? 'password' : 'text'}
                  name='sNewPassword'
                  {...register('sNewPassword', {
                    required: validationErrors.required,
                    pattern: {
                      value: PASSWORD,
                      message: validationErrors.passwordRegEx
                    },
                    maxLength: { value: 12, message: validationErrors.rangeLength(8, 12) },
                    minLength: { value: 8, message: validationErrors.rangeLength(8, 12) }
                  })}
                />
                <Button onClick={handleNewPasswordToggle} variant='link' className='icon-right'>
                  <i className={showNewPassword ? 'icon-visibility' : 'icon-visibility-off'}></i>
                </Button>
              </InputGroup>
              {errors.sNewPassword && <Form.Control.Feedback type='invalid'>{errors.sNewPassword.message}</Form.Control.Feedback>}
            </Form.Group>
            <Form.Group className='form-group'>
              <Form.Label>
                <FormattedMessage id='confirmNewPassword' />*
              </Form.Label>
              <InputGroup>
                <Form.Control
                  className={`form-control ${errors.sConfirmPassword && 'error'}`}
                  type={showConfirmPassword ? 'password' : 'text'}
                  name='sConfirmPassword'
                  {...register('sConfirmPassword', {
                    required: validationErrors.required,
                    validate: (value) => value === sNewPassword.current || validationErrors.passwordNotMatch
                  })}
                />
                <Button onClick={handleConfirmPasswordToggle} variant='link' className='icon-right'>
                  <i className={showConfirmPassword ? 'icon-visibility' : 'icon-visibility-off'}></i>
                </Button>
              </InputGroup>
              {errors.sConfirmPassword && <Form.Control.Feedback type='invalid'>{errors.sConfirmPassword.message}</Form.Control.Feedback>}
              <div className='submit-btn'>
                <Button variant='primary' type='submit' size='sm'>
                  <FormattedMessage id='submit' />
                </Button>
              </div>
            </Form.Group>
          </Form>
        </Col>
      </Row>
    </>
  )
}
ChangePassword.propTypes = {
  handleChangePass: PropTypes.func,
  onClose: PropTypes.func
}
export default ChangePassword
