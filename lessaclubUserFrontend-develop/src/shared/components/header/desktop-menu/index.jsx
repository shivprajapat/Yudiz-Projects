import React, { memo } from 'react'
import { Button, Dropdown, Nav, Navbar, OverlayTrigger, Tooltip } from 'react-bootstrap'
import { FormattedMessage, useIntl } from 'react-intl'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import PropTypes from 'prop-types'
import { useDispatch, useSelector } from 'react-redux'

import GlobalSearch from '../global-search'
import LanguageDropdown from '../language-dropdown'
import { allRoutes } from 'shared/constants/allRoutes'
import { burgerIcon, heartIcon, headerUserIcon } from 'assets/images'
import { headerMenuItems, kycStatus, TOAST_TYPE } from 'shared/constants'
import { SHOW_TOAST } from 'modules/toast/redux/action'
import { getTimeZone } from 'shared/utils'
import PermissionProvider from 'shared/components/permission-provider'
import NotificationDropdown from '../notification-dropdown'

const DesktopMenu = ({ isLoggedIn, onChangeSelectWallet, logOut, handleKyc }) => {
  const labels = {
    yourBankAccountIsNotVerifiedYet: useIntl().formatMessage({ id: 'yourBankAccountIsNotVerifiedYet' }),
    pleaseEnterBankAccountDetailsInProfileToCreateAsset: useIntl().formatMessage({
      id: 'pleaseEnterBankAccountDetailsInProfileToCreateAsset'
    }),
    category: useIntl().formatMessage({ id: 'enterCategory' }),
    blockchain: useIntl().formatMessage({ id: 'selectBlockchain' })
  }

  const userStore = useSelector((state) => state.user.user)
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const handleCreateAssetRedirection = () => {
    if (userStore.bankVerified && userStore.timezone === getTimeZone()) {
      navigate(allRoutes.createAsset)
    } else if (userStore.timezone !== getTimeZone()) {
      dispatch({
        type: SHOW_TOAST,
        payload: {
          message: 'Timezone of application has to be same as system to create an asset',
          type: TOAST_TYPE.Error
        }
      })
    } else if (!userStore.bankVerified) {
      dispatch({
        type: SHOW_TOAST,
        payload: {
          message: userStore?.bankDetailEncryptedData ? `${labels.yourBankAccountIsNotVerifiedYet}` : `${labels.pleaseEnterBankAccountDetailsInProfileToCreateAsset}`,
          type: TOAST_TYPE.Error
        }
      })
    }
  }

  return (
    <Navbar.Collapse>
      <Nav className="ms-auto">
        <GlobalSearch />
        {headerMenuItems.map((item, index) => (
          <NavLink key={index} to={item.path} className="nav-link">
            {item.name}
          </NavLink>
        ))}

        <LanguageDropdown />
        {isLoggedIn && (
          <>
            <OverlayTrigger placement="left" delay={{ show: 250, hide: 250 }} overlay={<Tooltip id="button-tooltip">Nuucoins</Tooltip>}>
              <Nav.Link as={Link} to={allRoutes.nuuCoins} className="nav-link-icons">
                <img src={burgerIcon} alt="Coins" className="img-fluid" />
              </Nav.Link>
            </OverlayTrigger>
            <OverlayTrigger placement="left" delay={{ show: 250, hide: 250 }} overlay={<Tooltip id="button-tooltip">Wishlist</Tooltip>}>
              <Nav.Link as={Link} to={allRoutes.profileWishlist} className="nav-link-icons">
                <img src={heartIcon} alt="Wishlist" className="img-fluid" />
              </Nav.Link>
            </OverlayTrigger>
          </>
        )}

        {isLoggedIn ? (
          <>
            <Nav.Link as={Button} onClick={() => handleCreateAssetRedirection()} className="connect-wallet-btn">
              <FormattedMessage id="createAsset" />
            </Nav.Link>

            <NotificationDropdown />

            <Dropdown className="user-dropdown">
              <Dropdown.Toggle variant="success" id="dropdown-basic">
                <img src={headerUserIcon} alt="user-icon" className="img-fluid" />
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item as={Link} to={`${allRoutes.profile}/${allRoutes.profileChildRoutes.collected}`}>
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
                {userStore?.kycStatus && !kycStatus.includes(userStore?.kycStatus) && (
                  <Dropdown.Item as={Button} onClick={() => handleKyc(true)}>
                    <FormattedMessage id="kyc" />
                  </Dropdown.Item>
                )}
                {/* TODO: change password when API ready */}
                {/* <Dropdown.Item as={Link} to={allRoutes.changePassword}>
                          <FormattedMessage id="changePassword" />
                        </Dropdown.Item> */}
                <PermissionProvider>
                  <Dropdown.Item as={Link} to='/admin/analytics'>
                    Admin Dashboard
                  </Dropdown.Item>
                </PermissionProvider>
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
  handleKyc: PropTypes.func
}
export default memo(DesktopMenu)
