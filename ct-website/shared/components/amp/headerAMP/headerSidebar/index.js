import React, { useContext, useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import PropTypes from 'prop-types'
import { Nav, Tab, Button, Form, Offcanvas, Accordion } from 'react-bootstrap'
import { useLazyQuery, useMutation } from '@apollo/client'
import useTranslation from 'next-translate/useTranslation'
import dynamic from 'next/dynamic'

import styles from './style.module.scss'
import {
  FacebookIcon,
  InstagramIcon,
  LinkedinIcon,
  TelegramIcon,
  TwitterIcon,
  YoutubeIcon,
  FeaturedIcon,
  StatsIcon,
  FantasyTipsIcon,
  CupIcon,
  CloseIcon
} from '@shared-components/ctIcons'
import { TOAST_TYPE, FACEBOOK_URL, TELEGRAM_URL, LINKEDIN_URL, INSTAGRAM_URL, TWITTER_URL, YOUTUBE_URL } from '@shared/constants'
import { ToastrContext } from '@shared-components/toastr'
import sportsInfo from '@assets/images/sportsinfo.svg'
import { GET_FAVOURITE } from '@graphql/category/category.query'
import { DELETE_FAVOURITE } from '@graphql/category/category.mutation'
import { allRoutes } from '@shared/constants/allRoutes'
const NoData = dynamic(() => import('@shared/components/noData'), { ssr: false })

function HeaderSidebar(props) {
  const { t } = useTranslation()
  const [favList, setFavList] = useState()
  const { dispatch } = useContext(ToastrContext)
  const [getFavourite, { data: favouriteData }] = useLazyQuery(GET_FAVOURITE)

  useEffect(() => {
    favouriteData && setFavList(favouriteData?.listFavourite?.aResults)
  }, [favouriteData])

  const handleList = () => {
    getFavourite({ variables: { input: { nLimit: 10, nSkip: 0 } } })
  }

  const [deleteFavourite] = useMutation(DELETE_FAVOURITE, {
    onCompleted: (data) => {
      if (data && data.deleteFavourite !== null) {
        dispatch({
          type: 'SHOW_TOAST',
          payload: { message: data.deleteFavourite.sMessage, type: TOAST_TYPE.Success }
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
      <Offcanvas show={props.showMenu} onHide={props.handleMenu} placement={'end'} className={styles.sidemenu}>
        <Button variant="link" onClick={props.handleMenu} className={`${styles.closeMenu} btn-close`}></Button>
        <Offcanvas.Body className={`${styles.menuBody} d-flex flex-column flex-md-row`}>
          <div className={styles.tabSection}>
            <Tab.Container id="left-tabs-example" defaultActiveKey="first">
              <Nav className={`${styles.navTab} equal-width-nav`} variant="pills">
                <Nav.Item>
                  <Nav.Link eventKey="first">{t('common:Topics')}</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="second" onClick={() => handleList()}>
                    {t('common:Favorite')}
                  </Nav.Link>
                </Nav.Item>
              </Nav>
              <Tab.Content>
                <Tab.Pane eventKey="first">
                  <h4 className="text-uppercase">{t('common:Topics')}</h4>
                  <Accordion defaultActiveKey="0">
                    <Accordion.Item eventKey="0">
                      <Accordion.Header>
                        <span className="icon d-flex align-items-center justify-content-center">
                          <FeaturedIcon />
                        </span>{' '}
                        Featured
                      </Accordion.Header>
                      <Accordion.Body>
                        <Button variant="link" className="icon-btn star-btn">
                          India
                        </Button>
                        <Button variant="link" className="icon-btn star-btn">
                          New Zealand
                        </Button>
                        <Button variant="link" className="icon-btn star-btn">
                          New Zealand
                        </Button>
                      </Accordion.Body>
                    </Accordion.Item>
                    <Accordion.Item eventKey="1">
                      <Accordion.Header>
                        <span className="icon d-flex align-items-center justify-content-center">
                          <StatsIcon />
                        </span>{' '}
                        Cricket Stats
                      </Accordion.Header>
                      <Accordion.Body>
                        <Button variant="link" className="icon-btn star-btn">
                          India
                        </Button>
                        <Button variant="link" className="icon-btn star-btn">
                          New Zealand
                        </Button>
                        <Button variant="link" className="icon-btn star-btn">
                          New Zealand
                        </Button>
                      </Accordion.Body>
                    </Accordion.Item>
                    <Accordion.Item eventKey="2">
                      <Accordion.Header>
                        <span className="icon d-flex align-items-center justify-content-center">
                          <FantasyTipsIcon />
                        </span>{' '}
                        Cricket Fantasy Tips
                      </Accordion.Header>
                      <Accordion.Body>
                        <Button variant="link" className="icon-btn star-btn">
                          India
                        </Button>
                        <Button variant="link" className="icon-btn star-btn">
                          New Zealand
                        </Button>
                        <Button variant="link" className="icon-btn star-btn">
                          New Zealand
                        </Button>
                      </Accordion.Body>
                    </Accordion.Item>
                    <Accordion.Item eventKey="3">
                      <Accordion.Header>
                        <span className="icon d-flex align-items-center justify-content-center">
                          <CupIcon />
                        </span>{' '}
                        Current Series
                      </Accordion.Header>
                      <Accordion.Body>
                        <Button variant="link" className="icon-btn star-btn">
                          India
                        </Button>
                        <Button variant="link" className="icon-btn star-btn">
                          New Zealand
                        </Button>
                        <Button variant="link" className="icon-btn star-btn">
                          New Zealand
                        </Button>
                      </Accordion.Body>
                    </Accordion.Item>
                  </Accordion>
                  <div className="btn-list">
                    <Button variant="link" className="icon-btn arrow-btn">
                      T20
                    </Button>
                    <Button variant="link" className="icon-btn arrow-btn">
                      IPL Teams
                    </Button>
                    <Button variant="link" className="icon-btn arrow-btn">
                      BPL Teams
                    </Button>
                    <Button variant="link" className="icon-btn arrow-btn">
                      Cricket Humour
                    </Button>
                    <Button variant="link" className="icon-btn star-btn">
                      Interviews
                    </Button>
                    <Button variant="link" className="icon-btn star-btn">
                      Editor’s Pick
                    </Button>
                    <Button variant="link" className="icon-btn star-btn">
                      Twitter Reactions
                    </Button>
                    <Button variant="link" className="icon-btn star-btn">
                      Twitter Reactions
                    </Button>
                  </div>
                </Tab.Pane>
                <Tab.Pane eventKey="second">
                  <h4 className="text-uppercase">{t('common:Favorite')}</h4>
                  <div className="btn-list">
                    {favList?.map((element) => {
                      return (
                        <Button
                          key={element?.iPageId}
                          variant="link"
                          className={`${styles.favBtn} icon-btn light-theme-btn d-flex justify-content-between align-items-center text-capitalize`}
                        >
                          <Link href={element?.oSeo?.sSlug || ''} prefetch={false}>{element?.sName}</Link>
                          <a onClick={() => handleFav(element?.iPageId)}>
                            <CloseIcon />
                          </a>
                        </Button>
                      )
                    })}
                    {favList?.length === 0 && <NoData />}
                  </div>
                </Tab.Pane>
              </Tab.Content>
            </Tab.Container>
          </div>
          <div className={styles.infoSection}>
            <div className={`${styles.item} ${styles.moreLink}`}>
              <h4 className="text-uppercase">{t('common:MoreLinks')}</h4>
              <ul className="mb-0">
                <li>
                  <Link href={allRoutes.aboutUs} prefetch={false}>{t('common:AboutUs')}</Link>
                </li>
                <li>
                  <Link href={allRoutes.contactUs} prefetch={false}>{t('common:ContactUs')}</Link>
                </li>
                <li>
                  <Link href={allRoutes.privacyPolicy} prefetch={false}>{t('common:PrivacyPolicy')}</Link>
                </li>
                <li>
                  <Link href="/">{t('common:GDPRCompliance')}</Link>
                </li>
                <li>
                  <Link href="/">{t('common:Affiliate')}</Link>
                </li>
              </ul>
            </div>
            <div className={styles.item}>
              <h4 className="text-uppercase"># {t('common:FollowUs')}</h4>
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
            <div className={styles.item}>
              <h4 className="text-uppercase">{t('common:NewsLetter')}</h4>
              <Form.Group className={`${styles.formGroup}`} controlId="formBasicEmail">
                <Form.Control type="email" placeholder={t('common:Enteremail')} />
                <Button type="submit">{t('common:Subscribe')}</Button>
              </Form.Group>
            </div>
            <div className={styles.item}>
              <h4 className="text-uppercase">{t('common:OtherSports')}</h4>
              <div className={`${styles.otherLogo}`}>
                <Image src={sportsInfo} alt="logo" layout="responsive" />
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
