import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import NavbarComponent from '../../../../components/Navbar'
import UserDetails from './UserDetails'

function UserDetailsPage (props) {
  return (
    <Fragment>
      <NavbarComponent {...props} />
      <UserDetails {...props} />
    </Fragment>
  )
}

UserDetailsPage.prototypes = {
  match: PropTypes.object
}

export default UserDetailsPage
