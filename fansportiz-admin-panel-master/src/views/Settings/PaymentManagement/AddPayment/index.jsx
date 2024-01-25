import React, { Fragment } from 'react'
import NavbarComponent from '../../../../components/Navbar'
import AddPayment from './AddPayment'

function index (props) {
  return (
    <Fragment>
      <NavbarComponent {...props}/>
      <AddPayment {...props} cancelLink="/settings/payment-management" />
    </Fragment>
  )
}

export default index
