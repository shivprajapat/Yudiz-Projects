import React from 'react'
import PropTypes from 'prop-types'
import styles from './style.module.scss'
import { Badge } from 'react-bootstrap'
import dynamic from 'next/dynamic'

import { getArticleImg } from '@shared/utils'
import noImage from '@assets/images/placeholder/article-placeholder.jpg'
import { BLUR_DATA_URL_BASE64 } from '@shared/constants'
import CustomLink from '../customLink'

const MyImage = dynamic(() => import('@shared/components/myImage'))
function CricSpecialContent({ redirectURL, title, category, imgURL }) {
  return (
    <div>
      <article className={`${styles.item} pb-3 mb-n1`}>
        <CustomLink href={'/' + redirectURL} prefetch={false}>
          <a className={`${styles.postimg} d-block br-md overflow-hidden`}>
            <MyImage
              src={getArticleImg(imgURL)?.sUrl || noImage}
              alt={getArticleImg(imgURL)?.sText || title}
              blurDataURL={BLUR_DATA_URL_BASE64}
              placeholder="blur"
              height="80"
              width="128"
              layout="responsive"
              sizes="(max-width: 767px) 120px, (max-width: 991px) 180px, (max-width: 1190px) 200px, 240px"
            />
          </a>
        </CustomLink>
        <Badge bg="secondary" className={`${styles.badge} my-2`}>
          {category}
        </Badge>
        <h4 className="small-head mb-0 overflow-hidden">
          <CustomLink href={'/' + redirectURL} prefetch={false}>
            <a className="line-clamp-3">{title}</a>
          </CustomLink>
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
