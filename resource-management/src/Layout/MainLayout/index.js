import React, { lazy, Suspense } from 'react'
import PropTypes from 'prop-types'
const Navigationbar = lazy(() => import('Components/Navbar'))
const Sidebar = lazy(() => import('Components/Sidebar'))

import BreadCrumbs from 'Components/Bread-Crumbs'
import { Loading } from 'Components'

export default function MainLayout({ children }) {
  return (
    <div className="main_layout">
      <Suspense fallback={<Loading absolute />}>
        <Navigationbar />
      </Suspense>
      <div className="section_container">
        <div className="sidebar_container">
          <Suspense fallback={<Loading absolute />}>
            <Sidebar />
          </Suspense>
        </div>
        <div className="herosection_container">
          <div className="breadCrumb">
            <BreadCrumbs />
          </div>
          <div className="children">{children}</div>
        </div>
      </div>
    </div>
  )
}

MainLayout.propTypes = {
  children: PropTypes.node,
}
