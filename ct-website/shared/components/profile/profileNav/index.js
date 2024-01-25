import React from 'react'
import Link from 'next/link'
import PropTypes from 'prop-types'
import useTranslation from 'next-translate/useTranslation'
import { useRouter } from 'next/router'

import styles from './style.module.scss'
import { allRoutes } from '@shared/constants/allRoutes'

const ProfileNav = ({ articleCount }) => {
  const { t } = useTranslation()
  const router = useRouter()
  return (
    <div className={`${styles.desc}`}>
      <div
        className={`${styles.navList} mt-2 mt-sm-3 d-flex flex-sm-column align-items-center align-items-sm-stretch text-nowrap scroll-list`}
      >
        <Link href={allRoutes.profile} prefetch={false}>
          <a
            className={`d-flex justify-content-between text-uppercase xsmall-text font-bold ${
              (router.asPath === allRoutes.profile || router.asPath === allRoutes.profileEdit) ? 'bg-info' : ''
            }`}
          >
            {t('common:Profile')}
          </a>
        </Link>
        {/* <Link href="/profile/">
          <a className="d-flex justify-content-between text-uppercase xsmall-text font-bold">
            {t('common:Following')} <span>(3)</span>
          </a>
        </Link>
        <Link href="/profile/">
          <a className="d-flex justify-content-between text-uppercase xsmall-text font-bold">
            {t('common:Followers')} <span>(3)</span>
          </a>
        </Link> */}
        <Link href={allRoutes.saveForLater} prefetch={false}>
          <a
            className={`d-flex justify-content-between text-uppercase xsmall-text font-bold ${
              router.asPath === allRoutes.saveForLater ? 'bg-info' : ''
            }`}
          >
            {t('common:SavedForLater')} <span>({articleCount || 0})</span>
          </a>
        </Link>
      </div>
    </div>
  )
}

ProfileNav.propTypes = {
  articleCount: PropTypes.number
}

export default ProfileNav
