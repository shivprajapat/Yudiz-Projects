import React from 'react'
import PropTypes from 'prop-types'
import { useNavigate } from 'react-router-dom'

import { convertDateToMDY } from 'shared/utils'
import { allRoutes } from 'shared/constants/allRoutes'

const ProfileCommunityList = ({ community }) => {
  const navigate = useNavigate()
  return (
    <tr onClick={() => navigate(allRoutes.editViewCommunity(community?.id))}>
      <td>{community?.name}</td>
      <td colSpan={2}>{community?.followerCount || 0}</td>
      <td>{convertDateToMDY(community?.createdAt)}</td>
    </tr>
  )
}
ProfileCommunityList.propTypes = {
  community: PropTypes.object
}
export default ProfileCommunityList
