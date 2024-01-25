import React from 'react'
import logo from '../../assets/images/logo2-ollato.png'
import hamburger from '../../assets/images/hamburger.svg'
import notification from '../../assets/images/notification.svg'
import { PropTypes } from 'prop-types'
function MobileHeader (props) {
  const handleToggle = () => {
    props?.setToggle(!props?.toggle)
  }
  return (
    <>
        <div className="mobile-header-section d-md-none d-flex justify-content-between align-items-center">
                <div className="logo-box new-logo mobile-logo">
                    <img src={logo} />
                </div>
                <div className="mobile-profile">
                    <button type='button' className="notification-box"><img src={notification} alt="notification" /></button>
                    <button className="hamburger-menu" onClick={() => handleToggle()}>
                        <img src={hamburger} alt="hamburger" />
                    </button>
                </div>
        </div>
    </>
  )
}
MobileHeader.propTypes = {
  parentCallback: PropTypes.func,
  setToggle: PropTypes.func,
  toggle: PropTypes.any
}

export default MobileHeader
