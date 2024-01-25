import React, { useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useSnackbar } from 'react-notistack'
import Accordion from 'react-bootstrap/Accordion'
import { NavLink, useNavigate } from 'react-router-dom'
// Images
import logoOllato from '../../assets/images/logo2-ollato.png'
// import logoOllato from '../../assets/images/sidebar-icons/logo-ollato.svg'

import packages from '../../assets/images/sidebar-icons/packages.svg'
import availability from '../../assets/images/sidebar-icons/Availability.svg'
import result from '../../assets/images/sidebar-icons/result.svg'
import logout from '../../assets/images/sidebar-icons/logout.svg'
import centermanage from '../../assets/images/sidebar-icons/manage-center.svg'
import dashboard from '../../assets/images/sidebar-icons/dashboard.svg'
import counselling from '../../assets/images/sidebar-icons/Counselling.svg'
import Settings from '../../assets/images/sidebar-icons/Settings.svg'
// import usermanage from '../../assets/images/sidebar-icons/user-manage.svg'
// import leadsmanage from '../../assets/images/sidebar-icons/manage-leads.svg'
// import cmsmanage from '../../assets/images/sidebar-icons/manage-cms.svg'
// import sessionrequest from '../../assets/images/sidebar-icons/session-request.svg'
import session from '../../assets/images/sidebar-icons/session-couns.svg'
import testmanage from '../../assets/images/sidebar-icons/manage-test.svg'
import boardmanage from '../../assets/images/sidebar-icons/manage-board.svg'
import statesmanage from '../../assets/images/sidebar-icons/manage-states.svg'
import citymanage from '../../assets/images/sidebar-icons/manage-city.svg'
import universitymanage from '../../assets/images/sidebar-icons/manage-university.svg'
import closebtn from '../../assets/images/close-circle-mobile.svg'
import PropTypes from 'prop-types'
import defaultimage from '../../assets/images/default_profile.jpg'

