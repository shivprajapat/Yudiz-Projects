import React from 'react'
import PropTypes from 'prop-types'

const LoginHeader = (props) => {
  const { data } = props
  return (
    <div className="login-header d-flex justify-content-between align-items-center">
      <div>
        <h2>{data.title}</h2>
        <p className="small-text mb-0">{data.description}</p>
      </div>
    </div>
  )
}

LoginHeader.propTypes = {
  data: PropTypes.object
}

export default LoginHeader
