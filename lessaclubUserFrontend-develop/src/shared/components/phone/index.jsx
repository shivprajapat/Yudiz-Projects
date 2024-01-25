import React from 'react'
import PhoneInput from 'react-phone-input-2'
import { Controller } from 'react-hook-form'
import PropTypes from 'prop-types'
import { Form } from 'react-bootstrap'
import { FormattedMessage } from 'react-intl'

import { validationErrors } from 'shared/constants/validationErrors'

const Phone = ({ control, name, required, errors }) => {
  const validatePhoneNumber = (e) => {
    if (!e.includes('/')) {
      return true
    }
    if (e && e.length > 0) {
      const diff = e.split('/')
      const targetValueLength = diff[0].length
      const requiredLength = (diff[1]?.match(/\./g) || []).length
      if (requiredLength !== targetValueLength) {
        return false
      } else if (targetValueLength === requiredLength) {
        return true
      }
    }
  }

  return (
    <>
      <Form.Group className="form-group phone-input">
        <Form.Label>
          <FormattedMessage id="phone" />*
        </Form.Label>
        <Controller
          name={name}
          control={control}
          rules={{ required: validationErrors.required, validate: (value) => validatePhoneNumber(value) || validationErrors.phoneNumber }}
          render={({ field: { onChange, value } }) => (
            <PhoneInput
              enableLongNumbers={true}
              enableSearch={true}
              className={`${errors.phone && 'error'}`}
              name={name}
              country="in"
              value={value}
              specialLabel=""
              onChange={(e, selectedCountry) => {
                onChange(e + '/' + selectedCountry?.format)
              }}
              inputProps={{
                id: name,
                name,
                required
              }}
            />
          )}
        />
        {errors.phone && (
          <Form.Control.Feedback type="invalid" className="invalidFeedback">
            {errors?.phone?.message}
          </Form.Control.Feedback>
        )}
      </Form.Group>
    </>
  )
}
Phone.propTypes = {
  control: PropTypes.object.isRequired,
  name: PropTypes.string.isRequired,
  required: PropTypes.bool,
  errors: PropTypes.object
}
export default Phone
