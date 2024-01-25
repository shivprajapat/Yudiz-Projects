import React, { Fragment, useRef } from 'react'
import NavbarComponent from '../../../components/Navbar'
import Heading from '../component/Heading'
import SportsComponent from './Sports'

function SportsManagement (props) {
  const content = useRef()

  return (
    <Fragment>
      <NavbarComponent {...props} />
      <main className="main-content">
        <section className="management-section common-box">
          <Heading
            info
            heading="Sports"
          />
          <SportsComponent
            {...props}
            ref={content}
          />
        </section>
      </main>
    </Fragment>
  )
}

export default SportsManagement
