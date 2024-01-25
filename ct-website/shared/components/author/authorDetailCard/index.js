import React from 'react'
import PropTypes from 'prop-types'
import dynamic from 'next/dynamic'

import styles from './style.module.scss'
import articleStyles from '@shared/components/article/style.module.scss'
import { getImgURL, getDesignation, abbreviateNumber } from '@utils'
import { BLUR_DATA_URL } from '@shared/constants'
import { PencilIcon, EyeIcon } from '../../ctIcons'
import useTranslation from 'next-translate/useTranslation'
import noImage from '@assets/images/placeholder/person-placeholder.jpg'

const MyImage = dynamic(() => import('@shared/components/myImage'))

function AuthorDetailCard({ data }) {
  const { t } = useTranslation()
  return (
    <div className={`${articleStyles.article} mb-3 d-flex`}>
      <div className={`${articleStyles.postimg} ${styles.postimg} d-block block-img flex-shrink-0 me-3`}>
        <MyImage
          src={getImgURL(data?.sUrl) || noImage}
          alt={`Author ${data?.sFName}`}
          placeholder="blur"
          blurDataURL={BLUR_DATA_URL}
          layout="fill"
        />
      </div>
      <div className="flex-grow-1 d-flex">
        <div className="flex-grow-1 me-3">
          <h3 className="big-text mb-0">
            {data?.sFName}
            {data?.bIsVerified && (
              <span className={`${styles.verfied} d-inline-block rounded-circle align-text-top`} />
            )}
          </h3>
          <div className="text-muted">
            <span className="xsmall-text mb-2 d-block">{getDesignation(data.eDesignation)}</span>
            <div className="text-capitalize">
              <PencilIcon width="20" height="20" className="flex-shrink-0 me-1" /> {data?.nArticleCount} {t('common:Posts')}
            </div>
            <p className="mb-0">{data?.sBio}</p>
          </div>
        </div>
        <div className="flex-shrink-0 d-flex flex-column align-items-center text-muted">
          <EyeIcon width="45" height="45" />
          <span className="h5 mb-0 fw-normal">{abbreviateNumber(data?.nViewCount || 0)}</span>
          <span className="text-uppercase">{t('common:Views')}</span>
        </div>
      </div>
    </div>
  )
}

AuthorDetailCard.propTypes = {
  data: PropTypes.object
}

AuthorDetailCard.defaultProps = {
  data: {}
}

export default AuthorDetailCard
