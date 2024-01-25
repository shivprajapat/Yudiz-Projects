import React, { useEffect } from 'react'
import { Button, Col, Form, Row, Spinner } from 'react-bootstrap'
import { useForm } from 'react-hook-form'
import PropTypes from 'prop-types'
import { useNavigate } from 'react-router-dom'

import { URL_REGEX } from 'shared/constants'
import { validationErrors } from 'shared/constants/validationErrors'

const Links = ({ handleStepSubmit, defaultValues, loading }) => {
  const navigate = useNavigate()
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm({
    mode: 'all'
  })

  useEffect(() => {
    if (defaultValues) {
      reset({
        socialLinks: JSON.parse(defaultValues.socialLinks)
      })
    }
  }, [defaultValues])

  return (
    <section>
      <Form onSubmit={handleSubmit((data) => handleStepSubmit(2, data))} autoComplete="off">
        <h3 className="form-heading">Links</h3>
        <Form.Group className="form-group">
          <Form.Label>Website</Form.Label>
          <Form.Control
            type="text"
            {...register('socialLinks.website', {
              required: false,
              pattern: { value: URL_REGEX, message: validationErrors.url }
            })}
          />
          {errors?.socialLinks?.website && (
            <Form.Control.Feedback type="invalid" className="invalidFeedback">
              {errors.socialLinks.website.message}
            </Form.Control.Feedback>
          )}
        </Form.Group>
        <Form.Group className="form-group">
          <Form.Label>Google</Form.Label>
          <Form.Control
            type="text"
            {...register('socialLinks.google', {
              required: false,
              pattern: { value: URL_REGEX, message: validationErrors.url }
            })}
          />
          {errors?.socialLinks?.google && (
            <Form.Control.Feedback type="invalid" className="invalidFeedback">
              {errors.socialLinks.google.message}
            </Form.Control.Feedback>
          )}
        </Form.Group>
        <Form.Group className="form-group">
          <Form.Label>Facebook</Form.Label>
          <Form.Control
            type="text"
            {...register('socialLinks.facebook', {
              required: false,
              pattern: { value: URL_REGEX, message: validationErrors.url }
            })}
          />
          {errors?.socialLinks?.facebook && (
            <Form.Control.Feedback type="invalid" className="invalidFeedback">
              {errors.socialLinks.facebook.message}
            </Form.Control.Feedback>
          )}
        </Form.Group>
        <Form.Group className="form-group">
          <Form.Label>Twitter</Form.Label>
          <Form.Control
            type="text"
            {...register('socialLinks.twitter', {
              required: false,
              pattern: { value: URL_REGEX, message: validationErrors.url }
            })}
          />
          {errors?.socialLinks?.twitter && (
            <Form.Control.Feedback type="invalid" className="invalidFeedback">
              {errors.socialLinks.twitter.message}
            </Form.Control.Feedback>
          )}
        </Form.Group>
        <Form.Group className="form-group">
          <Form.Label>Instagram</Form.Label>
          <Form.Control
            type="text"
            {...register('socialLinks.instagram', {
              required: false,
              pattern: { value: URL_REGEX, message: validationErrors.url }
            })}
          />
          {errors?.socialLinks?.instagram && (
            <Form.Control.Feedback type="invalid" className="invalidFeedback">
              {errors.socialLinks.instagram.message}
            </Form.Control.Feedback>
          )}
        </Form.Group>
        <Form.Group className="form-group">
          <Form.Label>Twitch</Form.Label>
          <Form.Control
            type="text"
            {...register('socialLinks.twitch', {
              required: false,
              pattern: { value: URL_REGEX, message: validationErrors.url }
            })}
          />
          {errors?.socialLinks?.twitch && (
            <Form.Control.Feedback type="invalid" className="invalidFeedback">
              {errors.socialLinks.twitch.message}
            </Form.Control.Feedback>
          )}
        </Form.Group>
        <div className="form-footer">
          <Row>
            <Col md={6}>
              <Button className="gray-btn" disabled={loading} onClick={() => navigate(-1)}>
                Cancel
              </Button>
            </Col>
            <Col md={6}>
              <Button className="white-btn" type="submit" disabled={loading}>
                Save Update
                {loading && <Spinner animation="border" size="sm" />}
              </Button>
            </Col>
          </Row>
        </div>
      </Form>
    </section>
  )
}
Links.propTypes = {
  handleStepSubmit: PropTypes.func,
  defaultValues: PropTypes.object,
  loading: PropTypes.bool
}
export default Links
