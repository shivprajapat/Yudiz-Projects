import React from 'react'
import PropTypes from 'prop-types'

function Tab({ content, eventKey }) {
  return (
    <div className="" eventKey={eventKey}>
      {content}
    </div>
  )
}

export default Tab

Tab.propTypes = {
  label: PropTypes.string,
  content: PropTypes.any,
  eventKey: PropTypes.string,
}
