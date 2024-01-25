import React from 'react'
import './_wrapper.scss'
import PropTypes from 'prop-types'

export default function Wrapper({ transparent, children, className }) {
  return <section className={`${className ? className : ''} wrapper_section ${transparent ? 'transparent' : ''}`}>{children}</section>
}

Wrapper.propTypes = {
  children: PropTypes.any,
  transparent: PropTypes.bool,
  className: PropTypes.string,
}
