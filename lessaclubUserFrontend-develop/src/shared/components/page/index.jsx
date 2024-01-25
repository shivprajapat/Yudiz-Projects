import React from 'react'
import { withRouter } from 'react-router-dom'
import PropTypes from 'prop-types'

import Header from '../header'
import Footer from '../footer'

const Page = ({ children }) => {
  return (
    <>
      <Header />
      <div>{children}</div>
      <Footer />
    </>
  )
}
Page.propTypes = {
  children: PropTypes.any
}
export default withRouter(Page)
