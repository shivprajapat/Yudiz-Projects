import React from 'react'
import PropTypes from 'prop-types'
function MainLayout({ childComponent }) {
  return (
    <div>
      <h1>MainLayout</h1>
      {childComponent}
    </div>
  )
}
MainLayout.propTypes = {
  childComponent: PropTypes.node.isRequired
}
export default MainLayout
