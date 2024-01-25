import React, { useRef, useState, useEffect, Fragment } from 'react'
import qs from 'query-string'
import moment from 'moment'
import { useDispatch, useSelector } from 'react-redux'
import NavbarComponent from '../../../components/Navbar'
import SportsHeader from '../SportsHeader'
import MatchManagementComponent from './MatchManagement'
import { getMatchList, fetchMatch, clearMatchMsg, getMatchesTotalCount } from '../../../actions/match'
import PropTypes from 'prop-types'
import { getSeasonList } from '../../../actions/season'

function IndexMatchManagement (props) {
  const content = useRef()
  const [searchText, setSearchText] = useState('')
  const [selectedDate, setselectedDate] = useState(null)
  const [openPicker, setOpenPicker] = useState(false)
  const [initialFlag, setinitialFlag] = useState(false)
  const token = useSelector(state => state.auth.token)
  const Auth = useSelector(state => state.auth.adminData && state.auth.adminData.eType)
  const adminPermission = useSelector(state => state.auth.adminPermission)
  const sportsType = props.location.pathname.includes('cricket') ? 'cricket' : props.location.pathname.includes('football') ? 'football' : props.location.pathname.includes('basketball') ? 'basketball' : props.location.pathname.includes('baseball') ? 'baseball' : props.location.pathname.includes('kabaddi') ? 'kabaddi' : ''
  const dispatch = useDispatch()
  const [dateRange, setDateRange] = useState([null, null])
  const [startDate, endDate] = dateRange
  const [provider, setProvider] = useState('ENTITYSPORT')

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
    setinitialFlag(true)
  }

  function onHandleDatePicker (isOpen = true, sd) {
    setOpenPicker(isOpen)
    if (sd) {
      setselectedDate(moment(sd).format('DD-MM-YYYY'))
    }
  }

  function getMatchesTotalCountFunc (search, filter, dateFrom, dateTo, matchProvider, season, format) {
    const from = dateFrom ? new Date(moment(dateFrom).startOf('day').format()) : ''
    const to = dateTo ? new Date(moment(dateTo).endOf('day').format()) : ''
    const matchListData = {
      search, filter, startDate: from ? new Date(from).toISOString() : '', endDate: to ? new Date(to).toISOString() : '', sportsType: sportsType.toUpperCase(), provider: matchProvider, season, format, token
    }
    dispatch(getMatchesTotalCount(matchListData))
  }
  function getList (start, limit, sort, order, search, filterMatchStatus, dateFrom, dateTo, matchProvider, season, format) {
    const from = dateFrom ? new Date(moment(dateFrom).startOf('day').format()) : ''
    const to = dateTo ? new Date(moment(dateTo).endOf('day').format()) : ''
    const matchListData = {
      start, limit, sort, order, search, filter: filterMatchStatus, startDate: from ? new Date(from).toISOString() : '', endDate: to ? new Date(to).toISOString() : '', sportsType: sportsType.toUpperCase(), provider: matchProvider, season, format, token
    }
    dispatch(getMatchList(matchListData))
  }

  function seasonList (start, limit, search, sportsType) {
    const startDate = ''
    const endDate = ''
    const data = { start, limit, search, sportsType, startDate, endDate, token }
    dispatch(getSeasonList(data))
  }

  function setProviderFunc (event) {
    setProvider(event.target.value)
  }

  function AddMatch (date) {
    // if (sportsType === 'kabaddi' || sportsType === 'basketball') {
    //   dispatch(fetchMatch(moment(Date.now()).format('YYYY-MM-DD'), 'ENTITYSPORT', token, sportsType))
    // } else {
    dispatch(fetchMatch(date, provider, token, sportsType))
    // }
  }

  function clearMatchMsgFun () {
    dispatch(clearMatchMsg())
  }

  function onRefreshFun () {
    content.current.onRefresh()
  }

  return (
    <div>
      <NavbarComponent {...props} />
      <main className="main-content">
        <section className="management-section common-box">
          <Fragment>
            <SportsHeader
              heading={`${sportsType.charAt(0).toUpperCase() + sportsType.slice(1)} Match Management`}
              handleSearch={onHandleSearch}
              selectedDate={selectedDate}
              DateText="Fetch Match Data"
              search={searchText}
              setUrl={`/${sportsType}/match-management/add-match`}
              SearchPlaceholder="Search Match"
              handleDatePicker={onHandleDatePicker}
              buttonText="Add Match"
              searchDateBox
              startDate={startDate}
              endDate={endDate}
              dateRange={dateRange}
              setDateRange={setDateRange}
              onRefresh={onRefreshFun}
              refresh
              matchManagement
              extButton
              permission={(Auth && Auth === 'SUPER') || (adminPermission?.MATCH !== 'R')}
            />
            <MatchManagementComponent
              {...props}
              ref={content}
              sportsType={sportsType}
              openPicker={openPicker}
              handleDatePicker={onHandleDatePicker}
              viewLink={`/${sportsType}/match-management/view-match`}
              getList={getList}
              seasonList={seasonList}
              AddMatch={AddMatch}
              clearMatchMsg={clearMatchMsgFun}
              search={searchText}
              flag={initialFlag}
              provider={provider}
              startDate={startDate}
              endDate={endDate}
              setProviderFunc={setProviderFunc}
              getMatchesTotalCountFunc={getMatchesTotalCountFunc}
            />
          </Fragment>
        </section>
      </main>
    </div>
  )
}

IndexMatchManagement.propTypes = {
  location: PropTypes.object
}

export default IndexMatchManagement
