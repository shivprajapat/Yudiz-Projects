import React, { Fragment, useState, useEffect, useRef } from 'react'
import qs from 'query-string'
import { useDispatch, useSelector } from 'react-redux'
import NavbarComponent from '../../../components/Navbar'
import UserHeader from '../Component/UsersListHeader'
import WithdrawManagementContent from './WithdrawManagement'
import { getWithdrawalsTotalCount, getWithdrawList } from '../../../actions/withdraw'
import PropTypes from 'prop-types'
import moment from 'moment'

function WithdrawManagement (props) {
  const [search, setSearch] = useState('')
  const [initialFlag, setinitialFlag] = useState(false)
  const dispatch = useDispatch()
  const token = useSelector(state => state.auth.token)
  const withdrawList = useSelector(state => state.withdraw.withdrawList)
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

  function getWithdrawalsTotalCountFunc (searchText, status, method, reversedInfo, dateFrom, dateTo) {
    const from = dateFrom ? new Date(moment(dateFrom).startOf('day').format()) : ''
    const to = dateTo ? new Date(moment(dateTo).endOf('day').format()) : ''
    const withdrawListData = {
      search: searchText, status, method, reversedInfo, startDate: from ? new Date(from).toISOString() : '', endDate: to ? new Date(to).toISOString() : '', token
    }
    dispatch(getWithdrawalsTotalCount(withdrawListData))
  }

  function getList (start, limit, sort, order, searchText, status, method, reversedInfo, dateFrom, dateTo, isFullResponse) {
    const from = dateFrom ? new Date(moment(dateFrom).startOf('day').format()) : ''
    const to = dateTo ? new Date(moment(dateTo).endOf('day').format()) : ''
    const withdrawListData = {
      start, limit, sort, order, search: searchText.trim(), status, method, reversedInfo, startDate: from ? new Date(from).toISOString() : '', endDate: to ? new Date(to).toISOString() : '', isFullResponse, token
    }
    dispatch(getWithdrawList(withdrawListData))
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
            heading="Withdrawals"
            handleSearch={onHandleSearch}
            search={search}
            onExport={onExport}
            list={withdrawList}
            startDate={startDate}
            endDate={endDate}
            dateRange={dateRange}
            setDateRange={setDateRange}
            refresh
            onRefresh={onRefresh}
          />
          <WithdrawManagementContent
            {...props}
            ref={content}
            List={withdrawList}
            getList={getList}
            search={search}
            flag={initialFlag}
            viewLink="/users/user-management/user-details"
            startDate={startDate}
            endDate={endDate}
            getWithdrawalsTotalCountFunc={getWithdrawalsTotalCountFunc}
          />
        </section>
      </main>
    </Fragment>
  )
}

WithdrawManagement.propTypes = {
  location: PropTypes.object
}

export default WithdrawManagement
