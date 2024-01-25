import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import { Button, Col, Form, Modal, Row } from 'react-bootstrap'
import { Controller, useForm } from 'react-hook-form'
import { FormattedMessage, useIntl } from 'react-intl'
import Select from 'react-select'
import { useDispatch } from 'react-redux'

import { validationErrors } from 'shared/constants/validationErrors'
import Phone from 'shared/components/phone'
import countries from 'shared/data/countries'
import { EMAIL } from 'shared/constants'
import { addAddress, getAddress, updateAddress } from 'modules/address/redux/service'

const AddEditAddressModal = ({ show, handleClose, defaultValues }) => {
  const dispatch = useDispatch()
  const userId = localStorage.getItem('userId')

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
    setValue,
    reset
  } = useForm({ mode: 'all' })

  useEffect(() => {
    if (defaultValues) {
      reset({ ...defaultValues })
    } else {
      reset({})
    }
  }, [])

  const onSubmit = (data) => {
    const phoneNumber = data.phone.split('/')[0]
    const payload = {
      ...data,
      phone: phoneNumber.includes('+') ? phoneNumber : `+${phoneNumber}`,
      country: data.country.label,
      countryCode: data.country.value
    }
    if (defaultValues) {
      delete payload.id
      dispatch(
        updateAddress(defaultValues.id, payload, () => {
          handleClose()
          dispatch(getAddress({ userId: userId }))
        })
      )
    } else {
      dispatch(
        addAddress(payload, () => {
          handleClose()
          dispatch(getAddress({ userId: userId }))
        })
      )
    }
  }

  return (
    <Modal show={show} backdrop="static" centered className="add-edit-address-modal" size="lg">
      <Modal.Header>
        <Modal.Title>Add New Address</Modal.Title>
      </Modal.Header>
      <Form autoComplete="off">
        <Modal.Body>
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
        </Modal.Body>
        <Modal.Footer>
          <Button className="white-btn" type="submit" onClick={handleSubmit(onSubmit)}>
            Add Address
          </Button>
          <Button className="white-border-btn" onClick={handleClose}>
            Cancel
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  )
}
AddEditAddressModal.propTypes = {
  show: PropTypes.bool,
  handleClose: PropTypes.func,
  defaultValues: PropTypes.object
}
export default AddEditAddressModal
