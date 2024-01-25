import React, { useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { viewScoreCard } from '../../../../redux/actions/scoreCard'
import { useParams } from 'react-router-dom'

function ScoreCards (props) {
  const dispatch = useDispatch()
  const scoreCardData = useSelector(state => state.scoreCard.scoreCard)
  const inningEleRef = useRef('')
  const previousProps = useRef({ scoreCardData }).current

  const { sMatchId } = useParams()

  useEffect(() => {
    dispatch(viewScoreCard(sMatchId))
  }, [])

  useEffect(() => {
    if (previousProps.scoreCardData !== scoreCardData) {
      if (scoreCardData && inningEleRef.current) {
        const fragment = document.createRange().createContextualFragment(scoreCardData)
        inningEleRef?.current?.append(fragment)
      }
    }
    return () => {
      previousProps.scoreCardData = scoreCardData
    }
  }, [scoreCardData])

  return (<div ref={inningEleRef} className='score-cards' />)
}

export default ScoreCards
