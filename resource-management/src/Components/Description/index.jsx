import React from 'react'
import './_descriptionBox.scss'
import PropTypes from 'prop-types'

const DescriptionBox = ({ title }) => {
  return <div className="description-box" dangerouslySetInnerHTML={{ __html: title }}></div>
}
DescriptionBox.propTypes = {
  title: PropTypes.string,
}
export default DescriptionBox
