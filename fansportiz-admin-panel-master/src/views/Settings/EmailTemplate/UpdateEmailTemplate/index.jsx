import React, { Fragment } from 'react'
import Header from '../../../../components/Header'
import Navbar from '../../../../components/Navbar'
import UpdateEmailTemplateComponent from './UpdateEmailTemplate'

function UpdateEmailTemplate (props) {
  return (
    <Fragment>
      <Header />
      <Navbar {...props} />
      <UpdateEmailTemplateComponent {...props} />
    </Fragment>
  )
}

export default UpdateEmailTemplate
