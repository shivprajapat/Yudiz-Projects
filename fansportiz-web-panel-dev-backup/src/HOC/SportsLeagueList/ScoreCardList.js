import React, { useEffect, useState, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getFetchLiveInnings } from '../../redux/actions/scoreCard'
import { useParams } from 'react-router-dom'

export const ScoreCardList = (Component) => {
  const MyComponent = (props) => {
    const [loading, setLoading] = useState(false)
    const dispatch = useDispatch()
    const fullLiveInning = useSelector(state => state.scoreCard.fullLiveInning)
    const resMessage = useSelector(state => state.scoreCard.resMessage)
    // const token = useSelector(state => state.auth.token) || localStorage.getItem('Token')
    const previousProps = useRef({ resMessage, fullLiveInning }).current

    const { sMatchId } = useParams()

    useEffect(() => {
      if (sMatchId) {
        dispatch(getFetchLiveInnings(sMatchId, ''))
        setLoading(true)
      }
    }, [])

    useEffect(() => {
      if (previousProps.fullLiveInning !== fullLiveInning) {
        if (fullLiveInning) {
          setLoading(false)
        }
      }
      return () => {
        previousProps.fullLiveInning = fullLiveInning
      }
    }, [fullLiveInning])

    return (
      <Component
        {...props}
        fullLiveInning={fullLiveInning}
        joinedLoading={loading}
      />
    )
  }
  MyComponent.displayName = MyComponent
  return MyComponent
}

export default ScoreCardList
