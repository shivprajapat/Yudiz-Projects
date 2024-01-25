import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getPlayerRoleList } from '../../../actions/playerRole'
import NavbarComponent from '../../../components/Navbar'
import PlayerRoleList from './PlayerRole'
import SportsHeader from '../SportsHeader'
import PropTypes from 'prop-types'

function IndexPlayerRole (props) {
  const token = useSelector(state => state.auth.token)
  const sportsType = props.location.pathname.includes('cricket') ? 'cricket' : props.location.pathname.includes('football') ? 'football' : props.location.pathname.includes('basketball') ? 'basketball' : props.location.pathname.includes('baseball') ? 'baseball' : props.location.pathname.includes('kabaddi') ? 'kabaddi' : ''
  const dispatch = useDispatch()

  function listOfPlayerRole () {
    dispatch(getPlayerRoleList(sportsType, token))
  }

  return (
    <div>
      <NavbarComponent {...props} />
      <main className="main-content">
        <section className="management-section common-box">
          <SportsHeader
            hidden
            heading={`${sportsType.charAt(0).toUpperCase() + sportsType.slice(1)} Player Roles`}
          />
          <PlayerRoleList
            {...props}
            sportsType={sportsType}
            getList={listOfPlayerRole}
            EditPlayerRoleLink={`/${sportsType}/player-role-management/update-player-role`}
          />
        </section>
      </main>
    </div>
  )
}

IndexPlayerRole.propTypes = {
  location: PropTypes.object
}

export default IndexPlayerRole
