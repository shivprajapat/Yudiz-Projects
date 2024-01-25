import React, { useState, useRef, useEffect, Fragment } from 'react'
import { Container, Row, Col, Button } from 'react-bootstrap'
import dynamic from 'next/dynamic'
import PropTypes from 'prop-types'
import { useLazyQuery } from '@apollo/client'
import useTranslation from 'next-translate/useTranslation'
import { useRouter } from 'next/router'

import styles from './style.module.scss'
import mobilefilter from '@assets/scss/components/mobile-filter.module.scss'
import Layout from '@shared-components/layout'
import { dayCal, decodeDay, currentDateMonth, getTimeZone, isBottomReached, appendParams } from '@utils'
import { FANTASY_TIPS_LIST } from '@graphql/fantasy-tips/fantasy-tips.query'
import { fantasyTipsLoader, pageHeaderLoader } from '@shared/libs/allLoader'
import useWindowSize from '@shared/hooks/windowSize'
import { filterFantasyTips } from '@shared/libs/fantasyTipsFilter'
import { getDeviceInfo } from '@shared/libs/menu'

const PageHeader = dynamic(() => import('@shared-components/pageHeader'), { loading: () => pageHeaderLoader() })
const DateSlider = dynamic(() => import('@shared-components/dateSlider'))
const FantasyTipsFilter = dynamic(() => import('./filter'))
const FantasyTipsItems = dynamic(() => import('@shared-components/fantasyTipsItems'), {
  loading: () => fantasyTipsLoader()
})
const NoData = dynamic(() => import('@shared-components/noData'), { ssr: false })
const Ads = dynamic(() => import('@shared/components/ads'), { ssr: false })
const CurrentSeries = dynamic(() => import('@shared/components/widgets/currentSeries'))
const RankingTab = dynamic(() => import('@shared/components/rankingTab'), { ssr: false })

