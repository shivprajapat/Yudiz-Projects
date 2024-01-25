import React, { useState, useRef, useEffect, useContext } from 'react'
import PropTypes from 'prop-types'
import dynamic from 'next/dynamic'
import { Container, Button } from 'react-bootstrap'
import { useLazyQuery, useSubscription } from '@apollo/client'

import styles from './style.module.scss'
import { MINI_SCORECARD_SUBSCRIPTION } from '@graphql/home/home.subscription'
import { MINI_SCORECARD, MINI_SCORECARD_HEADER, SERIES_MINI_SCORECARD } from '@graphql/home/home.query'
import { scoreCardNavLoader, scorecardItemLoader } from '@shared/libs/allLoader'
// import Slider from '@shared/components/slider'
import ScoreCard from '@shared/components/scorecardSlider/scorecard'
import GlobalEventsContext from '@shared/components/global-events/GlobalEventsContext'
import useOnMouseAndScroll from '@shared/hooks/useOnMouseAndScroll'
import useWindowSize from '@shared/hooks/windowSize'

const Ads = dynamic(() => import('@shared/components/ads'), { ssr: false })
const Slider = dynamic(() => import('@shared/components/slider'), { loading: () => scorecardItemLoader() })
// const ScoreCard = dynamic(() => import('@shared/components/scorecardSlider/scorecard'), { loading: () => scoreCardSliderLoader(true) })

function ScorecardSlider({ isSeriesTitle, seriesId, data: seriesScoreCard, adData }) {
  const cardData = useRef()
  const [scoreCardData, setScoreCardData] = useState(seriesScoreCard?.length > 0 ? seriesScoreCard : [])
  const activeCard = useRef('all')
  const { stateGlobalEvents, dispatchGlobalEvents } = useContext(GlobalEventsContext)
  const { isLoaded } = useOnMouseAndScroll()
  const [width] = useWindowSize()

  const [getHeader, { data: header, loading: loadingHeader }] = useLazyQuery(MINI_SCORECARD_HEADER)

  const [getScoreCard, { data }] = useLazyQuery(isSeriesTitle ? MINI_SCORECARD : SERIES_MINI_SCORECARD, {
    variables: { input: { _id: seriesId } }
  })

  typeof window !== 'undefined' && useSubscription(MINI_SCORECARD_SUBSCRIPTION, {
    onSubscriptionData: ({ subscriptionData }) => {
      if (subscriptionData?.data?.fetchMiniScorecardData) {
        const newData = subscriptionData?.data?.fetchMiniScorecardData
        const ids = newData.map((e) => e?.iMatchId)
        cardData.current = cardData.current?.map((m) => {
          if (ids.includes(m.iMatchId)) {
            return {
              ...m,
              ...newData.filter((e) => e.iMatchId === m.iMatchId)[0]
            }
          } else {
            return m
          }
        })
        const filterData = activeCard.current === 'all' ? cardData.current : cardData.current.filter((series) => series?.oSeries?._id === activeCard.current)
        setScoreCardData(filterData)
        // updateHomePageArticleScore(cardData.current)
      }
    }
  })
  const cardDataLength = !seriesId && data?.fetchMiniScorecardData?.length

  const handleSeries = (value) => {
    if (value === 'all') {
      activeCard.current = 'all'
      setScoreCardData(cardData.current)
    } else {
      activeCard.current = value
      setScoreCardData(cardData.current.filter((series) => series?.oSeries?._id === value))
    }
  }

  const setScoreCardDetail = (card) => {
    setScoreCardData(card)
    cardData.current = card
  }

  useEffect(() => {
    if (seriesId) {
      setScoreCardDetail(data?.listSeriesScorecard)
    } else {
      setScoreCardDetail(data?.fetchMiniScorecardData)
      // updateHomePageArticleScore(data?.fetchMiniScorecardData)
    }
  }, [data])

  useEffect(() => {
    if (isSeriesTitle) {
      getScoreCard()
      getHeader()
      if (seriesScoreCard?.length) setScoreCardDetail(seriesScoreCard)
    } else {
      setScoreCardDetail(seriesScoreCard)
    }
  }, [seriesScoreCard])

  // eslint-disable-next-line no-unused-vars
  function updateHomePageArticleScore(updatedData) {
    if (isSeriesTitle) {
      dispatchGlobalEvents({
        type: 'HOME_ARTICLE_UPDATE',
        payload: { ...stateGlobalEvents, homeArticle: updatedData }
      })
    }
  }

  // function random(numbers = []) {
  //   return numbers[Math.floor(Math.random() * numbers.length)]
  // }
  return (
    <section className={`${styles.scorecardSlider} scorecard-slider ${seriesId ? 'pt-3' : 'pt-0'} overflow-hidden pb-3`}>
      <Container>
        {isSeriesTitle && header?.getMiniScoreCardHeader?.length > 0 && (
          <div className={`${styles.scorecardNav} xsmall-text text-nowrap scroll-list d-flex pb-1`}>
            <div className="d-flex m-auto">
              {cardDataLength > 0 && (
                <>
                  <Button
                    variant="link"
                    className={`${activeCard.current === 'all' ? styles.active : ''} ${styles.cardbtn} py-1 px-2 mx-1 fw-bold text-uppercase br-sm`}
                    onClick={() => handleSeries('all')}
                  >{`All Matches (${cardDataLength})`}</Button>
                </>
              )}
              {header?.getMiniScoreCardHeader?.map((series, index) => {
                return (
                  <Button
                    variant="link"
                    key={series?.oSeries?._id}
                    className={`${activeCard.current === series?.oSeries?._id ? styles.active : ''} ${styles.cardbtn} py-1 px-2 mx-1 fw-bold text-uppercase br-sm`}
                    onClick={() => handleSeries(series?.oSeries?._id)}
                  >
                    {series?.oSeries?.sSrtTitle || series?.oSeries?.sTitle}
                  </Button>
                )
              })}
            </div>
          </div>
        )}
        {isSeriesTitle && (loadingHeader) && scoreCardNavLoader()}
        {/* {scoreCardData?.length !== 0 && ( */}
        <Slider className={`${styles.sliderMain} mx-n1`} nav={width > 1199} gap={0} destroyBelow={1199}>
          {scoreCardData?.map((card, index) => {
            if (index === 1 && ((adData?.adIdDesktop && width > 767) || (adData?.adIdMobile && width < 767))) {
              return (
                <React.Fragment key={card?.iMatchId} >
                  <div>
                    <Ads
                      {...adData}
                      className={'text-center p-0 rounded d-flex align-items-center justify-content-center bg-transparent'}
                      style={{
                        transition: '0.5s all',
                        transitionDelay: '0.1s',
                        width: isLoaded ? '330px' : '0px'
                      }}
                    />
                  </div>
                  <ScoreCard card={card} seriesId={seriesId} />
                </React.Fragment>
              )
            } else {
              return (
                <ScoreCard card={card} key={card?.iMatchId} seriesId={seriesId} />
              )
            }
          })}
        </Slider>
        {/* )} */}
        {/* {(loading) && scoreCardSliderLoader(isSeriesTitle)} */}
      </Container>
    </section>
  )
}

ScorecardSlider.propTypes = {
  isSeriesTitle: PropTypes.bool,
  seriesId: PropTypes.string,
  data: PropTypes.array,
  adData: PropTypes.object
}

export default ScorecardSlider
