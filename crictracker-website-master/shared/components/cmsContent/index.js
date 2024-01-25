import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'

import styles from './style.module.scss'
import Layout from '@shared/components/layout'
import useWindowSize from '@shared/hooks/windowSize'
import { staticPages } from '@shared/constants/staticPages'
import { addAdsInsideParagraph, addEditorAds } from '@shared/utils'
import { WIDGET } from '@shared/constants'

const BreadcrumbNav = dynamic(() => import('@shared/components/breadcrumbNav'))
const Ads = dynamic(() => import('@shared/components/ads'))
const OnMouseAndScroll = dynamic(() => import('@shared/components/lazyLoad/onMouseAndScroll'))
const AllWidget = dynamic(() => import('@shared/components/allWidget'))
// const SeriesPointTable = dynamic(() => import('@shared/components/widgets/seriesPointTable'))
const CommonContent = dynamic(() => import('@shared/components/commonContent'))

const CMSContent = ({ data, seoData }) => {
  const router = useRouter()
  const isMobileWebView = router?.query?.isMobileWebView
  const cmsData = data?.getUserCMSPage
  const [width] = useWindowSize()
  // const isStaticPage = staticPages.includes(router.asPath)
  const isStaticPage = staticPages.some((path) => router.asPath.startsWith(path))

  useEffect(async () => {
    if (!isStaticPage) {
      const ReactDOM = (await import('react-dom'))

      // const { refreshGoogleAds } = (await import('@shared/libs/ads'))
      const gtAds1 = document.getElementById('gt-ads-1')
      if (gtAds1) { // Editor ads one
        ReactDOM.render(<Ads
          id="div-ad-gpt-138639789-1660131756-0"
          adIdDesktop="Crictracker2022_Desktop_AP_MID3_728x90"
          // adIdMobile="Crictracker2022_Mobile_AP_MID3_300x250"
          dimensionDesktop={[728, 90]}
          // dimensionMobile={[300, 250]}
          // mobile
          className={'text-center mb-4 d-none d-md-block'}
        />, gtAds1)
      }
      const gtAd2 = document.getElementById('gt-ads-2')
      if (gtAd2) { // Editor ads Two
        ReactDOM.render(<Ads
          id="div-ad-gpt-138639789-1660131756-1"
          adIdDesktop="Crictracker2022_Desktop_AP_MID4_728x90"
          // adIdMobile="Crictracker2022_Mobile_AP_MID4_300x250"
          dimensionDesktop={[728, 90]}
          // dimensionMobile={[300, 250]}
          // mobile
          className={'text-center mb-4 d-none d-md-block'}
        />, gtAd2)
      }
      const fixedAd2 = document.getElementById('fixed-ads-2')
      if (fixedAd2) { // After 3rd paragraph fixed ads
        ReactDOM.render(<Ads
          id="div-ad-gpt-138639789-Desktop_AP_MID-1646637168-0"
          adIdDesktop="Crictracker2022_Desktop_AP_MID_728x90"
          adIdMobile="Crictracker2022_Mobile_AP_MID_300x250"
          dimensionDesktop={[728, 90]}
          dimensionMobile={[300, 250]}
          mobile
          className={'text-center'}
        />, fixedAd2)
      }
      const fixedAd5 = document.getElementById('fixed-ads-5')
      if (fixedAd5) { // After 6th paragraph fixed ads
        ReactDOM.render(<Ads
          id="div-ad-gpt-138639789_Desktop_AP_MID2_728-46637168-0"
          adIdDesktop="Crictracker2022_Desktop_AP_MID2_728x90"
          adIdMobile="Crictracker2022_Mobile_AP_MID2_300x250"
          dimensionDesktop={[728, 90]}
          dimensionMobile={[300, 250]}
          mobile
          className={'text-center'}
        />, fixedAd5)
        // refreshGoogleAds()
      }
    }
  }, [])

  return (
    <Layout data={{ ...cmsData, oSeo: seoData }}>
      <section className="common-section">
        <div className='container'>
          <div className="d-none d-md-block mt-2" style={{ minHeight: '90px' }}>
            {width > 767 && !isStaticPage && ( // Desktop Top
              <Ads
                id="div-ad-gpt-138639789-1646637094-0"
                adIdDesktop="Crictracker2022_Desktop_Top_970x90"
                dimensionDesktop={[970, 90]}
                className="mb-4 text-center"
                style={{ minHeight: '90px' }}
              />
            )}
          </div>
          <div className='row'>
            <div className="left-content col-xxl-9 col-xl-8">
              <div className={`${styles.CMSContent} common-box mb-0`}>
                {!isMobileWebView && <BreadcrumbNav />}
                <h1>{cmsData?.sTitle}</h1>
                <CommonContent>
                  <div dangerouslySetInnerHTML={{ __html: addEditorAds(addAdsInsideParagraph(cmsData?.sContent, [0, 1, 2, 5])) }} />
                </CommonContent>
                {!isStaticPage && (
                  <OnMouseAndScroll>
                    <Ads
                      id="div-ad-gpt-138639789-1646637259-0"
                      adIdDesktop="Crictracker2022_Desktop_AP_BTF_728x90"
                      adIdMobile="Crictracker2022_Mobile_AP_BTF_300x250"
                      dimensionDesktop={[728, 90]}
                      dimensionMobile={[300, 250]}
                      mobile
                      className={'text-center mt-2'}
                    />
                  </OnMouseAndScroll>
                )}
              </div>
            </div>
            {width > 991 && (
              <div xl={4} xxl={3} className='common-sidebar d-none d-lg-block col-xxl-3 col-xl-4'>
                {/* <SeriesPointTable /> */}
                <AllWidget type={WIDGET.trendingNews} show />
                {!isStaticPage && (
                  <OnMouseAndScroll>
                    {/* <PixFuture /> */}
                    <Ads
                      id="div-ad-gpt-138639789-1646637134-0"
                      adIdDesktop="Crictracker2022_Desktop_AP_RightATF_300x600"
                      dimensionDesktop={[300, 600]}
                      className="sticky-ads position-sticky mb-2"
                    />
                  </OnMouseAndScroll>
                )}
              </div>
            )}
          </div>
        </div>
      </section>
    </Layout>
  )
}

CMSContent.propTypes = {
  data: PropTypes.object,
  seoData: PropTypes.object
}

export default CMSContent
