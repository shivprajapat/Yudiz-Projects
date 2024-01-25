import React from 'react'
import PropTypes from 'prop-types'

import { Form } from 'react-bootstrap'

const CustomFormGroup = ({ children, className, ...rest }) => {
  return (
    <Form.Group className={className || ''} {...rest} >
      {children}
    </Form.Group>
  )
}
CustomFormGroup.propTypes = {
  className: PropTypes.any,
  children: PropTypes.any
}

export default CustomFormGroup
