import React from 'react'
import PropTypes from 'prop-types'
import useTranslation from 'next-translate/useTranslation'
import { useRouter } from 'next/router'

import styles from './style.module.scss'
import { allRoutes } from '@shared/constants/allRoutes'
import CustomLink from '@shared/components/customLink'

const ProfileNav = ({ articleCount }) => {
  const { t } = useTranslation()
  const router = useRouter()
  return (
    <div className={`${styles.desc}`}>
      <div
        className={`${styles.navList} mt-3 d-flex justify-content-center flex-sm-column align-items-center align-items-sm-stretch text-nowrap scroll-list`}
      >
        <CustomLink href={allRoutes.profile} prefetch={false}>
          <a
            className={`d-flex justify-content-between text-uppercase xsmall-text fw-bold br-sm py-1 px-2 mx-1 ms-md-0 mb-md-2 ${
              (router.asPath === allRoutes.profile || router.asPath === allRoutes.profileEdit) ? 'bg-info' : ''
            }`}
          >
            {t('common:Profile')}
          </a>
        </CustomLink>
        {/* <CustomLink href="/profile/">
          <a className="d-flex justify-content-between text-uppercase xsmall-text fw-bold">
            {t('common:Following')} <span>(3)</span>
          </a>
        </Link>
        <CustomLink href="/profile/">
          <a className="d-flex justify-content-between text-uppercase xsmall-text fw-bold">
            {t('common:Followers')} <span>(3)</span>
          </a>
        </Link> */}
        <CustomLink href={allRoutes.saveForLater} prefetch={false}>
          <a
            className={`d-flex justify-content-between text-uppercase xsmall-text fw-bold br-sm py-1 px-2 mx-1 ms-md-0 mb-md-2 ${
              router.asPath === allRoutes.saveForLater ? 'bg-info' : ''
            }`}
          >
            {t('common:SavedForLater')} <span>({articleCount || 0})</span>
          </a>
        </CustomLink>
      </div>
    </div>
  )
}

ProfileNav.propTypes = {
  articleCount: PropTypes.number
}

export default ProfileNav
