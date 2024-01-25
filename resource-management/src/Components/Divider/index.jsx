import React from 'react'
import PropTypes from 'prop-types'
import './_divider.scss'

export default function Divider({ width, height, ...props }) {
  return (
    <div className="divider_container" {...props}>
      <div className="custom_divider" style={{ width, height }} />
    </div>
  )
}
Divider.propTypes = {
  height: PropTypes.string,
  width: PropTypes.string,
}
