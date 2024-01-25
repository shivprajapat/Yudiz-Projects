import React from 'react'
import PropTypes from 'prop-types'
import { Badge } from 'react-bootstrap'
import Link from 'next/link'

import styles from './style.module.scss'

function TrendingNewsContent({ data }) {
  return (
    <>
      {data?.map((news, index) => (
        <article key={news._id} className="d-flex align-items-start">
          <b className={`${styles.num}`}>{index + 1}</b>
          <div className={`${styles.desc} flex-grow-1`}>
            <Badge bg="primary" className={`${styles.badge}`}>
              {news?.oCategory?.sName}
            </Badge>
            <h4 className="small-head mb-0">
              <Link href={'/' + news?.oSeo?.sSlug} prefetch={false}>
                <a>{news?.sTitle}</a>
              </Link>
            </h4>
          </div>
        </article>
      ))}
    </>
  )
}
TrendingNewsContent.propTypes = {
  data: PropTypes.array
}

export default TrendingNewsContent
