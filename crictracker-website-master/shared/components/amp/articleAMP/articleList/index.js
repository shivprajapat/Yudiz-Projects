import React from 'react'
import PropTypes from 'prop-types'
import { Badge } from 'react-bootstrap'

import styles from './style.module.scss'
import articleStyles from '../style.module.scss'
import { NoteIcon } from '../../ctIcons'
import CustomLink from '@shared/components/customLink'
function ArticleList({ data, isVideo }) {
  return (
    <article className={`${articleStyles.article} ${styles.articleList} py-0`}>
      {data.map((a) => (
        <h4 key={a._id} className="small-head">
          <CustomLink href={`/${a?.oSeo?.sSlug}` || ''} prefetch={false}>
            <a className="d-flex align-items-center">
              <NoteIcon />
              { isVideo && <Badge bg="info" className={`${styles.badge} text-dark me-1 me-2`}>1:12</Badge>}
              <span className="text-truncate">{a?.sSrtTitle || a.sTitle}</span>
            </a>
          </CustomLink>
        </h4>
      ))}
    </article>
  )
}
ArticleList.propTypes = {
  data: PropTypes.array,
  isVideo: PropTypes.bool
}

export default ArticleList
