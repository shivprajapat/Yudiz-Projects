import React, { useState, useEffect } from 'react'
import qs from 'query-string'
import { useSelector, useDispatch } from 'react-redux'
import FilterCategoryList from './FilterCategoryList'
import NavbarComponent from '../../../components/Navbar'
import LeagueHeader from '../Header/LeagueHeader'
import {
  getFilterCategoryList
} from '../../../actions/leaguecategory'
import PropTypes from 'prop-types'

function FilterCategoryManagement (props) {
  const [searchText, setSearchText] = useState('')
  const [SportsType, setSportsType] = useState('CRICKET')
  const [initialFlag, setinitialFlag] = useState(false)
  const token = useSelector(state => state.auth.token)
  const Auth = useSelector(state => state.auth.adminData && state.auth.adminData.eType)
  const adminPermission = useSelector(state => state.auth.adminPermission)
  const FiltercategoriesList = useSelector(state => state.leaguecategory.FiltercategoriesList)
  const dispatch = useDispatch()

  useEffect(() => {
    const obj = qs.parse(props.location.search)
    if (obj.search) {
      setSearchText(obj.search)
    }
  }, [])

  // function to handle search operations
  function onHandleSearch (value) {
    setSearchText(value)
    setinitialFlag(true)
  }

  // function to handle sports change
  function onHandleSport (e) {
    setSportsType(e.target.value)
  }

  // function to get list
  function getList (start, limit, sort, order, search) {
    dispatch(getFilterCategoryList(start, limit, sort, order, search.trim(), token))
  }

  return (
    <div>
      <NavbarComponent {...props} />
      <main className="main-content">
        <section className="management-section common-box">
          <LeagueHeader
            heading="Filter Categories"
            buttonText="Create Filter Category"
            handleSportType={onHandleSport}
            selectGame={SportsType}
            seriesLeaderBoard
            handleSearch={onHandleSearch}
            search={searchText}
            SearchPlaceholder="Search Filter Category"
            goToLeague="/league"
            setUrl="/league/add-filter-category"
            addButton
            info
            permission={(Auth && Auth === 'SUPER') || (adminPermission?.LEAGUE !== 'R')}
          />
          <FilterCategoryList
            {...props}
            List={FiltercategoriesList}
            getList={getList}
            search={searchText}
            selectGame={SportsType}
            flag={initialFlag}
            updateLeague="/league/filter-league-category"
          />
        </section>
      </main>
    </div>
  )
}

FilterCategoryManagement.propTypes = {
  location: PropTypes.object
}

export default FilterCategoryManagement
