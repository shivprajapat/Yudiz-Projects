import React, { Fragment } from 'react'
import Header from '../../../../components/Header'
import NavbarComponent from '../../../../components/Navbar'
import AddSportComponent from './AddSport'

function AddSport (props) {
  return (
    <Fragment>
      <Header />
      <NavbarComponent {...props} />
      <AddSportComponent {...props} />
    </Fragment>
  )
}

export default AddSport
