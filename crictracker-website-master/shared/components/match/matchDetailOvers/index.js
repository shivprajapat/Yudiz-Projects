import React, { useState, useRef, useEffect } from 'react'
import dynamic from 'next/dynamic'
import PropTypes from 'prop-types'
import { useRouter } from 'next/router'
import { Button, Nav } from 'react-bootstrap'
import useTranslation from 'next-translate/useTranslation'
import { useLazyQuery, useSubscription } from '@apollo/client'

import navStyles from '@shared-components/commonNav/style.module.scss'
import styles from './style.module.scss'
import { GET_MATCH_OVERS } from '@graphql/match/match.query'
import { GET_RECENT_OVER } from '@graphql/match/match.subscription'
import { checkIsGlanceView, isBottomReached } from '@utils'
import { oversLoader } from '@shared/libs/allLoader'

const OverList = dynamic(() => import('../overList'))
const Ads = dynamic(() => import('@shared/components/ads'), { ssr: false })
const GlanceAd = dynamic(() => import('@shared-components/ads/glanceAd'), { ssr: false })

const MatchDetailOvers = ({ data, matchDetail }) => {
  const { t } = useTranslation()
  const router = useRouter()
  const [selectedTab, setSelectedTab] = useState(matchDetail.nLatestInningNumber)
  const [enablebtn, setEnableBtn] = useState(data?.nTotal > 5)
  const tabChange = useRef(false)
  const total = useRef(data?.nTotal)
  const loading = useRef(false)
  const btnDisabled = useRef(false)
  const [overData, setOverData] = useState(data?.aResults)
  const isGlanceView = checkIsGlanceView(router?.query)
  const payloads = useRef({
    iMatchId: matchDetail?._id,
    nLimit: 5,
    nInningNumber: matchDetail.nLatestInningNumber,
    sOver: null,
    isFront: true
  })

  const [getMoreOvers, { loading: overLoading }] = useLazyQuery(GET_MATCH_OVERS, { fetchPolicy: 'network-only' })

  typeof window !== 'undefined' && useSubscription(GET_RECENT_OVER, {
    variables: { input: { iMatchId: matchDetail?._id, nInningNumber: matchDetail?.nLatestInningNumber } },
    onSubscriptionData: ({ subscriptionData }) => {
      const over = subscriptionData?.data?.listMatchOvers
      if (over) {
        if (overData[0]?.sOver === over?.sOver) {
          setOverData(overData?.map((item) => {
            if (item?.sOver === over?.sOver) {
              return { ...item, aBall: over?.aBall }
            }
            return item
          }))
        } else {
          setOverData([over, ...overData])
        }
      }
    }
  })

  const handleLoadMore = () => {
    payloads.current = { ...payloads.current, nInningNumber: selectedTab }
    getMoreOvers({ variables: { input: { ...payloads.current } } }).then((updatedOverData) => {
      updatedOverData.data && setOverData([...overData, ...updatedOverData.data?.listMatchOvers?.aResults])
    })
    setEnableBtn(false)
    btnDisabled.current = true
  }

  const handleInning = (inning) => {
    if (selectedTab !== inning?.nInningNumber) {
      tabChange.current = true
      setSelectedTab(inning.nInningNumber)
      payloads.current = { ...payloads.current, nInningNumber: inning.nInningNumber, sOver: null }
      getMoreOvers({ variables: { input: { ...payloads.current } } }).then((updatedOverData) => {
        updatedOverData?.data && setOverData(updatedOverData?.data?.listMatchOvers?.aResults)
      })
      setEnableBtn(true)
      btnDisabled.current = false
    }
  }

  useEffect(() => {
    // get last over from overData
    const lastItem = overData[Object.keys(overData)[Object.keys(overData).length - 1]]
    payloads.current.sOver = lastItem?.sOver
    if (btnDisabled.current) {
      loading.current = false
      const tempId = overData[overData.length - 1]?.sOver + overData[overData.length - 1]?.nInningNumber
      isBottomReached(tempId, isReached)
    }
  }, [overData])

  async function isReached(reach) {
    if (reach && !loading.current && overData?.length < total.current) {
      loading.current = true
      setPayload()
      getMoreOvers({ variables: { input: { ...payloads.current } } }).then((updatedOverData) => {
        updatedOverData.data && setOverData([...overData, ...updatedOverData.data?.listMatchOvers?.aResults])
      })
    }
  }

  function setPayload() {
    payloads.current = { ...payloads.current }
  }

  return (
    <>
      <Nav className={`${styles.navTab} text-uppercase flex-nowrap text-nowrap ${matchDetail?.aInning.length > 2 && styles.testMatch} `} variant="pills">
        {matchDetail?.aInning?.map((inning, index) => {
          return (
            <Nav.Item className={navStyles.item} key={index} onClick={() => handleInning(inning)}>
              <a className={`${selectedTab === inning?.nInningNumber ? 'active pe-none' : ''} nav-link`}>
                {inning?.sShortName}
              </a>
            </Nav.Item>
          )
        })}
      </Nav>
      {!overLoading && overData?.map((over, index) => {
        return (
          <React.Fragment key={index}>
            {isGlanceView && index === 2 && (
              <GlanceAd
                id={`div-gpt-ad-9${new Date().getTime() * ((Math.random() + 1) * 1000)}`}
                adId="Crictracker_mrec_mid"
                dimension={[[300, 250], [336, 280], 'fluid']}
                adUnitName="Crictracker_Sportstab_InArticleMedium_Mid2"
                placementName="InArticleMedium"
                className="d-flex justify-content-center"
                width={300}
                height={250}
                pageName="Crictracker SportsTab"
              />
            )}
            {index === 5 && (
              <Ads
                id="div-ad-gpt-138639789-1660147282-2"
                adIdDesktop="Crictracker2022_Mobile_LiveScore_MID_300x250"
                // adIdMobile="Crictracker2022_Desktop_LiveScore_MID_728x90"
                dimensionDesktop={[300, 250]}
                // dimensionMobile={[300, 250]}
                // mobile
                className={'text-center mb-3 d-md-none'}
              />
            )}
            {/* {index === 10 && (
              <Ads
                id="div-ad-gpt-138639789-1660147282-3"
                adIdDesktop="Crictracker2022_Desktop_LiveScore_MID2_728x90"
                adIdMobile="Crictracker2022_Mobile_LiveScore_MID2_300x250"
                dimensionDesktop={[728, 90]}
                dimensionMobile={[300, 250]}
                mobile
                className={'text-center mb-3 d-none d-md-block'}
              />
            )} */}
            <OverList data={over} id={over?.sOver + over?.nInningNumber} />
          </React.Fragment>
        )
      })}
      {overLoading && oversLoader()}
      {enablebtn && (total.current > 3) && (
        <div className="text-center my-2">
          <Button className="theme-btn" onClick={() => handleLoadMore()}>{t('common:LoadMore')}</Button>
        </div>
      )}
      {isGlanceView && (
        <GlanceAd
          id={`div-gpt-ad-7${new Date().getTime() * ((Math.random() + 1) * 1000)}`}
          adId="Crictracker_mrec_bottom"
          dimension={[[300, 250], [336, 280], 'fluid']}
          className="mt-2 d-flex justify-content-center"
          adUnitName="Crictracker_Sportstab_InArticleMedium_Mid3"
          placementName="InArticleMedium"
          pageName="Crictracker SportsTab"
          width={300}
          height={250}
        />
      )}
    </>
  )
}

MatchDetailOvers.propTypes = {
  data: PropTypes.object,
  matchDetail: PropTypes.object
}

export default MatchDetailOvers
