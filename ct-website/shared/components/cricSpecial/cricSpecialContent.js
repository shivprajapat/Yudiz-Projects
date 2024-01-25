import React from 'react'
import PropTypes from 'prop-types'
import styles from './style.module.scss'
import { Badge } from 'react-bootstrap'
import Link from 'next/link'
import dynamic from 'next/dynamic'

import { getArticleImg } from '@shared/utils'
import noImage from '@assets/images/placeholder/article-placeholder.jpg'
import { BLUR_DATA_URL } from '@shared/constants'

const MyImage = dynamic(() => import('@shared/components/myImage'))
function CricSpecialContent({ redirectURL, title, category, imgURL }) {
  return (
    <div>
      <article className={`${styles.item}`}>
        <div className="block-img">
          <Link href={'/' + redirectURL} prefetch={false}>
            <MyImage
              src={getArticleImg(imgURL)?.sUrl || noImage}
              alt={getArticleImg(imgURL)?.sText || title}
              className={`${styles.postimg}`}
              blurDataURL={BLUR_DATA_URL}
              placeholder="blur"
              height="80"
              width="128"
              layout="responsive"
              sizes="(max-width: 767px) 120px, (max-width: 991px) 180px, (max-width: 1190px) 200px, 240px"
            />
          </Link>
        </div>
        <Badge bg="secondary" className={`${styles.badge}`}>
          {category}
        </Badge>
        <h4 className="small-head mb-0">
          <Link href={'/' + redirectURL} prefetch={false}>
            <a>{title}</a>
          </Link>
        </h4>
      </article>
    </div>
  )
}
CricSpecialContent.propTypes = {
  title: PropTypes.string,
  category: PropTypes.string,
  imgURL: PropTypes.object,
  redirectURL: PropTypes.string
}

export default CricSpecialContent
