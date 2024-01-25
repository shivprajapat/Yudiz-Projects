import React, { Fragment } from 'react'
import Navbar from '../../../../components/Navbar'
import UpdatePayoutComponent from './UpdatePayout'

function UpdatePayout (props) {
  return (
    <Fragment>
      <Navbar {...props}/>
      <UpdatePayoutComponent {...props} cancelLink="/settings/payout-management" />
    </Fragment>
  )
}

export default UpdatePayout
