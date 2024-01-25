import React from 'react'
import PropTypes from 'prop-types'

function Description({ description }) {
  return <div dangerouslySetInnerHTML={{ __html: description?.html }} />
}

export default Description
Description.propTypes = {
  description: PropTypes.object.isRequired,
}
