
import React, { Fragment, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { addTeam, getTeamDetails, updateTeam } from '../../../../actions/team'
import AddTeam from './AddTeam'
import NavbarComponent from '../../../../components/Navbar'
import PropTypes from 'prop-types'

function IndexAddTeam (props) {
  const token = useSelector(state => state.auth.token)
  const TeamDetails = useSelector(state => state.team.teamDetails)
  const dispatch = useDispatch()
  const sportsType = props.location.pathname.includes('cricket') ? 'cricket' : props.location.pathname.includes('football') ? 'football' : props.location.pathname.includes('basketball') ? 'basketball' : props.location.pathname.includes('kabaddi') ? 'kabaddi' : ''

  function AddNewTeam (sKey, sName, sImage, sShortName, teamStatus) {
    const addTeamData = {
      sKey, sName, sImage, sShortName, sportsType, teamStatus, token
    }
    dispatch(addTeam(addTeamData))
  }
  function UpdateTeam (Id, sKey, sName, sImage, sShortName, teamStatus) {
    const updateTeamData = {
      Id, sportsType, sKey, sName, sImage, sShortName, teamStatus, token
    }
    dispatch(updateTeam(updateTeamData))
  }

  useEffect(() => {
    const { match } = props
    if (match.params.id) {
      dispatch(getTeamDetails(match.params.id, token))
    }
  }, [])

  return (
    <Fragment>
      <NavbarComponent {...props} />
      <AddTeam
        {...props}
        cancelLink={`/${sportsType}/team-management`}
        AddNewTeam={AddNewTeam}
        UpdateTeam={UpdateTeam}
        TeamDetails={TeamDetails}
      />
    </Fragment>
  )
}

IndexAddTeam.propTypes = {
  location: PropTypes.object,
  match: PropTypes.object
}

export default IndexAddTeam
