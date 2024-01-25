import React, { memo, useEffect, useMemo, useState } from 'react'
import PropTypes from 'prop-types'
import { formatDistance } from 'date-fns'
import { NavDropdown } from 'react-bootstrap'
import { useSelector, useDispatch } from 'react-redux'
import socketio from 'socket.io-client'

import SingleNotification from '../single-notification'
import { getMyNotifications } from 'modules/pushNotifications/redux/service'
import { INSERT_PUSH_NOTIFICATION } from 'modules/pushNotifications/redux/action'
import { NotificationIcon } from '../notification-icon'

const NotificationDropdown = ({ isForMobile }) => {
  const dispatch = useDispatch()

  const [menuIsOpen, setMenuIsOpen] = useState(false)
  const [isNewNotificationArrived, setIsNewNotificationArrived] = useState(false)

  const perPage = 20
  const userId = localStorage.getItem('userId')
  const targetUserId = userId
  const recentNotificationsData = useSelector((state) => state.notifications)
  const recentNotifications = recentNotificationsData?.pushNotifications?.notifications?.slice(0, 20)

  let url = process.env.REACT_APP_API_URL
  url = url.replace('/v1', '')
  let notificationTimeout

  const handleNotificationMenu = () => {
    if (menuIsOpen) {
      setIsNewNotificationArrived(false)
    }
    setMenuIsOpen(!menuIsOpen)
  }

  const timeAgoFormat = (time) => {
    return formatDistance(new Date(time), new Date(), { addSuffix: true })
  }

  const socketConnect = useMemo(
    () =>
      socketio.connect(url, {
        reconnection: true,
        query: { userId }
      }),
    []
  )

  useEffect(() => {
    dispatch(getMyNotifications({ targetUserId, perPage }))

    socketConnect?.on('connect', () => {
      console.log(socketConnect)
      console.log('on connect')
    })

    socketConnect?.on('disconnect', () => {
      console.log('on disconnect')
    })

    socketConnect?.on('connect_error', (err) => {
      console.log('----Error--Message-----', err.message)
    })

    socketConnect?.on('getNotification', (data) => {
      console.log('-------data-----------', data)
      console.log('getNotification')
      if (data.userId === userId) {
        setIsNewNotificationArrived(true)
        notificationTimeout = setTimeout(() => setIsNewNotificationArrived(false), 180000)

        dispatch({
          type: INSERT_PUSH_NOTIFICATION,
          payload: {
            data
          }
        })
      }
    })

    return () => {
      socketConnect?.off('connect')
      socketConnect?.off('disconnect')
      socketConnect?.off('getNotification')
      clearTimeout(notificationTimeout)
    }
  }, [socketConnect])

  return (
    <NavDropdown
      title={<NotificationIcon isNewNotificationArrived={isNewNotificationArrived} menuIsOpen={menuIsOpen} />}
      className={`notification-dropdown ${isForMobile && 'notification-mobile'}`}
      show={menuIsOpen}
      onToggle={handleNotificationMenu}
    >
      {recentNotifications?.length > 0 ? (
        recentNotifications.map((notification) => (
          <SingleNotification
            key={notification.id}
            heading={notification.detailedDescription.bodyHeading}
            time={timeAgoFormat(notification.updatedAt)}
            details={notification.detailedDescription.emailBodyText1}
          />
        ))
      ) : (
        <div className="w-100 d-flex justify-center align-items-center">
          <p className="lead">No, Notification for you at the moment.</p>
        </div>
      )}
    </NavDropdown>
  )
}

NotificationDropdown.propTypes = {
  isForMobile: PropTypes.bool
}

export default memo(NotificationDropdown)
