import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import NavbarComponent from '../../../components/Navbar'
import AddFilterCategory from './AddFilterCategory'
import {
  getFilterCategoryDetails, updateNewFilterCategory, addNewFilterCategory
} from '../../../actions/leaguecategory'
import PropTypes from 'prop-types'

function AddLC (props) {
  const { match } = props
  const [FilterId, setFilterId] = useState('')
  const token = useSelector(state => state.auth.token)
  const FilterCategoryDetails = useSelector(state => state.leaguecategory.FilterCategoryDetails)
  const dispatch = useDispatch()

  useEffect(() => {
    if (match.params.id) {
      setFilterId(match.params.id)
      // dispatch action to get Filter Category Details
      dispatch(getFilterCategoryDetails(match.params.id, token))
    }
  }, [])

  // function to dispatch action to add filter category
  function AddNewLeagueCategory (Title, Remark) {
    dispatch(addNewFilterCategory(Title, Remark, token))
  }

  // function to dispatch action to update filter category
  function UpdateLeagueCategory (Title, Remark) {
    dispatch(updateNewFilterCategory(Title, Remark, token, FilterId))
  }

  return (
    <div>
      <NavbarComponent {...props} />
      <AddFilterCategory
        {...props}
        FilterCategoryDetails={FilterCategoryDetails}
        AddNewLeagueCategory={AddNewLeagueCategory}
        UpdateLeagueCategory={UpdateLeagueCategory}
        cancelLink="/league/filter-category-list"
      />
    </div>
  )
}

AddLC.propTypes = {
  match: PropTypes.object
}

export default AddLC
