import React, { useState, useRef, useEffect, Fragment } from 'react'
import { Container, Row, Col, Button } from 'react-bootstrap'
import dynamic from 'next/dynamic'
import PropTypes from 'prop-types'
import { useLazyQuery } from '@apollo/client'

import styles from './style.module.scss'
import useTranslation from 'next-translate/useTranslation'
import mobilefilter from '@assets/scss/components/mobile-filter.module.scss'
import Layout from '@shared-components/layout'
import { dayCal, decodeDay, currentDateMonth, getTimeZone, isBottomReached } from '@utils'
import { FANTASY_TIPS_LIST } from '@graphql/fantasy-tips/fantasy-tips.query'
import { fantasyTipsLoader, pageHeaderLoader } from '@shared/libs/allLoader'
import { WIDGET } from '@shared/constants'
import useWindowSize from '@shared/hooks/windowSize'

const PageHeader = dynamic(() => import('@shared-components/pageHeader'), { loading: () => pageHeaderLoader() })
const DateSlider = dynamic(() => import('@shared-components/dateSlider'))
const AllWidget = dynamic(() => import('@shared/components/allWidget'), { ssr: false })
const FantasyTipsFilter = dynamic(() => import('./filter'))
const FantasyTipsItems = dynamic(() => import('@shared-components/fantasyTipsItems'), {
  loading: () => fantasyTipsLoader()
})
const NoData = dynamic(() => import('../../noData'), { ssr: false })
const Ads = dynamic(() => import('@shared/components/ads'), { ssr: false })

export default function FantasyTipsList({ data, seoData }) {
  const { t } = useTranslation()
  const [fantasyTipsList, setFantasyTipsList] = useState(data)
  const [toggleFilter, setToggleFilter] = useState(false)
  const payloads = useRef({ dDay: currentDateMonth(), sSortBy: 'dStartDate', nOrder: 1, sTimezone: getTimeZone(), nLimit: 10, nSkip: 1 })
  const loading = useRef(false)
  const isReachedBottom = useRef(false)
  const fantasyTipsListRef = useRef(data)
  const isClear = useRef(false)
  const [parentClear, setParentClear] = useState(false)
  const month = []
  const dayArray = dayCal(month)
  const [width] = useWindowSize()

  const [getFantasyTips, { data: newFantasyTipsData, loading: isFantasyTipsLoading }] = useLazyQuery(FANTASY_TIPS_LIST)

  const latestFantasyTips = useRef(newFantasyTipsData?.listMatchFantasyTipsFront?.aResults?.length || data?.length)

  const handleFilter = () => {
    setToggleFilter(!toggleFilter)
  }

  const handleMonth = (value) => {
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
    isBottomReached(fantasyTipsList[fantasyTipsList.length - 1]?._id, isReached)
  }, [fantasyTipsList])

  useEffect(() => {
    if (isReachedBottom.current && newFantasyTipsData) {
      setFantasyTipsList([...fantasyTipsList, ...newFantasyTipsData?.listMatchFantasyTipsFront?.aResults])
      loading.current = false
      isReachedBottom.current = false
    } else if (!loading.current && newFantasyTipsData) {
      setFantasyTipsList(newFantasyTipsData?.listMatchFantasyTipsFront?.aResults)
    }
    latestFantasyTips.current = newFantasyTipsData?.listMatchFantasyTipsFront?.aResults?.length || data?.length
  }, [newFantasyTipsData])

  const filterChange = (format, team, series, type) => {
    const match = newFantasyTipsData?.listMatchFantasyTipsFront?.aResults || data
    setFantasyTipsList(
      match?.filter((data) => {
        let fantasyTipsData
        if (type) {
          if (type === 'format' && data?.sFormatStr === format) fantasyTipsData = data
          if (type === 'series' && data?.oSeries?.sTitle === series) fantasyTipsData = data
          if (type === 'team' && (data?.oTeamA?.sTitle === team || data?.oTeamB?.sTitle === team)) fantasyTipsData = data
          if (type === 'all') {
            isClear.current = true
          }
        }
        return fantasyTipsData
      })
    )
  }

  useEffect(() => {
    if (isClear.current) {
      setFantasyTipsList(fantasyTipsListRef.current)
      isClear.current = false
    }
  }, [isClear.current])

  return (
    <Layout data={{ oSeo: seoData }}>
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
            <Col lg={9} className="left-content" >
              <PageHeader
                name={t('common:FantasyTips')}
                desc=""
              />
              <div className={`${styles.fixtureFilter} d-none d-md-flex align-items-center`}>
                <FantasyTipsFilter
                  fantasyTipsList={fantasyTipsListRef.current}
                  filterChange={filterChange}
                  parentClear={parentClear}
                  setParentClear={setParentClear}
                />
              </div>
              <DateSlider dayArray={dayArray} handleMonth={handleMonth} selectedDay={payloads.current.dDay} />
              {fantasyTipsList &&
                fantasyTipsList.map((fantasy, index) => {
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
                            className="mb-2 text-center"
                          />
                        )}
                      </Fragment>
                    )
                  } else {
                    return <FantasyTipsItems key={fantasy._id} data={fantasy} />
                  }
                })}
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
              {fantasyTipsList?.length === 0 && <NoData />}
              <Button
                variant="link"
                onClick={handleFilter}
                className={`${mobilefilter.filterToggle} rounded-circle border-0 d-block d-md-none`}
              ></Button>
              <div className={`${mobilefilter.mobFixtureFilter} ${toggleFilter && mobilefilter.active}`}>
                <div className={`${mobilefilter.head} d-flex d-md-none justify-content-between align-items-center`}>
                  <p className="font-semi mb-0">{t('common:Filter')}</p>
                  <Button variant="link" onClick={handleFilter} className="btn-close"></Button>
                </div>
                <div className={`${mobilefilter.innerBlock}`}>
                  <FantasyTipsFilter />
                </div>
              </div>
            </Col>
            <Col lg={3} className="common-sidebar">
              <AllWidget type={WIDGET.currentSeries} show />
              <AllWidget type={WIDGET.ranking} show />
              <Ads
                id="div-ad-gpt-138639789-1646637134-0"
                adIdDesktop="Crictracker2022_Desktop_AP_RightATF_300x600"
                dimensionDesktop={[300, 600]}
                className="sticky-ads"
              />
            </Col>
          </Row>
        </Container>
      </section>
    </Layout>
  )
}

FantasyTipsList.propTypes = {
  data: PropTypes.array,
  seoData: PropTypes.object
}
