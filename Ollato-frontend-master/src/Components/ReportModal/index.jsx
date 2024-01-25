import React from 'react'
import { Modal, Form } from 'react-bootstrap'
import PropTypes from 'prop-types'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm } from 'react-hook-form'
import { useDispatch } from 'react-redux'

// Action Files
import { report } from '../../Actions/counsellor'

// Validations
const validationSchema = yup.object().shape({
  text_area: yup.string().required('Reason is required')
})

const DeleteModal = ({ show, handleClose, handleDelete, id }) => {
  const dispatch = useDispatch()
  const token = localStorage.getItem('token')

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(validationSchema)
  })
  const { onChange, name } = register('text_area')

  const onSubmit = (data) => {
    const dataObject = {
      reason: data?.text_area,
      sessionId: id,
      reportBy: 'student'
    }
    dispatch(report(dataObject, token))
  }

  return (
    <Modal
      show={show}
      onHide={handleClose}
      aria-labelledby='contained-modal-title-vcenter'
      centered
    >
      <Modal.Header closeButton></Modal.Header>
        <Form onSubmit={handleSubmit(onSubmit)}>
        <Modal.Body>
            <div className='title-box has-subtitle'>
            <h2>Report </h2>

                <Form.Group
                className='mb-3'
                controlId='exampleForm.ControlTextarea1'
                >
                {/* <Form.Label>Example textarea</Form.Label> */}
                <Form.Control
                    as='textarea'
                    rows={3}
                    name={name}
                    placeholder='Write a reason...'
                    onChange={(e) => {
                      onChange(e)
                    }}
                    {...register('text_area', { required: true })} />
                    {errors.text_area?.message && (
                                    <Form.Text className='error-msg'>{errors.text_area?.message} </Form.Text>
                    )}
                </Form.Group>

            </div>
        </Modal.Body>
        <Modal.Footer>
           <div className='d-flex'>
              <button
                type='submit'
                className='theme-btn w-100 red-btn me-2'
                >
                Send
                </button>
                <button
                type='button'
                onClick={handleClose}
                className='theme-btn w-100 gray-btn '
                >
                Cancel
                </button>
           </div>
        </Modal.Footer>
        </Form>
    </Modal>
  )
}

DeleteModal.propTypes = {
  show: PropTypes.bool,
  handleClose: PropTypes.func,
  handleDelete: PropTypes.func,
  id: PropTypes.id
}

export default DeleteModal
