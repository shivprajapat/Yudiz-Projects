import React, { Fragment } from 'react'
import NavbarComponent from '../../../../components/Navbar'
import AddSlider from './AddSlider'

function index (props) {
  return (
    <Fragment>
      <NavbarComponent {...props}/>
      <AddSlider {...props} />
    </Fragment>
  )
}

export default index
