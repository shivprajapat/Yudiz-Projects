import React, { useRef, useEffect } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { useSnackbar } from 'react-notistack'
import PropTypes from 'prop-types'
import { Accordion } from 'react-bootstrap'

/* Icons */
import logoOllato from '../../assets/images/logo2-ollato.png'
// import logoOllato from '../../assets/images/sidebar-icons/logo-ollato.svg'
import dashboard from '../../assets/images/sidebar-icons/dashboard.svg'
import packages from '../../assets/images/sidebar-icons/packages.svg'
import testProcess from '../../assets/images/sidebar-icons/test-process.svg'
import assesment from '../../assets/images/sidebar-icons/assesment.svg'
// import result from '../../assets/images/sidebar-icons/result.svg'
import counselling from '../../assets/images/sidebar-icons/Counselling.svg'
import settings from '../../assets/images/sidebar-icons/Settings.svg'
import logout from '../../assets/images/sidebar-icons/logout.svg'
import closebtn from '../../assets/images/close-circle-mobile.svg'
import defaultImage from '../../assets/default_profile copy.jpg'

// Action Files
import { logoutAction } from '../../Actions/auth'

function Sidebar (props) {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { enqueueSnackbar } = useSnackbar()
  const token = localStorage.getItem('token')
  const profileData = JSON.parse(localStorage.getItem('profile'))

  // useSelector
  const data = useSelector((state) => state.auth.isLoggedOut)
  const dataMessage = useSelector((state) => state.auth.resMessage)
  // const profileDataArray = useSelector((state) => state.auth.profileData)
  const responseStatus = useSelector((state) => state.auth.resStatus)
  const previousProps = useRef({ data, dataMessage, responseStatus }).current

  // Logout Method
  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('EmailMobile')
    dispatch(logoutAction(token))
    // navigate('/')
  }

  // // Authorization error
  useEffect(() => {
    if (responseStatus === 401) {
      localStorage.removeItem('token')
      navigate('/')
    }
  }, [responseStatus])

  // Toastify Notification
  useEffect(() => {
    if (previousProps?.data !== data) {
      if (data) {
        enqueueSnackbar(`${dataMessage}`, {
          variant: 'success',
          autoHide: true,
          hide: 3000
        })
        navigate('/')
      } else if (data === false) {
        enqueueSnackbar(`${dataMessage}`, {
          variant: 'error',
          autoHide: true,
          hide: 3000,
          TransitionComponent: 'Fade'
        })
      }
    }
    return () => {
      previousProps.data = data
    }
  }, [data])

  // useEffect(() => {
  //   if (token) {
  //     dispatch(viewProfileAction(token))
  //   }
  // }, [token])

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
            <button className='profile-boxx'>
              <img src={ profileData?.profile !== null ? `${process.env.REACT_APP_AXIOS_BASE_URL}${profileData?.profile}` : defaultImage} alt='profile-pic' />
              {/* <img src={profile} alt='profile-pic' /> */}
            </button>
            <button
              type='button'
              className='close-btn'
              onClick={() => props?.toggleHandle(!props.toggle)}
            >
              <img src={closebtn} alt='close' />
            </button>
          </div>
          <ul className='sidebar-menu'>
            <li className='user-name'>
              <NavLink to={'/settings/my-profile'} className='menu-link'>
                <span>
                  {profileData?.first_name} {profileData?.last_name}
                </span>
              </NavLink>
            </li>
            <li
              className={`${
                props?.location.pathname === '/dashboard' ? 'active' : ''
              } `}
            >
              <NavLink to='/dashboard' className='menu-link'>
                <div className='icon-box'>
                  <img src={dashboard} alt='logo sidebar' />
                </div>
                <span>Dashboard</span>
              </NavLink>
            </li>
            <li
              className={`${
                props?.location.pathname?.includes('/package') ? 'active' : ''
              } `}
            >
              <NavLink to='/package' className='menu-link'>
                <div className='icon-box'>
                  <img src={packages} alt='logo sidebar' />
                </div>
                <span>Package</span>
              </NavLink>
            </li>
            <li
              className={`${
                props?.location.pathname?.includes('/test-process')
                  ? 'active'
                  : ''
              } `}
            >
              <NavLink to='/test-process' className='menu-link'>
                <div className='icon-box'>
                  <img src={testProcess} alt='logo sidebar' />
                </div>
                <span>Test Process</span>
              </NavLink>
            </li>
            <li
              className={`${
                props?.location.pathname?.includes('/assetment') ? 'active' : ''
              } `}
            >
              <NavLink to='/assetment' className='menu-link'>
                <div className='icon-box'>
                  <img src={assesment} alt='logo sidebar' />
                </div>
                <span>Assessment</span>
              </NavLink>
            </li>
            <Accordion className='accordion-nav' defaultActiveKey='0'>
              <Accordion.Item eventKey='1'>
                <Accordion.Header>
                <NavLink className="w-100" to='/counselling'>
                  <div className='menu-link'>
                      <div className='icon-box d-flex'>
                        <img src={counselling} alt='logo sidebar' />
                      </div>
                      <span>Counselling</span>
                  </div>
                  </NavLink>
                </Accordion.Header>
                <Accordion.Body>
                  <ul className='submenu'>
                    <li>
                      <NavLink
                        to='/counselling/career'
                        state={{ data: 'career_counsellor' }}
                      >
                        Career
                      </NavLink>
                    </li>
                    <li>
                      <NavLink
                        to='/counselling/psy'
                        state={{ data: 'psychologist' }}
                      >
                        Psychogist
                      </NavLink>
                    </li>
                    <li>
                      <NavLink
                        to='/counselling/over'
                        state={{ data: 'overseas_counsellor' }}
                      >
                        OverSeas
                      </NavLink>
                    </li>
                    <li>
                      <NavLink
                        to='/counselling/expert'
                        state={{ data: 'subject_expert' }}
                      >
                        Subject Expert
                      </NavLink>
                    </li>
                    <li>
                      <NavLink to='/counselling/session-history/:type'>
                        Session History
                      </NavLink>
                    </li>
                  </ul>
                </Accordion.Body>
              </Accordion.Item>
            </Accordion>
            {/* <li className='has-submenu'>
                        <NavLink to="/counselling" className='menu-link'>
                            <div className='icon-box'>
                              <img src={counselling} alt="logo sidebar" />
                            </div>
                            <span>Counselling</span>
                        </NavLink>

                    </li> */}
            <li
              className={`${
                props?.location.pathname === '/settings/change-password'
                  ? 'active'
                  : ''
              } `}
            >
              <NavLink to='/settings/change-password' className='menu-link'>
                <div className='icon-box'>
                  <img src={settings} alt='logo sidebar' />
                </div>
                <span>Settings</span>
              </NavLink>
            </li>
          </ul>
        </div>
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

export default Sidebar

Sidebar.propTypes = {
  location: PropTypes.object,
  toggleHandle: PropTypes.func,
  toggle: PropTypes.bool
}
