import React, { Fragment } from 'react'
import AddCategoryTemp from './AddCategoryTemp'
import NavbarComponent from '../../../../components/Navbar'

function AddTemplate (props) {
  return (
    <Fragment>
      <NavbarComponent {...props} />
      <main className="main-content">
        <section className="management-section common-box">
          <AddCategoryTemp
            {...props}
            cancelLink="/categoryTemplate"
          />
        </section>
      </main>
    </Fragment>
  )
}

export default AddTemplate
