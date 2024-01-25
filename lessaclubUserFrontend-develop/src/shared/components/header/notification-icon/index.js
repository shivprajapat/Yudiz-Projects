import React from 'react'
import PropTypes from 'prop-types'

import { MdNotifications, MdOutlineNotifications } from 'react-icons/md'

export const NotificationIcon = ({ isNewNotificationArrived, menuIsOpen }) => (
  <div className="notification-icon">
    {menuIsOpen ? (
      <MdNotifications size={30} color="black" />
    ) : (
      <>
        <MdOutlineNotifications size={30} color="black" />
        {isNewNotificationArrived && <span className="notification-arrived"></span>}
      </>
    )}
  </div>
)

NotificationIcon.propTypes = {
  isNewNotificationArrived: PropTypes.bool,
  menuIsOpen: PropTypes.bool
}
