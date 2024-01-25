import React, { Fragment, useEffect, useRef, useState } from 'react'
import PropTypes from 'prop-types'
import Navbar from '../../../components/Navbar'
import UserListHeader from '../Component/UsersListHeader'
import TDSManagement from './TDSManagement'
import { useDispatch, useSelector } from 'react-redux'
import moment from 'moment'
import { getTDSList, tdsCount, updateTds, getLeagueTdsList, tdsLeagueCount } from '../../../actions/users'
import qs from 'query-string'

const TDS = props => {
  const { match } = props
  const [search, setSearch] = useState('')
  const [initialFlag, setInitialFlag] = useState(false)
  const [dateRange, setDateRange] = useState([null, null])
  const [startDate, endDate] = dateRange
  const [leagueToTds, setLeagueToTds] = useState(false)
  const [leagueToTdsId, setLeagueToTdsId] = useState('')
  const [leagueToTdsMatch, setLeagueToTdsMatch] = useState('')
  const [leagueToTdsLeague, setLeagueToTdsLeague] = useState('')
  const dispatch = useDispatch()
  const token = useSelector((state) => state.auth.token)
  const tdsList = useSelector((state) => state.users.tdsList)
  const content = useRef()

  useEffect(() => {
    const obj = qs.parse(props.location.search)
    if (obj.search) {
      setSearch(obj.search)
    }
    if (obj.datefrom && obj.dateto) {
      setDateRange([new Date(obj.datefrom), new Date(obj.dateto)])
    }
    setLeagueToTds(props?.location?.state?.leagueTotds)
    setLeagueToTdsId(props?.location?.state?.leagueTdsId)
    setLeagueToTdsMatch(props?.location?.state?.matchNameToTds)
    setLeagueToTdsLeague(props?.location?.state?.leagueNameToTds)
  }, [])

  function onHandleSearch (e) {
    if (e.key === 'Enter') {
      e.preventDefault()
    }
    setSearch(e.target.value)
    setInitialFlag(true)
  }

  function getTDSTotalCountFunc (searchValue, status, userType, startDate, endDate) {
    const dateFrom = startDate ? new Date(moment(startDate).startOf('day').format()) : ''
    const dateTo = endDate ? new Date(moment(endDate).endOf('day').format()) : ''
    const data = {
      searchValue, status, userType, startDate: dateFrom ? new Date(dateFrom).toISOString() : '', endDate: dateTo ? new Date(dateTo).toISOString() : '', token
    }
    dispatch(tdsCount(data))
  }

  function getLeagueTdsCount (searchValue, status, userType, startDate, endDate) {
    const dateFrom = startDate ? new Date(moment(startDate).startOf('day').format()) : ''
    const dateTo = endDate ? new Date(moment(endDate).endOf('day').format()) : ''
    const id = match.params.id
    const data = {
      id, searchValue, status, userType, startDate: dateFrom ? new Date(dateFrom).toISOString() : '', endDate: dateTo ? new Date(dateTo).toISOString() : '', token
    }
    dispatch(tdsLeagueCount(data))
  }

  function getList (start, limit, sort, order, userType, searchValue, status, startDate, endDate, isFullResponse) {
    const dateFrom = startDate ? new Date(moment(startDate).startOf('day').format()) : ''
    const dateTo = endDate ? new Date(moment(endDate).endOf('day').format()) : ''
    const data = {
      start, limit, sort, order, userType, searchValue: searchValue.trim(), status, startDate: dateFrom ? new Date(dateFrom).toISOString() : '', endDate: dateTo ? new Date(dateTo).toISOString() : '', isFullResponse, token
    }
    dispatch(getTDSList(data))
  }

  function getLeagueTds (start, limit, sort, order, userType, searchValue, status, startDate, endDate, isFullResponse) {
    const dateFrom = startDate ? new Date(moment(startDate).startOf('day').format()) : ''
    const dateTo = endDate ? new Date(moment(endDate).endOf('day').format()) : ''
    const id = match.params.id
    const data = {
      id, start, limit, sort, order, userType, searchValue: searchValue.trim(), status, startDate: dateFrom ? new Date(dateFrom).toISOString() : '', endDate: dateTo ? new Date(dateTo).toISOString() : '', isFullResponse, token
    }
    dispatch(getLeagueTdsList(data))
  }

  function updateTdsFunc (status, id) {
    dispatch(updateTds(status, id, token))
  }

  function onExport () {
    content.current.onExport()
  }

  function onRefresh () {
    content.current.onRefresh()
  }

  return (
    <Fragment>
    <Navbar {...props} />
    <main className='main-content'>
      <section className='management-section common-box'>
        <UserListHeader
          heading='TDS'
          search={search}
          list={tdsList}
          startDate={startDate}
          endDate={endDate}
          dateRange={dateRange}
          setDateRange={setDateRange}
          onExport={onExport}
          handleSearch={onHandleSearch}
          refresh
          tdsUserType
          onRefresh={onRefresh}
          idLeagueLog={match.params.id}
          isLeagueToTds={leagueToTds}
          leagueToTdsId={leagueToTdsId}
          leagueToTdsMatch={leagueToTdsMatch}
          leagueToTdsLeague={leagueToTdsLeague}
        />
        <TDSManagement
          {...props}
          ref={content}
          List={tdsList}
          search={search}
          getList={getList}
          getLeagueTds={getLeagueTds}
          isLeagueLog={match.params.id}
          flag={initialFlag}
          startDate={startDate}
          endDate={endDate}
          getTDSTotalCountFunc={getTDSTotalCountFunc}
          getLeagueTdsCount={getLeagueTdsCount}
          updateTdsFunc={updateTdsFunc}
        />
      </section>
    </main>
  </Fragment>
  )
}

TDS.propTypes = {
  location: PropTypes.object,
  match: PropTypes.object
}

export default TDS
