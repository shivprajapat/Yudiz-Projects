import React, { useState, useEffect, useContext } from 'react'
import Link from 'next/link'
import { Container, Navbar, Nav, Dropdown, Form } from 'react-bootstrap'
import useTranslation from 'next-translate/useTranslation'
import { useLazyQuery, useMutation } from '@apollo/client'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'

import styles from './style.module.scss'
import { MenuIcon, EditIcon } from '@shared-components/ctIcons'
import logo from '@assets/images/logo.svg'
import { ToastrContext } from '@shared/components/toastr'
import userIcon from '@assets/images/icon/user-icon.svg'
import userImg from '@assets/images/placeholder/person-placeholder.jpg'
import { allRoutes } from '@shared/constants/allRoutes'
import { getToken, setCurrentUser } from '../../libs/menu'
import { GET_USER } from '@graphql/profile/profile.query'
import { SIGN_OUT } from '@graphql/auth/signout.mutation'
import { clearCookie, getImgURL } from '@utils'
import { GlobalEventsContext } from '../global-events'
import useWindowSize from '@shared/hooks/windowSize'
import { TOAST_TYPE } from '@shared/constants'

const GlobalSearch = dynamic(() => import('@shared/components/searchComponents/globalSearch'))
const HeaderSidebar = dynamic(() => import('@shared-components/header/headerSidebar'), { ssr: false })
const HeaderBottomMenu = dynamic(() => import('@shared-components/header/headerBottomMenu'))
const MobileMenu = dynamic(() => import('@shared-components/mobileMenu'))
const MyImage = dynamic(() => import('@shared/components/myImage'))

