import React, { Fragment, useEffect, useRef, useState } from 'react'
import PropTypes from 'prop-types'
import SportsHeader from '../../SportsHeader'
import SystemBotLogs from './SystemBotLogs'
import Navbar from '../../../../components/Navbar'
import { botLogsForMatchContest, getMatchLeagueDetails } from '../../../../actions/matchleague'
import { useDispatch, useSelector } from 'react-redux'
import { getMatchDetails } from '../../../../actions/match'

function SystemBotLogsPage (props) {
  const { match } = props
  const dispatch = useDispatch()
  const content = useRef()
  const token = useSelector(state => state.auth.token)
  const [matchLeagueName, setMatchLeagueName] = useState('')
  const [matchName, setMatchName] = useState('')
  const [loading, setLoading] = useState(false)

  const MatchDetails = useSelector(state => state.match.matchDetails)
  const matchLeagueDetails = useSelector(state => state.matchleague.matchLeagueDetails)
  const systemBotDetails = useSelector(state => state.matchleague.systemBotDetails)
  const sportsType = props.location.pathname.includes('cricket') ? 'cricket' : props.location.pathname.includes('football') ? 'football' : props.location.pathname.includes('basketball') ? 'basketball' : props.location.pathname.includes('kabaddi') ? 'kabaddi' : ''

  useEffect(() => {
    if (match.params.id) {
      dispatch(getMatchDetails(match.params.id, token))
    }
    if (match.params.id2) {
      getBotLogs(0, 10)
      dispatch(getMatchLeagueDetails(match.params.id2, token))
      setLoading(true)
    }
  }, [])

  useEffect(() => {
    if (MatchDetails) {
      setMatchName(MatchDetails.sName)
    }
  }, [MatchDetails])

  useEffect(() => {
    if (matchLeagueDetails) {
      setMatchLeagueName(matchLeagueDetails.sName)
      setLoading(false)
    }
  }, [matchLeagueDetails])

  function getBotLogs (start, limit) {
    dispatch(botLogsForMatchContest(start, limit, match.params.id2, token))
  }

  function onRefreshFun () {
    content.current.onRefresh()
  }

  function heading () {
    if (matchName && matchLeagueName) {
      if (window.innerWidth <= 480) {
        return <div>System Bot Logs <p className='mb-0'>{`(${matchName})`}</p> <p className='mb-0'>{`(${matchLeagueName})`}</p></div>
      } else {
        return <div>System Bot Logs {`(${matchName} - ${matchLeagueName})`}</div>
      }
    } else {
      return 'System Bot Logs'
    }
  }

  return (
    <Fragment>
      <Navbar {...props} />
      <main className="main-content">
        <section className="management-section common-box">
          <SportsHeader
            // heading={(matchName && matchLeagueName) ? `System Bot Logs (${matchName} - ${matchLeagueName})` : 'System Bot Logs'}
            heading={heading()}
            hidden
            refresh
            onRefresh={onRefreshFun}
            matchLeaguePage={`/${sportsType}/match-management/match-league-management/${match.params.id1}`}
          />
          <SystemBotLogs
            {...props}
            ref={content}
            loading={loading}
            setLoading={setLoading}
            systemBotDetails={systemBotDetails}
            getBotLogs={getBotLogs}
          />
        </section>
      </main>
    </Fragment>
  )
}

SystemBotLogsPage.propTypes = {
  match: PropTypes.object,
  location: PropTypes.object
}

export default SystemBotLogsPage
