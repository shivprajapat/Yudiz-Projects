import React from 'react'
import PropTypes from 'prop-types'

import styles from './style.module.scss'

const CustomFeedback = ({ message, className, ...rest }) => {
  return (
    <div className={`${className || ''} ${styles.invalidFeedback}`} {...rest} >
      {message}
    </div>
  )
}
CustomFeedback.propTypes = {
  message: PropTypes.string,
  className: PropTypes.string
}

export default CustomFeedback
