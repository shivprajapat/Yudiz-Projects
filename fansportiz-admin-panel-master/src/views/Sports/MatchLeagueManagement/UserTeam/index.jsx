import React, { useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import UserTeamList from './UserTeamList'
import SportsHeader from '../../SportsHeader'
import NavbarComponent from '../../../../components/Navbar'
import PropTypes from 'prop-types'
import { getUserTeamList } from '../../../../actions/matchleague'

function UserTeam (props) {
  const { match } = props
  const content = useRef()
  const token = useSelector(state => state.auth.token)
  const userTeamList = useSelector(state => state.matchleague.userTeamList)
  const dispatch = useDispatch()
  const sportsType = props.location.pathname.includes('cricket') ? 'cricket' : props.location.pathname.includes('football') ? 'football' : props.location.pathname.includes('basketball') ? 'basketball' : props.location.pathname.includes('kabaddi') ? 'kabaddi' : ''

  function getList (iMatchId, iUserId) {
    dispatch(getUserTeamList(iMatchId, iUserId, token))
  }

  function onRefreshFun () {
    content.current.onRefresh()
  }

  return (
    <div>
      <NavbarComponent {...props} />
      <main className="main-content">
        <section className="management-section common-box">
          <SportsHeader
            heading="User Teams"
            userLeaguePage={`/${sportsType}/match-management/match-league-management/user-league/${match.params.id1}/${match.params.id2}`}
            hidden
            onRefresh={onRefreshFun}
            refresh
            permission
          />
          <UserTeamList
            {...props}
            ref={content}
            List={userTeamList}
            getList={getList}
            userTeam={`/${sportsType}/match-management/match-league-management/user-league/user-team/user-team-player/${match.params.id1}`}
          />
        </section>
      </main>
    </div>
  )
}

UserTeam.propTypes = {
  match: PropTypes.object,
  location: PropTypes.object
}

export default UserTeam
