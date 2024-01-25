import React, { Fragment } from 'react'
import NavbarComponent from '../../../../components/Navbar'
import AddPopUpAd from './AddPopUpAd'

function PopupAdOperation (props) {
  return (
    <Fragment>
      <NavbarComponent {...props}/>
      <AddPopUpAd {...props} />
    </Fragment>
  )
}

export default PopupAdOperation
