import React, { useState, useEffect, useContext } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Dropdown } from 'react-bootstrap'
import useTranslation from 'next-translate/useTranslation'
import { useLazyQuery, useMutation } from '@apollo/client'
import dynamic from 'next/dynamic'
import iconImg from '@assets/images/icon/trending-icon.svg'

import userIcon from '@assets/images/icon/user-icon.svg'
import userImg from '@assets/images/placeholder/person-placeholder.jpg'
import { allRoutes } from '@shared/constants/allRoutes'
import { getHeaderSidebarMenu, getToken, setCurrentUser } from '../../../libs/menu'
import { GET_USER } from '@graphql/profile/profile.query'
import { SIGN_OUT } from '@graphql/auth/signout.mutation'
import { clearCookie, getImgURL } from '@utils'
import { FACEBOOK_URL, TELEGRAM_URL, LINKEDIN_URL, INSTAGRAM_URL, TWITTER_URL, YOUTUBE_URL, SPORTSINFO_URL, CRICTRACKER_HINDI_URL, CRICTRACKER_BENGALI_URL, S3_PREFIX } from '@shared/constants'
import { GlobalEventsContext } from '@shared/components/global-events'

const HeaderSidebar = dynamic(() => import('@shared-components/header/headerSidebar'), { ssr: false })
const HeaderMenuAMP = dynamic(() => import('@shared-components/amp/headerAMP/headerMenuAMP'))
const MobileMenuAMP = dynamic(() => import('@shared-components/amp/mobileMenuAMP'))

