import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { Form, Row, Col } from 'react-bootstrap'
import { FormattedMessage } from 'react-intl'
import { Controller } from 'react-hook-form'
import Select from 'react-select'

import { validationErrors } from 'shared/constants/ValidationErrors'
import { ROLES } from 'shared/constants'
import CommonInput from '../common-input'

function EditPlayer({ register, errors, control, nameChanged, values, countryList, loadingCountry, handleScrollCountry, optimizedSearch }) {
  const [name, setName] = useState()

  useEffect(() => {
    name && nameChanged(name)
  }, [name])

  function handleBlur(e) {
    e.target.value && setName(e.target.value)
  }

  return (
    <>
      <Row>
        <Col sm="6">
          <CommonInput
            type="text"
            onBlur={handleBlur}
            register={register}
            errors={errors}
            className={errors.sFullName && 'error'}
            name="sFullName"
            label="name"
            validation={{ maxLength: { value: 40, message: validationErrors.maxLength(40) } }}
            required
          />
        </Col>
        <Col sm="6">
          <Form.Group className="form-group">
            <Form.Label>
              <FormattedMessage id="country" />*
            </Form.Label>
            <Controller
              name="sCountry"
              control={control}
              rules={{ required: validationErrors.required }}
              render={({ field: { onChange, value = [], ref } }) => (
                <Select
                  ref={ref}
                  value={value || values?.sCountry}
                  options={countryList}
                  getOptionLabel={(option) => option.sTitle}
                  getOptionValue={(option) => option.sISO}
                  isSearchable
                  className={`react-select ${errors?.sCountry && 'error'}`}
                  classNamePrefix="select"
                  onMenuScrollToBottom={handleScrollCountry}
                  onInputChange={(value, action) => optimizedSearch(value, action)}
                  isLoading={loadingCountry}
                  onChange={(e) => {
                    onChange(e)
                  }}
                />
              )}
            />
            {errors.sCountry && <Form.Control.Feedback type="invalid">{errors.sCountry.message}</Form.Control.Feedback>}
          </Form.Group>
        </Col>
      </Row>
      <Row>
        <Col sm="6">
          <Form.Group className="form-group">
            <Form.Label>
              <FormattedMessage id="role" />*
            </Form.Label>
            <Controller
              name="sPlayingRole"
              control={control}
              render={({ field: { onChange, value = [], ref } }) => (
                <Select
                  ref={ref}
                  value={value || values?.oPlayingRole}
                  options={ROLES}
                  isSearchable
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
      </Row>
    </>
  )
}
EditPlayer.propTypes = {
  register: PropTypes.func,
  errors: PropTypes.object,
  control: PropTypes.object,
  nameChanged: PropTypes.func,
  values: PropTypes.object,
  handleMenuCountry: PropTypes.func,
  handleMenuRole: PropTypes.func,
  countryList: PropTypes.array,
  loadingCountry: PropTypes.bool,
  handleScrollCountry: PropTypes.func,
  optimizedSearch: PropTypes.func
}
export default EditPlayer
