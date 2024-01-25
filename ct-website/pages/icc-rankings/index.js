import React, { useState, useEffect, useRef } from 'react'
import PropTypes from 'prop-types'
import useTranslation from 'next-translate/useTranslation'
import { Container, Row, Col, Nav } from 'react-bootstrap'
import { useLazyQuery } from '@apollo/client'
import dynamic from 'next/dynamic'

import styles from './style.module.scss'
import navStyles from '@shared-components/commonNav/style.module.scss'
import Layout from '@shared-components/layout'
import { RANKINGS } from '@graphql/globalwidget/rankings.query'
import queryGraphql from '@shared/components/queryGraphql'
import { pageHeaderLoader, tableLoader } from '@shared/libs/allLoader'
import Error from '@shared/components/error'
import { GET_ARTICLE_ID } from '@graphql/article/article.query'
import { WIDGET } from '@shared/constants'
import { checkRedirectionStatus, handleApiError } from '@shared/utils'
import useWindowSize from '@shared/hooks/windowSize'

const ThemeTable = dynamic(() => import('@shared-components/themeTable'), { loading: () => tableLoader() })
const PageHeader = dynamic(() => import('@shared-components/pageHeader'), { loading: () => pageHeaderLoader() })
const Ads = dynamic(() => import('@shared/components/ads'), { ssr: false })
const AllWidget = dynamic(() => import('@shared/components/allWidget'), { ssr: false })
// const MatchPreview = dynamic(() => import('@shared-components/match/matchPreview'), {
//   loading: () => (
//     <>
//       <Skeleton width={'100px'} />
//       <Skeleton height={'150px'} className={'mt-2'} />
//     </>
//   )
// })

