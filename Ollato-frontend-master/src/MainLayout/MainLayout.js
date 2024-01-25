import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import Sidebar from '../Components/Sidebar'
import MobileHeader from '../Components/MobileHeader'
// import TitleHeader from '../Components/TitleHeader'

export default function MainLayout ({ children }) {
  const [toggle, setToggle] = useState()

  // Function for handle toggle
  const handleCallback = (toggle) => {
    setToggle(toggle)
  }

  // useEffect(() => {
  //
  // }, [toggle])
  useEffect(() => {
    if (toggle) {
      setToggle(!toggle)
    }
  }, [children])

  return (
    <div className={`common-layout common-dashboard-wrapper no-dropdown edit-profile-wrap add-new-form ${toggle ? 'open-sidebar' : ''}`}>
      <MobileHeader parentCallback={handleCallback}
        toggle={toggle}
        setToggle={setToggle}/>
      <Sidebar location={location}
        toggleHandle={handleCallback}
        toggle={toggle} />
      <div className='main-content-box'>{children}</div>
    </div>
  )
}
MainLayout.propTypes = {
  children: PropTypes.node
}
