import React, { useEffect, useState, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getPlayerScorePoints, getPlayerSeasonNames } from '../../redux/actions/player'
import PropTypes from 'prop-types'
import { useParams } from 'react-router-dom'

export const PlayerDetails = (Component) => {
  const MyComponent = (props) => {
    const { pId, isSeasonPoint } = props
    const dispatch = useDispatch()
    const token = useSelector(state => state.auth.token) || localStorage.getItem('Token')
    const resStatus = useSelector(state => state.player.resStatus)
    const resMessage = useSelector(state => state.player.resMessage)
    const pointBreakUp = useSelector(state => state.player.pointBreakUp)
    const nScoredPoints = useSelector(state => state.player.nScoredPoints)
    const playerData = useSelector(state => state.player.playerData)
    const seasonMatch = useSelector(state => state.player.seasonMatch)
    const matchPlayerList = useSelector(state => state.player.matchPlayer)
    const [loading, setLoading] = useState(false)
    const previousProps = useRef({
      seasonMatch, pointBreakUp, nScoredPoints
    }).current

    const { sPlayerId } = useParams()

    useEffect(() => {
      if (isSeasonPoint && token) {
        if (pId) {
          dispatch(getPlayerSeasonNames(pId, token))
          setLoading(true)
        } else {
          sPlayerId && (
            dispatch(getPlayerSeasonNames(sPlayerId, token))
          )
          setLoading(true)
        }
      }
      setLoading(true)
    }, [token])

    useEffect(() => {
      if (previousProps.seasonMatch !== seasonMatch) {
        if (seasonMatch) {
          setLoading(false)
        }
      }
      return () => {
        previousProps.seasonMatch = seasonMatch
      }
    }, [seasonMatch])

    useEffect(() => {
      if (previousProps.pointBreakUp !== pointBreakUp) {
        if (pointBreakUp && pointBreakUp.length) {
          setLoading(false)
        }
      }
      return () => {
        previousProps.pointBreakUp = pointBreakUp
      }
    }, [pointBreakUp])

    function playerScorePoints (pID) {
      if (token) {
        dispatch(getPlayerScorePoints(pID, token))
        setLoading(true)
      }
    }

    function playerSeasonNames (pID) {
      if (token && pID) {
        dispatch(getPlayerSeasonNames(pID, token))
        dispatch(getPlayerScorePoints(pID, token))
        setLoading(true)
      }
    }

    return (
      <Component
        {...props}
        loading={loading}
        matchPlayerList={matchPlayerList}
        nScoredPoints={nScoredPoints}
        playerData={playerData}
        playerScorePoints={playerScorePoints}
        playerSeasonNames={playerSeasonNames}
        pointBreakUp={pointBreakUp}
        resMessage={resMessage}
        resStatus={resStatus}
        seasonMatch={seasonMatch}
        token={token}
      />
    )
  }
  MyComponent.propTypes = {
    match: PropTypes.object,
    pId: PropTypes.string,
    isSeasonPoint: PropTypes.bool
  }
  MyComponent.displayName = MyComponent
  return MyComponent
}

export default PlayerDetails
