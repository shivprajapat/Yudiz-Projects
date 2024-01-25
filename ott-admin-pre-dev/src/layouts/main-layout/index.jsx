import React, { Suspense, useState } from 'react'
import PropTypes from 'prop-types'

import Header from 'shared/components/header'
import SideBar from 'shared/components/sidebar'
import Breadcrumbs from 'shared/components/breadcrumb'
import Loading from 'shared/components/loading'

function MainLayout({ children }) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className='main-layout'>
      <Header />
      <SideBar isOpen={isOpen} setIsOpen={setIsOpen} />
      <div className={`main-container ${isOpen && 'active'}`}>
        <div className='container'>
          <Breadcrumbs />
          <Suspense fallback={<Loading />}>{children}</Suspense>
        </div>
      </div>
    </div>
  )
}
MainLayout.propTypes = {
  children: PropTypes.node.isRequired
}
export default MainLayout
