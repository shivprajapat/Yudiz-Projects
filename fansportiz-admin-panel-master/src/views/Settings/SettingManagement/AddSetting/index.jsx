import React, { Fragment } from 'react'
import NavbarComponent from '../../../../components/Navbar'
import AddSetting from './AddSetting'

function index (props) {
  return (
    <Fragment>
      <NavbarComponent {...props}/>
      <AddSetting {...props} />
    </Fragment>
  )
}

export default index
