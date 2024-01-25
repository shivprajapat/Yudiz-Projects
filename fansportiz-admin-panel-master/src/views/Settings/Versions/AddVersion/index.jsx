import React, { Fragment } from 'react'
import NavbarComponent from '../../../../components/Navbar'
import AddVersion from './AddVersion'

function AddVersionIndex (props) {
  return (
    <Fragment>
      <NavbarComponent {...props} />
      <main className='main-content'>
        <section className='management-section common-box'>
          <AddVersion {...props} />
        </section>
      </main>
    </Fragment>
  )
}

export default AddVersionIndex
