import React from 'react'
import { Col, Form, Row, Button, Spinner } from 'react-bootstrap'
import PropTypes from 'prop-types'
import { Controller } from 'react-hook-form'
import Select from 'react-select'

import { validationErrors } from 'shared/constants/validationErrors'
import Phone from 'shared/components/phone'
import countries from 'shared/libs/country'
import { EMAIL } from 'shared/constants'

const AddressForm = ({ hidden, addressFormMethods, onSecondStepSubmit, loading, assetDetails }) => {
  const {
    register,
    formState: { errors },
    handleSubmit,
    control,
    setValue
  } = addressFormMethods

  return (
    <Form hidden={hidden} className="step-one" autoComplete="off" id="address-form">
      <div className="address-title">
        <h4 className="title text-capitalize">Add your Address</h4>
        <div className="checkout-price d-flex">
          <span className="price-txt">Price</span>
          <span className="price-num">{assetDetails?.asset?.sellingPrice}</span>
        </div>
        <p>Enter your address to proceed to payment</p>
      </div>
      <Row>
        <Col lg={6} md={12}>
          <Form.Group className="form-group">
            <Form.Label>First Name*</Form.Label>
            <Form.Control
              type="text"
              className={errors.firstName && 'error'}
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
        </Col>
        <Col lg={6} md={12}>
          <Form.Group className="form-group">
            <Form.Label>Last Name*</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter Last Name"
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
        </Col>
        <Col lg={6} md={12}>
          <Form.Group className="form-group">
            <Form.Label>House Number*</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter House Number"
              className={errors.houseNumber && 'error'}
              {...register('houseNumber', {
                required: validationErrors.required
              })}
            />
            {errors.houseNumber && (
              <Form.Control.Feedback type="invalid" className="invalidFeedback">
                {errors.houseNumber.message}
              </Form.Control.Feedback>
            )}
          </Form.Group>
        </Col>
        <Col lg={6} md={12}>
          <Form.Group className="form-group">
            <Form.Label>Street Name*</Form.Label>
            <Form.Control
              type="text"
              className={errors.streetName && 'error'}
              placeholder="Enter Street Name"
              {...register('streetName', {
                required: validationErrors.required
              })}
            />
            {errors.streetName && (
              <Form.Control.Feedback type="invalid" className="invalidFeedback">
                {errors.streetName.message}
              </Form.Control.Feedback>
            )}
          </Form.Group>
        </Col>
        <Col lg={6} md={12}>
          <Form.Group className="form-group">
            <Form.Label>City*</Form.Label>
            <Form.Control
              type="text"
              className={errors.city && 'error'}
              placeholder="Enter City"
              {...register('city', {
                required: validationErrors.required
              })}
            />
            {errors.city && (
              <Form.Control.Feedback type="invalid" className="invalidFeedback">
                {errors.city.message}
              </Form.Control.Feedback>
            )}
          </Form.Group>
        </Col>
        <Col lg={6} md={12}>
          <Form.Group className="form-group">
            <Form.Label>State/Province*</Form.Label>
            <Form.Control
              type="text"
              className={errors.state && 'error'}
              placeholder="Enter State/Province"
              {...register('state', {
                required: validationErrors.required
              })}
            />
            {errors.state && (
              <Form.Control.Feedback type="invalid" className="invalidFeedback">
                {errors.state.message}
              </Form.Control.Feedback>
            )}
          </Form.Group>
        </Col>
        <Col lg={12}>
          <Form.Group className="form-group">
            <Form.Label>Country*</Form.Label>
            <Controller
              name="country"
              control={control}
              rules={{ required: validationErrors.required }}
              render={({ field: { onChange, value = [] } }) => (
                <Select
                  value={value}
                  className={`react-select ${errors.country && 'error'}`}
                  classNamePrefix="select"
                  options={countries}
                  onChange={(e) => {
                    onChange(e)
                  }}
                />
              )}
            />
            {errors.country && (
              <Form.Control.Feedback type="invalid" className="invalidFeedback">
                {errors.country.message}
              </Form.Control.Feedback>
            )}
          </Form.Group>
        </Col>
        <Col lg={12}>
          <Form.Group className="form-group">
            <Form.Label>Postcode/Zip Code*</Form.Label>
            <Form.Control
              type="text"
              className={errors.pinCode && 'error'}
              placeholder="Enter Postcode/Zip Code"
              {...register('pinCode', {
                required: validationErrors.required
              })}
            />
            {errors.pinCode && (
              <Form.Control.Feedback type="invalid" className="invalidFeedback">
                {errors.pinCode.message}
              </Form.Control.Feedback>
            )}
          </Form.Group>
        </Col>
        <Col lg={12}>
          <Phone control={control} name="phone" required={true} errors={errors} />
        </Col>
        <Col lg={12}>
          <Form.Group className="form-group">
            <Form.Label>Email id*</Form.Label>
            <Form.Control
              type="text"
              className={errors.email && 'error'}
              placeholder="Enter E-mail"
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
        </Col>
      </Row>
      <Button
        className="white-btn payment-btn"
        form="address-form"
        onClick={handleSubmit(onSecondStepSubmit)}
        disabled={loading}
        type="submit"
      >
        proceed to payment
        {loading && <Spinner animation="border" size="sm" />}
      </Button>
    </Form>
  )
}
AddressForm.propTypes = {
  hidden: PropTypes.bool,
  addressFormMethods: PropTypes.object,
  onSecondStepSubmit: PropTypes.func,
  loading: PropTypes.bool,
  assetDetails: PropTypes.object
}
export default AddressForm
