import React, { useContext, useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import PropTypes from 'prop-types'
import useTranslation from 'next-translate/useTranslation'
import { useRouter } from 'next/router'
import { Dropdown } from 'react-bootstrap'
import { useLazyQuery, useMutation } from '@apollo/client'

import { TOAST_TYPE } from '@shared/constants'
import { allRoutes } from '@shared/constants/allRoutes'
import { clearCookie, getImgURL } from '@shared/utils'
import userIcon from '@assets/images/icon/user-icon.svg'
import userImg from '@assets/images/placeholder/person-placeholder.jpg'
import { SIGN_OUT } from '@graphql/auth/signout.mutation'
import { setCurrentUser } from '@shared/libs/menu'
import ToastrContext from '@shared-components/toastr/ToastrContext'
import GlobalEventsContext from '@shared/components/global-events/GlobalEventsContext'
import { GET_USER } from '@graphql/profile/profile.query'
import { getToken, setToken } from '@shared/libs/token'

// const WhatsAppUpdate = dynamic(() => import('@shared/components/whatsAppUpdate'))
const CustomLink = dynamic(() => import('@shared/components/customLink'))
const GlobalSearch = dynamic(() => import('@shared/components/searchComponents/globalSearch'))
const MyImage = dynamic(() => import('@shared/components/myImage'))
const DarkModeButton = dynamic(() => import('@shared/components/header/darkModeButton'))
const OnMouseAndScroll = dynamic(() => import('@shared/components/lazyLoad/onMouseAndScroll'))

function HeaderUser({ styles, isGlanceView }) {
  const { t } = useTranslation()
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [userData, setUserData] = useState({})
  const { dispatch } = useContext(ToastrContext)
  const { stateGlobalEvents, dispatchGlobalEvents: editProfileEvent } = useContext(GlobalEventsContext)

  const [getUser, { data }] = useLazyQuery(GET_USER, {
    fetchPolicy: 'network-only',
    notifyOnNetworkStatusChange: true,
    onCompleted: (data) => {
      setUserValue(data)
    }
  })

  const [signOut] = useMutation(SIGN_OUT, {
    onCompleted: (data) => {
      if (data && data.userLogout) {
        setToken(undefined)
        clearCookie('token')
        sessionStorage.clear()
        setIsAuthenticated(false)
        setCurrentUser(null)
        setUserData({})
        router.replace(allRoutes.home)
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

  return (
    <>
      {/* FOR PHASE 2 */}
      {/* {REACT_APP_ENV !== 'production' && ( */}
      <OnMouseAndScroll>
        {/* <WhatsAppUpdate /> */}
        <div className="">
          <DarkModeButton />
        </div>
      </OnMouseAndScroll>
      {/* )} */}
      {/* <Nav.Link href="/" className={`${styles.navLink} ${styles.outlineBtn} align-items-center rounded-pill`}>
        <EditIcon />
        {t('common:WriteforUs')}
      </Nav.Link> */}
      {(!isAuthenticated && !isGlanceView) && (
        <CustomLink href={allRoutes.signIn} prefetch={false}>
          <a className={`${styles.navLink} ${styles.fillBtn} rounded-pill`}>
            {t('common:SignIn')}
          </a>
        </CustomLink>
      )}
      <div className='hd-search-ot d-none d-md-block'>
        <GlobalSearch outerStyles={styles} />
      </div>
      {/* FOR PHASE 2 */}
      {/* {isAuthenticated &&
        showPopUp === true &&
        userData &&
        userData.bIsMobVerified === false &&
        router.pathname !== '/verify-phone-number' && (
          <Dropdown defaultShow className={`${styles.userDropdown} user-dropdown`}>
            <Dropdown.Toggle variant="link" id="dropdown-basic" className={`${styles.navLink} ${styles.iconItem} p-0`}>
              <NotificationIcon />
            </Dropdown.Toggle>
            <Dropdown.Menu className={`${styles.dropdownMenu} ${styles.dropdownVerify} text-center`} align="end">
              <div className="mb-2">
                <PasswordPhoneIcon />
              </div>
              <p className="mb-2">{t('common:VerifyPhonenumber')}</p>
              <CustomLink href={allRoutes.verifyPhoneNumber}>
                <a className="theme-btn outline-btn small-btn mx-auto">{t('common:Verify')}</a>
              </Link>
              <Dropdown.Item onClick={() => setUserPrefrence()}>{t('common:Skip')}</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
      )} */}
      {isAuthenticated && (
        <Dropdown className={`${styles.userDropdown} user-dropdown`}>
          <Dropdown.Toggle variant="link" id="dropdown-basic" className={`${styles.userToggle} rounded-circle overflow-hidden`}>
            <MyImage src={getImgURL(userData?.sProPic) || userIcon} alt="user name" width="32" height="32" layout="responsive" />
          </Dropdown.Toggle>
          <Dropdown.Menu className={styles.dropdownMenu} align="end">
            <Dropdown.Item as="div">
              <CustomLink href={allRoutes.profile} prefetch={false}>
                <a>
                  <div className={`${styles.profileInfo} d-flex align-items-center pb-2`}>
                    <div className={`${styles.profilePic} me-2 rounded-circle overflow-hidden`}>
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
                </a>
              </CustomLink>
            </Dropdown.Item>
            <Dropdown.Item as="div" className={router.pathname === allRoutes.saveForLater && styles.active}>
              <CustomLink href={allRoutes.saveForLater} prefetch={false}>
                <a>{t('common:SavedForLater')}</a>
              </CustomLink>
            </Dropdown.Item>
            <Dropdown.Item as="div">
              <CustomLink href={allRoutes.changePassword} passHref prefetch={false}>
                <Dropdown.Item className={router.pathname === allRoutes.changePassword && styles.active}>
                  {t('common:ChangePassword')}
                </Dropdown.Item>
              </CustomLink>
            </Dropdown.Item>
            <Dropdown.Item onClick={handleSignOut} as="button">{t('common:SignOut')}</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      )}
    </>
  )
}

HeaderUser.propTypes = {
  styles: PropTypes.object,
  isGlanceView: PropTypes.bool
}
export default HeaderUser
