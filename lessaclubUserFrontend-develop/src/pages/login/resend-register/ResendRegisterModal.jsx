import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { useForm } from 'react-hook-form'
import { Form, Button, Modal } from 'react-bootstrap'
import { validationErrors } from 'shared/constants/validationErrors'
import axios from 'shared/libs/axios'
import { apiPaths } from 'shared/constants/apiPaths'

const ResendRegisterModal = ({ show, handleClose, title, setShowResendEmailSuccess }) => {
  const [loading, setLoading] = useState(false)
  const {
    register,
    formState: { errors },
    handleSubmit,
    reset
  } = useForm({ mode: 'onTouched' })

  const onSubmit = async (data) => {
    setLoading(true)
    const payload = {
      ...data
    }
    try {
      const response = await axios.post(apiPaths.userResendMail, payload)
      if (response.data) {
        setShowResendEmailSuccess(true)
        setLoading(false)
        reset()
        handleClose()
      }
    } catch (error) {
      setLoading(false)
      reset()
      handleClose()
    }
  }

  return (
    <Modal show={show} onHide={handleClose} centered className="user-create-modal">
      <Modal.Header style={{ border: 'none' }}>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Form autoComplete="off" onSubmit={handleSubmit(onSubmit)}>
        <Modal.Body>
          <Form.Group className="form-group">
            <Form.Label>Enter your Email</Form.Label>
            <Form.Control
              type="text"
              placeholder="Please enter your Email"
              className={errors.name && 'error'}
              {...register('email', {
                required: validationErrors.required
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
          <Button className="white-btn" type="submit" disabled={loading}>
            Resend
          </Button>
          <Button
            className="white-border-btn"
            onClick={() => {
              reset()
              handleClose()
            }}
            disabled={loading}
          >
            Cancel
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  )
}
ResendRegisterModal.propTypes = {
  show: PropTypes.bool,
  page: PropTypes.number,
  perPage: PropTypes.number,
  title: PropTypes.string,
  handleClose: PropTypes.func,
  setShowResendEmailSuccess: PropTypes.func
}
export default ResendRegisterModal
