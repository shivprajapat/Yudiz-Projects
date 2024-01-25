import React from 'react'
import { Button, Dropdown, Nav, Navbar, OverlayTrigger, Tooltip } from 'react-bootstrap'
import { FormattedMessage } from 'react-intl'
import { Link, useLocation } from 'react-router-dom'
import PropTypes from 'prop-types'
import { useSelector } from 'react-redux'

import GlobalSearch from '../GlobalSearch'
import LanguageDropdown from '../LanguageDropdown'
import { allRoutes } from 'shared/constants/allRoutes'
import { burgerIcon, heartIcon, headerUserIcon } from 'assets/images'

const DesktopMenu = ({ isLoggedIn, onChangeSelectWallet, logOut, setKyc }) => {
  const location = useLocation()
  const userStore = useSelector((state) => state.user.user)

  const coinTooltip = (props) => (
    <Tooltip id="button-tooltip" {...props}>
      Nuucoins
    </Tooltip>
  )
  const wishlistTooltip = (props) => (
    <Tooltip id="button-tooltip" {...props}>
      Wishlist
    </Tooltip>
  )

  return (
    <Navbar.Collapse>
      <Nav className="ms-auto">
        <GlobalSearch />
        <Nav.Link as={Link} to={allRoutes.explore} active={location.pathname === allRoutes.explore}>
          <FormattedMessage id="explore" />
        </Nav.Link>
        <Nav.Link as={Link} to="/auction">
          <FormattedMessage id="auction" />
        </Nav.Link>
        <Nav.Link as={Link} to="/drop">
          <FormattedMessage id="drop" />
        </Nav.Link>
        <Nav.Link as={Link} to="/crates">
          <FormattedMessage id="crates" />
        </Nav.Link>
        <Nav.Link as={Link} to="/">
          <FormattedMessage id="community" />
        </Nav.Link>
        <LanguageDropdown />
        {isLoggedIn && (
          <>
            <OverlayTrigger placement="top" delay={{ show: 250, hide: 250 }} overlay={coinTooltip}>
              <Nav.Link as={Link} to={allRoutes.nuucoins} className="nav-link-icons">
                <img src={burgerIcon} alt="Coins" className="img-fluid" />
              </Nav.Link>
            </OverlayTrigger>
            <OverlayTrigger placement="top" delay={{ show: 250, hide: 250 }} overlay={wishlistTooltip}>
              <Nav.Link as={Link} to="/wishlist" className="nav-link-icons">
                <img src={heartIcon} alt="Wishlist" className="img-fluid" />
              </Nav.Link>
            </OverlayTrigger>
          </>
        )}

        {isLoggedIn ? (
          <>
            <Nav.Link as={Link} to={allRoutes.createAsset} className="connect-wallet-btn">
              <FormattedMessage id="createAsset" />
            </Nav.Link>
            <Dropdown className="user-dropdown">
              <Dropdown.Toggle variant="success" id="dropdown-basic">
                <img src={headerUserIcon} alt="user-icon" className="img-fluid" />
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item as={Link} to={`${allRoutes.profile}/${allRoutes.profileNested.collected}`}>
                  <FormattedMessage id="profile" />
                </Dropdown.Item>
                <Dropdown.Item onClick={onChangeSelectWallet}>
                  <FormattedMessage id="connectWallet" />
                </Dropdown.Item>
                <Dropdown.Item as={Link} to={allRoutes.donate}>
                  <FormattedMessage id="donate" />
                </Dropdown.Item>
                <Dropdown.Item as={Link} to={allRoutes.referrals}>
                  <FormattedMessage id="referrals" />
                </Dropdown.Item>
                {userStore?.kycStatus !== 'Approved' && (
                  <Dropdown.Item as={Button} onClick={() => setKyc(true)}>
                    <FormattedMessage id="kyc" />
                  </Dropdown.Item>
                )}
                {/* TODO: change password when API ready */}
                {/* <Dropdown.Item as={Link} to={allRoutes.changePassword}>
                          <FormattedMessage id="changePassword" />
                        </Dropdown.Item> */}
                <Dropdown.Item as={Button} onClick={logOut}>
                  <FormattedMessage id="logout" />
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </>
        ) : (
          <>
            <div className="desk-header-log-btn d-flex flex-wrap">
              <Button variant="link" as={Link} className="black-btn" to={allRoutes.login}>
                <FormattedMessage id="login" />
              </Button>
              <Button variant="link" as={Link} className="black-border-btn" to={allRoutes.signUp}>
                <FormattedMessage id="signUp" />
              </Button>
            </div>
          </>
        )}
      </Nav>
    </Navbar.Collapse>
  )
}
DesktopMenu.propTypes = {
  isLoggedIn: PropTypes.bool,
  onChangeSelectWallet: PropTypes.func,
  logOut: PropTypes.func,
  setKyc: PropTypes.func
}
export default DesktopMenu
