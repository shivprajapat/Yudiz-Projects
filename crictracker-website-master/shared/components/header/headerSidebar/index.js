import React, { useContext, useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { Nav, Tab, Button, Offcanvas, Accordion, Dropdown } from 'react-bootstrap'
import { useLazyQuery, useMutation } from '@apollo/client'
import useTranslation from 'next-translate/useTranslation'
import dynamic from 'next/dynamic'

import styles from './style.module.scss'
import { FacebookIcon, InstagramIcon, LinkedinIcon, TelegramIcon, TwitterIcon, YoutubeIcon, CloseIcon, ThreadsIcon } from '@shared-components/ctIcons'
import {
  TOAST_TYPE,
  FACEBOOK_URL,
  TELEGRAM_URL,
  LINKEDIN_URL,
  INSTAGRAM_URL,
  TWITTER_URL,
  YOUTUBE_URL,
  S3_PREFIX,
  SPORTSINFO_URL,
  CRICTRACKER_HINDI_URL,
  CRICTRACKER_BENGALI_URL,
  THREADS_URL
  // REACT_APP_ENV
} from '@shared/constants'
import ToastrContext from '@shared-components/toastr/ToastrContext'
import sportsInfo from '@assets/images/sportsinfo.svg'
import logoHindi from '@assets/images/crictracker-logo-hindi.png'
import logoBengali from '@assets/images/crictracker-logo-bangla.png'
import { GET_FAVOURITE } from '@graphql/category/category.query'
import { DELETE_FAVOURITE } from '@graphql/category/category.mutation'
import iconImg from '@assets/images/icon/trending-icon.svg'
import GlobalEventsContext from '@shared/components/global-events/GlobalEventsContext'
import { allRoutes } from '@shared/constants/allRoutes'
import { getHeaderSidebarMenu } from '@shared/libs/menu'
import CustomLink from '@shared/components/customLink'
import { getToken } from '@shared/libs/token'

const GlobalSearch = dynamic(() => import('@shared/components/searchComponents/globalSearch'))
// const DarkModeButton = dynamic(() => import('@shared/components/header/darkModeButton'))
const NoData = dynamic(() => import('@shared/components/noData'), { ssr: false })
const MyImage = dynamic(() => import('@shared/components/myImage'))
const CtToolTip = dynamic(() => import('@shared/components/ctToolTip'))

function HeaderSidebar({ showMenu, handleMenu }) {
  const { dispatchGlobalEvents: editGlobalEvent } = useContext(GlobalEventsContext)
  const { t } = useTranslation()
  const [favList, setFavList] = useState()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const { dispatch } = useContext(ToastrContext)
  const sliderData = getHeaderSidebarMenu()
  const [showLang, setShowLang] = useState(false)
  const showDropdown = (e) => { setShowLang(!showLang) }
  const hideDropdown = e => { setShowLang(false) }

  const [getFavourite, { data: favouriteData }] = useLazyQuery(GET_FAVOURITE, {
    fetchPolicy: 'network-only'
  })

  useEffect(() => {
    getToken() ? setIsAuthenticated(true) : setIsAuthenticated(false)
  }, [getToken()])

  useEffect(() => {
    favouriteData && setFavList(favouriteData?.listFavourite?.aResults)
  }, [favouriteData])

  const handleList = () => {
    getFavourite({ variables: { input: { nLimit: 15, nSkip: 0 } } })
  }

  const [deleteFavourite] = useMutation(DELETE_FAVOURITE, {
    onCompleted: (data) => {
      if (data && data.deleteFavourite !== null) {
        dispatch({
          type: 'SHOW_TOAST',
          payload: { message: data.deleteFavourite.sMessage, type: TOAST_TYPE.Success }
        })
        editGlobalEvent({
          type: 'CHANGE_FAVOURITE',
          payload: { favouriteData: data.deleteFavourite.oData._id }
        })
      }
    }
  })

  const handleFav = async (value) => {
    const deleteData = await deleteFavourite({ variables: { input: { iPageId: value } } })
    if (deleteData?.data?.deleteFavourite) {
      setFavList(favList?.filter((favItem) => favItem?.iPageId !== value))
    }
  }

  return (
    <>
      <Offcanvas show={showMenu} onHide={handleMenu} placement={'end'} className={`${styles.sidemenu} light-bg font-semi py-3`}>
        <CtToolTip tooltip={t('common:Close')}>
          <Button variant="link" onClick={handleMenu} className={`${styles.closeMenu} btn-close position-absolute rounded-circle`}>
          </Button>
        </CtToolTip>
        <div className={`${styles.menuHead} d-flex d-md-none ps-3 mt-n1`}>
          <Dropdown className={`${styles.langMenu} common-dropdown`} show={showLang} onMouseEnter={showDropdown} onMouseLeave={hideDropdown}>
            <Dropdown.Toggle id="language" variant="link" className="a-transition">
              {t('common:English')}
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
          {/* {REACT_APP_ENV !== 'production' && (
            <DarkModeButton isLightBg={true} />
          )} */}
          {/* {REACT_APP_ENV === 'production' && 'Menu'} */}
        </div>
        <Offcanvas.Body className={`${styles.menuBody} d-flex flex-column flex-md-row p-0 pt-3 pt-md-0`}>
          <div className='hd-search-ot d-md-none'>
            <GlobalSearch outerStyles={styles} handleSidebarMenu={handleMenu} defaultShow />
          </div>
          <div className={`${styles.tabSection} px-4`}>
            <Tab.Container id="left-tabs-example" defaultActiveKey="first">
              <Nav className={`${styles.navTab} equal-width-nav mx-2 mx-md-n2 mb-3 mb-md-4`} variant="pills">
                <Nav.Item>
                  <Nav.Link className="mx-2" eventKey="first">{t('common:Topics')}</Nav.Link>
                </Nav.Item>
                {isAuthenticated && (
                  <Nav.Item>
                    <Nav.Link className="mx-2" eventKey="second" onClick={() => handleList()}>
                      {t('common:Favorite')}
                    </Nav.Link>
                  </Nav.Item>
                )}
              </Nav>
              <Tab.Content>
                <Tab.Pane eventKey="first">
                  <h4 className="text-uppercase mb-3">{t('common:Topics')}</h4>
                  {sliderData?.map((data, i) => {
                    if (data.bIsMulti) {
                      return (
                        <Accordion key={`sb${i}`} defaultActiveKey="0">
                          <Accordion.Item eventKey={i - 1}>
                            <Accordion.Header className={styles.accordionHeader}>
                              <span className={`${styles.icon} icon d-flex align-items-center justify-content-center`}>
                                <MyImage
                                  src={data?.oImg?.sUrl ? `${S3_PREFIX}${data?.oImg?.sUrl}` : iconImg}
                                  width={24}
                                  height={24}
                                  layout="responsive"
                                />
                              </span>
                              {data?.sName}
                            </Accordion.Header>
                            <>
                              <Accordion.Body>
                                {data.aSlide.map((slide, index) => {
                                  return (
                                    <React.Fragment key={index}>
                                      <Button variant="link" className="icon-btn">
                                        <CustomLink href={'/' + slide?.sSlug} prefetch={false}>
                                          <a onClick={() => handleMenu()}>{slide?.sName}</a>
                                        </CustomLink>
                                      </Button>
                                    </React.Fragment>
                                  )
                                })}
                              </Accordion.Body>
                            </>
                          </Accordion.Item>
                        </Accordion>
                      )
                    } else {
                      return (
                        <div key={`sb${i}`} >
                          <Button variant="link" className="icon-btn mb-2 mb-md-3">
                            <span className={`${styles.icon} icon d-flex align-items-center justify-content-start`}>
                              {data?.oImg?.sUrl && (
                                <MyImage
                                  src={`${S3_PREFIX}${data?.oImg?.sUrl}`}
                                  width={24}
                                  height={24}
                                  layout="responsive"
                                />
                              )}
                              <CustomLink href={'/' + data?.sSlug} prefetch={false}>
                                <a onClick={() => handleMenu()}>{data?.sName}</a>
                              </CustomLink>
                            </span>
                          </Button>
                        </div>
                      )
                    }
                  })}
                </Tab.Pane>
                <Tab.Pane eventKey="second">
                  <h4 className="text-uppercase mb-3">{t('common:Favorite')}</h4>
                  <div>
                    {favList?.map((element) => {
                      return (
                        <Button
                          key={element?.iPageId}
                          variant="link"
                          className={`${styles.favBtn} pe-2 icon-btn light-theme-btn d-flex justify-content-between align-items-center text-capitalize mb-2 mb-md-3`}
                        >
                          <CustomLink href={element?.oSeo?.sSlug || ''} prefetch={false}>
                            <a onClick={() => handleMenu()}>{element?.sName}</a>
                          </CustomLink>
                          <a onClick={() => handleFav(element?.iPageId)}>
                            <CloseIcon />
                          </a>
                        </Button>
                      )
                    })}
                    {favList?.length === 0 && <NoData title={t('common:NoFavouriteData')} />}
                  </div>
                </Tab.Pane>
              </Tab.Content>
            </Tab.Container>
          </div>
          <div className={styles.infoSection}>
            <div className={`${styles.item} ${styles.moreLink} mb-4 mb-lg-5`}>
              <h4 className="text-uppercase mb-3">{t('common:MoreLinks')}</h4>
              <ul className="mb-0 pt-2">
                <li className="mb-2 mb-lg-3">
                  <CustomLink href={allRoutes.aboutUs} prefetch={false}>
                    <a className="ps-2" onClick={() => handleMenu()}>{t('common:AboutUs')}</a>
                  </CustomLink>
                </li>
                <li className="mb-2 mb-lg-3">
                  <CustomLink href={allRoutes.contactUs} prefetch={false}>
                    <a className="ps-2" onClick={() => handleMenu()}>{t('common:ContactUs')}</a>
                  </CustomLink>
                </li>
                <li className="mb-2 mb-lg-3">
                  <CustomLink href={allRoutes.careers} prefetch={false}>
                    <a className="ps-2" onClick={() => handleMenu()}>{t('common:Careers')}</a>
                  </CustomLink>
                </li>
                <li className="mb-2 mb-lg-3">
                  <CustomLink href={allRoutes.advertiseWithUs} prefetch={false}>
                    <a className="ps-2" onClick={() => handleMenu()}>{t('common:AdvertisewithUs')}</a>
                  </CustomLink>
                </li>
                <li className="mb-2 mb-lg-3">
                  <CustomLink href={allRoutes.privacyPolicy} prefetch={false}>
                    <a className="ps-2" onClick={() => handleMenu()}>{t('common:PrivacyPolicy')}</a>
                  </CustomLink>
                </li>
                <li className="mb-2 mb-lg-3">
                  <CustomLink href="/" prefetch={false}>
                    <a className="ps-2" onClick={() => handleMenu()}>{t('common:GDPRCompliance')}</a>
                  </CustomLink>
                </li>
                <li className="mb-2 mb-lg-3">
                  <CustomLink href="/" prefetch={false}>
                    <a className="ps-2" onClick={() => handleMenu()}>{t('common:Affiliate')}</a>
                  </CustomLink>
                </li>
              </ul>
            </div>
            <div className={`${styles.item} mb-4 mb-lg-5`}>
              <h4 className="text-uppercase mb-3"># {t('common:FollowUs')}</h4>
              <ul className={`${styles.socialMenu} d-flex text-uppercase align-items-center mb-0 mx-n1`}>
                <li className="mx-1">
                  <CtToolTip tooltip={t('common:Facebook')}>
                    <a href={FACEBOOK_URL} className="d-block" target="_blank" rel="noreferrer">
                      <FacebookIcon />
                    </a>
                  </CtToolTip>
                </li>
                <li className="mx-1">
                  <CtToolTip tooltip={t('common:Threads')}>
                    <a href={THREADS_URL} className="d-block" target="_blank" rel="noreferrer">
                      <ThreadsIcon />
                    </a>
                  </CtToolTip>
                </li>
                <li className="mx-1">
                  <CtToolTip tooltip={t('common:Twitter')}>
                    <a href={TWITTER_URL} className="d-block" target="_blank" rel="noreferrer">
                      <TwitterIcon />
                    </a>
                  </CtToolTip>
                </li>
                <li className="mx-1">
                  <CtToolTip tooltip={t('common:Instagram')}>
                    <a href={INSTAGRAM_URL} className="d-block" target="_blank" rel="noreferrer">
                      <InstagramIcon />
                    </a>
                  </CtToolTip>
                </li>
                <li className="mx-1">
                  <CtToolTip tooltip={t('common:LinkedIn')}>
                    <a href={LINKEDIN_URL} className="d-block" target="_blank" rel="noreferrer">
                      <LinkedinIcon />
                    </a>
                  </CtToolTip>
                </li>
                <li className="mx-1">
                  <CtToolTip tooltip={t('common:YouTube')}>
                    <a href={YOUTUBE_URL} className="d-block" target="_blank" rel="noreferrer">
                      <YoutubeIcon />
                    </a>
                  </CtToolTip>
                </li>
                <li className="mx-1">
                  <CtToolTip tooltip={t('common:Telegram')}>
                    <a href={TELEGRAM_URL} className="d-block" target="_blank" rel="noreferrer">
                      <TelegramIcon />
                    </a>
                  </CtToolTip>
                </li>
              </ul>
            </div>
            {/* FOR PHASE 2  */}
            {/* <div className={`${styles.item} mb-4 mb-lg-5`}>
              <h4 className="text-uppercase mb-3">{t('common:NewsLetter')}</h4>
              <CustomFormGroup className={`${styles.formGroup}`} controlId="formBasicEmail">
                <CustomInput type="email" placeholder={t('common:Enteremail')} />
                <Button type="submit">{t('common:Subscribe')}</Button>
              </CustomFormGroup>
            </div> */}
            <div className={`${styles.item}`}>
              <h4 className="text-uppercase mb-3">{t('common:OtherSports')}</h4>
              <div className={`${styles.otherLogoContainer} d-flex flex-column`}>
                <div className={`${styles.otherLogo} mb-3`}>
                  <CustomLink href={SPORTSINFO_URL} prefetch={false}>
                    <a target="_blank">
                      <MyImage src={sportsInfo} alt="logo" layout="responsive" />
                    </a>
                  </CustomLink>
                </div>
                <div className={`${styles.crictrackerLogo} mb-3`}>
                  <CustomLink href={CRICTRACKER_HINDI_URL} prefetch={false}>
                    <a target="_blank">
                      <MyImage src={logoHindi} alt="logo" placeholder="blur" layout="responsive" />
                    </a>
                  </CustomLink>
                </div>
                <div className={`${styles.crictrackerLogo}`}>
                  <CustomLink href={CRICTRACKER_BENGALI_URL} prefetch={false}>
                    <a target="_blank">
                      <MyImage src={logoBengali} alt="logo" placeholder="blur" layout="responsive" />
                    </a>
                  </CustomLink>
                </div>
              </div>
            </div>
          </div>
        </Offcanvas.Body>
      </Offcanvas>
    </>
  )
}

HeaderSidebar.propTypes = {
  showMenu: PropTypes.bool,
  handleMenu: PropTypes.func
}

export default HeaderSidebar
