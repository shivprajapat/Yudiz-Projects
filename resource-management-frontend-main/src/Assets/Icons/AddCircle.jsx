import React from 'react'
import PropTypes from 'prop-types'

export default function AddCircle({ fill }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 1024 1024" fill={fill}>
      <path fill={fill} d="M352 480h320a32 32 0 1 1 0 64H352a32 32 0 0 1 0-64z" />
      <path fill={fill} d="M480 672V352a32 32 0 1 1 64 0v320a32 32 0 0 1-64 0z" />
      <path fill={fill} d="M512 896a384 384 0 1 0 0-768a384 384 0 0 0 0 768zm0 64a448 448 0 1 1 0-896a448 448 0 0 1 0 896z" />
    </svg>
  )
}

AddCircle.propTypes = {
  fill: PropTypes.string,
}
