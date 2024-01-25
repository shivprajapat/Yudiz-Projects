import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import NavbarComponent from '../../../components/Navbar'
import AddLeagueCategory from './AddLeagueCategory'
import {
  getLeagueCategoryDetails, updateNewLeagueCategory, addNewLeagueCategory
} from '../../../actions/leaguecategory'
import PropTypes from 'prop-types'

function AddLC (props) {
  const { match } = props
  const [LeagueId, setLeagueId] = useState('')
  const token = useSelector(state => state.auth.token)
  const LeagueCategoryDetails = useSelector(state => state.leaguecategory.LeagueCategoryDetails)
  const dispatch = useDispatch()

  useEffect(() => {
    if (match.params.id) {
      setLeagueId(match.params.id)
      dispatch(getLeagueCategoryDetails(match.params.id, token))
    }
  }, [])

  function AddNewLeagueCategory (Title, Position, Remark, image) {
    dispatch(addNewLeagueCategory(Title, Position, Remark, image, token))
  }

  function UpdateLeagueCategory (Title, Position, Remark, image) {
    dispatch(updateNewLeagueCategory(Title, Position, Remark, image, token, match.params.id))
  }

  return (
    <div>
      <NavbarComponent {...props} />
      <AddLeagueCategory
        {...props}
        LeagueCategoryDetails={LeagueCategoryDetails}
        AddNewLeagueCategory={AddNewLeagueCategory}
        UpdateLeagueCategory={UpdateLeagueCategory}
        addLeagueCategory={`/league/league-Prize/${LeagueId}`}
        cancelLink="/league/league-category-list"
      />
    </div>
  )
}

AddLC.propTypes = {
  match: PropTypes.object
}

export default AddLC
