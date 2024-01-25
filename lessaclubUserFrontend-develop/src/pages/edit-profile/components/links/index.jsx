import React, { useEffect } from 'react'
import { Button, Col, Form, Row } from 'react-bootstrap'
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
      <Form onSubmit={handleSubmit((data) => handleStepSubmit('links', data))} autoComplete="off">
        <h3 className="form-heading">Links</h3>

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
              <Button className="gray-btn" onClick={() => navigate(-1)} disabled={loading}>
                Cancel
              </Button>
            </Col>
            <Col md={6}>
              <Button className="white-btn" type="submit" disabled={loading}>
                Save Update
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
