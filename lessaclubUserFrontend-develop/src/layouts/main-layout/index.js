import React, { Suspense } from 'react'
import PropTypes from 'prop-types'

import Footer from 'shared/components/footer'
import Header from 'shared/components/header'
import Loading from 'shared/components/loading'

const MainLayout = ({ childComponent }) => {
  return (
    <div className="main-layout">
      <Header />
      <div className="main-container">
        <Suspense fallback={<Loading />}>{childComponent}</Suspense>
      </div>
      <Footer />
    </div>
  )
}
MainLayout.propTypes = {
  childComponent: PropTypes.node.isRequired
}
export default MainLayout
