import React from 'react'
import PropTypes from 'prop-types'
import Link from 'next/link'
import useTranslation from 'next-translate/useTranslation'
import { Badge } from 'react-bootstrap'
import { abbreviateNumber, convertDateAMPM, dateCheck } from '@utils'
import articleStyles from '@shared/components/article/style.module.scss'
import CustomLink from '@shared/components/customLink'

function ArticleListCard({ article }) {
  const { t } = useTranslation()
  return (
    <article id={article?._id} className={`${articleStyles.article} light-bg mb-3 d-flex align-items-start c-transition`}>
      <div className="flex-grow-1 me-3">
        {article?.oCategory?.sName && (
          <div>
            <Badge as={Link} href={'/' + article?.oCategory?.oSeo?.sSlug}>
              <a className={`${articleStyles.badge} badge bg-${article?.ePlatformType === 'de' ? 'danger' : 'primary'}`}>{article?.oCategory?.sName}</a>
            </Badge>
          </div>
        )}
        <CustomLink href={`/${article?.oSeo?.sSlug || '404'}`} prefetch={false}>
          <a className="small-head h3">{article?.sTitle}</a>
        </CustomLink>
        <div className="text-muted mt-2">
          <time className="op-modified">
            <span className="text-primary">{t('common:Created')}</span> - {convertDateAMPM(dateCheck(article?.dPublishDisplayDate || article?.dPublishDate))}
          </time>
          <time className="op-modified mx-3">
            <span className="text-primary">{t('common:Updated')}</span> - {convertDateAMPM(dateCheck(article?.dModifiedDate || article?.dPublishDisplayDate))}
          </time>
        </div>
      </div>
      <div className="flex-shrink-0 text-center text-muted">
        <span className="d-block h5 mb-0 fw-normal">{abbreviateNumber(article?.nViewCount || article?.nOViews)}</span>
        <span className="d-block text-uppercase">{t('common:Views')}</span>
      </div>
    </article>
  )
}

ArticleListCard.propTypes = {
  article: PropTypes.object
}

export default ArticleListCard
