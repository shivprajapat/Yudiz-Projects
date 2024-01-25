import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import NavbarComponent from '../../../components/Navbar'
import AddLeague from './AddLeague'
import {
  addNewLeague, updateNewLeague, getLeagueDetails
} from '../../../actions/league'
import PropTypes from 'prop-types'

function AddLeaguePage (props) {
  const { match } = props
  const [LeagueId, setLeagueId] = useState('')
  const token = useSelector(state => state.auth.token)
  const dispatch = useDispatch()

  useEffect(() => {
    if (match.params.id) {
      setLeagueId(match.params.id)
      // dispatch action to get League Details
      dispatch(getLeagueDetails(match.params.id, token))
    }
  }, [])

  // function to dispatch action to add league
  function AddNewLeague (addNewLeagueData) {
    dispatch(addNewLeague(addNewLeagueData, token))
  }

  // function to dispatch action to update the league
  function UpdateLeague (updateLeagueData) {
    dispatch(updateNewLeague(updateLeagueData, token, match.params.id))
  }

  return (
    <div>
      <NavbarComponent {...props} />
      <AddLeague
        {...props}
        AddNewLeague={AddNewLeague}
        UpdateLeague={UpdateLeague}
        addLeaguepriceBreakup={`/league/league-Prize/${LeagueId}`}
        cancelLink="/league"
        priceBreakUpPage="/league/league-Prize"
      />
    </div>
  )
}

AddLeaguePage.propTypes = {
  match: PropTypes.object
}

export default AddLeaguePage
