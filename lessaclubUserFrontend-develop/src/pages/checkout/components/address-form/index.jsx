import React from 'react'
import { Col, Form, Row, Button } from 'react-bootstrap'
import PropTypes from 'prop-types'
import { Controller } from 'react-hook-form'
import Select from 'react-select'
import { FormattedMessage, useIntl } from 'react-intl'

import { validationErrors } from 'shared/constants/validationErrors'
import Phone from 'shared/components/phone'
import countries from 'shared/data/countries'
import { EMAIL } from 'shared/constants'

const AddressForm = ({ hidden, addressFormMethods, onSecondStepSubmit, loading, assetDetails }) => {
  const labels = {
    firstName: useIntl().formatMessage({ id: 'enterFirstName' }),
    lastName: useIntl().formatMessage({ id: 'enterLastName' }),
    houseNumber: useIntl().formatMessage({ id: 'enterHouseNumber' }),
    streetName: useIntl().formatMessage({ id: 'enterStreetName' }),
    city: useIntl().formatMessage({ id: 'enterCity' }),
    state: useIntl().formatMessage({ id: 'enterState' }),
    pinCode: useIntl().formatMessage({ id: 'enterPinCode' }),
    email: useIntl().formatMessage({ id: 'enterEmail' })
  }
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
        <h4 className="title text-capitalize">
          <FormattedMessage id="addYourAddress" />
        </h4>
        <div className="checkout-price d-flex">
          <span className="price-txt">
            <FormattedMessage id="price" />
          </span>
          <span className="price-num">{assetDetails?.asset?.sellingPrice}</span>
        </div>
        <p>
          <FormattedMessage id="enterYourAddressToProceedToPayment" />
        </p>
      </div>
      <Row>
        <Col md={6}>
          <Form.Group className="form-group">
            <Form.Label>
              <FormattedMessage id="firstName" />*
            </Form.Label>
            <Form.Control
              type="text"
              className={errors.firstName && 'error'}
              placeholder={labels.firstName}
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
        <Col md={6}>
          <Form.Group className="form-group">
            <Form.Label>
              <FormattedMessage id="lastName" />*
            </Form.Label>
            <Form.Control
              type="text"
              placeholder={labels.lastName}
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
        <Col md={6}>
          <Form.Group className="form-group">
            <Form.Label>
              <FormattedMessage id="houseNumber" />*
            </Form.Label>
            <Form.Control
              type="text"
              placeholder={labels.houseNumber}
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
        <Col md={6}>
          <Form.Group className="form-group">
            <Form.Label>
              <FormattedMessage id="streetName" />*
            </Form.Label>
            <Form.Control
              type="text"
              className={errors.streetName && 'error'}
              placeholder={labels.streetName}
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
        <Col md={6}>
          <Form.Group className="form-group">
            <Form.Label>
              <FormattedMessage id="city" />*
            </Form.Label>
            <Form.Control
              type="text"
              className={errors.city && 'error'}
              placeholder={labels.city}
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
        <Col md={6}>
          <Form.Group className="form-group">
            <Form.Label>
              <FormattedMessage id="state/province" />*
            </Form.Label>
            <Form.Control
              type="text"
              className={errors.state && 'error'}
              placeholder={labels.state}
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
        <Col md={12}>
          <Form.Group className="form-group">
            <Form.Label>
              <FormattedMessage id="country" />*
            </Form.Label>
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
        <Col md={12}>
          <Form.Group className="form-group">
            <Form.Label>
              <FormattedMessage id="postcode/zipCode" />*
            </Form.Label>
            <Form.Control
              type="text"
              className={errors.pinCode && 'error'}
              placeholder={labels.pinCode}
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
        <Col md={12}>
          <Phone control={control} name="phone" required={true} errors={errors} />
        </Col>
        <Col md={12}>
          <Form.Group className="form-group">
            <Form.Label>
              <FormattedMessage id="email" />*
            </Form.Label>
            <Form.Control
              type="text"
              className={errors.email && 'error'}
              placeholder={labels.email}
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
        <FormattedMessage id="ProceedToPayment" />
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
