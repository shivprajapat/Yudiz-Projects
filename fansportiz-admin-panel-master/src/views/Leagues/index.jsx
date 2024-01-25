import React, { useState, useRef, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import NavbarComponent from '../../components/Navbar'
import LeaguesList from './LeaguesList'
import LeagueHeader from './Header/LeagueHeader'
import {
  getLeagueList, getGameCategory, BlankMessage, updateNewLeague
} from '../../actions/league'
import { getFilterCategory, getListOfCategory } from '../../actions/leaguecategory'
import qs from 'query-string'
import PropTypes from 'prop-types'
import { useQueryState } from 'react-router-use-location-state'

function League (props) {
  const [searchField, setSearchField] = useQueryState('searchField', '')
  const [search, setSearch] = useQueryState('search', '')
  const [SportsType, setSportsType] = useQueryState('sportsType', 'CRICKET')
  const [initialFlag, setinitialFlag] = useState(false)
  const token = useSelector(state => state.auth.token)
  const LeagueList = useSelector(state => state.league.LeagueList)
  const LeagueCategoryList = useSelector(state => state.leaguecategory.LeaguecategoryList)
  const GameCategoryList = useSelector(state => state.league.GamecategoryList)
  const FiltercategoryList = useSelector(state => state.leaguecategory.FiltercategoryList)
  const adminPermission = useSelector(state => state.auth.adminPermission)
  const Auth = useSelector(state => state.auth.adminData && state.auth.adminData.eType)
  const dispatch = useDispatch()

  const content = useRef()

  useEffect(() => {
    const obj = qs.parse(props.location.search)
    if (obj.search) {
      setSearch(obj.search)
    }
    if (obj.searchField) {
      setSearchField(obj.searchField)
    }
  }, [])

  function onExport () {
    content.current.onExport()
  }

  function onHandleSearch (value) {
    setSearch(value)
    setinitialFlag(true)
  }

  function onHandleSport (value) {
    setSportsType(value)
  }

  function getList (start, limit, sort, order, searchText, field, leagueCategory, sportsType) {
    const leagueListParams = {
      start, limit, sort, order, search: searchText.trim(), searchField: field, leagueCategory, sportsType, token
    }
    dispatch(getLeagueList(leagueListParams))
  }

  function BlankMessagefun () {
    dispatch(BlankMessage())
  }

  function getListOfCategoryFun () {
    dispatch(getListOfCategory(token))
  }

  function getGameCategoryFun () {
    dispatch(getGameCategory(token))
  }

  function getFilterCategoryFun () {
    dispatch(getFilterCategory(token))
  }

  function UpdateLeague (updateLeagueData, id) {
    dispatch(updateNewLeague(updateLeagueData, token, id))
  }

  function onHandleSearchBox (e) {
    setSearchField(e.target.value)
  }

  return (
    <div>
      <NavbarComponent {...props} />
      <main className="main-content">
        <section className="management-section common-box">
          <LeagueHeader
            heading="Leagues"
            buttonText="Create League"
            onExport={onExport}
            list={LeagueList}
            handleSportType={onHandleSport}
            selectGame={SportsType}
            handleSearch={onHandleSearch}
            searchField={searchField}
            search={search}
            setUrl="/league/add-league"
            GameCategoryList={GameCategoryList}
            searchBox
            addButton
            SearchPlaceholder="Search league"
            permission={(Auth && Auth === 'SUPER') || (adminPermission?.LEAGUE !== 'R')}
          />
          <LeaguesList
            {...props}
            LeagueCategoryList={LeagueCategoryList}
            FiltercategoryList={FiltercategoryList}
            List={LeagueList}
            getList={getList}
            searchField={searchField}
            search={search}
            handleSearch={onHandleSearch}
            handleSportType={onHandleSport}
            handleSearchBox={onHandleSearchBox}
            selectGame={SportsType}
            flag={initialFlag}
            ref={content}
            activeSports={GameCategoryList}
            getListOfCategory={getListOfCategoryFun}
            getGameCategory={getGameCategoryFun}
            getFilterCategory={getFilterCategoryFun}
            blankMessage={BlankMessagefun}
            UpdatedLeague={UpdateLeague}
            updateLeague="/league/update-league"
            LeaguePrizeLink="/league/league-Prize"
          />
        </section>
      </main>
    </div>
  )
}

League.propTypes = {
  location: PropTypes.object
}

export default League
