import React from 'react'
import PropTypes from 'prop-types'

const SingleNotification = ({ heading, time, details }) => {
  return (
    <div className="single-notification">
      <div className="notification-header">
        <span className="notification-heading">{heading}</span>
        <span className="notification-time">{time}</span>
      </div>
      <p className="notification-details">{details}</p>
    </div>
  )
}

SingleNotification.propTypes = {
  heading: PropTypes.string,
  time: PropTypes.string,
  details: PropTypes.string
}

export default SingleNotification
