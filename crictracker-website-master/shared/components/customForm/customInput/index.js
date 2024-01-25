import React from 'react'
import PropTypes from 'prop-types'
import { Form } from 'react-bootstrap'

import styles from './style.module.scss'

const CustomInput = React.forwardRef(({ className, name, register = {}, validation, ...rest }, ref) => (
  <Form.Control
    className={`${className || ''} ${styles.formControl}`}
    ref={ref}
    {...register}
    {...rest}
  />
))

CustomInput.displayName = 'CustomInput'
CustomInput.propTypes = {
  name: PropTypes.string,
  className: PropTypes.any,
  register: PropTypes.any,
  validation: PropTypes.object
}

export default CustomInput
