import React, { Fragment, useEffect, useRef, useState } from 'react'
import PropTypes from 'prop-types'
import Navbar from '../../../components/Navbar'
import SubAdminHeader from '../components/SubAdminHeader'
import AdminLogsList from './AdminLogsList'
import { useDispatch, useSelector } from 'react-redux'
import qs from 'query-string'
import { adminIds, adminLogs, getLeagueLogs, getMatchLogs, singleAdminLogs } from '../../../actions/subadmin'
import moment from 'moment'
import { getRecommendedList } from '../../../actions/users'
import { isNumber } from '../../../helpers/helper'
import { useQueryState } from 'react-router-use-location-state'

const AdminLogs = props => {
  const { match } = props
  const dispatch = useDispatch()
  const content = useRef()
  const [adminUsername, setAdminUsername] = useState('')
  const [searchType, setSearchType] = useState('')
  const [userName, setUserName] = useQueryState('user', '')
  const [userSearch, setUserSearch] = useState('')
  const [IsNumber, setIsNumber] = useState(false)
  const [initialFlag, setInitialFlag] = useState(false)
  const [dateRange, setDateRange] = useState([null, null])
  const [startDate, endDate] = dateRange
  const token = useSelector(state => state.auth.token)
  const adminLogsList = useSelector(state => state.subadmin.adminLogsList)
  const recommendedList = useSelector(state => state.users.recommendedList)
  const adminsList = useSelector(state => state.subadmin.adminsList)
  const previousProps = useRef({ userSearch }).current
  const dateFlag = useRef(false)

  useEffect(() => {
    const obj = qs.parse(props.location.search)
    if (obj.user) {
      setUserName(obj.user)
      setUserSearch(obj.user)
      onGetRecommendedList(obj.user, true)
      if (isNumber(obj.user)) {
        setIsNumber(true)
      }
    } else if (recommendedList?.length === 0 || !recommendedList) {
      onGetRecommendedList('', false)
    }
    if (obj.adminId) {
      setAdminUsername(obj.adminId)
    }
    if (obj.datefrom && obj.dateto) {
      setDateRange([new Date(obj.datefrom), new Date(obj.dateto)])
    }
    if (obj.searchType) {
      setSearchType(obj.searchType)
    }
    getAdminIds()
  }, [])

  function handleAdminSearch (e) {
    setAdminUsername(e.target.value)
    getAdminIds()
    setInitialFlag(true)
  }

  function handleSearch (e, value) {
    if (e.key === 'Enter') {
      e.preventDefault()
    } else {
      setUserName(value)
      setInitialFlag(true)
    }
  }

  function handleNormalSearch (val) {
    setUserName(val)
  }

  useEffect(() => {
    const typeOfUserSearch = typeof userSearch
    const callSearchService = () => {
      if (typeOfUserSearch === 'string') {
        onGetRecommendedList(userSearch.trim(), false)
      } else {
        onGetRecommendedList(userSearch, false)
      }
    }
    if (initialFlag) {
      const debouncer = setTimeout(() => {
        callSearchService()
      }, 1000)
      return () => {
        clearTimeout(debouncer)
        previousProps.userName = userName
      }
    }
  }, [userSearch])

  function onHandleRecommendedSearch (e, value) {
    if (e.key === 'Enter') {
      e.preventDefault()
    }
    if (isNumber(value)) {
      setUserSearch(parseInt(value))
      setIsNumber(true)
    } else {
      setUserSearch(value)
      setIsNumber(false)
    }
  }

  function onGetRecommendedList (data, sendId) {
    dispatch(getRecommendedList(data, sendId, token))
  }

  function handleOtherFilter (e) {
    setSearchType(e.target.value)
  }

  function getList (start, limit, order, search, searchType, adminId, dateFrom, dateTo) {
    let searchData = ''
    if (searchType === 'AW' || searchType === 'AD' || searchType === 'D' || searchType === 'W' || searchType === 'KYC' || searchType === 'P' || searchType === 'BD' || searchType === '') {
      if (search) {
        if (IsNumber) {
          const data1 = recommendedList?.length > 0 && recommendedList.find(rec => rec.sMobNum === search)
          searchData = data1 ? data1._id : ''
        } else {
          const data2 = recommendedList?.length > 0 && recommendedList.find(rec => rec.sEmail === search)
          searchData = data2 ? data2._id : ''
        }
      }
    }
    const StartDate = dateFrom ? new Date(moment(dateFrom).startOf('day').format()) : ''
    const EndDate = dateTo ? new Date(moment(dateTo).endOf('day').format()) : ''
    const data = {
      start, limit, order, search: (searchData || search), searchType, adminId, dateFrom: (StartDate ? new Date(StartDate).toISOString() : ''), dateTo: (EndDate ? new Date(moment(new Date(EndDate)).endOf('day')).toISOString() : ''), token
    }
    dispatch(adminLogs(data))
  }

  function getSingleAdminLog (id) {
    dispatch(singleAdminLogs(id, token))
  }

  function getMatchLogsFunc (start, limit) {
    dispatch(getMatchLogs(start, limit, match.params.id, token))
  }

  function getLeagueLogsFunc (start, limit) {
    dispatch(getLeagueLogs(start, limit, match.params.leagueid, token))
  }

  function getAdminIds () {
    dispatch(adminIds(token))
  }

  function onRefreshFun () {
    content.current.onRefresh()
  }

  return (
    <Fragment>
      <Navbar {...props} />
      <main className="main-content">
        <section className="management-section common-box">
          <SubAdminHeader
            {...props}
            List={adminLogsList}
            search={userName}
            adminSearch={adminUsername}
            handleAdminSearch={handleAdminSearch}
            header="Admin Logs"
            adminsList={adminsList}
            adminLogs
            refresh
            isMatchLog={match.params.id}
            isLeagueLog={match.params.leagueid}
            onRefresh={onRefreshFun}
            startDate={startDate}
            endDate={endDate}
            dateRange={dateRange}
            setDateRange={setDateRange}
            userSearch={userSearch}
            searchType={searchType}
            recommendedList={recommendedList}
            handleOtherFilter={handleOtherFilter}
            handleChangeSearch={handleSearch}
            handleNormalSearch={handleNormalSearch}
            handleRecommendedSearch={onHandleRecommendedSearch}
            dateFlag={dateFlag}
            matchApiLogUrl={`${match.params.id}/matchapi-logs`}
          />
          <AdminLogsList
            {...props}
            ref={content}
            search={userName}
            setSearch={setUserName}
            searchType={searchType}
            adminSearch={adminUsername}
            List={adminLogsList}
            getList={getList}
            getSingleAdminLog={getSingleAdminLog}
            getAdminIds={getAdminIds}
            getMatchLogsFunc={getMatchLogsFunc}
            getLeagueLogsFunc={getLeagueLogsFunc}
            recommendedList={recommendedList}
            flag={initialFlag}
            startDate={startDate}
            endDate={endDate}
            dateFlag={dateFlag}
          />
        </section>
      </main>
    </Fragment>
  )
}

AdminLogs.propTypes = {
  location: PropTypes.object,
  match: PropTypes.object
}

export default AdminLogs
