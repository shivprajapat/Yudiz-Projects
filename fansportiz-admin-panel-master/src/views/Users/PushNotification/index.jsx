import moment from 'moment'
import qs from 'query-string'
import PropTypes from 'prop-types'
import React, { Fragment, useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { pushNotificationList } from '../../../actions/pushnotification'
import NavbarComponent from '../../../components/Navbar'
import Heading from '../../Settings/component/Heading'
import PushNotificationContent from './PushNotification'

function PushNotification (props) {
  const dispatch = useDispatch()
  const content = useRef()
  const [search, setSearch] = useState('')
  const [initialFlag, setinitialFlag] = useState(false)
  const [dateRange, setDateRange] = useState([null, null])
  const [startDate, endDate] = dateRange
  const [modalOpen, setModalOpen] = useState(false)

  const adminPermission = useSelector(state => state.auth.adminPermission)
  const Auth = useSelector(state => state.auth.adminData && state.auth.adminData.eType)
  const token = useSelector(state => state.auth.token)
  const notificationList = useSelector(state => state.pushNotification.pushNotificationList)

  useEffect(() => {
    const obj = qs.parse(props.location.search)
    if (obj.search) {
      setSearch(obj.search)
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

  function getList (start, limit, sort, search, dateFrom, dateTo, platform, orderby) {
    const from = dateFrom ? new Date(moment(dateFrom).startOf('day').format()) : ''
    const to = dateTo ? new Date(moment(dateTo).endOf('day').format()) : ''
    const listData = {
      start, limit, sort, search, startDate: from ? new Date(from).toISOString() : '', endDate: to ? new Date(to).toISOString() : '', platform, orderby, token
    }
    dispatch(pushNotificationList(listData))
  }

  function onRefreshFun () {
    content.current.onRefresh()
  }

  return (
    <Fragment>
      <NavbarComponent {...props} />
      <main className="main-content">
        <section className="management-section common-box">
          <Heading
            heading="Push Notifications"
            notification="Send Push Notification"
            aNotification="Automated Notifications"
            handleSearch={onHandleSearch}
            search={search}
            list={notificationList}
            startDate={startDate}
            endDate={endDate}
            dateRange={dateRange}
            setDateRange={setDateRange}
            modalOpen={modalOpen}
            setModalOpen={setModalOpen}
            refresh
            onRefresh={onRefreshFun}
            notificationFilter
            permission={(Auth && Auth === 'SUPER') || (adminPermission?.PUSHNOTIFICATION !== 'R')}
          />
          <PushNotificationContent
            {...props}
            ref={content}
            search={search}
            getList={getList}
            flag={initialFlag}
            modalOpen={modalOpen}
            setModalOpen={setModalOpen}
            startDate={startDate}
            endDate={endDate}
          />
        </section>
      </main>
    </Fragment>
  )
}

PushNotification.propTypes = {
  location: PropTypes.object
}

export default PushNotification
