import React, { useEffect, useState } from 'react'
import useTranslation from 'next-translate/useTranslation'
import { useRouter } from 'next/router'
import { Button } from 'react-bootstrap'
import dynamic from 'next/dynamic'

import styles from './style.module.scss'
import { FACEBOOK_URL, TELEGRAM_URL, LINKEDIN_URL, INSTAGRAM_URL, TWITTER_URL, YOUTUBE_URL, APP_STORE_URL, PLAY_STORE_URL, THREADS_URL } from '@shared/constants'
import logo from '@assets/images/logo.png'
import facebookIcon from '@assets/images/icon/facekbook-icon.svg'
import instagramIcon from '@assets/images/icon/instagram-icon.svg'
import linkedinIcon from '@assets/images/icon/linkedin-icon.svg'
import telegramIcon from '@assets/images/icon/telegram-icon.svg'
import twitterIcon from '@assets/images/icon/twitter-icon.svg'
import threadsIcon from '@assets/images/icon/threads-icon.svg'
import youtubeIcon from '@assets/images/icon/youtube-icon.svg'
import appStore from '@assets/images/app-store.svg'
import googlePlay from '@assets/images/google-play.svg'
// import { getFooterMenu } from '../../libs/menu'
import { allRoutes } from '@shared/constants/allRoutes'
// import { FOOTER_MENU } from '@graphql/common/common.query'
// import { useQuery } from '@apollo/client'
import { getFooterMenu } from '@shared/libs/menu'
import { ArrowUpIcon } from '@shared/components/ctIcons'

const MyImage = dynamic(() => import('@shared/components/myImage'))
const CustomLink = dynamic(() => import('@shared/components/customLink'))
const CtToolTip = dynamic(() => import('@shared/components/ctToolTip'))

