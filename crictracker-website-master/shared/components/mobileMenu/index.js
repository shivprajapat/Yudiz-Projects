import React from 'react'
import PropTypes from 'prop-types'
import { useRouter } from 'next/router'
import useTranslation from 'next-translate/useTranslation'
import { Button } from 'react-bootstrap'

import { HomeIcon, ScheduleIcon, FantasyTipsIcon, CupIcon, MenuIcon } from '@shared-components/ctIcons'
import { allRoutes } from '@shared/constants/allRoutes'
import CustomLink from '../customLink'

const MobileMenu = ({ handleMenuShow, scrollDirection, scrollTrigger }) => {
  const { t } = useTranslation()
  const router = useRouter()
  return (
    <ul className={`${scrollDirection === 'up' ? 'fixed' : 'down'} ${scrollTrigger && 'scrollTrigger'} mobileMenu light-bg d-flex d-md-none text-center text-uppercase font-semi mb-0 vw-100 start-0 bottom-0 position-fixed`}>
      <li className="flex-grow-1 p-1">
        <CustomLink href={allRoutes.home} prefetch={false}>
          <a className={`${router.pathname === allRoutes.home ? 'active' : ''} d-block br-md`}><HomeIcon />{t('common:Home')} </a>
        </CustomLink>
      </li>
      <li className="flex-grow-1 p-1">
        <CustomLink href={allRoutes.fixtures} prefetch={false}>
          <a className={`${router.pathname.includes(allRoutes.fixtures.replaceAll('/', '')) && 'active'} d-block br-md`}><ScheduleIcon />{t('common:Schedule')}</a>
        </CustomLink>
      </li>
      <li className="flex-grow-1 p-1">
        <CustomLink href={allRoutes.fantasyCricketTips} prefetch={false}>
          <a className={`${router.pathname.includes(allRoutes.fantasyCricketTips.replaceAll('/', '')) && 'active'} d-block br-md`}><FantasyTipsIcon />{t('common:FantasyTips')}</a>
        </CustomLink>
      </li>
      <li className="flex-grow-1 p-1">
        <CustomLink href={allRoutes.cricketSeries} prefetch={false}>
          <a className={`${router.pathname.includes(allRoutes.cricketSeries.replaceAll('/', '')) && 'active'} d-block br-md`}><CupIcon />{t('common:Series')}</a>
        </CustomLink>
      </li>
      <li className="flex-grow-1 p-1">
        <Button variant="link" title={t('common:More')} className="w-100 d-block br-md" onClick={handleMenuShow}>
          <MenuIcon />{t('common:More')}
        </Button>
      </li>
    </ul>
  )
}

MobileMenu.propTypes = {
  handleMenuShow: PropTypes.func,
  scrollDirection: PropTypes.string,
  scrollTrigger: PropTypes.bool
}

export default MobileMenu
