import React, { Fragment } from 'react'
import Header from '../../../../components/Header'
import NavbarComponent from '../../../../components/Navbar'
import AddContent from './AddContent'

function AddContest (props) {
  return (
    <Fragment>
      <Header />
      <NavbarComponent {...props} />
      <AddContent {...props} />
    </Fragment>
  )
}

export default AddContest
