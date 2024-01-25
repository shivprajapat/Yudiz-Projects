import React, { Fragment, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import NotificationManagement from './NotificationContent'
import NavbarComponent from '../../../components/Navbar'
import Heading from '../component/Heading'
import { notificationsList } from '../../../actions/notification'
import qs from 'query-string'
import PropTypes from 'prop-types'
import moment from 'moment'

function NotificationManage (props) {
  const dispatch = useDispatch()
  const [modalOpen, setModalOpen] = useState(false)
  const [searchText, setSearchText] = useState('')
  const [initialFlag, setInitialFlag] = useState(false)
  const [dateRange, setDateRange] = useState([null, null])
  const [startDate, endDate] = dateRange
  const adminPermission = useSelector(state => state.auth.adminPermission)
  const Auth = useSelector(state => state.auth.adminData && state.auth.adminData.eType)

  useEffect(() => {
    const obj = qs.parse(props.location.search)
    if (obj.search) {
      setSearchText(obj.search)
    }
    if (obj.datefrom && obj.dateto) {
      setDateRange([new Date(obj.datefrom), new Date(obj.dateto)])
    }
  }, [])

  function getList (start, limit, sort, order, search, notificationType, StartDate, EndDate, token) {
    const dateFrom = StartDate ? new Date(moment(StartDate).startOf('day').format()) : ''
    const dateTo = EndDate ? new Date(moment(EndDate).endOf('day').format()) : ''
    const data = {
      start, limit, sort, order, search: search.trim(), notificationType, dateFrom: dateFrom ? new Date(dateFrom).toISOString() : '', dateTo: dateTo ? new Date(dateTo).toISOString() : '', token
    }
    dispatch(notificationsList(data))
  }

  function onHandleSearch (e) {
    setSearchText(e.target.value)
    setInitialFlag(true)
  }

  return (
    <Fragment>
      <NavbarComponent {...props} />
      <main className="main-content">
        <section className="management-section common-box">
          <Heading
            notificationFilter
            heading="Notifications"
            notification="Send Notification"
            handleSearch={onHandleSearch}
            search={searchText}
            startDate={startDate}
            endDate={endDate}
            dateRange={dateRange}
            setDateRange={setDateRange}
            modalOpen={modalOpen}
            setModalOpen={setModalOpen}
            permission={(Auth && Auth === 'SUPER') || (adminPermission?.NOTIFICATION !== 'R')}
          />
          <NotificationManagement
            {...props}
            getList={getList}
            search={searchText}
            flag={initialFlag}
            startDate={startDate}
            endDate={endDate}
            modalOpen={modalOpen}
            setModalOpen={setModalOpen}
          />
        </section>
      </main>
    </Fragment>
  )
}

NotificationManage.propTypes = {
  location: PropTypes.object
}

export default NotificationManage
