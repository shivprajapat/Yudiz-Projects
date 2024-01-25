import React from 'react'
import { Container, Row, Col } from 'react-bootstrap'
import PropTypes from 'prop-types'
import dynamic from 'next/dynamic'
import Trans from 'next-translate/Trans'

import styles from './style.module.scss'
import Layout from '@shared-components/layout'
import { allRoutes } from '../../constants/allRoutes'
import { WIDGET } from '@shared/constants'
import useWindowSize from '@shared/hooks/windowSize'

const Skeleton = dynamic(() => import('@shared-components/skeleton'), { ssr: false })
const Ads = dynamic(() => import('@shared/components/ads'), { ssr: false })
const AllWidget = dynamic(() => import('@shared/components/allWidget'), { ssr: false })
const CommonNav = dynamic(() => import('@shared-components/commonNav'), {
  loading: () => (
    <div className="bg-white p-2 d-flex rounded-pill">
      <Skeleton className={'mx-1'} />
      <Skeleton className={'mx-1'} />
      <Skeleton className={'mx-1'} />
      <Skeleton className={'mx-1'} />
    </div>
  )
})
export default function FixtureContent({ children, type, seoData }) {
  const [width] = useWindowSize()
  const navData = [
    { navItem: <Trans i18nKey="common:CurrentMatches" />, url: allRoutes.fixtures, active: type === 'currentMatches' && true },
    { navItem: <Trans i18nKey="common:ScheduleByMonth" />, url: allRoutes.cricketSchedule, active: type === 'scheduleByMonth' && true },
    { navItem: <Trans i18nKey="common:CurrentAndFutureSeries" />, url: allRoutes.cricketSeries, active: type === 'currentSeries' && true },
    { navItem: <Trans i18nKey="common:SeriesArchive" />, url: allRoutes.cricketSeriesArchive, active: type === 'seriesArchive' && true }
  ]

  return (
    <Layout data={{ oSeo: seoData }}>
      <section className="common-section">
        <Container>
          <div className="d-none d-md-block" style={{ minHeight: '90px', marginTop: '-15px' }}>
            {width > 767 && ( // Desktop Top
              <Ads
                id="div-ad-gpt-138639789-Desktop_Top_970x90"
                adIdDesktop="Crictracker2022_Desktop_Top_970x90"
                dimensionDesktop={[970, 90]}
                className="mb-3 text-center"
                style={{ minHeight: '90px' }}
              />
            )}
          </div>
          <Row>
            <Col lg={9} className="left-content" >
              <h4 className="text-uppercase">
                <Trans i18nKey="common:Fixtures" />
              </h4>
              <CommonNav items={navData} className={`${styles.navFixtures}`} isSticky />
              {children}
            </Col>
            {width > 767 &&
              <Col lg={3} className="common-sidebar">
                <AllWidget type={WIDGET.currentSeries} show />
                {/* In the right sidebar mobile/Desktop */}
                <Ads
                  id="div-ad-gpt-138639789-1646636827-0"
                  adIdDesktop="Crictracker2022_Desktop_Fix_RightATF_300x600"
                  dimensionDesktop={[300, 600]}
                  className="sticky-ads position-sticky mb-2"
                />
              </Col>
            }
          </Row>
        </Container>
      </section>
    </Layout>
  )
}

FixtureContent.propTypes = {
  type: PropTypes.string,
  children: PropTypes.node,
  seoData: PropTypes.object
}
