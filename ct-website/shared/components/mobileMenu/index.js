import React from 'react'
import PropTypes from 'prop-types'
import Link from 'next/link'
import { useRouter } from 'next/router'
import useTranslation from 'next-translate/useTranslation'

import styles from './style.module.scss'
import { HomeIcon, ScheduleIcon, FantasyTipsIcon, CupIcon, MenuIcon } from '@shared-components/ctIcons'
import { allRoutes } from '@shared/constants/allRoutes'

const MobileMenu = ({ handleMenuShow }) => {
  const { t } = useTranslation()
  const router = useRouter()
  return (
    <ul className={`${styles.mobileMenu} d-flex d-md-none text-center text-uppercase font-semi mb-0`}>
      <li>
        <Link href={allRoutes.home} prefetch={false}>
          <a className={`${router.pathname === allRoutes.home ? styles.active : ''}`}><HomeIcon />{t('common:Home')} </a>
        </Link>
      </li>
      <li>
        <Link href={allRoutes.fixtures} prefetch={false}>
          <a className={`${router.pathname.includes(allRoutes.fixtures.replaceAll('/', '')) && styles.active}`}><ScheduleIcon />{t('common:Schedule')}</a>
        </Link>
      </li>
      <li>
        <Link href={allRoutes.fantasyCricketTips} prefetch={false}>
          <a className={`${router.pathname.includes(allRoutes.fantasyCricketTips.replaceAll('/', '')) && styles.active}`}><FantasyTipsIcon />{t('common:FantasyTips')}</a>
        </Link>
      </li>
      <li>
        <Link href={allRoutes.cricketSeries} prefetch={false}>
          <a className={`${router.pathname.includes(allRoutes.cricketSeries.replaceAll('/', '')) && styles.active}`}><CupIcon />{t('common:Series')}</a>
        </Link>
      </li>
      <li>
        <Link href="/">
          <a onClick={(e) => handleMenuShow(e)}><MenuIcon />{t('common:More')}</a>
        </Link>
      </li>
    </ul>
  )
}

MobileMenu.propTypes = {
  handleMenuShow: PropTypes.func
}

export default MobileMenu
