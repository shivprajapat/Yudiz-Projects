import React from 'react'
import PropTypes from 'prop-types'
import InnerHTML from '@shared/components/InnerHTML'
import { useRouter } from 'next/router'
import { checkPageNumberInSlug } from '@shared/utils'
import Trans from 'next-translate/Trans'
import Head from 'next/head'
import { DOMAIN } from '@shared/constants'

function ListicleArticleAMP({ article }) {
  const router = useRouter()
  const { lastSlug, slug, params } = checkPageNumberInSlug(router?.asPath?.split('/').filter(e => e))
  const index = Number(lastSlug) || 1
  const nextURL = `/${slug?.join('/')}/${index + 1}`
  const prevURL = index === 1 ? `/${slug?.join('/')}` : `/${slug?.join('/')}/${index - 1}`

  return (
    <>
      <Head>
        {index > 1 && <link rel="prev" href={`${DOMAIN + prevURL?.substring(1)}/?amp=1`} />}
        {(index < article?.oListicleArticle?.nTotal) && <link rel="next" href={`${DOMAIN + nextURL?.substring(1)}/?amp=1`} />}
      </Head>
      <style jsx amp-custom>{`
   .d-flex{display:flex;-webkit-display:flex}.align-items-center{align-items:center;-webkit-align-items:center}.justify-content-center{justify-content:center;-webkit-justify-content:center}.theme-btn{padding:9px 16px;display:inline-flex;background:#045de9;font-size:12px;line-height:18px;color:#fff;text-align:center;font-weight:700;border:1px solid #045de9;border-radius:2em}.theme-btn:hover,.theme-btn:focus{background:#174a9c;color:#fff;border-color:#174a9c;-webkit-box-shadow:none;box-shadow:none}.theme-btn>*{width:20px}.theme-btn .icon{width:24px;filter:brightness(0) invert(1)}.theme-btn .left{margin:0px 4px -2px -4px}.theme-btn .right{margin:0px -4px -2px 4px}.theme-btn .disabled{opacity:.65;pointer-events:none}.pageBox{margin-bottom:20px}.pageBox .theme-btn{font-size:16px;text-decoration:none}@media(max-width: 991px){.pageBox{margin-bottom:15px}.pageBox .theme-btn{font-size:14px}}.pageCount{font-weight:bold;font-size:16px;padding:0 20px}.pageCount span{background-color:#045de9;color:#fff;display:inline-block;height:32px;width:32px;text-align:center;line-height:32px;border-radius:100%;margin-left:7px}@media(max-width: 480px){.pageCount{font-size:14px;padding:0 10px}}@media(max-width: 1399px){.content{font-size:17px;line-height:26px}}@media(max-width: 991px){.content{font-size:16px;line-height:24px}}/*# sourceMappingURL=style.css.map */

    `}
      </style>
      <div className="content">
        <InnerHTML
          id="listicle"
          html={article?.oListicleArticle?.oAmpPageContent[index - 1]}
        />
      </div>
      <div className="pageBox d-flex align-items-center justify-content-center">
        <a
          className={`theme-btn align-items-center ${index === 1 ? 'disabled' : ''}`}
          href={`${prevURL}/${params}`}
        >
          <span className="icon left">
            <amp-img alt="left"
              src="/static/left-arrow.svg"
              width="24"
              height="24"
              layout="responsive" >
            </amp-img>
          </span>
          <Trans i18nKey="common:Prev" />
        </a>
        <div className="pageCount">
          <Trans i18nKey="common:Page" />
          <span>{index}</span> / {article?.oListicleArticle?.nTotal}
        </div>
        <a
          className={`theme-btn align-items-center ${index === article?.oListicleArticle?.nTotal ? 'disabled' : ''}`}
          href={`${nextURL}/${params}`}
        >
          <Trans i18nKey="common:Next" />
          <span className="icon right">
            <amp-img alt="right"
              src="/static/right-arrow.svg"
              width="24"
              height="24"
              layout="responsive" >
            </amp-img>
          </span>
        </a>
      </div>
    </>
  )
}

ListicleArticleAMP.propTypes = {
  article: PropTypes.object
}
export default ListicleArticleAMP