// Action File
import { logoutAction } from '../../Actions/auth'
import { getCounsellorDataAction } from '../../Actions/Counsellor/dashboard'
import ls from 'localstorage-slim'
// import localStorage from 'react-secure-storage'
// import { getCounsellorDataAction } from '../../Actions/Counsellor/dashboard'
function Sidebar (props) {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { enqueueSnackbar } = useSnackbar()

  // localStorage
  const roles = JSON.parse(localStorage.getItem('roles'))
  const profile = JSON.parse(localStorage.getItem('profile'))
  const adminType = ls.get('admin-type', { decrypt: true, secret: profile?.id })
  const token = localStorage.getItem('token')

  // useSelector
  const data = useSelector((state) => state.auth.isLoggedOut)
  const dataMessage = useSelector((state) => state.auth.resMessage)
  const profileData = useSelector((state) => state.dashboard.counsellorData)
  const previousProps = useRef({ data, dataMessage }).current

  const handleLogout = () => {
    localStorage.removeItem('token')
    // localStorage.setItem('isLogin', '0')
    if (adminType === 'super' || adminType === 'sub') {
      dispatch(logoutAction(token, 'admin'))
    } else if (adminType === 'center') {
      dispatch(logoutAction(token, 'center'))
    } else {
      dispatch(logoutAction(token, 'counsellor'))
    }
    setTimeout(() => {
      if (
        adminType === 'super' ||
        adminType === 'sub'
      ) {
        navigate('/admin/login')
      } else if (adminType === 'center') {
        navigate('/center/login')
      } else if (adminType === 'counsellor') {
        navigate('/counsellor/login')
      }
      localStorage.removeItem('admin-type')
      localStorage.removeItem('roles')
      localStorage.removeItem('profile')
    }, 500)
  }
  Accordion.defaultProps = {
    open: false
  }
  // Toastify Notification
  useEffect(() => {
    if (previousProps?.data !== data) {
      if (data) {
        enqueueSnackbar(`${dataMessage}`, {
          variant: 'success',
          hide: 2000,
          autoHide: true
        })
        // navigate('/admin/login')
      } else if (data === false) {
        enqueueSnackbar(`${dataMessage}`, {
          variant: 'error',
          hide: 2000,
          autoHide: true,
          TransitionComponent: 'Fade'
        })
      }
    }
    return () => {
      previousProps.data = data
    }
  }, [data])

  useEffect(() => {
    if (token && adminType === 'counsellor') {
      dispatch(getCounsellorDataAction(token))
    }
  }, [token && adminType === 'counsellor'])

  return (
    <>
      <div className='sidebar-box'>
        <div className='menu-box'>
          <div className='logo-box new-logo'>
            <a href='#'>
              <img src={logoOllato} alt='logo' />
            </a>
          </div>
          <div className='notification-close-box d-flex align-items-center justify-content-between'>
            <button className='profile-box profile-box-dp'>
              {/* <img src={profile} alt='profile-pic' /> */}
              <img src={ adminType === 'super' || adminType === 'sub' ? `${process.env.REACT_APP_AXIOS_BASE_URL}${profile?.profile_pic}` : adminType === 'counsellor' ? `${process.env.REACT_APP_AXIOS_BASE_URL}${profile?.profile_picture}` : adminType === 'center' && profile?.profile ? `${process.env.REACT_APP_AXIOS_BASE_URL}${profile?.profile}` : defaultimage} alt='profile-pic' />
            </button>
            <button type='button' className='close-btn' onClick={() => props?.toggleHandle(!props.toggle)}>
              <img src={closebtn} alt='close' />
            </button>
          </div>
          <ul className='sidebar-menu'>
            {/* <li className='has-submenu'> */}
            {/* Dashboard */}
            {adminType === 'center' && <li className='user-name'>
                  <NavLink to='/center/settings/myprofile' className='menu-link'>
                    <span>
                      {profile?.title}
                    </span>
                  </NavLink>
                </li>}
            {adminType !== 'counsellor' && (
              <>
                <li>
                  <NavLink
                    to={
                      adminType === 'center'
                        ? '/center/dashboard'
                        : adminType === 'super' || adminType === 'sub'
                          ? '/admin/dashboard'
                          : adminType === 'counsellor'
                            ? '/counsellor-dashboard'
                            : ''
                    }
                    className='menu-link'
                  >
                    {' '}
                    <div className='icon-box'>
                      <img src={dashboard} alt='logo sidebar' />
                    </div>
                    <span>Dashboard</span>
                  </NavLink>
                </li>
              </>
            )}
            {/* Counsellor Panel */}
            {adminType === 'counsellor' && (
              <>
                <li className='user-name'>
                  <NavLink to='/counsellor/profile' className='menu-link'>
                    <span>
                      {profileData?.first_name} {profileData?.last_name}
                    </span>
                  </NavLink>
                </li>
                <li>
                  <NavLink to='/counsellor-dashboard' className='menu-link'>
                    <div className='icon-box'>
                      <img src={dashboard} alt='logo sidebar' />
                    </div>
                    <span>Dashboard</span>
                  </NavLink>
                </li>

                <li>
                  <NavLink to='/cousellor/availability' className='menu-link'>
                    <div className='icon-box'>
                      <img src={availability} alt='logo sidebar' />
                    </div>
                    <span>Availability</span>
                  </NavLink>
                </li>
                <li>
                  <NavLink to='/counsellor/revenue' className='menu-link'>
                    <div className='icon-box'>
                      <img src={session} alt='logo sidebar' />
                    </div>
                    <span>Revenue</span>
                  </NavLink>
                </li>
                <li>
                  <NavLink to='/counsellor/session' className='menu-link'>
                    <div className='icon-box'>
                      <img src={session} alt='logo sidebar' />
                    </div>
                    <span>Session</span>
                  </NavLink>
                </li>
                <li>
                  <NavLink to='/counsellor-settings' className='menu-link'>
                    <div className='icon-box'>
                      <img src={Settings} alt='logo sidebar' />
                    </div>
                    <span>Settings</span>
                  </NavLink>
                </li>
              </>
            )}
{/*
            {adminType === 'counsellor' && (
              <li>
                <NavLink to='/counsellor-dashboard' className='menu-link'>
                  <div className='icon-box'>
                    <img src={dashboard} alt='logo sidebar' />
                  </div>
                  <span>Dashboard</span>
                </NavLink>
              </li>
            )}
            {adminType === 'counsellor' && (
              <li>
                <NavLink to='/cousellor/availability' className='menu-link'>
                  <div className='icon-box'>
                    <img src={availability} alt='logo sidebar' />
                  </div>
                  <span>Availability</span>
                </NavLink>
              </li>
            )}
            {adminType === 'counsellor' && (
              <li>
                <NavLink to='/cousellor/session' className='menu-link'>
                  <div className='icon-box'>
                    <img src={session} alt='logo sidebar' />
                  </div>
                  <span>Session</span>
                </NavLink>
              </li>
            )} */}
            {adminType === 'super' ||
            roles?.find((i) => i.module_permissions.slug === 'career-profile')
              ?.list === '1'
              ? (
              <li>
                <NavLink to='/admin/career-profile' className='menu-link'>
                  <div className='icon-box'>
                    <img src={counselling} alt='logo sidebar' />
                  </div>
                  <span>Career Profile</span>
                </NavLink>
              </li>
                )
              : null}
               {adminType === 'super' ||
            roles?.find(
              (i) => i.module_permissions.slug === 'center-management'
            )?.list === '1'
                 ? (
              <li>
                <NavLink to='/admin/center-management' className='menu-link'>
                  <div className='icon-box'>
                    <img src={packages} alt='logo sidebar' />
                  </div>
                  <span>Center Management</span>
                </NavLink>
                 </li>
                   )
                 : null}
              {(adminType === 'super' || roles?.find(
                (i) => i.module_permissions.slug === 'center-redeem-history'
              )?.list === '1') && <> <li>
                <NavLink to='/admin/center-redeem-history' className='menu-link'>
                  <div className='icon-box'>
                    <img src={packages} alt='logo sidebar' />
                  </div>
                  <span>Center redeem history </span>
                </NavLink>
              </li>
              </>}
              {adminType === 'super' ||
            adminType === 'center' ||
            roles?.find(
              (i) => i.module_permissions.slug === 'counsellor-management'
            )?.list === '1'
                ? (
              <li>
                <NavLink
                  to={
                    adminType === 'super' || adminType === 'sub'
                      ? '/admin/counsellor-management'
                      : adminType === 'center'
                        ? '/center/counsellor-management'
                        : ''
                  }
                  className='menu-link'
                >
                  <div className='icon-box'>
                    <img src={packages} alt='logo sidebar' />
                  </div>
                  <span>Counsellor Management</span>
                </NavLink>
              </li>
                  )
                : null}
               {(adminType === 'super' || roles?.find(
                 (i) => i.module_permissions.slug === 'counsellor-redeem-history'
               )?.list === '1') &&
              <li>
                <NavLink to='/admin/counsellor-redeem-history' className='menu-link'>
                  <div className='icon-box'>
                    <img src={packages} alt='logo sidebar' />
                  </div>
                  <span>Counsellor redeem history </span>
                </NavLink>
              </li>}
            {(adminType === 'super' || roles?.find(
              (i) => i.module_permissions.slug === 'coupon-codes'
            )?.list === '1') &&
            <li>
              <NavLink
                to='/admin/coupon-codes'
                className='menu-link'
              >
                <div className='icon-box'>
                  <img src={packages} alt='logo sidebar' />
                </div>
                <span>Coupon Codes</span>
              </NavLink>
            </li>}
            {adminType === 'super' ||
            roles?.find(
              (i) => i.module_permissions.slug === 'qualification-management'
            )?.list === '1'
              ? (
              <li>
                <NavLink
                  to='/admin/qualification-management'
                  className='menu-link'
                >
                  <div className='icon-box'>
                    <img src={centermanage} alt='logo sidebar' />
                  </div>
                  <span>Manage Qualification</span>
                </NavLink>
              </li>
                )
              : null}
            {/* {adminType === 'super' ||
            roles?.find(
              (i) => i.module_permissions.slug === 'school-management'
            )?.list === '1'
              ? (
              <li>
                <NavLink to='/admin/school-management' className='menu-link'>
                  <div className='icon-box'>
                    <img src={centermanage} alt='logo sidebar' />
                  </div>
                  <span>Manage Schools</span>
                </NavLink>
              </li>
                )
              : null} */}
            {adminType === 'super' ||
            roles?.find((i) => i.module_permissions.slug === 'norms-management')
              ?.list === '1'
              ? (
              <li>
                <NavLink to='/admin/norms-management' className='menu-link'>
                  <div className='icon-box'>
                    <img src={packages} alt='logo sidebar' />
                  </div>
                  <span>Manage Norms</span>
                </NavLink>
              </li>
                )
              : null}
              {adminType === 'super' ||
            roles?.find(
              (i) => i.module_permissions.slug === 'package-management'
            ).list === '1'
                ? (
              <li>
                <NavLink to='/admin/package-management' className='menu-link'>
                  <div className='icon-box'>
                    <img src={packages} alt='logo sidebar' />
                  </div>
                  <span>Manage Package</span>
                </NavLink>
              </li>
                  )
                : null}
            <li className='has-submenu'>
              {adminType === 'super' && (
                <NavLink
                  to='/admin/test-management/questions'
                  className='menu-link'
                >
                  <div className='icon-box'>
                    <img src={testmanage} alt='logo sidebar' />
                  </div>
                  <span>Manage Test</span>
                </NavLink>
              )}
              <ul className='submenu'>
                {adminType === 'super' ||
                roles?.find(
                  (i) =>
                    i.module_permissions.slug === 'test-management/questions'
                ).list === '1'
                  ? (
                  <li>
                    <NavLink to='/admin/test-management/questions'>
                      Questions
                    </NavLink>
                  </li>
                    )
                  : null}
                {adminType === 'super' ||
                roles?.find(
                  (i) =>
                    i.module_permissions.slug ===
                    'test-management/main-category'
                ).list === '1'
                  ? (
                  <li>
                    <NavLink to='/admin/test-management/main-category'>
                      Main Category
                    </NavLink>
                  </li>
                    )
                  : null}
                {adminType === 'super' ||
                roles?.find(
                  (i) =>
                    i.module_permissions.slug === 'test-management/sub-category'
                ).list === '1'
                  ? (
                  <li>
                    <NavLink to='/admin/test-management/sub-category'>
                      Sub Category
                    </NavLink>
                  </li>
                    )
                  : null}
              </ul>
            </li>
            {adminType === 'super' ||
            roles?.find((i) => i.module_permissions.slug === 'grade-management')
              .list === '1'
              ? (
              <li>
                <NavLink to='/admin/grade-management' className='menu-link'>
                  <div className='icon-box'>
                    <img src={result} alt='logo sidebar' />
                  </div>
                  <span>Manage Grade</span>
                </NavLink>
              </li>
                )
              : null}
            {adminType === 'super' ||
            roles?.find((i) => i.module_permissions.slug === 'board-management')
              .list === '1'
              ? (
              <li>
                <NavLink to='/admin/board-management' className='menu-link'>
                  <div className='icon-box'>
                    <img src={boardmanage} alt='logo sidebar' />
                  </div>
                  <span>Manage Board</span>
                </NavLink>
              </li>
                )
              : null}
            {adminType === 'super' ||
            roles?.find((i) => i.module_permissions.slug === 'state-management')
              .list === '1'
              ? (
              <NavLink to='/admin/state-management' className='menu-link'>
                <div className='icon-box'>
                  <img src={statesmanage} alt='logo sidebar' />
                </div>
                <span>Manage States</span>
              </NavLink>
                )
              : null}
            {adminType === 'super' ||
            roles?.find((i) => i.module_permissions.slug === 'city-management')
              ?.list === '1'
              ? (
              <NavLink to='/admin/city-management' className='menu-link'>
                <div className='icon-box'>
                  <img src={citymanage} alt='logo sidebar' />
                </div>
                <span>Manage City</span>
              </NavLink>
                )
              : null}
            {adminType === 'super' ||
            roles?.find(
              (i) => i.module_permissions.slug === 'university-management'
            ).list === '1'
              ? (
              <NavLink to='/admin/university-management' className='menu-link'>
                <div className='icon-box'>
                  <img src={universitymanage} alt='logo sidebar' />
                </div>
                <span>Manage University</span>
              </NavLink>
                )
              : null}
            {(adminType === 'super' || roles?.filter(i => i.module_permissions.slug === 'norms-management/test-time-norms' || i.module_permissions.slug === 'norms-management/gradenorms' || i.module_permissions.slug === 'norms-management/test-description-norms')?.some(i => i.list === '1')) && (
              <>
                <Accordion className='accordion-nav' defaultActiveKey='1'>
                  <Accordion.Item eventKey='0'>
                    <Accordion.Header>
                      <div className={location?.pathname === '/admin/norms/gradenorms' || location?.pathname === '/admin/norms/test-time-norms' || location?.pathname === '/admin/norms/test-description-norms' ? 'menu-link active' : 'menu-link'}>
                        <div className='icon-box'>
                          <img src={centermanage} alt='logo sidebar' />
                        </div>
                        <span>Norms</span>
                      </div>
                    </Accordion.Header>
                    <Accordion.Body>
                      <ul className='submenu'>
                        { (roles?.find((i) => i.module_permissions.slug === 'norms-management/gradenorms')
                          ?.list === '1' || adminType === 'super') &&
                        <li>
                          <NavLink to='/admin/norms/gradenorms'>
                            Grade Norms
                          </NavLink>
                        </li>}
                        { (roles?.find((i) => i.module_permissions.slug === 'norms-management/test-time-norms')
                          ?.list === '1' || adminType === 'super') &&
                        <li>
                          <NavLink to='/admin/norms/test-time-norms'>
                            Test Time Norms
                          </NavLink>
                        </li>}
                        { (roles?.find((i) => i.module_permissions.slug === 'norms-management/test-description-norms')
                          ?.list === '1' || adminType === 'super') &&
                        <li>
                          <NavLink to='/admin/norms/test-description-norms'>
                            Test Norms Description
                          </NavLink>
                        </li>}
                      </ul>
                    </Accordion.Body>
                  </Accordion.Item>
                </Accordion>
              </>
            )}

            {adminType === 'super' ||
            roles?.find((i) => i.module_permissions.slug === 'role-management')
              ?.list === '1'
              ? (
              <li>
                <NavLink to='/admin/role-management' className='menu-link'>
                  <div className='icon-box'>
                    <img src={packages} alt='logo sidebar' />
                  </div>
                  <span>Role Management</span>
                </NavLink>
              </li>
                )
              : null}
            {adminType === 'super' ||
            roles?.find(
              (i) => i.module_permissions.slug === 'sub-admin-management'
            )?.list === '1'
              ? (
              <li>
                <NavLink to='/admin/sub-admin-management' className='menu-link'>
                  <div className='icon-box'>
                    <img src={packages} alt='logo sidebar' />
                  </div>
                  <span>Sub Admin Management</span>
                </NavLink>
              </li>
                )
              : null}
            {adminType === 'super' ||
            roles?.find((i) => i.module_permissions.slug === 'software-matrix')
              ?.list === '1'
              ? (
              <li>
                <NavLink to='/admin/software-matrix' className='menu-link'>
                  <div className='icon-box'>
                    <img src={packages} alt='logo sidebar' />
                  </div>
                  <span>Software Matrix</span>
                </NavLink>
              </li>
                )
              : null}
            {adminType === 'center' &&
              <>
            <li>
              <NavLink
                to='/center/purchase-license'
                className='menu-link'
              >
                <div className='icon-box'>
                  <img src={packages} alt='logo sidebar' />
                </div>
                <span>Purchased License</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to='/center/revenue'
                className='menu-link'
              >
                <div className='icon-box'>
                  <img src={packages} alt='logo sidebar' />
                </div>
                <span>Revenue</span>
              </NavLink>
            </li>
            </>}

            {/* Admin-Center - Student */}
            {adminType === 'super' ||
            adminType === 'center' ||
            roles?.find(
              (i) => i.module_permissions.slug === 'students-management'
            )?.list === '1'
              ? (
              <li>
                <NavLink
                  to={
                    adminType === 'super' ||
                    roles?.find(
                      (i) => i.module_permissions.slug === 'students-management'
                    )?.list === '1'
                      ? '/admin/students-management'
                      : '/center/students-management'
                  }
                  className='menu-link'
                >
                  <div className='icon-box'>
                    <img src={packages} alt='logo sidebar' />
                  </div>
                  <span>Students Management</span>
                </NavLink>
              </li>
                )
              : null}

            {(adminType === 'super' || roles?.find(
              (i) => i.module_permissions.slug === 'sessions'
            )?.list === '1' || adminType === 'center') &&
            <li>
              <NavLink
                to={adminType === 'center' ? '/center/sessions' : '/admin/sessions'}
                className='menu-link'
              >
                <div className='icon-box'>
                  <img src={packages} alt='logo sidebar' />
                </div>
                <span>Session</span>
              </NavLink>
            </li>}
            {adminType !== 'counsellor' && (
              <li className='has-submenu'>
                <NavLink
                  to={
                    adminType === 'super' || adminType === 'sub'
                      ? '/admin/settings/myprofile'
                      : adminType === 'center'
                        ? '/center/settings/myprofile'
                        : ''
                  }
                  className='menu-link'
                >
                  <div className='icon-box'>
                    <img src={Settings} alt='logo sidebar' />
                  </div>
                  <span>Settings</span>
                </NavLink>
                <ul className='submenu'>
                  <li>
                    <NavLink
                      to={
                        adminType === 'super' || adminType === 'sub'
                          ? '/admin/settings/myprofile'
                          : adminType === 'center'
                            ? '/center/settings/myprofile'
                            : ''
                      }
                    >
                      My Profile
                    </NavLink>
                  </li>
                </ul>
              </li>
            )}
          </ul>
        </div>
        {/* Logout Button */}
        <div className='logout-btn'>
          <button className='logout menu-link' onClick={handleLogout}>
            <div className='icon-box'>
              <img src={logout} alt='logo sidebar' />
            </div>
            <span>Logout</span>
          </button>
        </div>
      </div>
    </>
  )
}

Sidebar.propTypes = {
  location: PropTypes.object,
  toggleHandle: PropTypes.func,
  toggle: PropTypes.bool
}

export default Sidebar
