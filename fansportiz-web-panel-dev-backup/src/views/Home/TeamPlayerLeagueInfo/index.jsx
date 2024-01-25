import React from 'react'
import PlayerLeagueInfo from './ViewPlayerLeagueInfo'
import { useParams } from 'react-router-dom'

function PlayerLeagueInfoIndex (props) {
  const { sPlayerId } = useParams()

  return (
    <>
      <PlayerLeagueInfo {...props} isSeasonPoint pId={sPlayerId} />
    </>
  )
}

export default PlayerLeagueInfoIndex
