import React, { useState, useEffect } from 'react'
// import PropTypes from 'prop-types'
import { useQueryState } from 'react-router-use-location-state'
import LeagueHeader from '../components/LeagueHeader'
import LeaguesCompletedPage from './LeaguesCompleted'
import { useLocation, useParams } from 'react-router-dom'

function LeaguesCompleted (props) {
  // eslint-disable-next-line no-unused-vars
  const [activeState, setActiveState] = useQueryState('activeState', '1')
  const [VideoStream, setVideoStream] = useState(false)
  const [activeTab, setActiveTab] = useState('1')
  const toggle = tab => {
    if (activeTab !== tab) setActiveTab(tab)
  }

  const location = useLocation()
  const { sMatchId, sportsType, activeState: ActiveState } = useParams()

  useEffect(() => {
    if (ActiveState) {
      if (ActiveState) {
        const active = ActiveState
        setActiveState(active)
        toggle(active)
      }
    }
  }, [])
  return (
    <>
      <LeagueHeader
        {...props}
        VideoStream={VideoStream}
        backTab={location.pathname === `/live-match/leagues/${sportsType}/${sMatchId}` ? '2' : location.pathname === `/completed-match/leagues/${sportsType}/${sMatchId}` ? '3' : '1'}
        completed
        goToBack={`/matches/${sportsType}`}
        setVideoStream={setVideoStream}
        showBalance
      />
      <LeaguesCompletedPage {...props} activeTab={activeTab} setActiveState={setActiveState} toggle={toggle}/>
    </>
  )
}

LeaguesCompleted.propTypes = {
}

export default LeaguesCompleted
