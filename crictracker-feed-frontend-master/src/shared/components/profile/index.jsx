import React, { useState, useEffect } from 'react'
import { Form, Row, Col } from 'react-bootstrap'
import PropTypes from 'prop-types'
import { FormattedMessage } from 'react-intl'
import { Controller } from 'react-hook-form'
import Select from 'react-select'

import { validationErrors } from 'shared/constants/ValidationErrors'
import CommonInput from '../common-input'
import Countries from '../../constants/countries'
import States from '../../constants/states'
import Cities from '../../constants/cities'

function EditProfileComponent({
  register,
  control,
  errors
}) {
  const [selectedCountry, setSelectedCountry] = useState()
  const [listOfStates, setListOfStates] = useState([])
  const [selectedState, setSelectedState] = useState([])
  const [listOfCities, setListofCities] = useState([])

  useEffect(() => {
    setListOfStates(States.filter((state) => state?.country_id === selectedCountry?.id))
  }, [selectedCountry])
  useEffect(() => {
    setListofCities(Cities.filter((city) => city.state_id === selectedState.id))
  }, [selectedState])

  return (
    <>
      <Row>
        <Col sm='4'>
          <CommonInput
            type='text'
            register={register}
            errors={errors}
            className={`form-control ${errors.sName && 'error'}`}
            name='sName'
            label='fullName'
            disabled={true}
          />
        </Col>
        <Col sm='4'>
          <CommonInput
            type='text'
            register={register}
            errors={errors}
            className={`form-control ${errors.sUsername && 'error'}`}
            name='sUsername'
            label='userName'
            disabled={true}
          />
        </Col>
        <Col sm='4'>
          <CommonInput
            type='text'
            register={register}
            errors={errors}
            className={`form-control ${errors.sEmail && 'error'}`}
            name='sEmail'
            label='emailAddress'
            disabled={true}
          />
        </Col>
        <Col sm='4'>
          <CommonInput
            type='text'
            register={register}
            errors={errors}
            className={`form-control ${errors.sCompanyName && 'error'}`}
            name='sCompanyName'
            label='companyName'
          />
        </Col>
        <Col sm='4'>
          <Form.Group className='form-group'>
            <Form.Label>
              <FormattedMessage id='phoneNumber' />*
            </Form.Label>
            <Form.Control
              type='text'
              name='sPhone'
              className={errors.sPhone && 'error'}
              {...register('sPhone', {
                required: validationErrors.required,
                maxLength: { value: 10, message: validationErrors.number },
                minLength: { value: 10, message: validationErrors.number }
              })}
            />
            {errors.sPhone && <Form.Control.Feedback type='invalid'>{errors.sPhone.message}</Form.Control.Feedback>}
          </Form.Group>
        </Col>
        <Col sm='4'>
          <CommonInput
            type='text'
            register={register}
            errors={errors}
            className={`form-control ${errors.sGSTNo && 'error'}`}
            name='sGSTNo'
            label='gstno'
          />
        </Col>
        <Col sm='4'>
          <CommonInput
            type='text'
            register={register}
            errors={errors}
            className={`form-control ${errors.sAddress && 'error'}`}
            name='sAddress'
            label='address'
          />
        </Col>
        <Col sm='4'>
          <Form.Group className='form-group'>
            <Form.Label>
              <FormattedMessage id='country' />
            </Form.Label>
            <Controller
              name='sCountry'
              control={control}
              render={({ field: { onChange, value = [], ref } }) => (
                <Select
                  ref={ref}
                  value={value}
                  options={Countries}
                  className={`react-select ${errors?.sCountry && 'error'}`}
                  classNamePrefix='select'
                  onChange={(e) => {
                    onChange(e)
                    setSelectedCountry(e)
                  }}
                />
              )}
            />
            {errors.sCountry && <Form.Control.Feedback type='invalid'>{errors.sCountry.message}</Form.Control.Feedback>}
          </Form.Group>
        </Col>
        <Col sm='4'>
          <Form.Group className='form-group'>
            <Form.Label>
              <FormattedMessage id='state' />
            </Form.Label>
            <Controller
              name='sState'
              control={control}
              render={({ field: { onChange, value = [], ref } }) => (
                <Select
                  ref={ref}
                  value={value}
                  options={listOfStates}
                  className={`react-select ${errors?.sState && 'error'}`}
                  classNamePrefix='select'
                  onChange={(e) => {
                    onChange(e)
                    setSelectedState(e)
                  }}
                  isDisabled={listOfStates.length === 0}
                />
              )}
            />
            {errors.sState && <Form.Control.Feedback type='invalid'>{errors.sState.message}</Form.Control.Feedback>}
          </Form.Group>
        </Col>
        <Col sm='4'>
          <Form.Group className='form-group'>
            <Form.Label>
              <FormattedMessage id='city' />
            </Form.Label>
            <Controller
              name='sCity'
              control={control}
              render={({ field: { onChange, value = [], ref } }) => (
                <Select
                  ref={ref}
                  value={value}
                  options={listOfCities}
                  className={`react-select ${errors?.sCity && 'error'}`}
                  classNamePrefix='select'
                  onChange={(e) => {
                    onChange(e)
                  }}
                  isDisabled={listOfCities.length === 0}
                />
              )}
            />
            {errors.sCity && <Form.Control.Feedback type='invalid'>{errors.sCity.message}</Form.Control.Feedback>}
          </Form.Group>
        </Col>
      </Row>
    </>
  )
}

EditProfileComponent.propTypes = {
  register: PropTypes.func,
  values: PropTypes.object,
  control: PropTypes.object,
  errors: PropTypes.object,
  clearErrors: PropTypes.func,
  trigger: PropTypes.func,
  sProfilePicture: PropTypes.string,
  profileData: PropTypes.object,
  sBankDetailPic: PropTypes.string,
  sPanPicture: PropTypes.string,
  handleChange: PropTypes.func,
  setValue: PropTypes.func
}

export default EditProfileComponent
