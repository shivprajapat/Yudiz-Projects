import React, { forwardRef } from 'react'
import PropTypes from 'prop-types'
import Form from 'react-bootstrap/Form'

function CheckRadioButton ({ label, onChange, value, name }) {
  return (
    <Form>
      {['radio'].map((type) => (
        <div key={`inline-${type}`} className="mb-3 d-flex">
          <Form.Check
            inline
            label={label}
            name={name}
            type={type}
            id={`inline-${label}`}
            // ref={(r) => (ref = r)}
            value={value}
            onChange={onChange}
          />
        </div>
      ))}
    </Form>
  )
}

export default forwardRef(CheckRadioButton)
CheckRadioButton.propTypes = {
  type: PropTypes.string,
  label: PropTypes.string,
  name: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func,
}