import React, { useEffect } from 'react'
import { Form, Row, Col, Button } from 'react-bootstrap'
import { Controller, useForm } from 'react-hook-form'
import PropTypes from 'prop-types'
import { useNavigate } from 'react-router-dom'
import Select from 'react-select'
import { useDispatch } from 'react-redux'
import DatePicker from 'react-datepicker'

import { EMAIL, TOAST_TYPE } from 'shared/constants'
import { validationErrors } from 'shared/constants/validationErrors'
import { getTimeZone } from 'shared/utils'
import timezones from 'shared/data/timezones'
import { SHOW_TOAST } from 'modules/toast/redux/action'
import { FormattedMessage } from 'react-intl'

const Information = ({ handleStepSubmit, defaultValues, loading }) => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const machineTimezone = getTimeZone()
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
    watch,
    control
  } = useForm({
    mode: 'all'
  })
  const timezone = watch('timezone')
  const dateOfBirth = watch('dateOfBirth')

  useEffect(() => {
    if (timezone && timezone.value !== machineTimezone) {
      dispatch({
        type: SHOW_TOAST,
        payload: {
          message: 'This timezone is not the same as your machine timezone',
          type: TOAST_TYPE.Error
        }
      })
    }
  }, [timezone])
  useEffect(() => {
    if (defaultValues) {
      reset({
        firstName: defaultValues.firstName,
        lastName: defaultValues.lastName,
        email: defaultValues.email,
        userName: defaultValues.userName,
        description: defaultValues.description,
        timezone: { label: defaultValues.timezone, value: defaultValues.timezone } || { label: machineTimezone, value: machineTimezone },
        kycStatus: defaultValues.kycStatus,
        dateOfBirth: defaultValues.dateOfBirth
      })
    }
  }, [defaultValues])

  const filterPassedDate = (time) => {
    const selectedDate = new Date(time)
    const currentDate = new Date()
    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()
    const day = currentDate.getDate()
    const sixteenYearsBefore = new Date(year - 16, month, day)

    return sixteenYearsBefore.getTime() > selectedDate.getTime()
  }

  return (
    <section>
      <Form onSubmit={handleSubmit((data) => handleStepSubmit('basicInfo', data))} autoComplete="off">
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

        <Row>
          <Form.Group className="form-group" as={Col} lg="6">
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

          <Form.Group className="form-group" as={Col} lg="6">
            <Form.Label>KYC Status</Form.Label>
            <Form.Control name="kycStatus" disabled {...register('kycStatus')} />
          </Form.Group>
        </Row>

        <Row>
          <Col xl="6">
            <Form.Group className="form-group">
              <Form.Label className="d-block">
                <FormattedMessage id="chooseDOB" />*
              </Form.Label>
              <Controller
                name="dateOfBirth"
                control={control}
                rules={{
                  required: validationErrors.required,
                  validate: (value) => {
                    if (!filterPassedDate(value)) {
                      return 'Invalid Date'
                    }
                  }
                }}
                render={({ field: { onChange, value = '' } }) => (
                  <DatePicker
                    placeholderText="Select your date of birth"
                    selected={value}
                    onChange={(update) => {
                      onChange(update)
                    }}
                    className={`form-control ${errors.dateOfBirth && 'error'}`}
                    popperPlacement="bottom"
                    dateFormat="MMMM d, yyyy"
                    showMonthDropdown
                    showYearDropdown
                    dropdownMode="select"
                    floatLabelType="Auto"
                    disabled={defaultValues?.dateOfBirth}
                  />
                )}
              />
              {(!filterPassedDate(dateOfBirth) || errors?.dateOfBirth?.message) && (
                <Form.Control.Feedback type="invalid" className="invalidFeedback">
                  {errors?.dateOfBirth?.message}
                </Form.Control.Feedback>
              )}
              <Form.Label className="d-block small" style={{ fontSize: '1rem' }}>
                (Please enter Date Of Birth correctly as it cannot be edited again)
              </Form.Label>
            </Form.Group>
          </Col>
          <Col xl="6">
            <Form.Group className="form-group">
              <Form.Label>Timezone*</Form.Label>
              <Controller
                name="timezone"
                control={control}
                rules={{ required: validationErrors.required }}
                render={({ field: { onChange, value = [] } }) => (
                  <Select
                    value={value}
                    className={`react-select ${errors.timezone && 'error'}`}
                    classNamePrefix="select"
                    options={timezones}
                    onChange={(e) => {
                      onChange(e)
                    }}
                  />
                )}
              />
              {errors.timezone && (
                <Form.Control.Feedback type="invalid" className="invalidFeedback">
                  {errors.timezone.message}
                </Form.Control.Feedback>
              )}
            </Form.Group>
          </Col>
        </Row>

        <Form.Group className="form-group">
          <Form.Label>Description</Form.Label>
          <Form.Control as="textarea" name="description" rows={3} {...register('description')} />
          {errors.description && (
            <Form.Control.Feedback type="invalid" className="invalidFeedback">
              {errors.description.message}
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
Information.propTypes = {
  handleStepSubmit: PropTypes.func,
  defaultValues: PropTypes.object,
  loading: PropTypes.bool
}
export default Information
