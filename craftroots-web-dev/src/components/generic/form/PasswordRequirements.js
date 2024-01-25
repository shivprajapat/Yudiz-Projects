import React from 'react'
import PropTypes from 'prop-types'

const PasswordRequirements = ({
  char,
  uppercase,
  lowerCase,
  number,
  hasRequiredFieldError,
}) => {
  const getValidationClassName = (isValid) => {
    if (hasRequiredFieldError) {
      return isValid ? 'text-success' : 'text-error'
    }
    return isValid ? 'text-success' : 'text-gray-400'
  }
  return (
    <div className="text-sm mt-1">
      <span className={getValidationClassName(char)}> 8 Characters</span>
      <span className={getValidationClassName(uppercase)}> 1 Uppercase</span>
      <span className={getValidationClassName(lowerCase)}> 1 Lowercase</span>
      <span className={getValidationClassName(number)}> 1 Number</span>
    </div>
  )
}

PasswordRequirements.propTypes = {
  char: PropTypes.bool,
  uppercase: PropTypes.bool,
  lowerCase: PropTypes.bool,
  number: PropTypes.bool,
  hasRequiredFieldError: PropTypes.bool,
}

PasswordRequirements.defaultProps = {
  char: false,
  uppercase: false,
  lowerCase: false,
  number: false,
  hasRequiredFieldError: false,
}

export default PasswordRequirements
