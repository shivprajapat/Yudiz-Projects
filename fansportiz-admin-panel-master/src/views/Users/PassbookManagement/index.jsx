import React, { useState, useEffect, useRef } from 'react'
import qs from 'query-string'
import { useDispatch, useSelector } from 'react-redux'
import moment from 'moment'
import NavbarComponent from '../../../components/Navbar'
import PassbookList from './PassbookList'
import UsersListHeader from '../Component/UsersListHeader'
import { getLeaguePassbookList, getLeagueTransactionsTotalCount, getPassbookList, getTransactionsTotalCount } from '../../../actions/passbook'
import PropTypes from 'prop-types'

function Passbook (props) {
  const { match } = props
  // const [showSearchInput, setShowSearchInput] = useState(false)
  const [searchText, setSearchText] = useState('')
  const [searchType, setSearchType] = useState('')
  const [initialFlag, setinitialFlag] = useState(false)
  const [userToPass, setUserToPass] = useState(false)
  const [systemUserToPass, setSystemUserToPass] = useState(false)
  const [tdsToPass, setTdsToPass] = useState(false)
  const [leagueToPass, setLeagueToPass] = useState(false)
  const [userToPassId, setUserToPassId] = useState('')
  const [leagueToPassId, setLeagueToPassId] = useState('')
  const [tdsToPassId, setTdsToPassId] = useState(0)
  const [leagueToPassbookMatch, setLeagueToPassbookMatch] = useState('')
  const [leagueToPassbookLeague, setLeagueToPassbookLeague] = useState('')
  const dispatch = useDispatch()
  const [dateRange, setDateRange] = useState([null, null])
  const [startDate, endDate] = dateRange
  const token = useSelector(state => state.auth.token)
  const passbookList = useSelector(state => state.passbook.passbookList)
  const content = useRef()

  useEffect(() => {
    const obj = qs.parse(props.location.search)
    if (obj.searchValue) {
      // setShowSearchInput(true)
      setSearchText(obj.searchValue)
    }
    if (obj.datefrom && obj.dateto) {
      setDateRange([new Date(obj.datefrom), new Date(obj.dateto)])
    }
    if (obj.searchType) {
      setSearchType(obj.searchType)
    }
    setSystemUserToPass(props?.location?.state?.systemUserToPassbook)
    setUserToPass(props?.location?.state?.userToPassbook)
    setUserToPassId(props?.location?.state?.id)
    setTdsToPass(props?.location?.state?.tdsToPassbook)
    setTdsToPassId(props?.location?.state?.passbookId)
    setLeagueToPass(props?.location?.state?.leagueToPassbook)
    setLeagueToPassId(props?.location?.state?.leaguePassbookId)
    setLeagueToPassbookMatch(props?.location?.state?.matchNameToPassbook)
    setLeagueToPassbookLeague(props?.location?.state?.leagueNameToPassbook)
  }, [])

  function onHandleSearch (e) {
    if (e.key === 'Enter') {
      e.preventDefault()
    }
    setSearchText(e.target.value)
    setinitialFlag(true)
  }

  function handleOtherFilter (e) {
    setSearchType(e.target.value)
  }

  function getTransactionsTotalCountFunc (search, searchType, dateFrom, dateTo, particulars, eType, status) {
    const StartDate = dateFrom ? new Date(moment(dateFrom).startOf('day').format()) : ''
    const EndDate = dateTo ? new Date(moment(dateTo).endOf('day').format()) : ''
    const passBookData = {
      search: search.trim(), searchType, startDate: StartDate ? new Date(StartDate).toISOString() : '', endDate: EndDate ? new Date(EndDate).toISOString() : '', particulars, eType, status, token
    }
    dispatch(getTransactionsTotalCount(passBookData))
  }

  function leagueTransactionsTotalCountFunc (search, searchType, dateFrom, dateTo, particulars, eType, status) {
    const StartDate = dateFrom ? new Date(moment(dateFrom).startOf('day').format()) : ''
    const EndDate = dateTo ? new Date(moment(dateTo).endOf('day').format()) : ''
    const id = match.params.id
    const passBookData = {
      id, search: search.trim(), searchType, startDate: StartDate ? new Date(StartDate).toISOString() : '', endDate: EndDate ? new Date(EndDate).toISOString() : '', particulars, eType, status, token
    }
    dispatch(getLeagueTransactionsTotalCount(passBookData))
  }

  function getList (start, limit, sort, order, search, searchType, dateFrom, dateTo, particulars, eType, status, isFullResponse) {
    const StartDate = dateFrom ? new Date(moment(dateFrom).startOf('day').format()) : ''
    const EndDate = dateTo ? new Date(moment(dateTo).endOf('day').format()) : ''
    const passBookData = {
      start, limit, sort, order, search, searchType, startDate: StartDate ? new Date(StartDate).toISOString() : '', endDate: EndDate ? new Date(EndDate).toISOString() : '', particulars, eType, status, isFullResponse, token
    }
    dispatch(getPassbookList(passBookData))
  }

  function leaguePassbookList (start, limit, sort, order, search, searchType, dateFrom, dateTo, particulars, eType, status, isFullResponse) {
    const StartDate = dateFrom ? new Date(moment(dateFrom).startOf('day').format()) : ''
    const EndDate = dateTo ? new Date(moment(dateTo).endOf('day').format()) : ''
    const id = match.params.id
    const passBookData = {
      id, start, limit, sort, order, search, searchType, startDate: StartDate ? new Date(StartDate).toISOString() : '', endDate: EndDate ? new Date(EndDate).toISOString() : '', particulars, eType, status, isFullResponse, token
    }
    dispatch(getLeaguePassbookList(passBookData))
  }

  function onExport () {
    content.current.onExport()
  }

  function onRefresh () {
    content.current.onRefresh()
  }

  return (
    <div>
      <NavbarComponent {...props} />
      <main className="main-content">
        <section className="management-section common-box">
          <UsersListHeader
            passbook
            heading="Transactions"
            handleSearch={onHandleSearch}
            search={searchText}
            searchType={searchType}
            onExport={onExport}
            list={passbookList}
            startDate={startDate}
            endDate={endDate}
            dateRange={dateRange}
            setDateRange={setDateRange}
            searchBox
            passBookID
            refresh
            onRefresh={onRefresh}
            // hidden={showSearchInput}
            handleOtherFilter={handleOtherFilter}
            isSystemUserToPassbook={systemUserToPass}
            isUserToPassbook={userToPass}
            userToPassbookId={userToPassId}
            isTdsToPassbook={tdsToPass}
            tdsToPassbookId={tdsToPassId}
            isLeagueToPassbook={leagueToPass}
            leagueToPassbookId={leagueToPassId}
            leagueToPassbookMatch={leagueToPassbookMatch}
            leagueToPassbookLeague={leagueToPassbookLeague}
          />
          <PassbookList
            {...props}
            isLeaguePassbook={match.params.id}
            ref={content}
            List={passbookList}
            getList={getList}
            leaguePassbookList={leaguePassbookList}
            search={searchText}
            searchType={searchType}
            flag={initialFlag}
            viewLink="/users/user-management/user-details"
            startDate={startDate}
            endDate={endDate}
            getTransactionsTotalCountFunc={getTransactionsTotalCountFunc}
            leagueTransactionsTotalCountFunc={leagueTransactionsTotalCountFunc}
            userToPassbookId={userToPassId}
            isUserToPassbook={userToPass}
            tdsToPassbookId={tdsToPassId}
            isTdsToPassbook={tdsToPass}
          />
        </section>
      </main>
    </div>
  )
}

Passbook.propTypes = {
  location: PropTypes.object,
  match: PropTypes.object
}

export default Passbook
