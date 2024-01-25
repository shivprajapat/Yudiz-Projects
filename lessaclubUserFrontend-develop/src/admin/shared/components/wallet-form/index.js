import React, { useEffect } from 'react'
import { Button, Col, Form, Row } from 'react-bootstrap'
import PropTypes from 'prop-types'
import { useForm } from 'react-hook-form'
import { validationErrors } from 'shared/constants/validationErrors'

const WalletForm = ({ handleStepSubmit, defaultValues, loading }) => {
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
        donationWalletAddress: defaultValues.donationWalletAddress
      })
    }
  }, [defaultValues])
  return (
    <>
      <Form onSubmit={handleSubmit((data) => handleStepSubmit('generalSettings', data))} autoComplete="off">
        <Form.Group className="form-group">
          <h3 className="form-heading">Donation Wallet Address</h3>
          <Form.Control
            type="text"
            name="donationWalletAddress"
            placeholder="Enter Donation Wallet Address"
            {...register('donationWalletAddress', {
              required: validationErrors.required
            })}
          />
          {errors?.donationWalletAddress && (
            <Form.Control.Feedback type="invalid" className="invalidFeedback">
              {errors?.donationWalletAddress.message}
            </Form.Control.Feedback>
          )}
        </Form.Group>
        <Row>
          <Col md={6}>
            <Button className="white-btn" type="submit" disabled={loading}>
              Update Donation Wallet
            </Button>
          </Col>
        </Row>
      </Form>
    </>
  )
}

WalletForm.propTypes = {
  handleStepSubmit: PropTypes.func,
  defaultValues: PropTypes.any,
  loading: PropTypes.bool
}

export default WalletForm
