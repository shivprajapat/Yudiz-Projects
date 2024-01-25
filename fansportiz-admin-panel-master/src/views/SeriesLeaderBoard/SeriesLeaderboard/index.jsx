import React, { useState, useRef, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import NavbarComponent from '../../../components/Navbar'
import LeagueHeader from '../../Leagues/Header/LeagueHeader'
import { getSeriesList } from '../../../actions/seriesLeaderBoard'
import {
  getGameCategory
} from '../../../actions/league'
import SeriesLeaderBoard from './SeriesLeaderBoard'
import { useQueryState } from 'react-router-use-location-state'
import qs from 'query-string'
import PropTypes from 'prop-types'

function SeriesLB (props) {
  const [searchText, setSearchText] = useQueryState('search', '')
  const [SportsType, setSportsType] = useQueryState('sportsType', 'CRICKET')
  const [initialFlag, setinitialFlag] = useState(false)
  const token = useSelector(state => state.auth.token)
  const leaderboardSeriesList = useSelector(state => state.seriesLeaderBoard.leaderboardSeriesList)
  const GameCategoryList = useSelector(state => state.league.GamecategoryList)
  const Auth = useSelector(state => state.auth.adminData && state.auth.adminData.eType)
  const adminPermission = useSelector(state => state.auth.adminPermission)
  const dispatch = useDispatch()
  const content = useRef()

  useEffect(() => {
    const obj = qs.parse(props.location.search)
    if (obj.search) {
      setSearchText(obj.search)
    }
  }, [])

  function onHandleSearch (value) {
    setSearchText(value)
    setinitialFlag(true)
  }

  function onHandleSport (value) {
    setSportsType(value)
  }

  function getGameCategoryFun () {
    dispatch(getGameCategory(token))
  }

  function getList (start, limit, sort, order, search, status, SportsType) {
    const data = {
      start, limit, sort, order, search: search.trim(), status, SportsType, token
    }
    dispatch(getSeriesList(data))
  }

  return (
    <div>
      <NavbarComponent {...props} />
      <main className="main-content">
        <section className="management-section common-box">
          <LeagueHeader
            heading="Series LeaderBoard"
            buttonText="Add Series"
            handleSportType={onHandleSport}
            selectGame={SportsType}
            handleSearch={onHandleSearch}
            search={searchText}
            seriesLeaderBoard
            addButton
            setUrl="/seriesLeaderBoard/add-SeriesLeaderBoard"
            GameCategoryList={GameCategoryList}
            SearchPlaceholder="Search Series Leaderboard"
            permission={(Auth && Auth === 'SUPER') || (adminPermission?.SERIES_LEADERBOARD !== 'R')}
          />
          <SeriesLeaderBoard
            {...props}
            List={leaderboardSeriesList}
            getList={getList}
            search={searchText}
            handleSportType={onHandleSport}
            selectGame={SportsType}
            getGameCategory={getGameCategoryFun}
            flag={initialFlag}
            ref={content}
            updateSeries="/seriesLeaderBoard/edit-SeriesLeaderBoard"
          />
        </section>
      </main>
    </div>
  )
}

SeriesLB.propTypes = {
  location: PropTypes.object
}

export default SeriesLB
