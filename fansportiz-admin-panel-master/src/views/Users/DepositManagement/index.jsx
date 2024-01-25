import React, { Fragment, useState, useEffect, useRef } from 'react'
import qs from 'query-string'
import { useDispatch, useSelector } from 'react-redux'
import NavbarComponent from '../../../components/Navbar'
import UserHeader from '../Component/UsersListHeader'
import DepositManagementContent from './DepositManagement'
import { getDepositList, getDepositsTotalCount } from '../../../actions/deposit'
import PropTypes from 'prop-types'
import moment from 'moment'

function DepositManagement (props) {
  const [search, setSearch] = useState('')
  const [initialFlag, setinitialFlag] = useState(false)
  const dispatch = useDispatch()
  const token = useSelector(state => state.auth.token)
  const depositList = useSelector(state => state.deposit.depositList)
  const [dateRange, setDateRange] = useState([null, null])
  const [startDate, endDate] = dateRange
  const content = useRef()

  useEffect(() => {
    const obj = qs.parse(props.location.search)
    if (obj.searchValue) {
      setSearch(obj.searchValue)
    }
    if (obj.datefrom && obj.dateto) {
      setDateRange([new Date(obj.datefrom), new Date(obj.dateto)])
    }
  }, [])

  function onHandleSearch (e) {
    if (e.key === 'Enter') {
      e.preventDefault()
    }
    setSearch(e.target.value)
    setinitialFlag(true)
  }

  function getDepositsTotalCountFunc (searchText, status, method, dateFrom, dateTo) {
    const StartDate = dateFrom ? new Date(moment(dateFrom).startOf('day').format()) : ''
    const EndDate = dateTo ? new Date(moment(dateTo).endOf('day').format()) : ''
    const depositListData = {
      search: searchText, status, method, startDate: StartDate ? new Date(StartDate).toISOString() : '', endDate: EndDate ? new Date(EndDate).toISOString() : '', token
    }
    dispatch(getDepositsTotalCount(depositListData))
  }

  function getList (start, limit, sort, order, searchText, status, method, dateFrom, dateTo, isFullResponse) {
    const StartDate = dateFrom ? new Date(moment(dateFrom).startOf('day').format()) : ''
    const EndDate = dateTo ? new Date(moment(dateTo).endOf('day').format()) : ''
    const depositListData = {
      start, limit, sort, order, search: searchText.trim(), status, method, startDate: StartDate ? new Date(StartDate).toISOString() : '', endDate: EndDate ? new Date(EndDate).toISOString() : '', isFullResponse, token
    }
    dispatch(getDepositList(depositListData))
  }

  function onExport () {
    content.current.onExport()
  }

  function onRefresh () {
    content.current.onRefresh()
  }

  return (
    <Fragment>
      <NavbarComponent {...props} />
      <main className="main-content">
        <section className="management-section common-box">
          <UserHeader
            heading="Deposits"
            onExport={onExport}
            list={depositList}
            handleSearch={onHandleSearch}
            search={search}
            startDate={startDate}
            endDate={endDate}
            dateRange={dateRange}
            setDateRange={setDateRange}
            refresh
            onRefresh={onRefresh}
          />
          <DepositManagementContent
            {...props}
            ref={content}
            List={depositList}
            getList={getList}
            startDate={startDate}
            endDate={endDate}
            search={search}
            flag={initialFlag}
            getDepositsTotalCountFunc={getDepositsTotalCountFunc}
            viewLink="/users/user-management/user-details"
          />
        </section>
      </main>
    </Fragment>
  )
}

DepositManagement.propTypes = {
  location: PropTypes.object
}

export default DepositManagement