const iccRankings = ({ data, seoData }) => {
  const { t } = useTranslation()
  const [rankData, setRankData] = useState(data?.getRankings?.aResults)
  const initialCall = useRef(false)
  const [filter, setFilter] = useState({ eMatchType: 'Tests', eRankType: 'Teams', nLimit: 120, nSkip: 0 })
  const [getRankData, { data: newRankData }] = useLazyQuery(RANKINGS)
  const personLabels = [t('common:Rank'), t('common:Name'), t('common:Team'), t('common:Rating')]
  const teamLabels = [t('common:Rank'), t('common:Team'), t('common:Rating'), t('common:Points')]
  const [width] = useWindowSize()

  const handleRankFilter = (value) => {
    setFilter({ ...filter, eRankType: value })
  }
  const handleMatchFilter = (value) => {
    setFilter({ ...filter, eMatchType: value })
  }

  useEffect(() => {
    newRankData && setRankData(newRankData?.getRankings?.aResults)
  }, [newRankData])

  useEffect(() => {
    initialCall.current && getRankData({ variables: { input: filter } })
  }, [filter])

  useEffect(() => {
    initialCall.current = true
  }, [])
  return (
    <Layout
      data={{
        oSeo: {
          ...seoData?.getSeoData,
          sTitle: t('common:ICCRanking.Title'),
          sDescription: t('common:ICCRanking.Description')
        }
      }}
    >
      <section className="common-section">
        <Container>
          <div className="d-none d-md-block my-3" style={{ minHeight: '90px' }}>
            {width > 767 && ( // Desktop top
              <Ads
                id="div-ad-gpt-138639789--0-Crictracker2022_Desktop_Top_970"
                adIdDesktop="Crictracker2022_Desktop_Top_970x90"
                dimensionDesktop={[970, 90]}
                className={'text-center'}
                style={{ minHeight: '90px' }}
              />
            )}
          </div>
          <Row>
            <Col lg={9} className="left-content">
              <PageHeader name="ICC Cricket Rankings - Team" />
              <Nav className={`${navStyles.commonNav} text-uppercase`} variant="pills">
                <Nav.Item className={navStyles.item}>
                  <a className={`${filter.eRankType === 'Teams' && navStyles.active} nav-link`} onClick={() => handleRankFilter('Teams')}>
                    {t('common:Teams')}
                  </a>
                </Nav.Item>
                <Nav.Item className={navStyles.item}>
                  <a
                    className={`${filter.eRankType === 'Batsmen' && navStyles.active} nav-link`}
                    onClick={() => handleRankFilter('Batsmen')}
                  >
                    {t('common:Batting')}
                  </a>
                </Nav.Item>
                <Nav.Item className={navStyles.item}>
                  <a
                    className={`${filter.eRankType === 'Bowlers' && navStyles.active} nav-link`}
                    onClick={() => handleRankFilter('Bowlers')}
                  >
                    {t('common:Bowling')}
                  </a>
                </Nav.Item>
                <Nav.Item className={navStyles.item}>
                  <a
                    className={`${filter.eRankType === 'AllRounders' && navStyles.active} nav-link`}
                    onClick={() => handleRankFilter('AllRounders')}
                  >
                    {t('common:AllRounder')}
                  </a>
                </Nav.Item>
              </Nav>
              <Nav className={`${navStyles.commonNav} ${navStyles.themeLightNav} text-uppercase equal-width-nav`} variant="pills">
                <Nav.Item className={navStyles.item}>
                  <a className={`${filter.eMatchType === 'Tests' && navStyles.active} nav-link`} onClick={() => handleMatchFilter('Tests')}>
                    {t('common:Test')}
                  </a>
                </Nav.Item>
                <Nav.Item className={navStyles.item}>
                  <a className={`${filter.eMatchType === 'Odis' && navStyles.active} nav-link`} onClick={() => handleMatchFilter('Odis')}>
                    {t('common:ODI')}
                  </a>
                </Nav.Item>
                <Nav.Item className={navStyles.item}>
                  <a
                    className={`${filter.eMatchType === 'T20s' && navStyles.active} nav-link`}
                    onClick={() => handleMatchFilter('T20s')}
                  >
                    {t('common:T20i')}
                  </a>
                </Nav.Item>
              </Nav>
              <section className={styles.awardsTable}>
                <ThemeTable labels={filter.eRankType === 'Teams' ? teamLabels : personLabels} isNumbered={true}>
                  {rankData?.map((element) => {
                    return (
                      <tr key={element._id} className={`${element.highlight && 'highlight'}`}>
                        <td>{element.nRank}</td>
                        <td>{element.sName}</td>
                        {filter.eRankType !== 'Teams' && <td className='text-uppercase'>{width < 767 ? element?.oPlayer?.sCountry : element?.oPlayer?.sCountryFull}</td>}
                        <td>{element.nRating}</td>
                        {filter.eRankType === 'Teams' && <td>{element.nPoints}</td>}
                      </tr>
                    )
                  })}
                </ThemeTable>
              </section>
              {width < 767 && (
                <Ads
                  id="div-ad-gpt-138639789-1646636899-0"
                  adIdDesktop="Crictracker2022_Desktop_Fix_ATF_728x90"
                  adIdMobile="Crictracker2022_Mobile_Fix_ATF_300x250"
                  dimensionDesktop={[728, 90]}
                  dimensionMobile={[300, 250]}
                  mobile
                  className="mb-3 text-center"
                />
              )}
              {/* <MatchPreview /> */}
            </Col>
            <Col lg={3} className="common-sidebar">
              <AllWidget type={WIDGET.cricSpecial} show />
              <Ads
                id="div-ad-gpt-138639789-1646636827-0"
                adIdDesktop="Crictracker2022_Desktop_Fix_RightATF_300x600"
                adIdMobile="Crictracker2022_Mobile_Fix_BTF2_336x280"
                dimensionDesktop={[300, 600]}
                dimensionMobile={[336, 280]}
                mobile
                className="sticky-ads"
              />
            </Col>
          </Row>
        </Container>
      </section>
    </Layout>
  )
}

iccRankings.propTypes = {
  data: PropTypes.object
}

export async function getServerSideProps({ res, resolvedUrl }) {
  try {
    res.setHeader('Cache-Control', 'public, max-age=420')
    const { data: seoData } = await queryGraphql(GET_ARTICLE_ID, { input: { sSlug: resolvedUrl.replaceAll('/', '').split('?')[0] || '' } })
    // Check Redirection
    const { redirectStatus, eCode, returnObj, props } = checkRedirectionStatus(seoData?.getSeoData)
    if (redirectStatus && props) {
      res.statusCode = eCode
      return { props }
    } else if (redirectStatus) return returnObj

    const { data } = await queryGraphql(RANKINGS, { input: { eMatchType: 'Tests', eRankType: 'Teams', nLimit: 10, nSkip: 0 } })
    return {
      props: {
        data,
        seoData
      }
    }
  } catch (e) {
    res.setHeader('Cache-Control', 'no-cache')
    const status = handleApiError(e)
    return status
  }
}

export default Error(iccRankings)
