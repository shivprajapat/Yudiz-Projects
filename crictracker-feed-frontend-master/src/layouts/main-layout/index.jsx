import React, { Suspense } from 'react'
import PropTypes from 'prop-types'

import Header from 'shared/components/header'
import SideBar from 'shared/components/sidebar'
import Breadcrumbs from 'shared/components/breadcrumb'
import Loading from 'shared/components/loading'

function MainLayout({ childComponent, role }) {
  return (
    <div className="main-layout">
      <Header />
      <SideBar role={role}/>
      <div className="main-container">
        <div className="container">
          <Breadcrumbs />
          <Suspense fallback={<Loading />}>{childComponent}</Suspense>
        </div>
      </div>
    </div>
  )
}
MainLayout.propTypes = {
  childComponent: PropTypes.node.isRequired,
  role: PropTypes.string.isRequired
}
export default MainLayout
