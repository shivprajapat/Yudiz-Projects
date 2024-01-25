import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { useForm } from 'react-hook-form'
import { Form, Button, Modal } from 'react-bootstrap'
import { validationErrors } from 'shared/constants/validationErrors'
import { TOAST_TYPE } from 'shared/constants'
import axios from 'shared/libs/axios'
import { apiPaths } from 'shared/constants/apiPaths'
import { useDispatch } from 'react-redux'
import { SHOW_TOAST } from 'modules/toast/redux/action'
import { getCategories } from 'modules/category/redux/service'

const CategoryCreateModal = ({ show, handleClose, title, page, perPage }) => {
  const [loading, setLoading] = useState(false)
  const dispatch = useDispatch()
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
      const response = await axios.post(apiPaths.categoryListing, payload)
      if (response.data) {
        dispatch({
          type: SHOW_TOAST,
          payload: {
            message: response.data.message,
            type: TOAST_TYPE.Success
          }
        })
        setLoading(false)
        dispatch(getCategories({ page, perPage }))
        reset()
        handleClose()
      }
    } catch (error) {
      dispatch({
        type: SHOW_TOAST,
        payload: {
          message: error.message,
          type: TOAST_TYPE.Error
        }
      })
      setLoading(false)
      reset()
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
            <Form.Label>Category Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Please enter a category name"
              className={errors.name && 'error'}
              {...register('name', {
                required: validationErrors.required
              })}
            />
            {errors.name && (
              <Form.Control.Feedback type="invalid" className="invalidFeedback">
                {errors.name.message}
              </Form.Control.Feedback>
            )}
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button className="white-btn" type="submit" disabled={loading}>
            Create
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
CategoryCreateModal.propTypes = {
  show: PropTypes.bool,
  page: PropTypes.number,
  perPage: PropTypes.number,
  title: PropTypes.string,
  handleClose: PropTypes.func
}
export default CategoryCreateModal
