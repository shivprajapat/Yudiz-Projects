import React, { lazy, Suspense, useState } from 'react'
import PropTypes from 'prop-types'
import Navigationbar from 'Components/Navbar'
const Sidebar = lazy(() => import('Components/Sidebar'))
import BreadCrumbs from 'Components/Bread-Crumbs'
import { useLocation } from 'react-router-dom'
import { Loading } from 'Components'

export default function MainLayout({ children }) {
  const location = useLocation()

  const [isSidebarWrapped, setIsSidebarWrapped] = useState(true)

  return (
    <div className="main_layout">
      <Navigationbar />
      <div className={`sidebar_container ${isSidebarWrapped ? 'sidebar_container_wrapped' : ''}`}>
        <Suspense fallback={<Loading absolute />}>
          <Sidebar isSidebarWrapped={isSidebarWrapped} setIsSidebarWrapped={setIsSidebarWrapped} />
        </Suspense>
      </div>
      <div className={`herosection_container ${isSidebarWrapped ? 'active' : ''}`}>
        <div className="breadCrumb">{location?.pathname !== '/dashboard' && <BreadCrumbs />}</div>
        <div className="children">{children}</div>
      </div>
    </div>
  )
}

MainLayout.propTypes = {
  children: PropTypes.node,
}
