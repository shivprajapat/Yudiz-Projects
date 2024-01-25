import React, { Fragment } from 'react'
import NavBar from '../../components/Navbar'
import DashboardContent from './dashboard'

function index (props) {
  return (
    <Fragment>
      <NavBar {...props} />
      <DashboardContent />
    </Fragment>
  )
}

export default index
