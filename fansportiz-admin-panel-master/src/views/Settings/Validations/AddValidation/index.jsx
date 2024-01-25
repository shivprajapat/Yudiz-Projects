import React, { Fragment } from 'react'
import NavbarComponent from '../../../../components/Navbar'
import AddValidation from './AddValidation'

function index (props) {
  return (
    <Fragment>
      <NavbarComponent {...props}/>
      <main className="main-content">
        <section className="management-section common-box">
          <AddValidation {...props} />
        </section>
      </main>
    </Fragment>
  )
}

export default index
