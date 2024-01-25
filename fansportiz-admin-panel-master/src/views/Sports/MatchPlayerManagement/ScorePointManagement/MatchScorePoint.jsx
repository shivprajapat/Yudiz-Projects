import React, { Fragment, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Navbar from '../../../../components/Navbar'
import { getMatchPlayerScorePoint, updateMPScorePoint } from '../../../../actions/matchplayer'
import PlayerScorePoints from './PlayerScorePoints'
import PropTypes from 'prop-types'

function MatchScorePoint (props) {
  const [matchId, setMatchId] = useState('')
  const [matchPlayerId, setmatchPlayerId] = useState('')
  const token = useSelector(state => state.auth.token)
  const dispatch = useDispatch()
  const matchPlayerScoreList = useSelector(state => state.matchplayer.matchPlayerScorePointList)
  const SportsType = props.location.pathname.includes('cricket') ? 'cricket' : props.location.pathname.includes('football') ? 'football' : props.location.pathname.includes('basketball') ? 'basketball' : props.location.pathname.includes('kabaddi') ? 'kabaddi' : ''

  useEffect(() => {
    const { match } = props
    if (match.params.id1 && match.params.id2) {
      setmatchPlayerId(match.params.id2)
      setMatchId(match.params.id1)
    }
    if (match.params.id1) {
      setMatchId(match.params.id1)
    }
  }, [])

  // dispatch action to get player's score point
  function getList (matchPlayerid) {
    dispatch(getMatchPlayerScorePoint(token, matchPlayerid))
  }

  // dispatch action to update player's score point
  function updateMPScorePointFun (aPointBreakup, matchPlayerid) {
    dispatch(updateMPScorePoint(aPointBreakup, matchPlayerid, token))
  }

  return (
    <Fragment>
      <Navbar {...props} />
      <main className='main-content'>
        <section className='management-section common-box'>
          <PlayerScorePoints
            {...props}
            getList={getList}
            SportsType={SportsType}
            updateMPScorePoint={updateMPScorePointFun}
            matchPlayerScoreList={matchPlayerScoreList}
            aCancelLink={`/${SportsType}/match-management/match-player-management/add-match-player/${matchId}`}
            eCancelLink={`/${SportsType}/match-management/match-player-management/update-match-player/${matchId}/${matchPlayerId}`}
          />
        </section>
      </main>
    </Fragment>
  )
}

MatchScorePoint.propTypes = {
  location: PropTypes.object,
  match: PropTypes.object
}

export default MatchScorePoint
