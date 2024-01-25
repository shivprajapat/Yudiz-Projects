import React from 'react'
import PropTypes from 'prop-types'
import Trans from 'next-translate/Trans'

import { CalenderIcon, ClockIcon } from '../../../ctIcons'
import { convertDt24h, convertHMS, dateCheck, getArticleImg, getImgURL } from '@utils'
import { DEFAULT_BLOG_READ } from '@shared/constants'

function ArticleBig({ data, isVideo }) {
  return (
    <>
      <style jsx amp-custom>{`
      .article .postimg::after{content:"";position:absolute;display:block}.article{margin-bottom:16px;padding:16px;background:var(--light-mode-bg);border-radius:16px;-webkit-transition:all .3s ease-in-out;-ms-transition:all .3s ease-in-out;transition:all .3s ease-in-out}.article:hover{-webkit-box-shadow:0px 6px 16px rgba(166,200,255,.48);box-shadow:0px 6px 16px rgba(166,200,255,.48)}.article .postimg{border-radius:12px;overflow:hidden;position:relative;display:block}.article .postimg::after{width:100%;height:100%;left:0;top:0;opacity:0;-webkit-transition:all .3s ease-in-out;-ms-transition:all .3s ease-in-out;transition:all .3s ease-in-out;background-image:linear-gradient(0deg, #045DE9 0%, rgba(4, 93, 233, 0) 50%)}.article .postimg:hover::after{opacity:1}.article img{object-fit:cover}.article .badge{margin-bottom:8px;padding:0px 6px;font-size:11px;line-height:16px;border-radius:2em;text-transform:uppercase;max-width:100%;background:#e7f0ff;color:#045de9}.article .badge:empty{display:none}.article .articleInfo{color:#757a82;font-size:11px;line-height:14px}.article .articleInfo span{margin-right:8px}.article .articleInfo span:last-child{margin-right:0}.article .articleInfo svg{margin-right:2px}.article.video .postimg::after{display:none}.article.video .postimg .badge{position:absolute;bottom:0px;left:8px}.article>:last-child{margin-bottom:0}.article h3,.article h4{font-size:18px;line-height:24px}.article h3 a,.article h4 a{display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;overflow:hidden}.article .desc{display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;overflow:hidden}.article .articleInfo .item{margin-right:0;margin-left:4px}@media(max-width: 1399px){.article{padding:12px;border-radius:12px}}@media(max-width: 1199px){.article .articleInfo span{margin-right:6px}.article h3,.article h4{font-size:16px;line-height:22px}}@media(max-width: 575px){.article{padding:12px}.article .postimg{border-radius:6px}.article h3,.article h4{font-size:14px;line-height:20px}}/*# sourceMappingURL=style.css.map */


      `}
      </style>
      <article className={`article articleBig ${isVideo && 'video' + ' ' + 'video'}`}>
        <a href={`/${data?.oSeo?.sSlug || '404'}`}>
          <div className="postimg postimg mb-2">
            {isVideo && (
              <amp-img
                src={getImgURL(data?.sThumbnailUrl) || '/static/article-placeholder.jpg'}
                alt={data?.sTitle}
                placeholder="blur"
                height="160"
                width="256"
                layout="responsive"
              ></amp-img>
            )}
            {!isVideo && (
              <amp-img
                src={getArticleImg(data)?.sUrl || '/static/article-placeholder.jpg'}
                alt={getArticleImg(data)?.sText || data?.sSrtTitle}
                placeholder="blur"
                height="160"
                width="256"
                layout="responsive"
              ></amp-img>
            )}
            {isVideo && (
              <span className={`badge badge ${isVideo && 'video-badge'}`}>
                {data?.category} {convertHMS(data?.nDurationSeconds)}
              </span>
            )}
          </div>
        </a>
        {data?.oCategory?.sName && (
          <span
            bg={data?.ePlatformType === 'de' ? 'danger' : 'primary'}
            className={`badge badge ${isVideo && 'video-badge'}`}
          >
            <a href={data?.oCategory?.oSeo?.sSlug || ''}>{data?.oCategory?.sName}</a>
          </span>
        )}
        <h3 className="small-head">
          <a href={`/${data?.oSeo?.sSlug || '404'}`}>{data?.sSrtTitle || data?.sTitle}</a>
        </h3>
        {/* <p className={`${articleStyles.desc}`}>{data?.sDescription}</p> */}
        {(data?.dPublishDisplayDate || data?.dPublishDate || data?.nDuration?.toString()) && (
          <div className="articleInfo articleInfo d-flex">
            {(data?.dPublishDisplayDate || data?.dPublishDate) && (
              <span className="d-flex align-items-center">
                <CalenderIcon />
                {convertDt24h(dateCheck(data?.dPublishDisplayDate || data?.dPublishDate))}
              </span>
            )}
            <span className="d-flex align-items-center">
              <ClockIcon />
              {data?.nDuration > 0 ? data?.nDuration : DEFAULT_BLOG_READ} <Trans i18nKey="common:Minute" />
            </span>
          </div>
        )}
      </article>
    </>
  )
}

ArticleBig.propTypes = {
  title: PropTypes.string,
  category: PropTypes.string,
  imgURL: PropTypes.any,
  isVideo: PropTypes.bool,
  date: PropTypes.string,
  time: PropTypes.string,
  data: PropTypes.object
}

export default ArticleBig
