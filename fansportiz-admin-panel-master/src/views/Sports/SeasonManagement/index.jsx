import React, { Fragment, useEffect, useRef, useState } from 'react'
import PropTypes from 'prop-types'
import Navbar from '../../../components/Navbar'
import SportsHeader from '../SportsHeader'
import { useDispatch, useSelector } from 'react-redux'
import { getSeasonList, updateSeason } from '../../../actions/season'
import SeasonList from './SeasonList'
import qs from 'query-string'
import moment from 'moment'

const SeasonManagement = props => {
  const content = useRef()
  const dispatch = useDispatch()
  const [dateRange, setDateRange] = useState([null, null])
  const [startDate, endDate] = dateRange
  const [searchText, setSearchText] = useState('')
  const [initialFlag, setInitialFlag] = useState(false)
  const seasonList = useSelector(state => state.season.seasonList)
  const token = useSelector(state => state.auth.token)
  const sportsType = props.location.pathname.includes('cricket') ? 'cricket' : props.location.pathname.includes('football') ? 'football' : props.location.pathname.includes('basketball') ? 'basketball' : props.location.pathname.includes('baseball') ? 'baseball' : props.location.pathname.includes('kabaddi') ? 'kabaddi' : ''

  useEffect(() => {
    const obj = qs.parse(props.location.search)
    if (obj.search) {
      setSearchText(obj.search)
    }
    if (obj.datefrom && obj.dateto) {
      setDateRange([new Date(obj.datefrom), new Date(obj.dateto)])
    }
  }, [])

  function onHandleSearch (e) {
    setSearchText(e.target.value)
    setInitialFlag(true)
  }

  function getList (start, limit, search, dateFrom, dateTo) {
    const from = dateFrom ? new Date(moment(dateFrom).startOf('day').format()) : ''
    const to = dateTo ? new Date(moment(dateTo).endOf('day').format()) : ''
    const data = { start, limit, search: search.trim(), sportsType, startDate: from ? new Date(from).toISOString() : '', endDate: to ? new Date(to).toISOString() : '', token }
    dispatch(getSeasonList(data))
  }

  function updateSeasonFunc (seasonName, seasonId) {
    const data = {
      seasonName, seasonId, token
    }
    dispatch(updateSeason(data))
  }

  function onRefreshFun () {
    content.current.onRefresh()
  }

  return (
    <div>
      <Navbar {...props} />
      <main className="main-content">
        <section className="management-section common-box">
          <Fragment>
            <SportsHeader
              getList={getList}
              seasonList={seasonList}
              flag={initialFlag}
              heading='Season Management'
              handleSearch={onHandleSearch}
              search={searchText}
              SearchPlaceholder="Search Match"
              onRefresh={onRefreshFun}
              refresh
              searchDateBox
              startDate={startDate}
              endDate={endDate}
              dateRange={dateRange}
              setDateRange={setDateRange}
            />
            <SeasonList
              {...props}
              ref={content}
              getList={getList}
              seasonList={seasonList}
              sportsType={sportsType}
              userListView={`/${sportsType}/season-management/users-list`}
              search={searchText}
              flag={initialFlag}
              startDate={startDate}
              endDate={endDate}
              updateSeasonFunc={updateSeasonFunc}
            />
          </Fragment>
        </section>
      </main>
    </div>
  )
}

SeasonManagement.propTypes = {
  location: PropTypes.object
}

export default SeasonManagement
