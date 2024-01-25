import React from 'react'
import PropTypes from 'prop-types'
import dynamic from 'next/dynamic'

import styles from './style.module.scss'
import articleStyles from '@shared/components/article/style.module.scss'
import { getImgURL, getDesignation, abbreviateNumber } from '@utils'
import { BLUR_DATA_URL_BASE64 } from '@shared/constants'
import { PencilIcon, EyeIcon } from '../../ctIcons'
import useTranslation from 'next-translate/useTranslation'
import noImage from '@assets/images/placeholder/article-placeholder.jpg'

const MyImage = dynamic(() => import('@shared/components/myImage'))

function AuthorDetailCard({ data }) {
  const { t } = useTranslation()
  return (
    <div className={`${articleStyles.article} light-bg mb-3 d-md-flex position-relative br-lg overflow-hidden c-transition`}>
      <div className={`${articleStyles.postimg} ${styles.postimg} position-relative d-block flex-shrink-0 me-3 br-lg overflow-hidden a-transition`}>
        <MyImage
          src={getImgURL(data?.sUrl) || noImage}
          alt={`Author ${data?.sFName}`}
          placeholder="blur"
          blurDataURL={BLUR_DATA_URL_BASE64}
          layout="fill"
        />
      </div>
      <div className="flex-grow-1 d-sm-flex mt-3 mt-md-0">
        <div className="flex-grow-1 me-sm-3">
          <div className={`${styles.authorInfo}`}>
            <h3 className="big-text mb-1 mb-sm-0 line-clamp-3 overflow-hidden">
              {data?.sFName}
              {data?.bIsVerified && (
                <span className={`${styles.verfied} d-inline-block rounded-circle align-text-top`} />
              )}
            </h3>
            <div className={`${styles.designation} text-muted d-flex flex-column flex-md-row align-items-md-center small-text`}>
              <span className="me-1 me-sm-3">{getDesignation(data.eDesignation)}</span>
              <div className="d-flex align-items-center text-capitalize">
                <PencilIcon width="12" height="12" className="flex-shrink-0 me-1" /> {data?.nArticleCount} {t('common:Posts')}
              </div>
            </div>
          </div>
          <p className="mb-0 mt-2 text-muted">{data?.sBio}</p>
        </div>
        <div className={`${styles.view} flex-shrink-0 d-flex flex-md-column align-items-center text-muted mt-2 mt-md-0`}>
          <div className={`${styles.icon}`}>
            <EyeIcon />
          </div>
          <div className='d-flex d-md-block align-items-center text-center'>
            <h5 className="mb-0 fw-normal">{abbreviateNumber(data?.nViewCount || 0)}</h5>
            <span className="text-uppercase ms-1 ms-md-0">{t('common:Views')}</span>
          </div>
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
