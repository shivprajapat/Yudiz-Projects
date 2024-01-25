import React, { useState, useRef, useEffect } from 'react'
import PropTypes from 'prop-types'
import { Button } from 'react-bootstrap'
import useTranslation from 'next-translate/useTranslation'
import dynamic from 'next/dynamic'
import { useLazyQuery, useSubscription } from '@apollo/client'

import styles from '../../../../pages/live-scores/[...matchSlug]/style.module.scss'
import { GET_COMMENTARY } from '@graphql/match/match.query'
import { GET_COMMENTARY_SUBSCRIPTION } from '@graphql/match/match.subscription'
import { isBottomReached } from '@utils'
import { commentaryLoading } from '@shared/libs/allLoader'

const Commentary = dynamic(() => import('../commentary'))
const MatchDetailLive = dynamic(() => import('../matchDetailLive'))
const NoData = dynamic(() => import('@noData'), { ssr: false })

const MatchDetailCommentary = ({ data, matchDetail, liveScoreData, handleCommentary }) => {
  const { t } = useTranslation()
  const [commentaryData, setCommentaryData] = useState(data)
  const [enablebtn, setEnableBtn] = useState(data?.length > 14)
  const btnDisabled = useRef(false)
  const loading = useRef(false)
  const payloads = useRef({
    iMatchId: matchDetail?._id,
    nLimit: 15,
    sEventId: 0,
    nInningNumber: 0
  })

  const [getMoreCommentary, { data: updatedCommentary, loading: isCommentaryLoading }] = useLazyQuery(GET_COMMENTARY)
  typeof window !== 'undefined' && useSubscription(GET_COMMENTARY_SUBSCRIPTION, {
    variables: { input: { iMatchId: matchDetail?._id } },
    onSubscriptionData: ({ subscriptionData }) => {
      if (subscriptionData?.data?.listMatchCommentaries?.length) {
        handleCommentary()
        setCommentaryData([...subscriptionData?.data?.listMatchCommentaries, ...commentaryData])
      }
    }
  })

  const handleLoadMore = () => {
    setPayload()
    getMoreCommentary({ variables: { input: { ...payloads.current } } })
    setEnableBtn(false)
    btnDisabled.current = true
  }

  useEffect(() => {
    updatedCommentary && setCommentaryData([...commentaryData, ...updatedCommentary?.listMatchCommentaries])
  }, [updatedCommentary])

  useEffect(() => {
    // get last item from commentary data
    const lastItem = commentaryData[Object.keys(commentaryData)[Object.keys(commentaryData).length - 1]]
    payloads.current.sEventId = lastItem?.sEventId
    payloads.current.nInningNumber = lastItem?.nInningNumber
    if (btnDisabled) {
      loading.current = false
      isBottomReached(commentaryData[commentaryData.length - 1]?.sEventId, isReached)
    }
  }, [commentaryData])

  async function isReached(reach) {
    if (reach && !loading.current && updatedCommentary?.listMatchCommentaries?.length > 14) {
      loading.current = true
      setPayload()
      getMoreCommentary({ variables: { input: { ...payloads.current } } })
    }
  }

  function setPayload() {
    payloads.current = { ...payloads.current, sEventId: payloads.current.sEventId, nInningNumber: payloads.current.nInningNumber }
  }

  return (
    <>
      {(matchDetail?.sStatusStr === 'live' && matchDetail?.sLiveGameStatusStr !== 'innings break') && <MatchDetailLive styles={styles} matchDetail={matchDetail} liveScoreData={liveScoreData} />}
      {data?.length !== 0 &&
        <>
          <Commentary data={commentaryData} inning={matchDetail?.aInning} />
          {isCommentaryLoading && commentaryLoading()}
          {enablebtn && <div className="text-center my-3">
            <Button className="theme-btn" onClick={() => handleLoadMore()}>{t('common:LoadMore')}</Button>
          </div>}
        </>
      }
      {matchDetail?.sStatusStr !== 'live' && data?.length === 0 && <NoData />}
    </>
  )
}

MatchDetailCommentary.propTypes = {
  data: PropTypes.array,
  matchDetail: PropTypes.object,
  liveScoreData: PropTypes.array,
  handleCommentary: PropTypes.func
}

export default MatchDetailCommentary
