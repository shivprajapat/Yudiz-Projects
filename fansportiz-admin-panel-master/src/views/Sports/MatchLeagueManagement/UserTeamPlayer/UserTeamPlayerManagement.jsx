import React, { Fragment, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getMatchDetails } from '../../../../actions/match'
import { getUserTeamPlayerList } from '../../../../actions/matchleague'
import NavbarComponent from '../../../../components/Navbar'
import SportsHeader from '../../SportsHeader'
import UserTeamPlayer from './UserTeamPlayer'
import PropTypes from 'prop-types'

function UserTeamPlayerManagement (props) {
  const {
    match
  } = props
  const [matchName, setMatchName] = useState('')
  const [UserTeamName, setUserTeamName] = useState('')
  const token = useSelector(state => state.auth.token)
  const userTeamPlayerList = useSelector(state => state.matchleague.userTeamPlayerList)
  const MatchDetails = useSelector(state => state.match.matchDetails)
  const dispatch = useDispatch()

  useEffect(() => {
    if (match.params.id1 && match.params.id2) {
      dispatch(getMatchDetails(match.params.id1, token))
      dispatch(getUserTeamPlayerList(match.params.id2, token))
    }
  }, [])

  useEffect(() => {
    if (MatchDetails) {
      setMatchName(MatchDetails.sName)
    }
  }, [MatchDetails])

  useEffect(() => {
    if (userTeamPlayerList) {
      setUserTeamName(userTeamPlayerList.sName)
    }
  }, [userTeamPlayerList])

  return (
    <Fragment>
      <NavbarComponent {...props} />
      <main className="main-content">
        <section className="management-section common-box">
          <SportsHeader
            heading={(matchName && UserTeamName) ? `User Team Player Management ( ${matchName} : ${UserTeamName} )` : 'User Team Player Management'}
            hidden
            permission
          />
          <UserTeamPlayer
            {...props}
            List={userTeamPlayerList}
          />
        </section>
      </main>
    </Fragment>
  )
}

UserTeamPlayerManagement.propTypes = {
  match: PropTypes.object,
  location: PropTypes.object
}

export default UserTeamPlayerManagement
