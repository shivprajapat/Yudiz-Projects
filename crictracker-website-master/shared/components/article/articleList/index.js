import React from 'react'
import PropTypes from 'prop-types'
import { Badge } from 'react-bootstrap'
import dynamic from 'next/dynamic'

import styles from './style.module.scss'
// import articleStyles from '../style.module.scss'
import { NoteIcon } from '../../ctIcons'
import CustomLink from '@shared/components/customLink'
import { convertHMS } from '@shared/utils'

const ArticleStyles = dynamic(() => import('@shared/components/article/articleStyle'))

function ArticleList({ data, isVideo }) {
  return (
    <ArticleStyles>
      {(articleStyles) => (
        <article className={`${articleStyles.article} ${styles.articleList} light-bg py-1 py-md-0 br-lg c-transition`}>
          {data.map((a) => (
            <h4 key={a._id} id={a?._id} className="small-head mb-0">
              <CustomLink href={`/${a?.oSeo?.sSlug}` || ''} prefetch={false}>
                <a className="d-flex align-items-center py-2 py-md-3">
                  <span className="flex-shrink-0">
                    <NoteIcon />
                  </span>
                  {isVideo && <Badge bg="info" className={`${styles.badge} d-flex text-dark ms-1 align-items-center`}>{convertHMS(a?.nDurationSeconds)}</Badge>}
                  <span className="overflow-hidden text-nowrap t-ellipsis ms-2">{a?.sSrtTitle || a.sTitle}</span>
                </a>
              </CustomLink>
            </h4>
          ))}
        </article>
      )}
    </ArticleStyles>
  )
}
ArticleList.propTypes = {
  data: PropTypes.array,
  isVideo: PropTypes.bool
}

export default ArticleList
