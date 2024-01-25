import React from 'react'
import useTranslation from 'next-translate/useTranslation'
import { Container, Row, Col } from 'react-bootstrap'
import Link from 'next/link'
import { useRouter } from 'next/router'
import dynamic from 'next/dynamic'

import styles from './style.module.scss'
import { FACEBOOK_URL, TELEGRAM_URL, LINKEDIN_URL, INSTAGRAM_URL, TWITTER_URL, YOUTUBE_URL } from '@shared/constants'
import logo from '@assets/images/logo.svg'
import facebookIcon from '@assets/images/icon/facekbook-icon.svg'
import instagramIcon from '@assets/images/icon/instagram-icon.svg'
import linkedinIcon from '@assets/images/icon/linkedin-icon.svg'
import telegramIcon from '@assets/images/icon/telegram-icon.svg'
import twitterIcon from '@assets/images/icon/twitter-icon.svg'
import youtubeIcon from '@assets/images/icon/youtube-icon.svg'
// import appStore from '@assets/images/app-store.svg'
// import googlePlay from '@assets/images/google-play.svg'
// import { getFooterMenu } from '../../libs/menu'
import { allRoutes } from '@shared/constants/allRoutes'
// import { FOOTER_MENU } from '@graphql/common/common.query'
// import { useQuery } from '@apollo/client'
import { getFooterMenu } from '@shared/libs/menu'

const MyImage = dynamic(() => import('@shared/components/myImage'))

function Footer() {
  const router = useRouter()
  const { t } = useTranslation()
  // const { data } = useQuery(FOOTER_MENU)
  const menu = getFooterMenu()
  return (
    <footer className={`${styles.siteFooter}`} id="footer">
      <Container>
        <Row className={`text-center ${styles.footerInner}`}>
          {menu?.map((m, i) => {
            return (
              <Col key={i + m?.eType} xs={6} md={3}>
                <div className={`${styles.widgetTitle}`}>
                  <h4>{m?.eType.replace('_', ' ')}</h4>
                </div>
                <ul className="mb-0">
                  {m?.aResults?.map((c, index) => {
                    return (
                      <li key={index}>
                        <Link href={c?.sUrl?.charAt(0) === '/' ? c?.sUrl : '/' + c?.sUrl} prefetch={false}>
                          <a className={router.pathname === '/' + c?.sUrl ? styles.active : ''}>{c?.sTitle}</a>
                        </Link>
                      </li>
                    )
                  })}
                </ul>
              </Col>
            )
          })}
        </Row>
        <div className={`${styles.footerBottom}`}>
          <div className={`${styles.logoBlock} d-flex flex-column flex-md-row text-nowrap justify-content-between`}>
            <div className="text-center text-md-start">
              <div className={`${styles.footerLogo} d-inline-block mb-2`}>
                <MyImage src={logo} alt="logo" layout="responsive" />
              </div>
              {/* <div className={`${styles.downloadApp} d-flex justify-content-center justify-md-content-between`}>
                <Link href={'/href'} passHref>
                  <a>
                    <MyImage src={appStore} alt="logo" />
                  </a>
                </Link>
                <Link href={'/href'} passHref>
                  <a>
                    <MyImage src={googlePlay} alt="logo" />
                  </a>
                </Link>
              </div> */}
            </div>
            <div>
              <ul
                className={`${styles.quickLink} d-flex flex-wrap flex-md-nowrap justify-content-center justify-md-content-end text-uppercase align-items-center mb-0`}
              >
                <li>
                  <Link href={allRoutes.aboutUs} prefetch={false}>{t('common:About')}</Link>
                </li>
                <li>
                  <Link href={allRoutes.contactUs} prefetch={false}>{t('common:Contact')}</Link>
                </li>
                <li>
                  <Link href={allRoutes.feedback} prefetch={false}>{t('common:Feedback')}</Link>
                </li>
                <li>
                  <Link href={allRoutes.careers} prefetch={false}>
                    <a>{t('common:Careers')}</a>
                  </Link>
                </li>
                <li>
                  <Link href={allRoutes.advertiseWithUs}>{t('common:AdvertisewithUs')}</Link>
                </li>
                <li>
                  <Link href={allRoutes.writeForUs} prefetch={false}>{t('common:WriteforUs')}</Link>
                </li>
                <li>
                  <Link href={allRoutes.dmca} prefetch={false}>{t('common:DMCA')}</Link>
                </li>
                <li>
                  <Link href={allRoutes.disclaimer} prefetch={false}>{t('common:Disclaimer')}</Link>
                </li>
              </ul>
              <ul className={`${styles.socialMenu} d-none d-md-flex text-uppercase align-items-center`}>
                <li>
                  <a href={FACEBOOK_URL} target="_blank" rel="noreferrer">
                    <MyImage src={facebookIcon} alt="facebook" layout="responsive" />
                  </a>
                </li>
                <li>
                  <a href={TWITTER_URL} target="_blank" rel="noreferrer">
                    <MyImage src={twitterIcon} alt="twitter" layout="responsive" />
                  </a>
                </li>
                <li>
                  <a href={INSTAGRAM_URL} target="_blank" rel="noreferrer">
                    <MyImage src={instagramIcon} alt="instagram" layout="responsive" />
                  </a>
                </li>
                <li>
                  <a href={LINKEDIN_URL} target="_blank" rel="noreferrer">
                    <MyImage src={linkedinIcon} alt="linkedin" layout="responsive" />
                  </a>
                </li>
                <li>
                  <a href={YOUTUBE_URL} target="_blank" rel="noreferrer">
                    <MyImage src={youtubeIcon} alt="youtube" layout="responsive" />
                  </a>
                </li>
                <li>
                  <a href={TELEGRAM_URL} target="_blank" rel="noreferrer">
                    <MyImage src={telegramIcon} alt="telegram" layout="responsive" />
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className={`${styles.copyright} d-flex flex-column-reverse flex-md-row justify-content-between align-items-center`}>
            <p className="mb-0">
              © 2013 - {new Date().getFullYear()} {t('common:Allrightsreserved')}.
            </p>
            <ul className="d-flex align-items-center justify-content-between justify-md-content-end mb-0">
              <li>
                <Link href={allRoutes.termsAndConditions} prefetch={false}>
                  <a>{t('common:TermsandConditions')}</a>
                </Link>
              </li>
              <li>
                <Link href={allRoutes.privacyPolicy} prefetch={false}>{t('common:PrivacyPolicy')}</Link>
              </li>
              <li>
                <Link href={allRoutes.copyrightsNotice} prefetch={false}>{t('common:CopyrightsNotice')}</Link>
              </li>
            </ul>
          </div>
        </div>
      </Container>
    </footer>
  )
}
export default Footer
