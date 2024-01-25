import React, { useState, memo } from 'react'
import { Button, Collapse, Dropdown, Navbar } from 'react-bootstrap'
import { Link, useNavigate, NavLink } from 'react-router-dom'
import { FormattedMessage } from 'react-intl'
import PropTypes from 'prop-types'
import { useSelector } from 'react-redux'

import GlobalSearch from '../global-search'
import LanguageDropdown from 'shared/components/header/language-dropdown'
import { allRoutes } from 'shared/constants/allRoutes'
import { burgerIcon, heartIcon, headerUserIcon, closeIcon, checkStarIcon, logoIcon, userProfileIcon } from 'assets/images'
import { headerMenuItems, kycStatus } from 'shared/constants'
import NotificationDropdown from '../notification-dropdown'
import { useWindowDimensions } from 'shared/hooks/use-window-dimensions'
import PermissionProvider from 'shared/components/permission-provider'

const MobileMenu = ({ isLoggedIn, logOut, onChangeSelectWallet, handleKyc }) => {
  const navigate = useNavigate()

  const [mobileMenu, setMobileMenu] = useState(false)

  const handleMenu = () => setMobileMenu((prev) => !prev)

  const userStore = useSelector((state) => state.user.user)

  const handleLogOut = () => {
    handleMenu()
    logOut()
  }

  const { width: WindowWidth } = useWindowDimensions()

  const onDropdownChangeProfile = () => {
    handleMenu()
    navigate(`${allRoutes.profile}/${allRoutes.profileChildRoutes.collected}`)
  }
  const onDropdownChangeSelectWallet = () => {
    handleMenu()
    onChangeSelectWallet()
  }

  const onDropdownChangeDonate = () => {
    handleMenu()
    navigate(allRoutes.donate)
  }

  const onDropdownChangeReferrals = () => {
    handleMenu()
    navigate(allRoutes.referrals)
  }

  const onDropdownChangeAdmin = () => {
    handleMenu()
    navigate('/admin/analytics')
  }

  return (
    <>
      <div className="mob-menu-right d-flex align-items-center justify-content-end">
        <GlobalSearch isForMobile />

        {userStore && WindowWidth <= 990 && <NotificationDropdown isForMobile />}

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
              <Navbar.Brand as={Link} to={allRoutes.home} onClick={handleMenu}>
                <img src={logoIcon} alt="Lesa club" className="img-fluid" />
              </Navbar.Brand>
              <Button className="close-btn" onClick={handleMenu}>
                <img src={closeIcon} alt="close" className="img-fluid" />
              </Button>
            </div>

            {isLoggedIn ? (
              <>
                <div className="user-login-section d-flex justify-content-between align-items-center">
                  <div className="d-flex">
                    <div className="user-login-img checkStar align-self-center">
                      <img src={userStore?.profilePicUrl || userProfileIcon} alt="user-icon" className="img-fluid" />
                      <img src={checkStarIcon} alt="user-img" className="img-fluid check-img" />
                    </div>
                    <div className="user-login-desc">
                      <h5>{`${userStore?.firstName} ${userStore?.lastName}`}</h5>
                      {userStore?.userName && <span>{userStore?.userName}</span>}
                      <Button onClick={handleLogOut}>
                        <FormattedMessage id="logout" />
                      </Button>
                    </div>
                  </div>

                  <Dropdown className="user-dropdown mobile-user-dropdown">
                    <Dropdown.Toggle variant="success" id="dropdown-basic">
                      <img src={headerUserIcon} alt="user-icon" className="img-fluid" />
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                      <Dropdown.Item onClick={onDropdownChangeProfile}>
                        <FormattedMessage id="profile" />
                      </Dropdown.Item>
                      <Dropdown.Item onClick={onDropdownChangeSelectWallet}>
                        <FormattedMessage id="connectWallet" />
                      </Dropdown.Item>
                      <Dropdown.Item onClick={onDropdownChangeDonate}>
                        <FormattedMessage id="donate" />
                      </Dropdown.Item>
                      <Dropdown.Item onClick={onDropdownChangeReferrals}>
                        <FormattedMessage id="referrals" />
                      </Dropdown.Item>
                      {userStore?.kycStatus && !kycStatus.includes(userStore?.kycStatus) && (
                        <Dropdown.Item as={Button} onClick={() => {
                          handleMenu()
                          handleKyc(true)
                        }}>
                          <FormattedMessage id="kyc" />
                        </Dropdown.Item>
                      )}
                      {/* TODO: change password when API ready */}
                      {/* <Dropdown.Item as={Link} to={allRoutes.changePassword}>
                          <FormattedMessage id="changePassword" />
                        </Dropdown.Item> */}
                      <PermissionProvider>
                        <Dropdown.Item onClick={onDropdownChangeAdmin}>
                          Admin Dashboard
                        </Dropdown.Item>
                      </PermissionProvider>
                      <Dropdown.Item as={Button} onClick={logOut}>
                        <FormattedMessage id="logout" />
                      </Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
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
                {headerMenuItems.map((item, index) => (
                  <li key={index}>
                    <NavLink to={item.path} onClick={handleMenu}>
                      {item.name}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </div>
            <div className="menu-end-sec">
              {isLoggedIn && (
                <Button onClick={onChangeSelectWallet} className="wallet-btn">
                  <FormattedMessage id="connectWallet" />
                </Button>
              )}
              <div className="d-flex justify-content-center align-items-center">
                {isLoggedIn && (
                  <>
                    <Link to={allRoutes.nuuCoins} onClick={handleMenu} className="nav-link-icons">
                      <img src={burgerIcon} alt="Coins" className="img-fluid" />
                    </Link>
                    <Link to={allRoutes.profileWishlist} onClick={handleMenu} className="nav-link-icons">
                      <img src={heartIcon} alt="Wishlist" className="img-fluid" />
                    </Link>
                  </>
                )}
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
  isLoggedIn: PropTypes.bool,
  logOut: PropTypes.func,
  handleKyc: PropTypes.func,
  onChangeSelectWallet: PropTypes.func
}
export default memo(MobileMenu)
