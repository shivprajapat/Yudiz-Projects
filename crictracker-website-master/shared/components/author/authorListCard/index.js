import React from 'react'
import PropTypes from 'prop-types'
import { Row, Col } from 'react-bootstrap'
import dynamic from 'next/dynamic'
import useTranslation from 'next-translate/useTranslation'

import { BLUR_DATA_URL_BASE64 } from '@shared/constants'
import { getImgURL, getDesignation, getStringJoinByDash, abbreviateNumber } from '@utils'
import { PencilIcon, EyeIcon } from '../../ctIcons'
import noImage from '@assets/images/placeholder/person-placeholder.jpg'
import styles from './style.module.scss'
import articleStyles from '@shared/components/article/style.module.scss'
import { allRoutes } from '@shared/constants/allRoutes'
import CustomLink from '@shared/components/customLink'

const MyImage = dynamic(() => import('@shared/components/myImage'))
// const CtToolTip = dynamic(() => import('@shared/components/checkMobileView'))

function AuthorDetailLink({ slug, children, className }) {
  return (
    <CustomLink href={slug} prefetch={false}>
      <a className={`${className} text-nowrap overflow-hidden t-ellipsis`}>{children}</a>
    </CustomLink>
  )
}

AuthorDetailLink.propTypes = {
  slug: PropTypes.string,
  children: PropTypes.node,
  className: PropTypes.string
}

function AuthorListCard({ data }) {
  const { t } = useTranslation()
  const authorListItemID = data?.oSeo?.sSlug || getStringJoinByDash(data?.sFName)
  return (
    <article id={authorListItemID} className={`${articleStyles.article} light-bg mb-3 br-md c-transition`}>
      <Row className="gx-2 gx-md-3 flex-nowrap">
        <Col xs="auto">
          <AuthorDetailLink slug={allRoutes.authorDetail(data?.oSeo?.sSlug)} className={`${articleStyles.postimg} ${styles.postimg} d-block position-relative br-md overflow-hidden a-transition`}>
            <MyImage
              src={getImgURL(data?.sUrl) || noImage}
              alt={`Author ${data?.sFName}`}
              placeholder="blur"
              blurDataURL={BLUR_DATA_URL_BASE64}
              layout="fill"
            />
          </AuthorDetailLink>
        </Col>
        <Col xs="auto" className={`${styles.descBlock} d-flex flex-column flex-grow-1`}>
          <div className="flex-grow-1">
            <h2 className={`big-text mb-0 text-capitalize d-flex align-items-center ${styles.authorTitle}`}>
              <AuthorDetailLink slug={allRoutes.authorDetail(data?.oSeo?.sSlug)}>
                {data?.sFName}
              </AuthorDetailLink>
              {data?.bIsVerified && (
                // <CtToolTip tooltip="Verified">
                <span className={`${styles.verfied} ms-1 d-inline-block rounded-circle align-text-top`} />
                // </CtToolTip>
              )}
            </h2>
            <span className="text-muted xsmall-text mb-2 d-block">{getDesignation(data.eDesignation)}</span>
            <Row className="gx-1 gx-md-2 text-muted xsmall-text justify-content-between flex-nowrap">
              <Col lg={6} xs="auto" className="d-flex">
                <PencilIcon width="18" height="18" className="flex-shrink-0 me-1" /> {data?.nArticleCount} {t('common:Posts')}
              </Col>
              <Col lg={6} xs="auto" className="d-flex">
                <EyeIcon width="18" height="18" className="flex-shrink-0 me-1" /> {abbreviateNumber(data?.nViewCount || 0)}{' '}
                {t('common:Reads')}
              </Col>
            </Row>
          </div>
          <div className="flex-shrink-0 mt-1">
            <AuthorDetailLink slug={allRoutes.authorDetail(data?.oSeo?.sSlug)} className="theme-text text-uppercase">
              {t('common:ViewPosts')} &gt;
            </AuthorDetailLink>
          </div>
        </Col>
      </Row>
    </article>
  )
}

AuthorListCard.propTypes = {
  data: PropTypes.object
}

AuthorListCard.defaultProps = {
  data: {}
}

export default AuthorListCard
