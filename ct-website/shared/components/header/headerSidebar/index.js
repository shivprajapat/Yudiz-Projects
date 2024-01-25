import React, { useContext, useEffect, useState } from 'react'
import Link from 'next/link'
import PropTypes from 'prop-types'
import { Nav, Tab, Button, Offcanvas, Accordion } from 'react-bootstrap'
import { useLazyQuery, useMutation } from '@apollo/client'
import useTranslation from 'next-translate/useTranslation'
import dynamic from 'next/dynamic'

import styles from './style.module.scss'
import { FacebookIcon, InstagramIcon, LinkedinIcon, TelegramIcon, TwitterIcon, YoutubeIcon, CloseIcon } from '@shared-components/ctIcons'
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
  CRICTRACKER_BENGALI_URL
} from '@shared/constants'
import { ToastrContext } from '@shared-components/toastr'
import sportsInfo from '@assets/images/sportsinfo.svg'
import logoHindi from '@assets/images/crictracker-logo-hindi.png'
import logoBengali from '@assets/images/crictracker-logo-bangla.png'
import { GET_FAVOURITE } from '@graphql/category/category.query'
import { DELETE_FAVOURITE } from '@graphql/category/category.mutation'
import iconImg from '@assets/images/icon/trending-icon.svg'
import { GlobalEventsContext } from '@shared/components/global-events'
import { allRoutes } from '@shared/constants/allRoutes'
import { getHeaderSidebarMenu, getToken } from '@shared/libs/menu'

