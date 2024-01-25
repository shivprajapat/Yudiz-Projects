import React from 'react'
import PropTypes from 'prop-types'
import { Col, Form, Row } from 'react-bootstrap'
import { FormattedMessage, useIntl } from 'react-intl'
import Select from 'react-select'
import { Controller } from 'react-hook-form'

import { validationErrors } from 'shared/constants/ValidationErrors'
import CommonInput from 'shared/components/common-input'

function FantasyMatchReport({ register, errors, values, control, overviewData }) {
  const teamOptions = [
    { label: overviewData?.oMatch?.oTeamA?.sTitle, value: overviewData?.oMatch?.oTeamA?._id },
    { label: overviewData?.oMatch?.oTeamB?.sTitle, value: overviewData?.oMatch?.oTeamB?._id }
  ]

  return (
    <>
      <Col sm="12">
        <CommonInput
          type="textarea"
          register={register}
          errors={errors}
          className={errors.sNews && 'error'}
          name="sNews"
          label="injuryAndAvailabilityNews"
          required
        />
      </Col>
      <Row>
        <Col sm="6">
          <CommonInput
            type="text"
            register={register}
            errors={errors}
            className={`form-control ${errors?.sPitchCondition && 'error'}`}
            name="sPitchCondition"
            label="pitchCondition"
            validation={{ maxLength: { value: 40, message: validationErrors.maxLength(40) } }}
            required
          />
        </Col>
        <Col sm="6">
          <Form.Group className="form-group">
            <Form.Label className="d-flex justify-content-between">
              <div>
                <FormattedMessage id="averageScore" />*
              </div>
              <div className="text-muted text-capitalize">({useIntl().formatMessage({ id: 'onlyNumbers' })})</div>
            </Form.Label>
            <Form.Control
              type="number"
              name="sAvgScore"
              className={errors.sAvgScore && 'error'}
              {...register('sAvgScore', {
                required: validationErrors.required,
                maxLength: { value: 5, message: validationErrors.maxLength(5) }
              })}
            />
            {errors.sAvgScore && <Form.Control.Feedback type="invalid">{errors.sAvgScore.message}</Form.Control.Feedback>}
          </Form.Group>
        </Col>
      </Row>
      <Row>
        <Col sm="6">
          <Form.Group className="form-group">
            <Form.Label>
              <FormattedMessage id="matchWinner" />
            </Form.Label>
            <Controller
              name="iWinnerTeamId"
              control={control}
              render={({ field: { onChange, value = [], ref } }) => (
                <Select
                  ref={ref}
                  value={value || values?.iWinnerTeamId}
                  options={teamOptions}
                  className="react-select"
                  classNamePrefix="select"
                  onChange={(e) => {
                    onChange(e)
                  }}
                />
              )}
            />
          </Form.Group>
        </Col>
        <Col sm="6">
          <CommonInput
            type="text"
            register={register}
            errors={errors}
            className={`form-control ${errors?.sWeatherReport && 'error'}`}
            name="sWeatherReport"
            label="weatherReport"
            validation={{ maxLength: { value: 40, message: validationErrors.maxLength(40) } }}
            required
          />
        </Col>
      </Row>
      <Col sm="12">
        <CommonInput
          type="textarea"
          register={register}
          errors={errors}
          className={errors.sPitchReport && 'error'}
          name="sPitchReport"
          label="pitchReport"
          required
        />
      </Col>
    </>
  )
}

FantasyMatchReport.propTypes = {
  register: PropTypes.func,
  errors: PropTypes.object,
  values: PropTypes.object,
  control: PropTypes.object,
  overviewData: PropTypes.object
}
export default FantasyMatchReport
