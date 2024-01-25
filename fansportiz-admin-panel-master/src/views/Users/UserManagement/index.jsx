import React, { Fragment, useState, useEffect, useRef } from 'react'
import qs from 'query-string'
import { useDispatch, useSelector } from 'react-redux'
import PropTypes from 'prop-types'
import NavbarComponent from '../../../components/Navbar'
import UserHeader from '../Component/UsersListHeader'
import UserList from './UserList'
import { getUserList, getUsersTotalCount } from '../../../actions/users'
import moment from 'moment'

function UsersList (props) {
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('')
  const [initialFlag, setinitialFlag] = useState(false)
  const [dateRange, setDateRange] = useState([null, null])
  const [startDate, endDate] = dateRange
  const dispatch = useDispatch()
  const token = useSelector((state) => state.auth.token)
  const usersTotalCount = useSelector(state => state.users.usersTotalCount)
  const resStatus = useSelector(state => state.users.usersTotalCount)
  const resMessage = useSelector(state => state.users.resMessage)
  const usersList = useSelector((state) => state.users.usersList)
  const content = useRef()

  useEffect(() => {
    const obj = qs.parse(props.location.search)
    if (obj.searchvalue) {
      setSearch(obj.searchvalue)
    }
    if (obj.datefrom && obj.dateto) {
      setDateRange([new Date(obj.datefrom), new Date(obj.dateto)])
    }
    if (obj.filterBy) {
      setFilter(obj.filterBy)
    }
  }, [])

  function onHandleSearch (e) {
    if (e.key === 'Enter') {
      e.preventDefault()
    }
    setSearch(e.target.value)
    setinitialFlag(true)
  }

  function handleOtherFilter (e) {
    setFilter(e.target.value)
  }

  function getUsersTotalCountFunc (searchvalue, filterBy, startDate, endDate) {
    const dateFrom = startDate ? new Date(moment(startDate).startOf('day').format()) : ''
    const dateTo = endDate ? new Date(moment(endDate).endOf('day').format()) : ''
    const data = {
      searchvalue, filterBy, startDate: dateFrom ? new Date(dateFrom).toISOString() : '', endDate: dateTo ? new Date(dateTo).toISOString() : '', token
    }
    dispatch(getUsersTotalCount(data))
  }

  function getList (start, limit, sort, order, searchvalue, filterBy, startDate, endDate, isFullResponse) {
    const dateFrom = startDate ? new Date(moment(startDate).startOf('day').format()) : ''
    const dateTo = endDate ? new Date(moment(endDate).endOf('day').format()) : ''
    const usersData = {
      start, limit, sort, order, searchvalue: searchvalue.trim(), filterBy, startDate: dateFrom ? new Date(dateFrom).toISOString() : '', endDate: dateTo ? new Date(dateTo).toISOString() : '', isFullResponse, token
    }
    dispatch(getUserList(usersData))
  }

  function onExport () {
    content.current.onExport()
  }

  function onRefreshFun () {
    content.current.onRefresh()
  }

  return (
    <Fragment>
      <NavbarComponent {...props} />
      <main className='main-content'>
        <section className='management-section common-box'>
          <UserHeader
            heading='Users'
            handleSearch={onHandleSearch}
            search={search}
            list={usersList}
            searchBox
            users
            normalUser
            refresh
            onRefresh={onRefreshFun}
            totalCount={usersTotalCount}
            startDate={startDate}
            endDate={endDate}
            dateRange={dateRange}
            setDateRange={setDateRange}
            onExport={onExport}
            filter={filter}
            handleOtherFilter={handleOtherFilter}
          />
          <UserList
            {...props}
            ref={content}
            List={usersList}
            search={search}
            getList={getList}
            flag={initialFlag}
            usersTotalCount={usersTotalCount}
            viewLink='/users/user-management/user-details'
            startDate={startDate}
            endDate={endDate}
            filter={filter}
            resMessage={resMessage}
            resStatus={resStatus}
            getUsersTotalCountFunc={getUsersTotalCountFunc}
          />
        </section>
      </main>
    </Fragment>
  )
}

UsersList.propTypes = {
  location: PropTypes.object
}

export default UsersList
