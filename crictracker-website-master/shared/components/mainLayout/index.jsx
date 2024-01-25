import React, { useState } from 'react'
import PropTypes from 'prop-types'
import dynamic from 'next/dynamic'
import { useAmp } from 'next/amp'

const MainHeader = dynamic(() => import('@shared/components/header'))
const Footer = dynamic(() => import('@shared/components/footer'))

function TestLayout({ children }) {
  const isAmp = useAmp()
  // eslint-disable-next-line no-unused-vars
  const [isPreview, setIsPreview] = useState(false)
  return (
    <>
      {!isAmp && !isPreview && <MainHeader />}
      <main>{children}</main>
      {!isAmp && !isPreview && <Footer />}
    </>
  )
}
TestLayout.propTypes = {
  children: PropTypes.node.isRequired
}
export default TestLayout