function Footer() {
  const router = useRouter()
  const { t } = useTranslation()
  // const { data } = useQuery(FOOTER_MENU)
  const menu = getFooterMenu()
  const [visible, setVisible] = useState(false)
  const toggleVisible = () => {
    const scrolled = document.documentElement.scrollTop
    if (scrolled > 120) {
      setVisible(true)
    } else if (scrolled <= 300) {
      setVisible(false)
    }
  }
  function handleClick() {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }
  useEffect(() => {
    if (window !== undefined) {
      window.addEventListener('scroll', toggleVisible)
    }
  }, [])
  return (
    <footer className={`${styles.siteFooter} pb-4 py-md-4`} id="footer">
      <div className="container mt-md-2">
        <div className={`row text-center ${styles.footerInner}`}>
          {menu?.map((m, i) => {
            return (
              <div className="col-md-3 col-6" key={i + m?.eType}>
                <div className={`${styles.widgetTitle} position-relative mb-3 mt-4 mt-md-0 pt-2 pt-md-0`}>
                  <h4 className="px-md-2 m-0 text-uppercase d-inline-block position-relative">{m?.eType.replace('_', ' ')}</h4>
                </div>
                <ul className="mb-0">
                  {m?.aResults?.map((c, index) => {
                    return (
                      <li key={index}>
                        <CustomLink href={c?.sUrl?.charAt(0) === '/' ? c?.sUrl : '/' + c?.sUrl} prefetch={false}>
                          <a className={router.pathname === '/' + c?.sUrl ? styles.active : ''}>{c?.sTitle}</a>
                        </CustomLink>
                      </li>
                    )
                  })}
                </ul>
              </div>
            )
          })}
        </div>
        <div className={`${styles.footerBottom}`}>
          <div className={`${styles.logoBlock} d-flex flex-column flex-md-row text-nowrap justify-content-between`}>
            <div className="text-center text-md-start">
              <div className={`${styles.footerLogo} d-inline-block mb-2`}>
                <MyImage src={logo} alt="logo" layout="responsive" />
              </div>
              <div className={`${styles.downloadApp} d-flex justify-content-center justify-md-content-between`}>
                <CustomLink href={APP_STORE_URL} passHref>
                  <a className="d-block">
                    <MyImage src={appStore} alt="logo" />
                  </a>
                </CustomLink>
                <CustomLink href={PLAY_STORE_URL} passHref>
                  <a className="d-block">
                    <MyImage src={googlePlay} alt="logo" />
                  </a>
                </CustomLink>
              </div>
            </div>
            <div>
              <ul
                className={`${styles.quickLink} d-flex flex-wrap flex-md-nowrap justify-content-center justify-md-content-end text-uppercase align-items-center mb-0`}
              >
                <li>
                  <CustomLink href={allRoutes.aboutUs} prefetch={false}><a>{t('common:About')}</a></CustomLink>
                </li>
                <li>
                  <CustomLink href={allRoutes.contactUs} prefetch={false}><a>{t('common:Contact')}</a></CustomLink>
                </li>
                <li>
                  <CustomLink href={allRoutes.feedback} prefetch={false}><a>{t('common:Feedback')}</a></CustomLink>
                </li>
                <li>
                  <CustomLink href={allRoutes.careers} prefetch={false}>
                    <a>{t('common:Careers')}</a>
                  </CustomLink>
                </li>
                <li>
                  <CustomLink href={allRoutes.advertiseWithUs}><a>{t('common:AdvertisewithUs')}</a></CustomLink>
                </li>
                <li>
                  <CustomLink href={allRoutes.writeForUs} prefetch={false}><a>{t('common:WriteforUs')}</a></CustomLink>
                </li>
                <li>
                  <CustomLink href={allRoutes.dmca} prefetch={false}><a>{t('common:DMCA')}</a></CustomLink>
                </li>
                <li>
                  <CustomLink href={allRoutes.disclaimer} prefetch={false}><a>{t('common:Disclaimer')}</a></CustomLink>
                </li>
              </ul>
              <ul className={`${styles.socialMenu} d-none d-md-flex text-uppercase align-items-center justify-content-end`}>
                <li className="mt-lg-2">
                  <CtToolTip tooltip={t('common:Facebook')}>
                    <a href={FACEBOOK_URL} target="_blank" rel="noreferrer" className="d-block">
                      <MyImage src={facebookIcon} alt="facebook" layout="responsive" />
                    </a>
                  </CtToolTip>
                </li>
                <li className="mt-lg-2">
                  <CtToolTip tooltip={t('common:Twitter')}>
                    <a href={TWITTER_URL} target="_blank" rel="noreferrer" className="d-block">
                      <MyImage src={twitterIcon} alt="twitter" layout="responsive" />
                    </a>
                  </CtToolTip>
                </li>
                <li className="mt-lg-2">
                  <CtToolTip tooltip={t('common:Instagram')}>
                    <a href={INSTAGRAM_URL} target="_blank" rel="noreferrer" className="d-block">
                      <MyImage src={instagramIcon} alt="instagram" layout="responsive" />
                    </a>
                  </CtToolTip>
                </li>
                <li className="mt-lg-2">
                  <CtToolTip tooltip={t('common:Threads')}>
                    <a href={THREADS_URL} target="_blank" rel="noreferrer" className="d-block">
                      <MyImage src={threadsIcon} alt="threads" layout="responsive" />
                    </a>
                  </CtToolTip>
                </li>
                <li className="mt-lg-2">
                  <CtToolTip tooltip={t('common:LinkedIn')}>
                    <a href={LINKEDIN_URL} target="_blank" rel="noreferrer" className="d-block">
                      <MyImage src={linkedinIcon} alt="linkedin" layout="responsive" />
                    </a>
                  </CtToolTip>
                </li>
                <li className="mt-lg-2">
                  <CtToolTip tooltip={t('common:YouTube')}>
                    <a href={YOUTUBE_URL} target="_blank" rel="noreferrer" className="d-block">
                      <MyImage src={youtubeIcon} alt="youtube" layout="responsive" />
                    </a>
                  </CtToolTip>
                </li>
                <li className="mt-lg-2">
                  <CtToolTip tooltip={t('common:Telegram')}>
                    <a href={TELEGRAM_URL} target="_blank" rel="noreferrer" className="d-block">
                      <MyImage src={telegramIcon} alt="telegram" layout="responsive" />
                    </a>
                  </CtToolTip>
                </li>
              </ul>
            </div>
          </div>
          <div className={`${styles.copyright} pt-3 mt-3 pt-md-0 mt-md-0 d-flex flex-column-reverse flex-md-row text-center text-md-start justify-content-between align-items-center`}>
            <p className="mb-1 mt-2 mt-md-0 mb-md-0">
              © 2013 - {new Date().getFullYear()} {t('common:Allrightsreserved')}.
            </p>
            <ul className="d-flex align-items-center justify-content-between justify-md-content-end mb-0">
              <li className="ms-md-3 ps-md-1">
                <CustomLink href={allRoutes.termsAndConditions} prefetch={false}>
                  <a>{t('common:TermsandConditions')}</a>
                </CustomLink>
              </li>
              <li className="ms-md-3 ps-md-1">
                <CustomLink href={allRoutes.privacyPolicy} prefetch={false}><a>{t('common:PrivacyPolicy')}</a></CustomLink>
              </li>
              <li className="ms-md-3 ps-md-1">
                <CustomLink href={allRoutes.copyrightsNotice} prefetch={false}><a>{t('common:CopyrightsNotice')}</a></CustomLink>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <Button onClick={() => handleClick()} variant="link" className={`${styles.scrollTop} ${visible ? 'd-inline-flex' : 'd-none'} light-bg d-block position-fixed rounded-circle align-items-center justify-content-center c-transition`}>
        <ArrowUpIcon />
      </Button>
    </footer>
  )
}
export default Footer
