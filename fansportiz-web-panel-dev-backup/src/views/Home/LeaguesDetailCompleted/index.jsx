import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { useQueryState } from 'react-router-use-location-state'
import LeagueHeader from '../components/LeagueHeader'
import { useSelector } from 'react-redux'
import LeaguesDetailCompletedPage from './LeaguesDetailCompleted'
import { useParams } from 'react-router-dom'

function LeaguesDetailCompleted (props) {
  // eslint-disable-next-line no-unused-vars
  const [activeState, setActiveState] = useQueryState('activeState', '2')
  const [VideoStream, setVideoStream] = useState(false)
  const [activeTab, setActiveTab] = useState('2')
  const matchDetails = useSelector(state => state.match.matchDetails)
  const toggle = tab => {
    if (activeTab !== tab) setActiveTab(tab)
  }

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
      <LeagueHeader VideoStream={VideoStream}
        completed={true}
        goToBack={matchDetails?.eStatus === 'L' ? `/live-match/leagues/${sportsType}/${sMatchId}` : ((matchDetails?.eStatus === 'I') || (matchDetails?.eStatus === 'CMP') ? `/completed-match/leagues/${sportsType}/${sMatchId}` : '')}
        setVideoStream={setVideoStream}
        {...props}
      />
      <LeaguesDetailCompletedPage {...props} activeTab={activeTab} leaguesInfo setActiveState={setActiveState} toggle={toggle}/>
    </>
  )
}

LeaguesDetailCompleted.propTypes = {
  location: PropTypes.shape({
    pathname: PropTypes.string,
    search: PropTypes.string
  }),
  match: PropTypes.object
}

export default LeaguesDetailCompleted