function HeaderAMP() {
  const { t } = useTranslation()
  const [showMenu, setMenuShow] = useState(false)
  const handleMenuClose = () => setMenuShow(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [userData, setUserData] = useState({})
  const { stateGlobalEvents, dispatchGlobalEvents: editProfileEvent } = useContext(GlobalEventsContext)
  const sliderData = getHeaderSidebarMenu()

  const [getUser, { data }] = useLazyQuery(GET_USER, { fetchPolicy: 'network-only' })

  const [signOut] = useMutation(SIGN_OUT, {
    onCompleted: (data) => {
      if (data && data.userLogout) {
        clearCookie()
        sessionStorage.clear()
        setIsAuthenticated(false)
        setCurrentUser(null)
        setUserData({})
        // router.replace(allRoutes.home)
        // dispatch({
        //   type: 'SHOW_TOAST',
        //   payload: { message: data?.userLogout?.sMessage, type: TOAST_TYPE.Success }
        // })
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

  return (
    <>
      <header className="siteHeader">
        <div className="container">
          <nav className="navbar d-flex align-items-center navbar navbar-expand navbar-light">
            <a href="/" className="logo navbar-brand d-block">
              <amp-img alt="post" src="/static/logo.png" width="689" height="108" layout="responsive"></amp-img>
            </a>
            {/* <span className="separator"></span> */}
            {/* <Dropdown className="langMenu common-dropdown">
              <Dropdown.Toggle id="language" variant="link">
                {t('common:Eng')}
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item href="/">{t('common:Eng')}</Dropdown.Item>
                <Dropdown.Item href="/">{t('common:Fr')}</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown> */}
            <div className="nav d-flex ms-auto align-items-center">
              {/* {!isAuthenticated && (
                <Link href={allRoutes.signIn} prefetch={false}>
                  <a className="navLink fillBtn">
                    {t('common:SignIn')}
                  </a>
                </Link>
              )} */}
              {/* <GlobalSearch /> */}
              {/* For phase 2 */}
              {/* {isAuthenticated &&
                showPopUp === true &&
                userData &&
                userData.bIsMobVerified === false &&
                router.pathname !== '/verify-phone-number' && (
                  <Dropdown defaultShow className="userDropdown user-dropdown">
                    <Dropdown.Toggle variant="link" id="dropdown-basic" className="navLink iconItem">
                      <NotificationIcon />
                    </Dropdown.Toggle>
                    <Dropdown.Menu className="dropdownMenu dropdownVerify text-center" align="end">
                      <div className="mb-2">
                        <PasswordPhoneIcon />
                      </div>
                      <p className="mb-2">{t('common:VerifyPhonenumber')}</p>
                      <Link href={allRoutes.verifyPhoneNumber} prefetch={false}>
                        <a className="theme-btn outline-btn small-btn mx-auto">{t('common:Verify')}</a>
                      </Link>
                      <Dropdown.Item onClick={() => setUserPrefrence()}>{t('common:Skip')}</Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
              )} */}
              {isAuthenticated && (
                <Dropdown className="userDropdown user-dropdown">
                  <Dropdown.Toggle variant="link" id="dropdown-basic">
                    <Image src={userIcon} alt="user name" />
                  </Dropdown.Toggle>
                  <Dropdown.Menu className="dropdownMenu" align="end">
                    <Link href={allRoutes.profile} prefetch={false}>
                      <div className="profileInfo d-flex align-items-center">
                        <div className="profilePic rounded-circle overflow-hidden">
                          <Image
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
                    <Link href={allRoutes.saveForLater} passHref prefetch={false}>
                      <Dropdown.Item href={allRoutes.saveForLater}> {t('common:SavedForLater')}</Dropdown.Item>
                    </Link>
                    <Dropdown.Item>{t('common:ChangePassword')}</Dropdown.Item>
                    <Dropdown.Item onClick={handleSignOut} as="button"> {t('common:SignOut')}</Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              )}
              <a href={allRoutes.search} className="navLink iconItem search-icon">
                <amp-img alt="menu" src="/static/search-icon.svg" width="32" height="32" layout="responsive"></amp-img>
              </a>
              <span className="separator d-none d-md-block"></span>
              <a on="tap:sidebar1.toggle" className="navLink iconItem search-icon d-none d-md-block">
                <amp-img alt="menu" src="/static/menu-icon.svg" width="32" height="32" layout="responsive"></amp-img>
              </a>
            </div>
          </nav>
        </div>
        <HeaderSidebar showMenu={showMenu} handleMenu={handleMenuClose} />
        <HeaderMenuAMP />
      </header>
      <amp-sidebar id="sidebar1" layout="nodisplay" side="right" className="sidebar">
        <div className="acordian">
          <div className="item">
            <h4 className="text-uppercase">{t('common:Topics')}</h4>
            <amp-accordion animate="">
              {
                sliderData.map((data, i) =>
                  <section className="accordian-container" key={i}>
                    <h5 className="accordian-heading">
                      <div>
                        {data?.oImg?.sUrl && data?.bIsMulti && <span className='accordian-lblimg'><amp-img src={data?.oImg?.sUrl ? `${S3_PREFIX}${data?.oImg?.sUrl}` : iconImg} width="18" height="18"></amp-img></span>}
                        {
                          data?.bIsMulti ? <span>{data?.sName}</span> : <a href={`/${data?.sSlug}?amp=1`}>{data?.sName}</a>
                        }
                      </div>
                    </h5>
                    <ul className="accordian-list">
                      {data.aSlide.map((slide, i) =>
                        <li key={i}><a href={`/${slide?.sSlug}?amp=1`}>{slide?.sName}</a></li>)}
                    </ul>
                  </section>
                )
              }
            </amp-accordion>
          </div>
          <div className="infoSection">
            <div className="item moreLink">
              <h4 className="text-uppercase">{t('common:MoreLinks')}</h4>
              <ul className="mb-0">
                <li>
                  <a href={allRoutes.aboutUs}>{t('common:AboutUs')}</a>
                </li>
                <li>
                  <a href={allRoutes.contactUs}>{t('common:ContactUs')}</a>
                </li>
                <li>
                  <a href={allRoutes.privacyPolicy}>{t('common:PrivacyPolicy')}</a>
                </li>
                <li>
                  <a href="/">{t('common:GDPRCompliance')}</a>
                </li>
                <li>
                  <a href="/">{t('common:Affiliate')}</a>
                </li>
              </ul>
            </div>
            <div className="item">
              <h4 className="text-uppercase"># {t('common:FollowUs')}</h4>
              <ul className="socialMenu d-flex text-uppercase align-items-center d-flex mb-0">
                <li>
                  <a href={FACEBOOK_URL} target="_blank" rel="noreferrer">
                    <amp-img alt="menu" src="/static/facebook-icon.svg" width="32" height="32" layout="responsive"></amp-img>
                  </a>
                </li>
                <li>
                  <a href={TWITTER_URL} target="_blank" rel="noreferrer">
                    <amp-img alt="twitter" src="/static/twitter-icon.svg" width="32" height="32" layout="responsive"></amp-img>
                  </a>
                </li>
                <li>
                  <a href={INSTAGRAM_URL} target="_blank" rel="noreferrer">
                    <amp-img alt="instagram" src="/static/instagram-icon.svg" width="32" height="32" layout="responsive"></amp-img>
                  </a>
                </li>
                <li>
                  <a href={LINKEDIN_URL} target="_blank" rel="noreferrer">
                    <amp-img alt="linkedin" src="/static/linkedin-icon.svg" width="32" height="32" layout="responsive"></amp-img>
                  </a>
                </li>
                <li>
                  <a href={YOUTUBE_URL} target="_blank" rel="noreferrer">
                    <amp-img alt="youtube" src="/static/youtube-icon.svg" width="32" height="32" layout="responsive"></amp-img>
                  </a>
                </li>
                <li>
                  <a href={TELEGRAM_URL} target="_blank" rel="noreferrer">
                    <amp-img alt="telegram" src="/static/telegram-icon.svg" width="32" height="32" layout="responsive"></amp-img>
                  </a>
                </li>
              </ul>
            </div>
            <div className="item">
              <h4 className="text-uppercase">{t('common:OtherSports')}</h4>
              <div className="otherLogo-container">
                <a href={SPORTSINFO_URL} target="_blank" rel="noreferrer" className="otherLogo">
                  <amp-img src="/static/sportsinfo.svg" alt="logo" width="116" height="24" layout="responsive"></amp-img>
                </a>
                <a href={CRICTRACKER_HINDI_URL} target="_blank" rel="noreferrer" className="otherLogo">
                  <amp-img src="/static/crictracker-logo-hindi.png" alt="crictracker logo" width="164" height="26" layout="responsive"></amp-img>
                </a>
                <a href={CRICTRACKER_BENGALI_URL} target="_blank" rel="noreferrer" className="otherLogo">
                  <amp-img src="/static/crictracker-logo-bangla.png" alt="crictracker logo" width="164" height="22" layout="responsive"></amp-img>
                </a>
              </div>
            </div>
          </div>
        </div>
      </amp-sidebar>
      <MobileMenuAMP />
      {/* <MobileMenu handleMenuShow={handleMenuShow} /> */}
    </>
  )
}
export default HeaderAMP