const NoData = dynamic(() => import('@shared/components/noData'), { ssr: false })
const MyImage = dynamic(() => import('@shared/components/myImage'))
function HeaderSidebar({ showMenu, handleMenu }) {
  const { dispatchGlobalEvents: editGlobalEvent } = useContext(GlobalEventsContext)
  const { t } = useTranslation()
  const [favList, setFavList] = useState()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const { dispatch } = useContext(ToastrContext)
  const sliderData = getHeaderSidebarMenu()

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
      <Offcanvas show={showMenu} onHide={handleMenu} placement={'end'} className={styles.sidemenu}>
        <Button variant="link" onClick={handleMenu} className={`${styles.closeMenu} btn-close`}></Button>
        <Offcanvas.Body className={`${styles.menuBody} d-flex flex-column flex-md-row`}>
          <div className={styles.tabSection}>
            <Tab.Container id="left-tabs-example" defaultActiveKey="first">
              <Nav className={`${styles.navTab} equal-width-nav`} variant="pills">
                <Nav.Item>
                  <Nav.Link eventKey="first">{t('common:Topics')}</Nav.Link>
                </Nav.Item>
                {isAuthenticated && (
                  <Nav.Item>
                    <Nav.Link eventKey="second" onClick={() => handleList()}>
                      {t('common:Favorite')}
                    </Nav.Link>
                  </Nav.Item>
                )}
              </Nav>
              <Tab.Content>
                <Tab.Pane eventKey="first">
                  <h4 className="text-uppercase mb-3">{t('common:Topics')}</h4>
                  {sliderData?.map((data, i) => {
                    return (
                      <React.Fragment key={i}>
                        {data.bIsMulti && (
                          <Accordion defaultActiveKey="0">
                            <Accordion.Item eventKey={i - 1}>
                              <Accordion.Header>
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
                                          <Link href={'/' + slide?.sSlug} prefetch={false}>
                                            <a onClick={() => handleMenu()}>{slide?.sName}</a>
                                          </Link>
                                        </Button>
                                      </React.Fragment>
                                    )
                                  })}
                                </Accordion.Body>
                              </>
                            </Accordion.Item>
                          </Accordion>
                        )}
                      </React.Fragment>
                    )
                  })}
                  <div className="btn-list">
                    {sliderData?.map((data, i) => {
                      return (
                        <React.Fragment key={i}>
                          {!data.bIsMulti && (
                            <Button variant="link" className="icon-btn">
                              <Link href={'/' + data?.sSlug} prefetch={false}>
                                <a onClick={() => handleMenu()}>{data?.sName}</a>
                              </Link>
                            </Button>
                          )}
                        </React.Fragment>
                      )
                    })}
                  </div>
                </Tab.Pane>
                <Tab.Pane eventKey="second">
                  <h4 className="text-uppercase mb-3">{t('common:Favorite')}</h4>
                  <div className="btn-list">
                    {favList?.map((element) => {
                      return (
                        <Button
                          key={element?.iPageId}
                          variant="link"
                          className={`${styles.favBtn} icon-btn light-theme-btn d-flex justify-content-between align-items-center text-capitalize`}
                        >
                          <Link href={element?.oSeo?.sSlug || ''} prefetch={false}>
                            <a onClick={() => handleMenu()}>{element?.sName}</a>
                          </Link>
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
            <div className={`${styles.item} ${styles.moreLink}`}>
              <h4 className="text-uppercase mb-3">{t('common:MoreLinks')}</h4>
              <ul className="mb-0">
                <li>
                  <Link href={allRoutes.aboutUs} prefetch={false}>
                    <a onClick={() => handleMenu()}>{t('common:AboutUs')}</a>
                  </Link>
                </li>
                <li>
                  <Link href={allRoutes.contactUs} prefetch={false}>
                    <a onClick={() => handleMenu()}>{t('common:ContactUs')}</a>
                  </Link>
                </li>
                <li>
                  <Link href={allRoutes.careers} prefetch={false}>
                    <a onClick={() => handleMenu()}>{t('common:Careers')}</a>
                  </Link>
                </li>
                <li>
                  <Link href={allRoutes.advertiseWithUs}>
                    <a onClick={() => handleMenu()}>{t('common:AdvertisewithUs')}</a>
                  </Link>
                </li>
                <li>
                  <Link href={allRoutes.privacyPolicy} prefetch={false}>
                    <a onClick={() => handleMenu()}>{t('common:PrivacyPolicy')}</a>
                  </Link>
                </li>
                <li>
                  <Link href="/">
                    <a onClick={() => handleMenu()}>{t('common:GDPRCompliance')}</a>
                  </Link>
                </li>
                <li>
                  <Link href="/">
                    <a onClick={() => handleMenu()}>{t('common:Affiliate')}</a>
                  </Link>
                </li>
              </ul>
            </div>
            <div className={styles.item}>
              <h4 className="text-uppercase mb-3"># {t('common:FollowUs')}</h4>
              <ul className={`${styles.socialMenu} d-flex text-uppercase align-items-center mb-0`}>
                <li>
                  <a href={FACEBOOK_URL} target="_blank" rel="noreferrer">
                    <FacebookIcon />
                  </a>
                </li>
                <li>
                  <a href={TWITTER_URL} target="_blank" rel="noreferrer">
                    <TwitterIcon />
                  </a>
                </li>
                <li>
                  <a href={INSTAGRAM_URL} target="_blank" rel="noreferrer">
                    <InstagramIcon />
                  </a>
                </li>
                <li>
                  <a href={LINKEDIN_URL} target="_blank" rel="noreferrer">
                    <LinkedinIcon />
                  </a>
                </li>
                <li>
                  <a href={YOUTUBE_URL} target="_blank" rel="noreferrer">
                    <YoutubeIcon />
                  </a>
                </li>
                <li>
                  <a href={TELEGRAM_URL} target="_blank" rel="noreferrer">
                    <TelegramIcon />
                  </a>
                </li>
              </ul>
            </div>
            {/* FOR PHASE 2  */}
            {/* <div className={styles.item}>
              <h4 className="text-uppercase mb-3">{t('common:NewsLetter')}</h4>
              <Form.Group className={`${styles.formGroup}`} controlId="formBasicEmail">
                <Form.Control type="email" placeholder={t('common:Enteremail')} />
                <Button type="submit">{t('common:Subscribe')}</Button>
              </Form.Group>
            </div> */}
            <div className={styles.item}>
              <h4 className="text-uppercase mb-3">{t('common:OtherSports')}</h4>
              <div className={`${styles.otherLogoContainer} d-flex flex-column`}>
                <div className={`${styles.otherLogo}`}>
                  <Link href={SPORTSINFO_URL} prefetch={false}>
                    <a target="_blank">
                      <MyImage src={sportsInfo} alt="logo" layout="responsive" />
                    </a>
                  </Link>
                </div>
                <div className={`${styles.crictrackerLogo}`}>
                  <Link href={CRICTRACKER_HINDI_URL} prefetch={false}>
                    <a target="_blank">
                      <MyImage src={logoHindi} alt="logo" placeholder="blur" layout="responsive" />
                    </a>
                  </Link>
                </div>
                <div className={`${styles.crictrackerLogo}`}>
                  <Link href={CRICTRACKER_BENGALI_URL} prefetch={false}>
                    <a target="_blank">
                      <MyImage src={logoBengali} alt="logo" placeholder="blur" layout="responsive" />
                    </a>
                  </Link>
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
