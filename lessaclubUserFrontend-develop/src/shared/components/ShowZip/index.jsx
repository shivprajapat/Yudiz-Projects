import React from 'react'
import PropTypes from 'prop-types'
import { FileZipIcon } from 'assets/images/icon-components/icons'

const ShowZip = ({ iconDark }) => {
  return (
    <div
      className={
        iconDark ? 'text-dark d-flex flex-column justify-content-center align-items-center h-100' : 'd-flex flex-column justify-content-center align-items-center h-100'
      }
    >
      <FileZipIcon />
      <span className="p-3 text-center font-weight-lighter">Your GLTF will be converted to GLB soon.</span>
    </div>
  )
}

ShowZip.propTypes = {
  iconDark: PropTypes.bool
}

export default ShowZip