export default function FantasyTipsList({ data, seoData, category, sideBarData, filteredFantasyCricketTips }) {
  const { t } = useTranslation()
  const router = useRouter()
  const { dDay } = router?.query
  const [fantasyTipsList, setFantasyTipsList] = useState(filteredFantasyCricketTips?.length ? filteredFantasyCricketTips : data)
  const fantasyTipsListRef = useRef(data)
  const [parentClear, setParentClear] = useState(false)
  const [toggleFilter, setToggleFilter] = useState(false)
  const payloads = useRef({ dDay: dDay || currentDateMonth(), sSortBy: 'dStartDate', nOrder: 1, sTimezone: getTimeZone(), nLimit: 50, nSkip: 1 })
  const loading = useRef(false)
  const isReachedBottom = useRef(false)
  const month = []
  const dayArray = dayCal(month)
  const [width] = useWindowSize()
  const { isMobile } = getDeviceInfo()

  const [getFantasyTips, { data: newFantasyTipsData, loading: isFantasyTipsLoading }] = useLazyQuery(FANTASY_TIPS_LIST)

  const latestFantasyTips = useRef(newFantasyTipsData?.listMatchFantasyTipsFront?.aResults?.length || data?.length)

  const handleFilter = () => {
    setToggleFilter(!toggleFilter)
  }

  const handleMonth = (value) => {
    appendParams({ dDay: decodeDay(value), eFormat: undefined, sSeries: undefined, sTeam: undefined })
    payloads.current = { ...payloads.current, dDay: decodeDay(value), nSkip: 1 }
    getFantasyTips({ variables: { input: payloads.current } })
    setParentClear(true)
  }

  async function isReached(reach) {
    if (reach && !loading.current && latestFantasyTips.current === payloads.current.nLimit) {
      loading.current = true
      isReachedBottom.current = true
      payloads.current = { ...payloads.current, nSkip: payloads.current.nSkip + 1 }
      getFantasyTips({ variables: { input: payloads.current } })
    }
  }

  useEffect(() => {
    loading.current = false
    isBottomReached(fantasyTipsList[fantasyTipsList?.length - 1]?._id, isReached)
  }, [fantasyTipsList])

  useEffect(() => {
    const fnData = newFantasyTipsData?.listMatchFantasyTipsFront?.aResults
    if (isReachedBottom.current && newFantasyTipsData) {
      setFantasyTipsList([...fantasyTipsList, ...fnData])
      loading.current = false
      isReachedBottom.current = false
    } else if (!loading.current && newFantasyTipsData) {
      fantasyTipsListRef.current = fnData
      setFantasyTipsList(fnData)
    }
    latestFantasyTips.current = fnData?.length === 0 ? 1 : fnData?.length || data?.length
  }, [newFantasyTipsData])

  function filterChange(format, team, series, type = undefined) {
    if (type === 'all') {
      setFantasyTipsList(fantasyTipsListRef.current)
    } else {
      setFantasyTipsList(filterFantasyTips(fantasyTipsList, format, team, series))
    }
  }

  return (
    <Layout data={{ oSeo: seoData }}>
      <section className="common-section">
        <Container>
          <div className="d-none d-md-block mb-3" style={{ minHeight: '90px', marginTop: '-15px' }}>
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
            <Col lg={9} className="left-content" >
              <PageHeader
                name={category?.sName}
                desc={category?.sContent}
                id={seoData?.iId}
              />
              {width > 768 && (
                <div className={`${styles.fixtureFilter} d-none d-md-flex align-items-center`}>
                  <FantasyTipsFilter
                    fantasyTipsList={fantasyTipsListRef.current}
                    filterChange={filterChange}
                    parentClear={parentClear}
                    setParentClear={setParentClear}
                  />
                </div>
              )}
              <DateSlider dayArray={dayArray} handleMonth={handleMonth} selectedDay={payloads.current.dDay} isSticky />
              {fantasyTipsList?.length > 0 ? (
                fantasyTipsList?.map((fantasy, index) => {
                  if (index === 3) {
                    return (
                      <Fragment key={fantasy?._id}>
                        <FantasyTipsItems data={fantasy} />
                        {width < 768 && (
                          <Ads
                            id="div-ad-gpt-138639789-1646637094-0"
                            adIdDesktop="Crictracker2022_Desktop_AP_ATF_728x90"
                            adIdMobile="Crictracker2022_Mobile_AP_ATF_300x250"
                            dimensionDesktop={[728, 90]}
                            dimensionMobile={[300, 250]}
                            mobile
                            className="mt-2 text-center"
                          />
                        )}
                      </Fragment>
                    )
                  } else {
                    return <FantasyTipsItems key={fantasy._id} data={fantasy} />
                  }
                })) : <NoData />}
              {isFantasyTipsLoading && fantasyTipsLoader()}
              {fantasyTipsList?.length < 4 && width < 768 && (
                <Ads
                  id="div-ad-gpt-138639789-1646637094-0"
                  adIdDesktop="Crictracker2022_Desktop_AP_ATF_728x90"
                  adIdMobile="Crictracker2022_Mobile_AP_ATF_300x250"
                  dimensionDesktop={[728, 90]}
                  dimensionMobile={[300, 250]}
                  mobile
                  className="mb-2 text-center"
                />)
              }
              <Button
                variant="link"
                onClick={handleFilter}
                className={`${mobilefilter.filterToggle} border-0 d-block d-md-none position-fixed start-50 translate-middle-x c-transition`}
              >
                {t('common:Filter')}
              </Button>
              {
                width < 768 && (
                  <div className={`${mobilefilter.mobFixtureFilter} ${toggleFilter && mobilefilter.active} light-bg position-fixed vw-100`}>
                    <div className={`${mobilefilter.head} d-flex d-md-none justify-content-between align-items-center`}>
                      <p className="font-semi mb-0">{t('common:Filter')}</p>
                      <Button variant="link" onClick={handleFilter} className="btn-close"></Button>
                    </div>
                    <div className={`${mobilefilter.innerBlock}`}>
                      <FantasyTipsFilter
                        fantasyTipsList={fantasyTipsListRef.current}
                        filterChange={filterChange}
                        parentClear={parentClear}
                        setParentClear={setParentClear}
                        isMobile
                      />
                    </div>
                  </div>
                )
              }
            </Col>
            {(width > 767 || !isMobile) && (
              <Col lg={3} className="common-sidebar">
                <CurrentSeries data={sideBarData?.currentSeries} />
                <RankingTab data={sideBarData?.ranking} />
                {/* <AllWidget type={WIDGET.currentSeries} show /> */}
                {/* <AllWidget type={WIDGET.ranking} show /> */}
                <Ads
                  id="div-ad-gpt-138639789-1646637134-0"
                  adIdDesktop="Crictracker2022_Desktop_AP_RightATF_300x600"
                  dimensionDesktop={[300, 600]}
                  className="sticky-ads position-sticky mb-2"
                />
              </Col>
            )}
          </Row>
        </Container>
      </section>
    </Layout>
  )
}

FantasyTipsList.propTypes = {
  data: PropTypes.array,
  filteredFantasyCricketTips: PropTypes.array,
  seoData: PropTypes.object,
  category: PropTypes.object,
  sideBarData: PropTypes.object
}
