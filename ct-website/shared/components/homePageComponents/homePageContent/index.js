import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { Col, Container, Row } from 'react-bootstrap'
import dynamic from 'next/dynamic'

import useWindowSize from '@shared/hooks/windowSize'
// import { scoreCardSliderLoader } from '@shared/libs/allLoader'
import Layout from '@shared/components/layout'
import ScorecardSlider from '@shared/components/scorecardSlider'
import { REACT_APP_ENV } from '@shared/constants'

// const Layout = dynamic(() => import('@shared-components/layout'))
// const ScorecardSlider = dynamic(() => import('@shared-components/scorecardSlider'), { loading: () => scoreCardSliderLoader() })
const HomeNav = dynamic(() => import('@shared-components/homeNav'))
const Ads = dynamic(() => import('@shared/components/ads'), { ssr: false })
const AllWidget = dynamic(() => import('@shared/components/allWidget'), { ssr: false })
const PromotionSmall = dynamic(() => import('@shared/components/adsPromotion/promotionSmall'))
// const LazyLoad = dynamic(() => import('@shared/components/lazyLoad'))

function HomePageContent({ children }) {
  const [width] = useWindowSize()
  const [activeTab, setActiveTab] = useState('ar')

  function getMetaDetail() {
    return {
      oSeo: {
        sTitle: 'Cricket Teams, Stats, Latest News, Match Predictions, Fantasy Tips &amp; Results',
        sDescription: 'Get cricket match updates (Domestic &amp; International), team stats, series results, fixtures, latest news, top stories, match preview, predictions, review, results, fantasy tips, statistical highlights, videos and complete cricket analysis along with ICC Cricket player rankings on CricTracker'
      }
    }
  }

  return (
    <Layout data={getMetaDetail()}>
      <ScorecardSlider isSeriesTitle />
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
        <Container className="home-container">
          <Row>
            <Col lg={3} className="order-1 order-lg-0 common-sidebar bt-width d-none d-lg-block">
              {width > 991 && (
                <>
                  {REACT_APP_ENV === 'staging' && <PromotionSmall />}
                  <AllWidget show={true} position="l" />
                  <Ads
                    id="div-ad-gpt-138639789-1660055716-Desktop_HP_LeftBTF-1"
                    adIdDesktop="Crictracker2022_Desktop_HP_LeftBTF_300x600"
                    dimensionDesktop={[300, 600]}
                    className="sticky-ads"
                  />
                </>
              )}
            </Col>
            <Col lg={6} className="center-content">
              <HomeNav active={activeTab} handleChange={(t) => setActiveTab(t)} />
              {children(activeTab)}
            </Col>
            <Col lg={3} className="common-sidebar bt-width d-none d-lg-block">
              {width > 991 && (
                <>
                  <AllWidget show={true} position="r" />
                  <Ads
                    id="div-ad-gpt-138639789-1660055716-Desktop_HP_RightBTF-0"
                    adIdDesktop="Crictracker2022_Desktop_HP_RightBTF_300x600"
                    dimensionDesktop={[300, 600]}
                    className="sticky-ads"
                  />
                </>
              )}
            </Col>
          </Row>
          {/* Below Footer mobile/Desktop */}
          <Ads
            id="div-ad-gpt-138639789-166005-Crictracker2022_Desktop_HP_BTF_-5"
            adIdDesktop="Crictracker2022_Desktop_HP_BTF_728x90"
            adIdMobile="Crictracker2022_Mobile_HP_BTF_300x250"
            dimensionDesktop={[728, 90]}
            dimensionMobile={[300, 250]}
            mobile
            className="mt-1 text-center"
          />
        </Container>
      </div>
    </Layout>
  )
}
HomePageContent.propTypes = {
  children: PropTypes.func
}
export default HomePageContent
