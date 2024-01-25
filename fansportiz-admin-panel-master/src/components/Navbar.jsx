import React, { useState, Fragment } from 'react'
import {
  Collapse, Navbar, NavbarToggler, Nav, NavItem, UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem
} from 'reactstrap'
import { Link, NavLink } from 'react-router-dom'
import { connect, useDispatch, useSelector } from 'react-redux'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import dashboardIcon from '../assets/images/dashboard-icon.svg'
import usersIcon from '../assets/images/users-icon.svg'
import settingsIcon from '../assets/images/game-settings-icon.svg'
import leagueIcon from '../assets/images/league.svg'
import profilePicture from '../assets/images/profile_pic.png'
import cricketIcon from '../assets/images/cricket.svg'
import footballIcon from '../assets/images/football-icon.svg'
import basketballIcon from '../assets/images/basketball.svg'
import kabaddiIcon from '../assets/images/kabaddi.svg'
import { logout } from '../actions/auth'

// Navbar component
function NavbarComponent (props) {
  const [isOpen, setIsOpen] = useState(false)
  const toggle = () => setIsOpen(!isOpen)
  const token = useSelector(state => state.auth.token)
  const adminPermission = useSelector(state => state.auth.adminPermission)
  const Auth = useSelector(state => state.auth.adminData && state.auth.adminData.eType)
  const adminDetails = useSelector(state => state.auth.adminData)
  const dispatch = useDispatch()
  const history = props.history

  // Logout function
  function onLogout () {
    dispatch(logout(token))
  }

  const cricketPath = history.location && (history.location.pathname.includes('/cricket/match-management') || history.location.pathname.includes('/cricket/team-management') || history.location.pathname.includes('/cricket/player-management') || history.location.pathname.includes('/cricket/player-role-management') || history.location.pathname.includes('/cricket/season-management') || history.location.pathname.includes('/cricket/matches-app-view') || history.location.pathname.includes('/cricket/point-system'))
  const footballPath = history.location && (history.location.pathname.includes('/football/match-management') || history.location.pathname.includes('/football/team-management') || history.location.pathname.includes('/football/player-management') || history.location.pathname.includes('/football/player-role-management') || history.location.pathname.includes('/football/season-management') || history.location.pathname.includes('/football/matches-app-view') || history.location.pathname.includes('/football/point-system'))
  const basketballPath = history.location && (history.location.pathname.includes('/basketball/match-management') || history.location.pathname.includes('/basketball/team-management') || history.location.pathname.includes('/basketball/player-management') || history.location.pathname.includes('/basketball/player-role-management') || history.location.pathname.includes('/basketball/season-management') || history.location.pathname.includes('/basketball/matches-app-view') || history.location.pathname.includes('/basketball/point-system'))
  const kabaddiPath = history.location && (history.location.pathname.includes('/kabaddi/match-management') || history.location.pathname.includes('/kabaddi/team-management') || history.location.pathname.includes('/kabaddi/player-management') || history.location.pathname.includes('/kabaddi/player-role-management') || history.location.pathname.includes('/kabaddi/season-management') || history.location.pathname.includes('/kabaddi/matches-app-view') || history.location.pathname.includes('/kabaddi/point-system'))

  const settingsPath = history.location && (history.location.pathname.includes('/settings') || history.location.pathname.includes('/reports'))

  return (
    <Navbar expand='lg' className='main-navbar' light>
      <div className='logobar d-flex justify-content-between align-items-center'>
        Fantasy Admin Panel
        <Nav className='align-items-center'>
          <NavItem className='notification'>
          </NavItem>
          <UncontrolledDropdown nav inNavbar className='user-dropdown'>
            <DropdownToggle nav caret>
              <img src={profilePicture} alt='Profile Pic' />
            </DropdownToggle>
            {/* Super Admin */}
            <DropdownMenu right>
              <DropdownItem>
                {Auth === 'SUPER' ? adminDetails?.sName + '(Super)' : adminDetails?.sName + '(Sub)'}
              </DropdownItem>
              <DropdownItem onClick={onLogout}>
                Logout
              </DropdownItem>
            </DropdownMenu>
          </UncontrolledDropdown>
        </Nav>
      </div>
      <div className='menubar'>
        <NavbarToggler onClick={toggle} />
        <Collapse navbar isOpen={isOpen}>
          <Nav expand='lg' className='navbar-nav'>
            <NavItem className={classnames({ active: history.location && history.location.pathname === '/dashboard' })}>
              <NavLink to='/dashboard' className='nav-link'>
                <img src={dashboardIcon} alt='Dashboard' />
                <span>Dashboard</span>
              </NavLink>
            </NavItem>
            {(adminPermission?.VERSION === 'N' && adminPermission.COMPLAINT === 'N' && adminPermission.LEADERSHIP_BOARD === 'N' && adminPermission.EMAIL_TEMPLATES === 'N' && adminPermission.POPUP_ADS === 'N' && adminPermission.PAYOUT_OPTION === 'N' && adminPermission.REPORT === 'N' && adminPermission.OFFER === 'N' && adminPermission.CMS === 'N' && adminPermission.PROMO === 'N' && adminPermission.BANNER === 'N' && adminPermission.SETTING === 'N' && adminPermission.PAYMENT_OPTION === 'N' && adminPermission.RULE === 'N' && adminPermission.SCORE_POINT === 'N' && adminPermission.NOTIFICATION === 'N' && adminPermission.SPORT === 'N')
              ? ''
              : <Fragment>
                <UncontrolledDropdown nav inNavbar className='custom-dropdown'>
              <DropdownToggle nav caret className={classnames({ active: settingsPath })}>
              <img src={settingsIcon} alt='settings' />
                <span>Settings</span>
                </DropdownToggle>
                <DropdownMenu>
                  {
                    ((Auth && Auth === 'SUPER') || (adminPermission?.RULE !== 'N')) && (
                      <DropdownItem tag={Link} className={classnames({ active: history.location && ((history.location.pathname === '/settings/common-rules') || history.location.pathname.includes('/settings/add-common-rule') || history.location.pathname.includes('/settings/common-rules-details')) })} to='/settings/common-rules'>Common Rules</DropdownItem>
                    )
                  }
                  {
                  ((Auth && Auth === 'SUPER') || (adminPermission?.CMS !== 'N')) && (
                    <DropdownItem tag={Link} className={classnames({ active: history.location && ((history.location.pathname === '/settings/content-management' || history.location.pathname === '/settings/add-content') || history.location.pathname.includes('/settings/content-details')) })} to='/settings/content-management'>Content </DropdownItem>
                  )
                  }
                  {
                    ((Auth && Auth === 'SUPER') || (adminPermission?.EMAIL_TEMPLATES !== 'N')) && (
                      <DropdownItem tag={Link} className={classnames({ active: history.location && (history.location.pathname === '/settings/email-template' || history.location.pathname.includes('/settings/template-details')) })} to='/settings/email-template'>Email Template</DropdownItem>
                    )
                  }
                  {
                    ((Auth && Auth === 'SUPER') || (adminPermission?.COMPLAINT !== 'N')) && (
                      <DropdownItem tag={Link} className={classnames({ active: history.location && ((history.location.pathname === '/settings/feedback-complaint-management') || (history.location.pathname.includes('/settings/update-complaint-status'))) })} to='/settings/feedback-complaint-management'>Feedbacks/Complaints</DropdownItem>
                    )
                  }
                  {
                    ((Auth && Auth === 'SUPER') || (adminPermission?.LEADERSHIP_BOARD !== 'N')) && (
                      <DropdownItem tag={Link} className={classnames({ active: history.location && (history.location.pathname === '/settings/leader-board-management') })} to='/settings/leader-board-management'>Leader Board</DropdownItem>
                    )
                  }
                  {
                    ((Auth && Auth === 'SUPER') || (adminPermission?.NOTIFICATION !== 'N')) && (
                      <DropdownItem tag={Link} className={classnames({ active: history.location && (history.location.pathname === '/settings/notification-management' || history.location.pathname.includes('settings/notification-details')) })} to='/settings/notification-management'>Notifications</DropdownItem>
                    )
                  }
                  {
                    ((Auth && Auth === 'SUPER') || (adminPermission?.OFFER !== 'N')) && (
                      <DropdownItem tag={Link} className={classnames({ active: history.location && (history.location.pathname === '/settings/offer-management' || history.location.pathname === '/settings/add-offer' || history.location.pathname.includes('/settings/offer-details')) })} to='/settings/offer-management'>Offers</DropdownItem>
                    )
                  }
                  {
                    ((Auth && Auth === 'SUPER') || (adminPermission?.PAYMENT_OPTION !== 'N')) && (
                      <DropdownItem tag={Link} className={classnames({ active: history.location && (history.location.pathname === '/settings/payment-management' || history.location.pathname === '/settings/add-payment' || history.location.pathname.includes('/settings/payment-details')) })} to='/settings/payment-management'>Payment Gateways</DropdownItem>
                    )
                  }
                  {
                    ((Auth && Auth === 'SUPER') || (adminPermission?.PAYOUT_OPTION !== 'N')) && (
                      <DropdownItem tag={Link} className={classnames({ active: history.location && (history.location.pathname === '/settings/payout-management' || history.location.pathname.includes('/settings/payout-details')) })} to='/settings/payout-management'>Payout Gateways</DropdownItem>
                    )
                  }
                  {
                    ((Auth && Auth === 'SUPER') || (adminPermission?.POPUP_ADS !== 'N')) && (
                      <DropdownItem tag={Link} className={classnames({ active: history.location && (history.location.pathname === '/settings/popup-ads-management' || history.location.pathname.includes('/settings/add-popup-ad') || history.location.pathname.includes('/settings/update-popup-ad')) })} to='/settings/popup-ads-management'>Pop Up Ads</DropdownItem>
                    )
                  }
                  {
                    ((Auth && Auth === 'SUPER') || (adminPermission?.PROMO !== 'N')) && (
                      <DropdownItem tag={Link} className={classnames({ active: history.location && (((history.location.pathname === '/settings/promocode-management') || (history.location.pathname === '/settings/add-promocode')) || history.location.pathname.includes('/settings/promocode-details') || history.location.pathname.includes('/settings/promocode-statistics')) })} to='/settings/promocode-management'>Promo Codes</DropdownItem>
                    )
                  }

                {
                  ((Auth && Auth === 'SUPER') || (adminPermission?.REPORT !== 'N')) && (
                    <DropdownItem tag={Link} className={classnames({ active: history.location && (history.location.pathname.includes('/reports/all-reports')) })} to='/reports/all-reports'>Reports</DropdownItem>
                  )
                }
                {
                  ((Auth && Auth === 'SUPER') || (adminPermission?.SETTING !== 'N')) && (
                    <DropdownItem tag={Link} className={classnames({ active: history.location && ((history.location.pathname === '/settings/setting-management' || history.location.pathname === '/settings/add-setting') || history.location.pathname.includes('/settings/setting-details') || history.location.pathname.includes('/settings/side-background-currency-management')) })} to='/settings/setting-management'>Settings</DropdownItem>
                  )
                }
                {
                  ((Auth && Auth === 'SUPER') || (adminPermission?.BANNER !== 'N')) && (
                    <DropdownItem tag={Link} className={classnames({ active: history.location && (((history.location.pathname === '/settings/slider-management') || (history.location.pathname === '/settings/add-slider')) || history.location.pathname.includes('/settings/slider-details') || history.location.pathname.includes('/settings/slider-statistics')) })} to='/settings/slider-management'>Sliders</DropdownItem>
                  )
                }
                {
                  ((Auth && Auth === 'SUPER') || (adminPermission?.SPORT !== 'N')) && (
                    <DropdownItem tag={Link} className={classnames({ active: history.location && ((history.location.pathname === '/settings/sports') || history.location.pathname.includes('/settings/add-sport') || history.location.pathname.includes('/settings/sport-details')) })} to='/settings/sports'>Sports</DropdownItem>
                  )
                }
                {((Auth && Auth === 'SUPER') || (adminPermission?.VERSION !== 'N')) && (
                    <DropdownItem tag={Link} className={classnames({ active: history.location && ((history.location.pathname === '/settings/versions') || (history.location.pathname.includes('/settings/add-version')) || (history.location.pathname.includes('/settings/version-details'))) })} to='/settings/versions'>Versions/Maintenance</DropdownItem>
                )}
                {/*
                  ((Auth && Auth === 'SUPER') || (adminPermission?.VALIDATION !== 'N')) && (
                    <DropdownItem tag={Link} className={classnames({ active: history.location && ((history.location.pathname === '/settings/validation-management' || history.location.pathname === '/settings/add-validation') || history.location.pathname.includes('/settings/validation-details')) })} to='/settings/validation-management'>Validations</DropdownItem>
                  )
                  */}
              </DropdownMenu>
            </UncontrolledDropdown>
            </Fragment>}
              {(adminPermission?.USERS === 'N' && adminPermission.KYC === 'N' && adminPermission.PASSBOOK === 'N' && adminPermission.WITHDRAW === 'N' && adminPermission.DEPOSIT === 'N' && adminPermission.PUSHNOTIFICATION === 'N' && adminPermission.SYSTEM_USERS === 'N' && adminPermission.TDS === 'N')
                ? ''
                : <Fragment>
                    <UncontrolledDropdown nav inNavbar className='custom-dropdown'>
                      <DropdownToggle nav caret className={classnames({ active: history.location && history.location.pathname.includes('/users/') })}>
                        <img src={usersIcon} alt='Users' />
                        <span>Users</span>
                      </DropdownToggle>
                      <DropdownMenu>
                        {
                          ((Auth && Auth === 'SUPER') || (adminPermission?.USERS !== 'N')) && (
                            <DropdownItem tag={Link} className={classnames({ active: history.location && (history.location.pathname.includes('/users/user-management') || history.location.pathname.includes('/users/user-referred-list')) })} to='/users/user-management'>Users</DropdownItem>
                          )
                        }
                        {
                          ((Auth && Auth === 'SUPER') || (adminPermission?.SYSTEM_USERS !== 'N')) && (
                            <DropdownItem tag={Link} className={classnames({ active: history.location && (history.location.pathname === '/users/system-users' || history.location.pathname.includes('/users/system-user')) })} to='/users/system-users'>System Users</DropdownItem>
                          )
                        }
                        {
                          ((Auth && Auth === 'SUPER') || (adminPermission?.KYC !== 'N')) && (
                            <DropdownItem tag={Link} className={classnames({ active: history.location && (history.location.pathname === '/users/kyc-verification') })} to='/users/kyc-verification'>KYC Verification</DropdownItem>
                          )
                        }
                        {
                          ((Auth && Auth === 'SUPER') || (adminPermission?.PASSBOOK !== 'N')) && (
                            <DropdownItem tag={Link} className={classnames({ active: history.location && (history.location.pathname === '/users/passbook') })} to='/users/passbook'>Transactions</DropdownItem>
                          )
                        }
                        {
                          ((Auth && Auth === 'SUPER') || (adminPermission?.WITHDRAW !== 'N')) && (
                            <DropdownItem tag={Link} className={classnames({ active: history.location && (history.location.pathname === '/users/withdraw-management') })} to='/users/withdraw-management'>Withdrawals</DropdownItem>
                          )
                        }
                        {
                          ((Auth && Auth === 'SUPER') || (adminPermission?.DEPOSIT !== 'N')) && (
                            <DropdownItem tag={Link} className={classnames({ active: history.location && (history.location.pathname === '/users/deposit-management') })} to='/users/deposit-management'>Deposits</DropdownItem>
                          )
                        }
                        {
                          ((Auth && Auth === 'SUPER') || (adminPermission?.PUSHNOTIFICATION !== 'N')) && (
                            <DropdownItem tag={Link} className={classnames({ active: history.location && (history.location.pathname.includes('/users/push-notification')) })} to='/users/push-notification'>Push Notifications</DropdownItem>
                          )
                        }
                        {
                          ((Auth && Auth === 'SUPER') || (adminPermission?.TDS !== 'N')) && (
                            <DropdownItem tag={Link} className={classnames({ active: history.location && (history.location.pathname.includes('/users/tds-management')) })} to='/users/tds-management'>TDS</DropdownItem>
                          )
                        }
                      </DropdownMenu>
                    </UncontrolledDropdown>
                  </Fragment>
              }
                {(adminPermission?.MATCH === 'N' && adminPermission.TEAM === 'N' && adminPermission.PLAYER === 'N' && adminPermission.ROLES === 'N')
                  ? ''
                  : <UncontrolledDropdown nav inNavbar className='custom-dropdown'>
                      <DropdownToggle nav caret className={classnames({ active: cricketPath })}>
                        <img src={cricketIcon} alt='Cricket' height='23px' width='23px' />
                        <span>Cricket</span>
                      </DropdownToggle>
                      <DropdownMenu>
                            {
                              ((Auth && Auth === 'SUPER') || (adminPermission?.MATCH !== 'N')) && (
                                <DropdownItem tag={Link} className={classnames({ active: history.location && history.location.pathname.includes('/cricket/match-management') })} to='/cricket/match-management'>Matches List View</DropdownItem>
                              )
                            }
                            {
                              ((Auth && Auth === 'SUPER') || (adminPermission?.MATCH !== 'N')) && (
                                <DropdownItem tag={Link} className={classnames({ active: history.location && history.location.pathname.includes('/cricket/matches-app-view') })} to='/cricket/matches-app-view'>Matches App View</DropdownItem>
                              )
                            }
                        {
                          ((Auth && Auth === 'SUPER') || (adminPermission?.SEASON !== 'N')) && (
                            <DropdownItem tag={Link} className={classnames({ active: history.location && history.location.pathname.includes('/cricket/season-management') })} to='/cricket/season-management'>Season</DropdownItem>
                          )
                        }
                        {
                          ((Auth && Auth === 'SUPER') || (adminPermission?.TEAM !== 'N')) && (
                            <DropdownItem tag={Link} className={classnames({ active: history.location && (history.location.pathname.includes('/cricket/team-management')) })} to='/cricket/team-management'>Teams</DropdownItem>
                          )
                        }
                        {
                          ((Auth && Auth === 'SUPER') || (adminPermission?.PLAYER !== 'N')) && (
                            <DropdownItem tag={Link} className={classnames({ active: history.location && (history.location.pathname.includes('/cricket/player-management')) })} to='/cricket/player-management'>Players</DropdownItem>
                          )
                        }
                        {
                          ((Auth && Auth === 'SUPER') || (adminPermission?.ROLES !== 'N')) && (
                            <DropdownItem tag={Link} className={classnames({ active: history.location && (history.location.pathname.includes('/cricket/player-role-management')) })} to='/cricket/player-role-management'>Player Role</DropdownItem>
                          )
                        }
                        {
                          ((Auth && Auth === 'SUPER') || (adminPermission?.SCORE_POINT !== 'N')) && (
                            <DropdownItem tag={Link} className={classnames({ active: history.location && ((history.location.pathname === '/cricket/point-system') || history.location.pathname.includes('/cricket/point-system')) })} to='/cricket/point-system'>Point System</DropdownItem>
                          )
                        }
                      </DropdownMenu>
                    </UncontrolledDropdown>
                }
                {(adminPermission?.MATCH === 'N' && adminPermission.TEAM === 'N' && adminPermission.PLAYER === 'N' && adminPermission.ROLES === 'N')
                  ? ''
                  : <UncontrolledDropdown nav inNavbar className='custom-dropdown'>
                      <DropdownToggle nav caret className={classnames({ active: footballPath })}>
                        <img src={footballIcon} alt='Football' height='23px' width='23px' />
                        <span>Football</span>
                        </DropdownToggle>
                        <DropdownMenu>
                            {
                              ((Auth && Auth === 'SUPER') || (adminPermission?.MATCH !== 'N')) && (
                                <DropdownItem tag={Link} className={classnames({ active: history.location && history.location.pathname.includes('/football/match-management') })} to='/football/match-management'>Matches List View</DropdownItem>
                              )
                            }
                            {
                              ((Auth && Auth === 'SUPER') || (adminPermission?.MATCH !== 'N')) && (
                                <DropdownItem tag={Link} className={classnames({ active: history.location && history.location.pathname.includes('/football/matches-app-view') })} to='/football/matches-app-view'>Matches App View</DropdownItem>
                              )
                            }
                          {
                            ((Auth && Auth === 'SUPER') || (adminPermission?.MATCH !== 'N')) && (
                              <DropdownItem tag={Link} className={classnames({ active: history.location && history.location.pathname.includes('/football/season-management') })} to='/football/season-management'>Season</DropdownItem>
                            )
                          }
                          {
                            ((Auth && Auth === 'SUPER') || (adminPermission?.TEAM !== 'N')) && (
                              <DropdownItem tag={Link} className={classnames({ active: history.location && (history.location.pathname.includes('/football/team-management') || history.location.pathname === '/football/team-management/add-team') })} to='/football/team-management'>Teams</DropdownItem>
                            )
                          }
                          {
                            ((Auth && Auth === 'SUPER') || (adminPermission?.PLAYER !== 'N')) && (
                              <DropdownItem tag={Link} className={classnames({ active: history.location && (history.location.pathname.includes('/football/player-management') || history.location.pathname === '/football/player-management/add-player') })} to='/football/player-management'>Players</DropdownItem>
                            )
                          }
                          {
                            ((Auth && Auth === 'SUPER') || (adminPermission?.ROLES !== 'N')) && (
                              <DropdownItem tag={Link} className={classnames({ active: history.location && (history.location.pathname.includes('/football/player-role-management') || history.location.pathname === '/football/player-role-management/add-player-role') })} to='/football/player-role-management'>Player Role</DropdownItem>
                            )
                          }
                          {
                            ((Auth && Auth === 'SUPER') || (adminPermission?.SCORE_POINT !== 'N')) && (
                              <DropdownItem tag={Link} className={classnames({ active: history.location && ((history.location.pathname === '/football/point-system') || history.location.pathname.includes('/football/point-system')) })} to='/football/point-system'>Point System</DropdownItem>
                            )
                          }
                        </DropdownMenu>
                    </UncontrolledDropdown>
                }
                {(adminPermission?.MATCH === 'N' && adminPermission.TEAM === 'N' && adminPermission.PLAYER === 'N' && adminPermission.ROLES === 'N')
                  ? ''
                  : <UncontrolledDropdown nav inNavbar className='custom-dropdown'>
                      <DropdownToggle nav caret className={classnames({ active: basketballPath })}>
                        <img src={basketballIcon} alt='Basketball' height='23px' width='23px' />
                        <span>Basketball</span>
                      </DropdownToggle>
                      <DropdownMenu>
                          {
                            ((Auth && Auth === 'SUPER') || (adminPermission?.MATCH !== 'N')) && (
                              <DropdownItem tag={Link} className={classnames({ active: history.location && history.location.pathname.includes('/basketball/match-management') })} to='/basketball/match-management'>Matches List View</DropdownItem>
                            )
                          }
                          {
                            ((Auth && Auth === 'SUPER') || (adminPermission?.MATCH !== 'N')) && (
                              <DropdownItem tag={Link} className={classnames({ active: history.location && history.location.pathname.includes('/basketball/matches-app-view') })} to='/basketball/matches-app-view'>Matches App View</DropdownItem>
                            )
                          }
                          {
                            ((Auth && Auth === 'SUPER') || (adminPermission?.MATCH !== 'N')) && (
                              <DropdownItem tag={Link} className={classnames({ active: history.location && history.location.pathname.includes('/basketball/season-management') })} to='/basketball/season-management'>Season</DropdownItem>
                            )
                          }
                          {
                            ((Auth && Auth === 'SUPER') || (adminPermission?.TEAM !== 'N')) && (
                              <DropdownItem tag={Link} className={classnames({ active: history.location && (history.location.pathname.includes('/basketball/team-management')) })} to='/basketball/team-management'>Teams</DropdownItem>
                            )
                          }
                          {
                            ((Auth && Auth === 'SUPER') || (adminPermission?.PLAYER !== 'N')) && (
                              <DropdownItem tag={Link} className={classnames({ active: history.location && (history.location.pathname.includes('/basketball/player-management')) })} to='/basketball/player-management'>Players</DropdownItem>
                            )
                          }
                          {
                            ((Auth && Auth === 'SUPER') || (adminPermission?.ROLES !== 'N')) && (
                              <DropdownItem tag={Link} className={classnames({ active: history.location && (history.location.pathname.includes('/basketball/player-role-management')) }) } to='/basketball/player-role-management'>Player Role</DropdownItem>
                            )
                          }
                          {
                            ((Auth && Auth === 'SUPER') || (adminPermission?.SCORE_POINT !== 'N')) && (
                              <DropdownItem tag={Link} className={classnames({ active: history.location && ((history.location.pathname === '/basketball/point-system') || history.location.pathname.includes('/basketball/point-system')) })} to='/basketball/point-system'>Point System</DropdownItem>
                            )
                          }
                        </DropdownMenu>
                    </UncontrolledDropdown>
                }
                { /* (adminPermission?.MATCH === 'N' && adminPermission.TEAM === 'N' && adminPermission.PLAYER === 'N' && adminPermission.ROLES === 'N')
                  ? ''
                    : <UncontrolledDropdown nav inNavbar className='custom-dropdown'>
                      <DropdownToggle nav caret className={classnames({ active: baseballPath })}>
                        <img src={baseballIcon} alt='Baseball' height='23px' width='23px' />
                        <span>Baseball</span>
                      </DropdownToggle>
                        <DropdownMenu>
                          {
                            ((Auth && Auth === 'SUPER') || (adminPermission?.MATCH !== 'N')) && (
                              <DropdownItem tag={Link} className={classnames({ active: history.location && (history.location.pathname.includes('/baseball/match-management')) })} to='/baseball/match-management'> Matches</DropdownItem>
                            )
                          }
                          {
                            ((Auth && Auth === 'SUPER') || (adminPermission?.TEAM !== 'N')) && (
                              <DropdownItem tag={Link} className={classnames({ active: history.location && (history.location.pathname.includes('/baseball/team-management')) })} to='/baseball/team-management'>Teams</DropdownItem>
                            )
                          }
                          {
                            ((Auth && Auth === 'SUPER') || (adminPermission?.PLAYER !== 'N')) && (
                              <DropdownItem tag={Link} className={classnames({ active: history.location && (history.location.pathname.includes('/baseball/player-management')) })} to='/baseball/player-management'>Players</DropdownItem>
                            )
                          }
                          {
                            ((Auth && Auth === 'SUPER') || (adminPermission?.ROLES !== 'N')) && (
                              <DropdownItem tag={Link} className={classnames({ active: history.location && (history.location.pathname.includes('/baseball/player-role-management')) })} to='/baseball/player-role-management'>Player Role</DropdownItem>
                            )
                          }
                          {
                            ((Auth && Auth === 'SUPER') || (adminPermission?.SCORE_POINT !== 'N')) && (
                              <DropdownItem tag={Link} className={classnames({ active: history.location && ((history.location.pathname === '/baseball/point-system') || history.location.pathname.includes('/baseball/point-system')) })} to='/baseball/point-system'>Point System</DropdownItem>
                            )
                          }
                        </DropdownMenu>
                    </UncontrolledDropdown>
                        */ }
                {(adminPermission?.MATCH === 'N' && adminPermission.TEAM === 'N' && adminPermission.PLAYER === 'N' && adminPermission.ROLES === 'N')
                  ? ''
                  : (
                    <UncontrolledDropdown nav inNavbar className='custom-dropdown'>
                      <DropdownToggle nav caret className={classnames({ active: kabaddiPath })}>
                        <img src={kabaddiIcon} alt='Kabaddi' height='23px' width='23px' />
                        <span>Kabaddi</span>
                      </DropdownToggle>
                      <DropdownMenu>
                          {
                            ((Auth && Auth === 'SUPER') || (adminPermission?.MATCH !== 'N')) && (
                              <DropdownItem tag={Link} className={classnames({ active: history.location && history.location.pathname.includes('/kabaddi/match-management') })} to='/kabaddi/match-management'>Matches List View</DropdownItem>
                            )
                          }
                          {
                            ((Auth && Auth === 'SUPER') || (adminPermission?.MATCH !== 'N')) && (
                              <DropdownItem tag={Link} className={classnames({ active: history.location && history.location.pathname.includes('/kabaddi/matches-app-view') })} to='/kabaddi/matches-app-view'>Matches App View</DropdownItem>
                            )
                          }
                          {
                            ((Auth && Auth === 'SUPER') || (adminPermission?.MATCH !== 'N')) && (
                              <DropdownItem tag={Link} className={classnames({ active: history.location && history.location.pathname.includes('/kabaddi/season-management') })} to='/kabaddi/season-management'>Season</DropdownItem>
                            )
                          }
                          {
                            ((Auth && Auth === 'SUPER') || (adminPermission?.TEAM !== 'N')) && (
                              <DropdownItem tag={Link} className={classnames({ active: history.location && (history.location.pathname.includes('/kabaddi/team-management')) })} to='/kabaddi/team-management'>Teams</DropdownItem>
                            )
                          }
                          {
                            ((Auth && Auth === 'SUPER') || (adminPermission?.PLAYER !== 'N')) && (
                              <DropdownItem tag={Link} className={classnames({ active: history.location && (history.location.pathname.includes('/kabaddi/player-management')) })} to='/kabaddi/player-management'>Players</DropdownItem>
                            )
                          }
                          {
                            ((Auth && Auth === 'SUPER') || (adminPermission?.ROLES !== 'N')) && (
                              <DropdownItem tag={Link} className={classnames({ active: history.location && (history.location.pathname.includes('/kabaddi/player-role-management')) })} to='/kabaddi/player-role-management'>Player Role</DropdownItem>
                            )
                          }
                          {
                            ((Auth && Auth === 'SUPER') || (adminPermission?.SCORE_POINT !== 'N')) && (
                              <DropdownItem tag={Link} className={classnames({ active: history.location && ((history.location.pathname === '/kabaddi/point-system') || history.location.pathname.includes('/kabaddi/point-system')) })} to='/kabaddi/point-system'>Point System</DropdownItem>
                            )
                          }
                        </DropdownMenu>
                    </UncontrolledDropdown>
                    )
              }
            {
              (adminPermission?.LEAGUE === 'N')
                ? ''
                : <Fragment>
                  <UncontrolledDropdown nav inNavbar className='custom-dropdown'>
                    <DropdownToggle nav caret className={classnames({ active: history.location && (history.location.pathname.includes('/league') || history.location.pathname.includes('/league')) })}>
                      <img src={leagueIcon} alt='League' height='23px' width='23px' />
                      <span>Leagues</span>
                    </DropdownToggle>
                    <DropdownMenu>
                      <DropdownItem tag={Link} className={classnames({ active: history.location && (history.location.pathname === '/league' || history.location.pathname === '/league/add-league' || history.location.pathname.includes('/league/update-league')) })} to='/league'>Leagues</DropdownItem>
                      <DropdownItem tag={Link} className={classnames({ active: history.location && (history.location.pathname === '/league/filter-category-list' || history.location.pathname === '/league/add-filter-category' || history.location.pathname.includes('/league/filter-league-category')) })} to='/league/filter-category-list'>Filter Category</DropdownItem>
                      <DropdownItem tag={Link} className={classnames({ active: history.location && (history.location.pathname === '/league/league-category-list' || history.location.pathname === '/league/add-league-category' || history.location.pathname.includes('/league/update-league-category')) })} to='/league/league-category-list'>League Category</DropdownItem>
                    </DropdownMenu>
                  </UncontrolledDropdown>
                </Fragment>
            }
            {
              ((Auth && Auth === 'SUPER') || (adminPermission?.SERIES_LEADERBOARD !== 'N')) && (
                <Fragment>
                  <UncontrolledDropdown nav inNavbar className='custom-dropdown'>
                    <DropdownToggle nav caret className={classnames({ active: history.location && (history.location.pathname.includes('/categoryTemplate') || history.location.pathname.includes('/seriesLeaderBoard')) })}>
                      <img src={cricketIcon} alt='Cricket' height='23px' width='23px' />
                      <span>Series LeaderBoard</span>
                    </DropdownToggle>
                    <DropdownMenu>
                      <DropdownItem tag={Link} className={classnames({ active: history.location && (history.location.pathname === '/categoryTemplate' || history.location.pathname === '/categoryTemplate/add-template' || history.location.pathname === '/categoryTemplate/edit-template/:id') })} to='/categoryTemplate'>Category Template</DropdownItem>
                      <DropdownItem tag={Link} className={classnames({ active: history.location && (history.location.pathname === '/seriesLeaderBoard' || history.location.pathname === '/seriesLeaderBoard/add-SeriesLeaderBoard' || history.location.pathname.includes('/seriesLeaderBoard/edit-SeriesLeaderBoard') || history.location.pathname === '/seriesLeaderBoardCategory/:id' || history.location.pathname.includes('/seriesLeaderBoardCategory')) })} to='/seriesLeaderBoard'>Series LeaderBoard</DropdownItem>
                    </DropdownMenu>
                  </UncontrolledDropdown>
                </Fragment>
              )
            }
            {((Auth && Auth === 'SUPER') || (adminPermission?.SUBADMIN !== 'N')) && <Fragment>
              <UncontrolledDropdown nav inNavbar className='custom-dropdown'>
                <DropdownToggle nav caret className={classnames({ active: history.location && (history.location.pathname.includes('/sub-admin') || history.location.pathname.includes('/admin-logs')) })}>
                  <img src={usersIcon} alt='subadmin' height='23px' width='23px' />
                  <span>Sub Admin</span>
                </DropdownToggle>
                <DropdownMenu>
                  {/* <DropdownItem tag={Link} className={classnames({ active: history.location && (history.location.pathname === '/sub-admin/permission' || history.location.pathname === '/sub-admin/add-permission' || history.location.pathname.includes('/sub-admin/edit-permission')) })} to='/sub-admin/permission'>Permissions</DropdownItem> */}
                  <DropdownItem tag={Link} className={classnames({ active: history.location && (history.location.pathname === '/sub-admin/roles' || history.location.pathname === '/sub-admin/add-role' || history.location.pathname.includes('/sub-admin/update-role/')) })} to='/sub-admin/roles'>Roles</DropdownItem>
                  <DropdownItem tag={Link} className={classnames({ active: history.location && (history.location.pathname === '/sub-admin' || history.location.pathname === '/sub-admin/add-sub-admin' || history.location.pathname.includes('/sub-admin/edit-sub-admin/')) })} to='/sub-admin'>Sub Admin</DropdownItem>
                  <DropdownItem tag={Link} className={classnames({ active: history.location && (history.location.pathname.includes('/admin-logs')) })} to='/admin-logs'>Admin Logs</DropdownItem>
                </DropdownMenu>
              </UncontrolledDropdown>

                {/* <NavItem className={classnames({ active: history.location && history.location.pathname === '/sub-admin' }),  'main-class'}>
                  <NavLink to='/sub-admin' className='nav-link'>
                      <img src={usersIcon} alt='League' height='23px' width='23px' />
                      <span>SubAdmin</span>
                    </NavLink>
                </NavItem> */}
              </Fragment>
            }

          </Nav>
        </Collapse>
      </div>
    </Navbar>
  )
}

NavbarComponent.defaultProps = {
  history: {}
}

NavbarComponent.propTypes = {
  history: PropTypes.shape({
    location: PropTypes.shape({
      pathname: PropTypes.string
    })
  })
}

export default connect()(NavbarComponent)
