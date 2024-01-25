import React, { Fragment } from 'react'
import NavbarComponent from '../../../../components/Navbar'
import UpdateNotification from './UpdateNotification'

function UpdateNotificationIndex (props) {
  return (
    <Fragment>
      <NavbarComponent {...props} />
      <main className="main-content">
          <UpdateNotification {...props} />
      </main>
    </Fragment>
  )
}

export default UpdateNotificationIndex
