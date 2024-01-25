import React, { Fragment, useState } from 'react'
import { useSelector } from 'react-redux'
import NavbarComponent from '../../../../components/Navbar'
import Heading from '../../../Settings/component/Heading'
import AutomatedNotification from './AutomatedNotification'

function IndexAutomatedNotification (props) {
  const adminPermission = useSelector(state => state.auth.adminPermission)
  const Auth = useSelector(state => state.auth.adminData && state.auth.adminData.eType)

  const [modalOpen, setModalOpen] = useState(false)

  return (
    <Fragment>
      <NavbarComponent {...props} />
      <main className="main-content">
        <section className="management-section common-box">
          <Heading
            heading="Automated Push Notifications"
            modalOpen={modalOpen}
            setModalOpen={setModalOpen}
            permission={(Auth && Auth === 'SUPER') || (adminPermission?.PUSHNOTIFICATION !== 'R')}
            goBack
            automatedNotification
          />
          <AutomatedNotification
            modalOpen={modalOpen}
            setModalOpen={setModalOpen}
          />
        </section>
      </main>
    </Fragment>
  )
}

export default IndexAutomatedNotification
