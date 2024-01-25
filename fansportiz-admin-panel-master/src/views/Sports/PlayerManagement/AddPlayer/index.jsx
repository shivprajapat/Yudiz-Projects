import React, { Fragment, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { addPlayer, getPlayerDetails, updatePlayer } from '../../../../actions/player'
import { getPlayerRoleList } from '../../../../actions/playerRole'
import NavbarComponent from '../../../../components/Navbar'
import AddPlayer from './AddPlayer'
import PropTypes from 'prop-types'

function IndexAddPlayer (props) {
  const token = useSelector(state => state.auth.token)
  const playerDetails = useSelector(state => state.player.playerDetails)
  const adminPermission = useSelector(state => state.auth.adminPermission)
  const Auth = useSelector(state => state.auth.adminData && state.auth.adminData.eType)
  const playerRoleList = useSelector(state => state.playerRole.playerRoleList)
  const dispatch = useDispatch()
  const SportsType = props.location.pathname.includes('cricket') ? 'cricket' : props.location.pathname.includes('football') ? 'football' : props.location.pathname.includes('basketball') ? 'basketball' : props.location.pathname.includes('baseball') ? 'baseball' : props.location.pathname.includes('kabaddi') ? 'kabaddi' : ''

  function AddNewPlayer (sKey, sName, sImage, nFantasyCredit, eRole) {
    const addPlayerData = {
      sKey, sName, sImage, nFantasyCredit, eRole, sportsType: SportsType, token
    }
    dispatch(addPlayer(addPlayerData))
  }

  function UpdatePlayer (Id, sKey, sName, sImage, nFantasyCredit, eRole) {
    const updatePlayerData = {
      Id, sKey, sName, sImage, nFantasyCredit, eRole, sportsType: SportsType, token
    }
    dispatch(updatePlayer(updatePlayerData))
  }

  useEffect(() => {
    const { match } = props
    if (match.params.id) {
      dispatch(getPlayerDetails(match.params.id, token))
    }
    if ((Auth === 'SUPER') || (adminPermission?.ROLES !== 'N')) {
      dispatch(getPlayerRoleList(SportsType, token))
    }
  }, [SportsType])

  return (
    <Fragment>
      <NavbarComponent {...props} />
      <main className="main-content">
        <AddPlayer
          {...props}
          gameCategory={SportsType}
          cancelLink={`/${SportsType}/player-management`}
          AddNewPlayer={AddNewPlayer}
          UpdatePlayer={UpdatePlayer}
          playerRoleList={playerRoleList}
          PlayerDetails={playerDetails}
        />
      </main>
    </Fragment>
  )
}

IndexAddPlayer.propTypes = {
  location: PropTypes.object,
  match: PropTypes.object
}

export default IndexAddPlayer
