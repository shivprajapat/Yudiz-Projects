import dynamic from 'next/dynamic'
import React, { Fragment } from 'react'
const Header = dynamic(() => import('../components/Header'))
const Footer = dynamic(() => import('../components/Footer'))

export default function App({ children }) {
  return (
    <Fragment>
      <Header showLogo={true} showMenu={true} />
      {children}
      <Footer />
    </Fragment>
  )
}
