import React from 'react'
import UserHeader from '../../User/components/UserHeader'
import NotificationPage from './Notification'

function Notification (props) {
  return (
    <>
      <UserHeader title="Notifications" {...props}/>
      <NotificationPage {...props} fetchList/>
    </>
  )
}
export default Notification
