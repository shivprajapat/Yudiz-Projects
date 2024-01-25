import React, { useState, useRef, useEffect, useContext } from 'react'
import PropTypes from 'prop-types'
import { Container, Button } from 'react-bootstrap'
import { useLazyQuery, useSubscription } from '@apollo/client'

import styles from './style.module.scss'
import { stringArraySortByOrder } from '@shared/utils'
import { MINI_SCORECARD_SUBSCRIPTION } from '@graphql/home/home.subscription'
import { MINI_SCORECARD, SERIES_MINI_SCORECARD } from '@graphql/home/home.query'
import { scoreCardNavLoader, scoreCardSliderLoader } from '@shared/libs/allLoader'
import Slider from '@shared/components/slider'

import { GlobalEventsContext } from '../global-events'
import ScoreCard from './scorecard'

function ScorecardSlider({ isSeriesTitle, seriesId, data: seriesScoreCard }) {
  const cardData = useRef()
  const { dispatchGlobalEvents: editGlobalEvent } = useContext(GlobalEventsContext)
  const [scoreCardData, setScoreCardData] = useState()
  const [series, setSeries] = useState()
  const [activeCard, setActiveCard] = useState('all')

  const [getScoreCard, { data, loading }] = useLazyQuery(isSeriesTitle ? MINI_SCORECARD : SERIES_MINI_SCORECARD, {
    variables: { input: { _id: seriesId } }
  })

  typeof window !== 'undefined' && useSubscription(MINI_SCORECARD_SUBSCRIPTION, {
    onSubscriptionData: ({ subscriptionData }) => {
      if (subscriptionData?.data?.fetchMiniScorecardData) {
        const newData = subscriptionData?.data?.fetchMiniScorecardData
        const ids = newData.map((e) => e?.iMatchId)
        setScoreCardData(
          cardData.current?.map((m) => {
            if (ids.includes(m.iMatchId)) {
              return {
                ...m,
                ...newData.filter((e) => e.iMatchId === m.iMatchId)[0]
              }
            } else {
              return m
            }
          })
        )
      }
    }
  })
  const cardDataLength = !seriesId && data?.fetchMiniScorecardData?.length

  const handleSeries = (value) => {
    if (value === 'all') {
      setScoreCardData(cardData.current)
      setActiveCard('all')
    } else {
      setScoreCardData(cardData.current.filter((series) => series?.oSeries?.sSrtTitle === value || series?.oSeries?.sTitle === value))
      setActiveCard(value)
    }
  }

  const setScoreCardDetail = (card) => {
    setScoreCardData(card)
    cardData.current = card
    editGlobalEvent({
      type: 'SERIES_MINI_SCORE_CARD_DATA',
      payload: { seriesMiniScoreCardData: data?.listSeriesScorecard }
    })
  }

  useEffect(() => {
    setScoreCardDetail(seriesId ? data?.listSeriesScorecard : data?.fetchMiniScorecardData)
  }, [data])

  useEffect(() => {
    if (!seriesId) {
      const seriesArray = []
      data?.fetchMiniScorecardData?.map((series) => {
        return !seriesArray.includes(series?.oSeries?.sSrtTitle || series?.oSeries?.sTitle) && seriesArray.push(series?.oSeries?.sSrtTitle || series?.oSeries?.sTitle)
      })
      setSeries(stringArraySortByOrder({ data: seriesArray, order: ['IND vs SA', 'LLC', 'Women\'s Asia Cup', 'RSWS', 'T20 World Cup'] }))
    }
  }, [scoreCardData])

  useEffect(() => {
    if (isSeriesTitle) {
      getScoreCard()
    } else {
      setScoreCardDetail(seriesScoreCard)
    }
  }, [seriesScoreCard])

  return (
    <section className={`${styles.scorecardSlider} scorecard-slider`}>
      <Container>
        {isSeriesTitle && series?.length !== 0 && (
          <div className={`${styles.scorecardNav} text-nowrap scroll-list d-flex`}>
            <div className="d-flex m-auto">
              {cardDataLength > 0 && (
                <>
                  <Button
                    variant="link"
                    className={activeCard === 'all' && styles.active}
                    onClick={() => handleSeries('all')}
                  >{`All Matches (${cardDataLength})`}</Button>
                </>
              )}
              {series?.map((card, index) => {
                return (
                  <Button
                    variant="link"
                    key={`sNav${index}`}
                    className={activeCard === card && styles.active}
                    onClick={() => handleSeries(card)}
                  >
                    {card}
                  </Button>
                )
              })}
            </div>
          </div>
        )}
        {scoreCardData?.length !== 0 && (
          <Slider nav gap={16} destroyBelow={1199}>
            {scoreCardData?.map((card, index) => {
              return (
                <ScoreCard card={card} key={card?.iMatchId} seriesId={seriesId}/>
              )
            })}
          </Slider>
        )}
        {isSeriesTitle && loading && scoreCardNavLoader()}
        {loading && scoreCardSliderLoader(isSeriesTitle)}
      </Container>
    </section>
  )
}

ScorecardSlider.propTypes = {
  isSeriesTitle: PropTypes.bool,
  seriesId: PropTypes.string,
  data: PropTypes.array
}

export default ScorecardSlider
