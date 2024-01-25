import React, { useState } from 'react'
import { Modal, Form } from 'react-bootstrap'
import PropTypes from 'prop-types'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm } from 'react-hook-form'
import ReactStars from 'react-rating-stars-component'
import { useDispatch } from 'react-redux'

// Action Files
import { ratings } from '../../Actions/counsellor'

// Validations
const validationSchema = yup.object().shape({
  text_area: yup.string().required('Feedback is required')
})

const RatingsModal = ({ show, handleClose, handleDelete, id, cId }) => {
  const [starsValue, setStarsValue] = useState(1)
  const dispatch = useDispatch()
  const token = localStorage.getItem('token')

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: yupResolver(validationSchema)
  })
  const { onChange, name } = register('text_area')

  const properties = {
    size: 28,
    count: 5,
    isHalf: false,
    value: 1,
    color: 'grey',
    activeColor: '#2170ac',
    // activeColor: '#a89c32',
    onChange: newValue => {
      setStarsValue(newValue)
    }
  }

  const onSubmit = (data) => {
    const dataObject = {
      counsellor_id: cId,
      message: data?.text_area,
      session_id: id,
      ratings: starsValue
    }

    if (dataObject) {
      dispatch(ratings(dataObject, token))
    }
    reset()
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
            <h2>Ratings</h2>
            <div className='col-lg-12 p-3'>
              <ReactStars {...properties} />
            </div>
            <Form.Group
              className='mb-3'
              controlId='exampleForm.ControlTextarea1'
            >
                {/* <Form.Label>Example textarea</Form.Label> */}
              <Form.Control
                as='textarea'
                rows={10}
                cols={10}
                name={name}
                placeholder='Write a feedback...'
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
                className='theme-btn w-100 gray-btn'
                >
                Cancel
                </button>
            </div>
        </Modal.Footer>
        </Form>
    </Modal>
  )
}

RatingsModal.propTypes = {
  show: PropTypes.bool,
  handleClose: PropTypes.func,
  handleDelete: PropTypes.func,
  id: PropTypes.id,
  cId: PropTypes.id
}

export default RatingsModal
