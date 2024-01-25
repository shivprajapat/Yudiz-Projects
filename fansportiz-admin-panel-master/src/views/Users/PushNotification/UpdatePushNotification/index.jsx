import React, { Fragment } from 'react'
import Navbar from '../../../../components/Navbar'
import UpdatePushNotification from './UpdatePushNotification'

function IndexUpdatePushNotification (props) {
  return (
    <Fragment>
      <Navbar {...props} />
      <UpdatePushNotification {...props} />
    </Fragment>
  )
}

export default IndexUpdatePushNotification