function MainHeader() {
  const { t } = useTranslation()
  const { dispatch } = useContext(ToastrContext)
  const router = useRouter()
  const [showMenu, setMenuShow] = useState(false)
  const [isDark, setDark] = useState(false)
  const handleMenuClose = () => setMenuShow(false)
  const handleMenuShow = (e) => {
    e.preventDefault()
    setMenuShow(true)
  }
  const [showLang, setShowLang] = useState(false)
  const showDropdown = (e) => { setShowLang(!showLang) }
  const hideDropdown = e => { setShowLang(false) }
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [userData, setUserData] = useState({})
  const [getUser, { data }] = useLazyQuery(GET_USER, { fetchPolicy: 'network-only' })
  const { stateGlobalEvents, dispatchGlobalEvents: editProfileEvent } = useContext(GlobalEventsContext)
  const [width] = useWindowSize()

  const [signOut] = useMutation(SIGN_OUT, {
    onCompleted: (data) => {
      if (data && data.userLogout) {
        clearCookie()
        sessionStorage.clear()
        setIsAuthenticated(false)
        setCurrentUser(null)
        setUserData({})
        // router.replace(allRoutes.home)
        dispatch({
          type: 'SHOW_TOAST',
          payload: { message: data?.userLogout?.sMessage, type: TOAST_TYPE.Success }
        })
        editProfileEvent({
          type: 'CHANGE_PROFILE',
          payload: { profileData: null }
        })
      }
    }
  })

  useEffect(() => {
    if (stateGlobalEvents && stateGlobalEvents.profileData) {
      setUserData({ ...stateGlobalEvents.profileData })
    }
  }, [stateGlobalEvents])

  useEffect(() => {
    isAuthenticated && getUser()
  }, [isAuthenticated])

  useEffect(() => {
    setUserValue(data)
  }, [data])

  function handleDark() {
    setDark(!isDark)
  }

  function setUserValue(data) {
    if (data?.getUser) {
      setUserData(data.getUser)
      setCurrentUser(data.getUser)
      editProfileEvent({
        type: 'CHANGE_PROFILE',
        payload: { profileData: data.getUser }
      })
    }
  }

  const handleSignOut = () => {
    signOut()
  }

  useEffect(() => {
    if (getToken()) {
      setIsAuthenticated(true)
      setUserData(data?.getUser)
      setCurrentUser(data?.getUser)
    } else {
      setIsAuthenticated(false)
    }
  }, [setIsAuthenticated, handleSignOut])

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const body = document.querySelector('body')
      document.body.classList.add('light-mode')
      if (isDark) {
        document.body.classList.add('dark-mode')
        document.body.classList.remove('light-mode')
        return () => {
          body.classList.remove('dark-mode')
          body.classList.add('light-mode')
        }
      }
    }
  }, [isDark])

  return (
    <>
      <header className={styles.siteHeader}>
        <Container>
          <Navbar className={`${styles.navbar} align-items-center`}>
            <Link href="/">
              <a className={`${styles.logo} navbar-brand d-block`}>
                <MyImage src={logo} alt="logo" layout="responsive" />
              </a>
            </Link>
            <span className={styles.separator}></span>
            <Dropdown className={`${styles.langMenu} common-dropdown`} show={showLang} onMouseEnter={showDropdown} onMouseLeave={hideDropdown}>
              <Dropdown.Toggle id="language" variant="link">
                {t('common:Eng')}
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item href="https://hindi.crictracker.com" target="_blank">
                  {t('common:Hindi')}
                </Dropdown.Item>
                <Dropdown.Item href="https://bengali.crictracker.com" target="_blank">
                  {t('common:Bengali')}
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
            <Nav className={`${styles.nav} ms-auto align-items-center`}>
              <Form className={`${styles.modeSwitch} d-none align-items-center`}>
                {/* d-md-flex */}
                <Form.Switch.Label htmlFor="dark-mode">{t('common:DarkMode')}</Form.Switch.Label>
                <Form.Switch type="switch" id="dark-mode" onChange={handleDark} />
              </Form>
              <Nav.Link href="/" className={`${styles.navLink} ${styles.outlineBtn} d-none align-items-center`}>
                {/* d-md-flex */}
                <EditIcon />
                {t('common:WriteforUs')}
              </Nav.Link>
              {/* {!isAuthenticated && (
                <Link href={allRoutes.signIn} prefetch={false}>
                  <a className={`${styles.navLink} ${styles.fillBtn}`}>
                    {t('common:SignIn')}
                  </a>
                </Link>
              )} */}
              <GlobalSearch outerStyles={styles} />
              {/* FOR PHASE 2 */}
              {/* {isAuthenticated &&
                showPopUp === true &&
                userData &&
                userData.bIsMobVerified === false &&
                router.pathname !== '/verify-phone-number' && (
                  <Dropdown defaultShow className={`${styles.userDropdown} user-dropdown`}>
                    <Dropdown.Toggle variant="link" id="dropdown-basic" className={`${styles.navLink} ${styles.iconItem}`}>
                      <NotificationIcon />
                    </Dropdown.Toggle>
                    <Dropdown.Menu className={`${styles.dropdownMenu} ${styles.dropdownVerify} text-center`} align="end">
                      <div className="mb-2">
                        <PasswordPhoneIcon />
                      </div>
                      <p className="mb-2">{t('common:VerifyPhonenumber')}</p>
                      <Link href={allRoutes.verifyPhoneNumber}>
                        <a className="theme-btn outline-btn small-btn mx-auto">{t('common:Verify')}</a>
                      </Link>
                      <Dropdown.Item onClick={() => setUserPrefrence()}>{t('common:Skip')}</Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
              )} */}
              {isAuthenticated && (
                <Dropdown className={`${styles.userDropdown} user-dropdown`}>
                  <Dropdown.Toggle variant="link" id="dropdown-basic" className={styles.userToggle}>
                    <MyImage src={getImgURL(userData?.sProPic) || userIcon} alt="user name" width="32" height="32" layout="responsive" />
                  </Dropdown.Toggle>
                  <Dropdown.Menu className={styles.dropdownMenu} align="end">
                    <Dropdown.Item as="div">
                      <Link href={allRoutes.profile} prefetch={false}>
                        <div className={`${styles.profileInfo} d-flex align-items-center`}>
                          <div className={`${styles.profilePic} rounded-circle overflow-hidden`}>
                            <MyImage
                              src={getImgURL(userData?.sProPic) || userImg}
                              alt={userData?.sFullName}
                              width="80"
                              height="80"
                              layout="responsive"
                            />
                          </div>
                          <span>{userData?.sFullName}</span>
                        </div>
                      </Link>
                    </Dropdown.Item>
                    <Dropdown.Item as="div" className={router.pathname === allRoutes.saveForLater && styles.active}>
                      <Link href={allRoutes.saveForLater} passHref prefetch={false}>
                        {t('common:SavedForLater')}
                      </Link>
                    </Dropdown.Item>
                    <Dropdown.Item as="div">
                      <Link href={allRoutes.changePassword} passHref prefetch={false}>
                        <Dropdown.Item className={router.pathname === allRoutes.changePassword && styles.active}>
                          {t('common:ChangePassword')}
                        </Dropdown.Item>
                      </Link>
                    </Dropdown.Item>
                    <Dropdown.Item onClick={handleSignOut} as="button">{t('common:SignOut')}</Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              )}
              <span className={`${styles.separator} d-none d-md-block`}></span>
              <Nav.Link onClick={handleMenuShow} className={`${styles.navLink} ${styles.iconItem} d-none d-md-block`}>
                <MenuIcon />
              </Nav.Link>
            </Nav>
          </Navbar>
        </Container>
      </header>
      {showMenu && <HeaderSidebar showMenu={showMenu} handleMenu={handleMenuClose} />}
      <HeaderBottomMenu />
      {width < 767 && (
        <MobileMenu handleMenuShow={handleMenuShow} />
      )}
    </>
  )
}
export default MainHeader
