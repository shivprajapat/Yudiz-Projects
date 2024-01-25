import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import { NavLink } from 'react-router-dom'

import { allRoutes } from 'shared/constants/allRoutes'

const ProfileTabs = ({ id, tabs }) => {
  return (
    <div className="profile-page-tabs" id="profile-tabs">
      <div className="profile-tab-links">
        {tabs.map((tab, index) => (
          <Fragment key={index}>
            {['collected', 'created', 'communities'].includes(tab.internalName) && (
              <NavLink to={id ? allRoutes.creatorProfile + '/' + tab.internalName + '/' + id : allRoutes.profile + '/' + tab.internalName}>
                <span>{tab.name}</span>
              </NavLink>
            )}
            {!id && !['collected', 'created', 'communities'].includes(tab.internalName) && (
              <NavLink to={id ? allRoutes.creatorProfile + '/' + tab.internalName + '/' + id : allRoutes.profile + '/' + tab.internalName}>
                <span>{tab.name}</span>
              </NavLink>
            )}
          </Fragment>
        ))}
      </div>
    </div>
  )
}
ProfileTabs.propTypes = {
  id: PropTypes.string,
  assets: PropTypes.object,
  handleTabChange: PropTypes.func,
  tabs: PropTypes.array,
  selectedTab: PropTypes.object,
  handleOrderChange: PropTypes.func,
  handleOrderTimeFilter: PropTypes.func
}
export default ProfileTabs
