import React, { useRef, Fragment, useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import UserLeagueList from './UserLeagueList'
import PropTypes from 'prop-types'
import Navbar from '../../../../components/Navbar'
import { getUserLeaguesList } from '../../../../actions/league'
import SportsHeader from '../../SportsHeader'

function UserJoinLeague (props) {
  const { match } = props
  const content = useRef()
  const [userName, setUserName] = useState('')
  const [matchName, setMatchName] = useState('')
  const token = useSelector(state => state.auth.token)
  const userLeaguesList = useSelector(state => state.league.userLeaguesList)
  const dispatch = useDispatch()
  const sportsType = props.location.pathname.includes('cricket') ? 'cricket' : props.location.pathname.includes('football') ? 'football' : props.location.pathname.includes('basketball') ? 'basketball' : props.location.pathname.includes('kabaddi') ? 'kabaddi' : ''

  useEffect(() => {
    if (userLeaguesList && userLeaguesList[0]) {
      setUserName(userLeaguesList[0].sUserName)
      setMatchName(userLeaguesList[0].sMatchName)
    }
  }, [userLeaguesList])

  function getList (iMatchId, iUserId) {
    dispatch(getUserLeaguesList(iMatchId, iUserId, token))
  }

  function onRefreshFun () {
    content.current.onRefresh()
  }

  function heading () {
    if (userName && matchName) {
      if (window.innerWidth <= 480) {
        return <div>User League Management <p>{`(${userName} - ${matchName})`}</p></div>
      } else {
        return <div>User League Management {`(${userName} - ${matchName})`}</div>
      }
    }
  }

  return (
    <div>
      <Navbar {...props} />
      <main className="main-content">
        <section className="management-section common-box">
          <Fragment>
            <SportsHeader
              // heading={(userName && matchName) && `User League Management (${userName} - ${matchName})`}
              heading={heading()}
              userLeaguePage={`/${sportsType}/match-management/match-league-management/user-league/${match.params.id1}/${match.params.id2}`}
              hidden
              onRefresh={onRefreshFun}
              refresh
              permission
            />
            <UserLeagueList
              {...props}
              ref={content}
              sportsType={sportsType}
              List={userLeaguesList}
              getList={getList}
              userTeamPlayer={`/${sportsType}/match-management/match-league-management/user-league/user-team/user-team-player/${match.params.id1}`}
            />
          </Fragment>
        </section>
      </main>
    </div>
  )
}

UserJoinLeague.propTypes = {
  match: PropTypes.object,
  location: PropTypes.object
}

export default UserJoinLeague
