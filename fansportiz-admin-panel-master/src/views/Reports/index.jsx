import React, { Fragment } from 'react'
import Navbar from '../../components/Navbar'
import AllReportsComponent from './AllReports'

function IndexAllReports (props) {
  return (
    <Fragment>
    <Navbar {...props} />
    <main className="main-content">
      <section className="management-section common-box">
        <AllReportsComponent
          {...props}
        />
      </section>
    </main>
    </Fragment>
  )
}

export default IndexAllReports
