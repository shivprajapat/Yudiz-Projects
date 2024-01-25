import React, { useEffect } from 'react'
import { Form, Row, Col, Button } from 'react-bootstrap'
import { useForm } from 'react-hook-form'
import PropTypes from 'prop-types'
import { useNavigate } from 'react-router-dom'

import { EMAIL } from 'shared/constants'
import { validationErrors } from 'shared/constants/validationErrors'

const Information = ({ handleStepSubmit, defaultValues }) => {
  const navigate = useNavigate()
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset
  } = useForm({
    mode: 'all'
  })

  useEffect(() => {
    if (defaultValues) {
      reset({
        firstName: defaultValues.firstName,
        lastName: defaultValues.lastName,
        email: defaultValues.email,
        userName: defaultValues.userName,
        description: defaultValues.description
      })
    }
  }, [defaultValues])

  return (
    <section>
      <Form onSubmit={handleSubmit((data) => handleStepSubmit(1, data))} autoComplete="off">
        <h3 className="form-heading">Basic Information</h3>
        <Row>
          <Form.Group className="form-group" as={Col} lg="6">
            <Form.Label>First Name*</Form.Label>
            <Form.Control
              type="text"
              name="firstName"
              placeholder="Enter First Name"
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
          <Form.Group className="form-group" as={Col} lg="6">
            <Form.Label>Last Name*</Form.Label>
            <Form.Control
              type="text"
              name="lastName"
              placeholder="Enter Last Name"
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
        </Row>
        <Form.Group className="form-group">
          <Form.Label>Email id</Form.Label>
          <Form.Control
            type="email"
            name="email"
            placeholder="Enter Email id"
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
        <Form.Group className="form-group">
          <Form.Label>User Name</Form.Label>
          <Form.Control
            type="text"
            name="userName"
            placeholder="Enter User Name"
            {...register('userName', {
              required: validationErrors.required
            })}
          />
          {errors.userName && (
            <Form.Control.Feedback type="invalid" className="invalidFeedback">
              {errors.userName.message}
            </Form.Control.Feedback>
          )}
        </Form.Group>
        <Form.Group className="form-group">
          <Form.Label>Description</Form.Label>
          <Form.Control
            as="textarea"
            name="description"
            rows={3}
            {...register('description', {
              required: validationErrors.required
            })}
          />
          {errors.description && (
            <Form.Control.Feedback type="invalid" className="invalidFeedback">
              {errors.description.message}
            </Form.Control.Feedback>
          )}
        </Form.Group>
        <div className="form-footer">
          <Row>
            <Col md={6}>
              <Button className="gray-btn" onClick={() => navigate(-1)}>
                Cancel
              </Button>
            </Col>
            <Col md={6}>
              <Button className="white-btn" type="submit">
                Save Update
              </Button>
            </Col>
          </Row>
        </div>
      </Form>
    </section>
  )
}
Information.propTypes = {
  handleStepSubmit: PropTypes.func,
  defaultValues: PropTypes.object
}
export default Information
