import React, { Fragment, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { clearMsg, getPlayerRoleDetails, updatePlayerRole } from '../../../../actions/playerRole'
import NavbarComponent from '../../../../components/Navbar'
import AddPlayerRoleForm from './AddPlayerRole'
import PropTypes from 'prop-types'

function IndexAddPlayerRole (props) {
  const { match } = props
  const token = useSelector(state => state.auth.token)
  const PlayerRoleDetails = useSelector(state => state.playerRole.playerRoleDetails)
  const dispatch = useDispatch()
  const sportsType = props.location.pathname.includes('cricket') ? 'cricket' : props.location.pathname.includes('football') ? 'football' : props.location.pathname.includes('basketball') ? 'basketball' : props.location.pathname.includes('baseball') ? 'baseball' : props.location.pathname.includes('kabaddi') ? 'kabaddi' : ''

  useEffect(() => {
    playerRoleDetailsFunc()
  }, [])

  function playerRoleDetailsFunc () {
    dispatch(getPlayerRoleDetails(match.params.id, sportsType, token))
  }

  function UpdatePlayerRole (sFullName, nMax, nMin, nPosition) {
    dispatch(updatePlayerRole(sFullName, nMax, nMin, nPosition, match.params.id, sportsType, token))
  }

  function clearMsgFun () {
    dispatch(clearMsg())
  }

  return (
    <Fragment>
      <NavbarComponent {...props} />
      <main className="main-content">
        <AddPlayerRoleForm
          {...props}
          sportsType={sportsType}
          clearMsg={clearMsgFun}
          UpdatePlayerRole={UpdatePlayerRole}
          PlayerRoleDetails={PlayerRoleDetails}
          playerRoleDetailsFunc={playerRoleDetailsFunc}
          cancelLink={`/${sportsType}/player-role-management`}
        />
      </main>
    </Fragment>
  )
}

IndexAddPlayerRole.propTypes = {
  location: PropTypes.object,
  match: PropTypes.object
}

export default IndexAddPlayerRole
