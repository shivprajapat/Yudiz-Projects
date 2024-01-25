import React, { Fragment } from 'react'
import Navbar from '../../../../components/Navbar'
import SystemUserDetails from './SystemUserDetails'

function SystemUserDetailsPage (props) {
  return (
    <Fragment>
      <Navbar {...props} />
      <SystemUserDetails {...props} systemUser />
    </Fragment>
  )
}

export default SystemUserDetailsPage
