import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { useForm } from 'react-hook-form'
import { Form, Row, Button, Modal } from 'react-bootstrap'
import { useIntl } from 'react-intl'
import { validationErrors } from 'shared/constants/validationErrors'
import { EMAIL, TOAST_TYPE } from 'shared/constants'
import axios from 'shared/libs/axios'
import { apiPaths } from 'shared/constants/apiPaths'
import { useDispatch } from 'react-redux'
import { SHOW_TOAST } from 'modules/toast/redux/action'

const UserCreateModal = ({ show, handleClose, title, setnewUser }) => {
  // eslint-disable-next-line no-unused-vars
  const [loading, setLoading] = useState(false)
  const dispatch = useDispatch()
  const {
    register,
    formState: { errors },
    handleSubmit,
    setValue,
    reset
  } = useForm({ mode: 'onTouched' })

  const onSubmit = async (payload) => {
    setLoading(true)
    payload = {
      ...payload,
      isTermsAccepted: true,
      isMarketing: true
    }
    try {
      const response = await axios.post(apiPaths.createUser, payload)
      if (response?.data) {
        if (response.data?.success) {
          dispatch({
            type: SHOW_TOAST,
            payload: {
              message: response?.data.message,
              type: TOAST_TYPE.Success
            }
          })
          setnewUser(response.data?.result?.user)
          setLoading(false)
          reset()
          handleClose()
        } else {
          dispatch({
            type: SHOW_TOAST,
            payload: {
              message: response?.data.message,
              type: TOAST_TYPE.Error
            }
          })
          setLoading(false)
        }
      }
    } catch (error) {
      setLoading(false)
    }
  }

  const labels = {
    firstName: useIntl().formatMessage({ id: 'firstName' }),
    enterFirstName: useIntl().formatMessage({ id: 'enterYourFirstName' }),
    lastName: useIntl().formatMessage({ id: 'lastName' }),
    enterLastName: useIntl().formatMessage({ id: 'enterYourLastName' }),
    emailId: useIntl().formatMessage({ id: 'emailId' }),
    enterEmailId: useIntl().formatMessage({ id: 'enterYourEmailId' })
  }

  return (
    <Modal show={show} onHide={handleClose} centered className="user-create-modal">
      <Modal.Header style={{ border: 'none' }}>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Form autoComplete="off" onSubmit={handleSubmit(onSubmit)}>
        <Modal.Body>
          <Form.Group as={Row} className="form-group">
            <Form.Group className="form-group">
              <Form.Label>{labels.firstName}*</Form.Label>
              <Form.Control
                type="text"
                placeholder={labels.enterFirstName}
                className={errors.firstName && 'error'}
                {...register('firstName', {
                  required: validationErrors.required
                })}
              />
              {errors.firstName && (
                <Form.Control.Feedback type="invalid" className="invalidFeedback">
                  {errors.firstName.message}
                </Form.Control.Feedback>
              )}
            </Form.Group>
            <Form.Group className="form-group">
              <Form.Label>{labels.lastName}*</Form.Label>
              <Form.Control
                type="text"
                placeholder={labels.enterLastName}
                className={errors.lastName && 'error'}
                {...register('lastName', {
                  required: validationErrors.required
                })}
              />
              {errors.lastName && (
                <Form.Control.Feedback type="invalid" className="invalidFeedback">
                  {errors.lastName.message}
                </Form.Control.Feedback>
              )}
            </Form.Group>
          </Form.Group>
          <Form.Group className="form-group">
            <Form.Label>{labels.emailId}</Form.Label>
            <Form.Control
              type="email"
              placeholder={labels.enterEmailId}
              className={errors.email && 'error'}
              {...register('email', {
                required: validationErrors.required,
                maxLength: {
                  value: 50,
                  message: validationErrors.maxLength(50)
                },
                pattern: {
                  value: EMAIL,
                  message: validationErrors.email
                },
                validate: (value) => setValue('email', value.toLowerCase())
              })}
            />
            {errors.email && (
              <Form.Control.Feedback type="invalid" className="invalidFeedback">
                {errors.email.message}
              </Form.Control.Feedback>
            )}
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button className="white-btn" type='submit' disabled={loading}>
            Create
          </Button>
          <Button className="white-border-btn" onClick={() => {
            reset()
            handleClose()
          }} disabled={loading}>
            Cancel
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  )
}
UserCreateModal.propTypes = {
  show: PropTypes.bool,
  title: PropTypes.string,
  handleClose: PropTypes.func,
  description: PropTypes.string,
  handleConfirmation: PropTypes.func,
  setnewUser: PropTypes.func,
  loading: PropTypes.bool,
  payload: PropTypes.object
}
export default UserCreateModal
