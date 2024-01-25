import React from 'react'
import PropTypes from 'prop-types'

import './style.scss'

const PageHeader = ({ title }) => {
  return (
    <div>
      <h3 className="page-header-title text-capitalize">{title}</h3>
    </div>
  )
}
PageHeader.propTypes = {
  title: PropTypes.object
}
export default PageHeader
