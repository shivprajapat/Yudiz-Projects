import React, { useState } from 'react'
import { Modal, Button, Form } from 'react-bootstrap'
import PropTypes from 'prop-types'
import { AiOutlineClose } from 'react-icons/ai'
import { useForm } from 'react-hook-form'
import { validationErrors } from 'shared/constants/validationErrors'

export const AssetRejectModal = ({ show, setShowRejectMessageModal, approveBtnHandler, reject }) => {
  const [loading, setLoading] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm({ mode: 'all' })

  const handleClose = () => {
    reset('description', '')
    setShowRejectMessageModal(false)
  }

  const onSubmit = (data) => {
    setLoading(true)
    approveBtnHandler(reject, data.description)
    setLoading(false)
    setShowRejectMessageModal(false)
  }

  return (
    <Modal show={show} onHide={handleClose} centered className="delete-modal">
      <Modal.Header>
        <Modal.Title>Reason for Reject</Modal.Title>
        <span className="reject-msg-close-btn" onClick={handleClose}>
          <AiOutlineClose />
        </span>
      </Modal.Header>
      <Form autoComplete="off" onSubmit={handleSubmit(onSubmit)}>
        <Modal.Body>
          <Form.Group className="form-group">
            <Form.Label>Describe the Reason for Rejection</Form.Label>
            <Form.Control
              type="text"
              as="textarea"
              className={errors.description && 'error'}
              name="description"
              {...register('description', {
                required: validationErrors.required,
                maxLength: {
                  value: 60,
                  message: validationErrors.maxLength(60)
                }
              })}
            />
            {errors.description && (
              <Form.Control.Feedback type="invalid" className="invalidFeedback">
                {errors.description.message}
              </Form.Control.Feedback>
            )}
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button className="white-btn" type="submit" disabled={loading}>
            Submit
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  )
}
AssetRejectModal.propTypes = {
  show: PropTypes.bool,
  title: PropTypes.string,
  description: PropTypes.string,
  handleConfirmation: PropTypes.func,
  loading: PropTypes.bool,
  handleClose: PropTypes.func,
  setRejectMessage: PropTypes.func,
  approveBtnHandler: PropTypes.func,
  setShowRejectMessageModal: PropTypes.func,
  reject: PropTypes.string
}
