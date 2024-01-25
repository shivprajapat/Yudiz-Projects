import React, { Fragment } from 'react'
import NavbarComponent from '../../../../components/Navbar'
import UpdatePointComponent from './UpdatePoint'

function UpdatePoint (props) {
  return (
    <Fragment>
      <NavbarComponent {...props}/>
      <UpdatePointComponent {...props} />
    </Fragment>
  )
}

export default UpdatePoint
