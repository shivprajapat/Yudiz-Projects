import React, { useState } from 'react'
import { Button, Collapse, Navbar } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { FormattedMessage } from 'react-intl'
import PropTypes from 'prop-types'

import GlobalSearch from '../GlobalSearch'
import LanguageDropdown from 'shared/components/header/LanguageDropdown'
import { allRoutes } from 'shared/constants/allRoutes'
import { burgerIcon, heartIcon, headerUserIcon, closeIcon, userLoginIcon, checkStarIcon, logoIcon } from 'assets/images'

const MobileMenu = ({ isLoggedIn }) => {
  const [mobileMenu, setMobileMenu] = useState(false)

  return (
    <>
      <div className="mob-menu-right d-flex align-items-center justify-content-end">
        <GlobalSearch isForMobile />
        <Button
          onClick={() => setMobileMenu(!mobileMenu)}
          aria-controls="example-collapse-text"
          aria-expanded={mobileMenu}
          className="menu-btn"
        ></Button>
      </div>
      <Collapse in={mobileMenu} className="mobile-menu">
        <div id="example-collapse-text">
          <div className="scroll-div">
            <div className="mobile-logo d-flex justify-content-between">
              <Navbar.Brand href="#home">
                <img src={logoIcon} alt="Lesa club" className="img-fluid" />
              </Navbar.Brand>
              <Button className="close-btn" onClick={() => setMobileMenu(false)}>
                <img src={closeIcon} alt="close" className="img-fluid" />
              </Button>
            </div>

            {isLoggedIn ? (
              <>
                <div className="user-login-section d-flex align-items-start">
                  <div className="user-login-img checkStar">
                    <img src={userLoginIcon} alt="user-icon" className="img-fluid" />
                    <img src={checkStarIcon} alt="user-img" className="img-fluid check-img" />
                  </div>
                  <div className="user-login-desc">
                    <h5>Robert Fox</h5>
                    <span>@robertfox</span>
                    <Link to="/">
                      <FormattedMessage id="logout" />
                    </Link>
                  </div>
                </div>
              </>
            ) : (
              <div className="user-section d-flex justify-content-between align-items-center">
                <span>
                  <img src={headerUserIcon} alt="user-icon" className="img-fluid" />
                </span>
                <ul className="d-flex">
                  <li>
                    <Link to={allRoutes.login}>
                      <FormattedMessage id="login" />
                    </Link>
                  </li>
                  <li>
                    <Link to={allRoutes.signUp}>
                      <FormattedMessage id="signUp" />
                    </Link>
                  </li>
                </ul>
              </div>
            )}

            <div className="page-links">
              <ul>
                <li>
                  <Link to={allRoutes.explore}>
                    <FormattedMessage id="explore" />
                  </Link>
                </li>
                <li>
                  <Link to="/">
                    <FormattedMessage id="auction" />
                  </Link>
                </li>
                <li>
                  <Link to="/">
                    <FormattedMessage id="drop" />
                  </Link>
                </li>
                <li>
                  <Link to="/">
                    <FormattedMessage id="crates" />
                  </Link>
                </li>
                <li>
                  <Link to="/">
                    <FormattedMessage id="community" />
                  </Link>
                </li>
              </ul>
            </div>
            <div className="menu-end-sec">
              <Link to="/" className="wallet-btn">
                <FormattedMessage id="connectWallet" />
              </Link>
              <div className="d-flex justify-content-center align-items-center">
                <Link to="/" className="nav-link-icons">
                  <img src={burgerIcon} alt="Coins" className="img-fluid" />
                </Link>
                <Link to="/" className="nav-link-icons">
                  <img src={heartIcon} alt="Wishlist" className="img-fluid" />
                </Link>
                <LanguageDropdown />
              </div>
            </div>
          </div>
        </div>
      </Collapse>
    </>
  )
}
MobileMenu.propTypes = {
  isLoggedIn: PropTypes.bool
}
export default MobileMenu
