import React, { Fragment } from 'react'
import NavbarComponent from '../../../../components/Navbar'
import UserViewContent from './UserKycVerification'

function UserKycRequest (props) {
  return (
    <Fragment>
      <NavbarComponent {...props} />
      <UserViewContent
        {...props}
      />
    </Fragment>
  )
}

export default UserKycRequest
