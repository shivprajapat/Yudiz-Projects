import React, { useEffect } from 'react'
import { Form, Row, Col, Button } from 'react-bootstrap'
import { Controller, useForm } from 'react-hook-form'
import PropTypes from 'prop-types'
import DatePicker from 'react-datepicker'

import { validationErrors } from 'shared/constants/validationErrors'

const GeneralSettings = ({ handleStepSubmit, defaultValues, loading }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control
  } = useForm({
    mode: 'all'
  })

  useEffect(() => {
    if (defaultValues) {
      reset({
        referrerRate: defaultValues.referrerRate,
        referrerExpiryDate: Date.parse(defaultValues.referrerExpiryDate),
        refereeRate: defaultValues.refereeRate,
        refereeExpiryDate: Date.parse(defaultValues.refereeExpiryDate),
        primaryCommissionRate: defaultValues.primaryCommissionRate,
        donationWalletAddress: defaultValues.donationWalletAddress,
        donationRate: defaultValues.donationRate,
        coinRateInPound: defaultValues.coinRateInPound,
        initialLoginCoinReserve: defaultValues.initialLoginCoinReserve,
        resaleCommissionRate: defaultValues.resaleCommissionRate
      })
    }
  }, [defaultValues])

  return (
    <section>
      <Form onSubmit={handleSubmit((data) => handleStepSubmit('generalSettings', data))} autoComplete="off">
        <h3 className="form-heading">General Settings</h3>
        <Row>
          <Form.Group className="form-group" as={Col} lg="8">
            <Form.Label>Referrer Rate</Form.Label>
            <Form.Control
              type="number"
              step=".01"
              name="referrerRate"
              placeholder="Enter Referrer Rate"
              {...register('referrerRate', {
                required: validationErrors.required,
                valueAsNumber: true
              })}
              onWheel={(e) => e.target.blur()}
            />
            {errors.referrerRate && (
              <Form.Control.Feedback type="invalid" className="invalidFeedback">
                {errors.referrerRate.message}
              </Form.Control.Feedback>
            )}
          </Form.Group>
        </Row>

        <Row>
          <Col xl="8">
            <Form.Group className="form-group">
              <Form.Label className="d-block">Referrer Expiry Date</Form.Label>
              <Controller
                name="referrerExpiryDate"
                control={control}
                rules={{ required: validationErrors.required }}
                render={({ field: { onChange, value = '' } }) => (
                  <DatePicker
                    placeholderText="Select referrer expiry date"
                    selected={value}
                    onChange={(update) => {
                      onChange(update)
                    }}
                    className={`form-control ${errors.referrerExpiryDate && 'error'}`}
                    popperPlacement="bottom"
                    dateFormat="MMMM d, yyyy"
                    showMonthDropdown
                    showYearDropdown
                    dropdownMode="select"
                    floatLabelType="Auto"
                  />
                )}
              />

              {errors.referrerExpiryDate && (
                <Form.Control.Feedback type="invalid" className="invalidFeedback">
                  {errors.referrerExpiryDate.message}
                </Form.Control.Feedback>
              )}
            </Form.Group>
          </Col>
        </Row>

        <Row>
          <Form.Group className="form-group" as={Col} lg="8">
            <Form.Label>referee Rate</Form.Label>
            <Form.Control
              type="number"
              step=".01"
              name="refereeRate"
              placeholder="Enter Referee Rate"
              {...register('refereeRate', {
                required: validationErrors.required,
                valueAsNumber: true
              })}
              onWheel={(e) => e.target.blur()}
            />
            {errors.refereeRate && (
              <Form.Control.Feedback type="invalid" className="invalidFeedback">
                {errors.refereeRate.message}
              </Form.Control.Feedback>
            )}
          </Form.Group>
        </Row>

        <Row>
          <Col xl="8">
            <Form.Group className="form-group">
              <Form.Label className="d-block">Referee Expiry Date</Form.Label>
              <Controller
                name="refereeExpiryDate"
                control={control}
                rules={{ required: validationErrors.required }}
                render={({ field: { onChange, value = '' } }) => (
                  <DatePicker
                    placeholderText="Select referee expiry date"
                    selected={value}
                    onChange={(update) => {
                      onChange(update)
                    }}
                    className={`form-control ${errors.refereeExpiryDate && 'error'}`}
                    popperPlacement="bottom"
                    dateFormat="MMMM d, yyyy"
                    showMonthDropdown
                    showYearDropdown
                    dropdownMode="select"
                    floatLabelType="Auto"
                  />
                )}
              />

              {errors.refereeExpiryDate && (
                <Form.Control.Feedback type="invalid" className="invalidFeedback">
                  {errors.refereeExpiryDate.message}
                </Form.Control.Feedback>
              )}
            </Form.Group>
          </Col>
        </Row>

        <Row>
          <Form.Group className="form-group" as={Col} lg="8">
            <Form.Label>Primary Commission Rate</Form.Label>
            <Form.Control
              type="number"
              step=".01"
              name="primaryComissionRate"
              placeholder="Enter Commission Rate"
              {...register('primaryCommissionRate', {
                required: validationErrors.required,
                valueAsNumber: true
              })}
              onWheel={(e) => e.target.blur()}
            />
            {errors.primaryComissionRate && (
              <Form.Control.Feedback type="invalid" className="invalidFeedback">
                {errors.primaryCommissionRate.message}
              </Form.Control.Feedback>
            )}
          </Form.Group>
        </Row>
        <Row>
          <Form.Group className="form-group" as={Col} lg="8">
            <Form.Label>Secondary Commission Rate</Form.Label>
            <Form.Control
              type="number"
              step=".01"
              name="resaleCommissionRate"
              placeholder="Enter Secondary Commission Rate"
              {...register('resaleCommissionRate', {
                required: validationErrors.required,
                valueAsNumber: true
              })}
              onWheel={(e) => e.target.blur()}
            />
            {errors.resaleCommissionRate && (
              <Form.Control.Feedback type="invalid" className="invalidFeedback">
                {errors.resaleCommissionRate.message}
              </Form.Control.Feedback>
            )}
          </Form.Group>
        </Row>
        {/* <Row>
          <Form.Group className="form-group" as={Col} lg="8">
            <Form.Label>Donation Rate</Form.Label>
            <Form.Control
              type="number"
              step=".01"
              name="donationRate"
              placeholder="Enter Donation Rate"
              {...register('donationRate', {
                required: validationErrors.required,
                valueAsNumber: true
              })}
            />
            {errors.donationRate && (
              <Form.Control.Feedback type="invalid" className="invalidFeedback">
                {errors.donationRate.message}
              </Form.Control.Feedback>
            )}
          </Form.Group>
        </Row> */}

        <div className="form-footer">
          <Row>
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
GeneralSettings.propTypes = {
  handleStepSubmit: PropTypes.func,
  defaultValues: PropTypes.any,
  loading: PropTypes.bool
}
export default GeneralSettings
