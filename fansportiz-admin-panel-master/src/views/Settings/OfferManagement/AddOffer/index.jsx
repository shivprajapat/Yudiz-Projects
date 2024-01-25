import React, { Fragment } from 'react'
import NavbarComponent from '../../../../components/Navbar'
import AddOffer from './AddOffer'

function index (props) {
  return (
    <Fragment>
      <NavbarComponent {...props} />
      <main className="main-content">
        <section className="management-section common-box">
          <AddOffer {...props} />
        </section>
      </main>
    </Fragment>
  )
}

export default index
