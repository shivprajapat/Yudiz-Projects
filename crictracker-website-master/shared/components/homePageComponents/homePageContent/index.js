import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { Col, Container, Row } from 'react-bootstrap'
import dynamic from 'next/dynamic'

import styles from './style.module.scss'
import useWindowSize from '@shared/hooks/windowSize'
// import { scoreCardSliderLoader } from '@shared/libs/allLoader'
// import ScorecardSlider from '@shared/components/scorecardSlider'
// import OnMouseAndScroll from '@shared/components/lazyLoad/onMouseAndScroll'
// import { REACT_APP_ENV } from '@shared/constants'

// const Layout = dynamic(() => import('@shared-components/layout'))
// const ScorecardSlider = dynamic(() => import('@shared-components/scorecardSlider'), { loading: () => scoreCardSliderLoader() })
const HomeNav = dynamic(() => import('@shared-components/homeNav'))
const ScorecardSlider = dynamic(() => import('@shared/components/scorecardSlider'))
const Ads = dynamic(() => import('@shared/components/ads'), { ssr: false })
const AllWidget = dynamic(() => import('@shared/components/allWidget'), { ssr: false })
// const PromotionSmall = dynamic(() => import('@shared/components/adsPromotion/promotionSmall'), { ssr: false })
// const PromotionFull = dynamic(() => import('@shared/components/adsPromotion/promotionFull'), { ssr: false })
// const SeriesPointTable = dynamic(() => import('@shared/components/widgets/seriesPointTable'), { ssr: false })
// const SeriesKeyStats = dynamic(() => import('@shared/components/widgets/SeriesKeyStats'), { ssr: false })

function HomePageContent({ articles, children, widgetPosition, miniScorecard }) {
  const [width] = useWindowSize()
  const [activeTab, setActiveTab] = useState('ar')

  return (
    <>
      <div style={{ height: `${width > 440 ? '259px' : '245px'}` }}>
        <ScorecardSlider
          data={miniScorecard}
          isSeriesTitle
          adData={{
            id: 'div-ad-gpt-138639789-1679039771-0',
            adIdDesktop: 'Crictracker2022_Desktop_HP_ATF_320x168',
            // adIdMobile: 'Crictracker2022_Mobile_HP_ATF_320x168',
            dimensionDesktop: [320, 168]
            // dimensionMobile: [320, 168],
            // mobile: true
          }}
        />
      </div>
      {/* {width < 767 && (
        <Container>
          <PromotionFull isHomePagePromotion />
        </Container>
      )} */}
      <Container className="d-none d-md-block mt-2" style={{ minHeight: '90px' }}>
        {width > 767 && ( // Desktop top
          <Ads
            id="div-ad-gpt-138639789--0-Crictracker2022_Desktop_Top_970"
            adIdDesktop="Crictracker2022_Desktop_Top_970x90"
            dimensionDesktop={[970, 90]}
            className={'text-center'}
            style={{ minHeight: '90px' }}
          />
        )}
      </Container>
      <div className="common-section">
        <Container className={styles.homeContainer}>
          <Row>
            <Col lg={3} className={`${styles.commonSidebar} order-1 order-lg-0 common-sidebar bt-width d-none d-lg-block`}>
              {width > 991 && (
                <>
                  {/* <PromotionSmall /> */}
                  <AllWidget show={true} position="l" widgetPosition={widgetPosition} />
                  {/* <LazyLoad>
                    <PixFuture />
                  </LazyLoad> */}
                  <Ads
                    id="div-ad-gpt-138639789-1660055716-Desktop_HP_LeftBTF-1"
                    adIdDesktop="Crictracker2022_Desktop_HP_LeftBTF_300x600"
                    dimensionDesktop={[300, 600]}
                    className="sticky-ads position-sticky mb-2"
                  />
                </>
              )}
            </Col>
            <Col lg={6} className={styles.centerContent}>
              <HomeNav active={activeTab} handleChange={(t) => setActiveTab(t)} />
              {children(activeTab)}
            </Col>
            <Col lg={3} className={`${styles.commonSidebar} common-sidebar bt-width d-none d-lg-block`}>
              {width > 991 && (
                <>
                  {/* <SeriesPointTable />
                  <OnMouseAndScroll>
                    <SeriesKeyStats />
                  </OnMouseAndScroll> */}
                  <AllWidget show={true} position="r" widgetPosition={widgetPosition} />
                  {/* <Ads
                    id="div-ad-gpt-138639789-1660055716-Desktop_HP_RightBTF-0"
                    adIdDesktop="Crictracker2022_Desktop_HP_RightBTF_300x600"
                    dimensionDesktop={[300, 600]}
                    className="sticky-ads position-sticky mb-2"
                  /> */}
                </>
              )}
            </Col>
          </Row>
        </Container>
      </div>
    </>
  )
}
HomePageContent.propTypes = {
  children: PropTypes.func,
  articles: PropTypes.array,
  widgetPosition: PropTypes.array,
  miniScorecard: PropTypes.array
}
export default HomePageContent
