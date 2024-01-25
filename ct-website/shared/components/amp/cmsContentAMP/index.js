import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import dynamic from 'next/dynamic'

import LayoutAmp from '@shared-components/layout/layoutAmp'
import { useRouter } from 'next/router'
import { staticPages } from '@shared/constants/staticPages'
const BreadcrumbNavAMP = dynamic(() => import('@shared/components/amp/breadcrumbNavAMP'))

const CMSContent = ({ data, seoData }) => {
  const router = useRouter()
  const [isPreview, setIsPreview] = useState(false)
  const cmsData = data?.getUserCMSPage
  const ampUrl = router.asPath.replace('?amp=1', '')
  const isStaticPage = staticPages.includes(ampUrl)

  useEffect(() => {
    if (router?.query?.isMobileWebView) {
      setIsPreview(true)
    }
  }, [router?.asPath])
  return (
    <>
      <style jsx amp-custom global>{`
     .common-section{background:#f2f4f7}.CMSContent{padding:24px 30px;position:relative;font-family:"Noto Sans Display",sans-serif}.content{font-size:18px;line-height:27px;color:var(--font-secondary)}.content p{margin-bottom:24px}.content a{color:#045de9}.content a:hover{color:"Noto Sans Display",sans-serif}.content ul,.content ol{margin-bottom:24px;padding-left:20px;font-size:16px;line-height:27px;font-weight:500}.content ul{list-style:disc}.content ol{list-style:decimal}.content li{padding-left:10px}.content blockquote{margin-bottom:24px;padding:16px 16px 20px 66px;background:#e7f0ff url(/static/quote-icon.svg) no-repeat 16px 14px/40px auto;font-size:21px;line-height:32px;color:#0e3778;font-style:italic;border-radius:16px}.content table{font-size:14px;line-height:20px}.content table tbody tr:first-child td{background:#045de9;color:#fff;text-transform:uppercase}.content table td{background:var(--theme-bg);width:auto}.content img{margin-bottom:24px;width:100%;height:auto}.table-responsive,.table-scroller{margin-bottom:16px;overflow-x:auto;-webkit-overflow-scrolling:touch}table{margin:0px;width:100%;font-size:14px;line-height:20px;border-spacing:0 4px;border-collapse:separate;border:none;white-space:nowrap}table p{margin:0}table tr:first-child th,table tr:first-child td{background:#045de9;font-weight:600;color:#fff}table th,table td{padding:4px 14px;height:44px;background:#f2f4f7}table th:first-child,table td:first-child{border-radius:8px 0 0 8px}table th:last-child,table td:last-child{border-radius:0 8px 8px 0}@media(max-width: 1399px){.content{font-size:17px;line-height:26px}.content p{margin-bottom:22px}.content blockquote{font-size:19px;line-height:28px}}@media(max-width: 1199px){.CMSContent{padding:20px 24px}}@media(max-width: 991px){.content{font-size:16px;line-height:24px}.content p{margin-bottom:22px}.content blockquote{font-size:18px;line-height:30px}table{margin:-4px 0px 4px;border-spacing:0 6px}table th,table td{padding:4px 10px;height:40px}table th:first-child,table td:first-child{border-radius:4px 0 0 4px}table th:last-child,table td:last-child{border-radius:0 4px 4px 0}}@media(max-width: 575px){.CMSContent{padding:16px 12px}.content{font-size:15px;line-height:22px}.content blockquote{padding:62px 16px 20px 16px}.content p,.content img,.content blockquote,.content ul,.content ol{margin-bottom:20px}.content ul,.content ol{padding-left:18px;font-size:14px;line-height:24px}.content li{padding-left:8px}.table-responsive,.table-scroller{margin-bottom:12px}table{margin:-3px 0px 3px;border-spacing:0 6px;font-size:13px}table th,table td{padding:2px 5px;height:30px}table th:first-child,table td:first-child{border-radius:3px 0 0 3px;padding-left:10px}table th:last-child,table td:last-child{border-radius:0 3px 3px 0;padding-right:10px}}/*# sourceMappingURL=style.css.map */

      `}
      </style>

      <LayoutAmp data={{ ...cmsData, oSeo: seoData }}>
        <section className="common-section">
          {
            !isStaticPage && <>
              <div className="d-flex justify-content-center">
                <amp-ad width="300"
                  height="250"
                  type="doubleclick"
                  data-slot="/138639789/Crictracker2022_AMP_ATF_300x250"
                >
                </amp-ad>
              </div>
              <amp-sticky-ad layout="nodisplay">
                <amp-ad
                  width="320"
                  height="50"
                  type="doubleclick"
                  data-slot="/138639789/Crictracker2022_AMP_Sticky_320x50"
                >
                </amp-ad>
              </amp-sticky-ad>
            </>
          }
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-md-9">
                <div className="CMSContent common-box mb-0">
                  {!isPreview && <BreadcrumbNavAMP />}
                  <h1>{cmsData?.sTitle}</h1>
                  <div className="content" dangerouslySetInnerHTML={{ __html: cmsData?.sAmpContent || cmsData?.sContent }} />
                </div>
              </div>
            </div>
          </div>
        </section>
      </LayoutAmp>
    </>
  )
}

CMSContent.propTypes = {
  data: PropTypes.object,
  seoData: PropTypes.object
}

export default CMSContent
