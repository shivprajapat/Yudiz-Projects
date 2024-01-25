import React from 'react'
import PropTypes from 'prop-types'
import { Row, Col } from 'react-bootstrap'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import useTranslation from 'next-translate/useTranslation'

import { BLUR_DATA_URL } from '@shared/constants'
import { getImgURL, getDesignation, getStringJoinByDash, abbreviateNumber } from '@utils'
import { PencilIcon, EyeIcon } from '../../ctIcons'
import noImage from '@assets/images/placeholder/person-placeholder.jpg'
import styles from './style.module.scss'
import articleStyles from '@shared/components/article/style.module.scss'
import { allRoutes } from '@shared/constants/allRoutes'

const MyImage = dynamic(() => import('@shared/components/myImage'))

function AuthorDetailLink({ slug, children, className }) {
  return (
    <Link href={slug} prefetch={false}>
      <a className={className}>{children}</a>
    </Link>
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
    <article id={authorListItemID} className={`${articleStyles.article} mb-3`}>
      <Row className="gx-3">
        <Col xs="5">
          <AuthorDetailLink slug={allRoutes.authorDetail(data?.oSeo?.sSlug)} className={`${articleStyles.postimg} ${styles.postimg} d-block block-img `}>
            <MyImage
              src={getImgURL(data?.sUrl) || noImage}
              alt={`Author ${data?.sFName}`}
              placeholder="blur"
              blurDataURL={BLUR_DATA_URL}
              layout="fill"
            />
          </AuthorDetailLink>
        </Col>
        <Col xs="7" className="d-flex flex-column">
          <div className="flex-grow-1">
            <h3 className="big-text mb-1 text-capitalize">
              <AuthorDetailLink slug={allRoutes.authorDetail(data?.oSeo?.sSlug)}>
                {data?.sFName}
                {data?.bIsVerified && (
                  <span className={`${styles.verfied} d-inline-block rounded-circle align-text-top`} />
                )}
              </AuthorDetailLink>
            </h3>
            <span className="text-muted xsmall-text mb-2 d-block">{getDesignation(data.eDesignation)}</span>
            <Row className="gx-2 text-muted xsmall-text justify-content-between">
              <Col className="d-flex">
                <PencilIcon width="18" height="18" className="flex-shrink-0 me-1" /> {data?.nArticleCount} {t('common:Posts')}
              </Col>
              <Col className="d-flex">
                <EyeIcon width="18" height="18" className="flex-shrink-0 me-1" /> {abbreviateNumber(data?.nViewCount || 0)}{' '}
                {t('common:Reads')}
              </Col>
            </Row>
          </div>
          <div className="flex-shrink-0">
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
