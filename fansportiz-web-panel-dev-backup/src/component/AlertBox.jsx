import React from 'react'
import PropTypes from 'prop-types'

const classNames = require('classnames')

function AlertBox (props) {
  const { children, type } = props
  const className = classNames('alertBox', { red: type === 'red', green: type !== 'red' })
  return (
    <div className={className}>
      <p>{children}</p>
    </div>
  )
}
AlertBox.propTypes = {
  children: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired
}
export default AlertBox
