import React from 'react'
import PropTypes from 'prop-types'
import { Spinner } from 'react-bootstrap'

export default function Loading({ variant, absolute }) {
  return (
    <Spinner
      style={{ position: absolute ? 'absolute' : 'fixed', top: '50%', left: '50%' }}
      animation="border"
      variant={'dark' || variant}
    />
  )
}

Loading.propTypes = {
  variant: PropTypes.string,
  absolute: PropTypes.bool,
}
