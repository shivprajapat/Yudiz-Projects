import React from 'react'
import PropTypes from 'prop-types'
import { convertDateInDMY } from 'helper/helper'
// import PermissionProvider from 'shared/components/permission-provider'

function CustomerViewItemRow({ user, index, selectedUser, onStatusChange, onDelete, onSelect, actionPermission, bulkPermission }) {
  return (
    <tr key={user._id}>
      <td>{user?.sRemoteAddress ? user.sRemoteAddress : '--'}</td>
      <td>{user?.oDeviceInfo?.eDeviceType ? user?.oDeviceInfo?.eDeviceType : '--'}</td>
      <td>{user?.oDeviceInfo?.sDeviceToken ? user?.oDeviceInfo?.sDeviceToken : '--'}</td>
      <td>{user?.oMeta?.sMobile ? user?.oMeta?.sMobile : '--'}</td>
      <td>{user?.oMeta.sCode ? user?.oMeta.sCode : '--'}</td>
      <td>{user?.sOperation ? user?.sOperation : '--'}</td>
      <td>{user?.sSubOperation ? user?.sSubOperation : '--'}</td>
      <td>{user?.oWatchedInfo?.watchedPercentage ? user?.oWatchedInfo?.watchedPercentage : '--'}</td>
      <td>{user?.movies?.sName ? user?.movies?.sName : '--'}</td>
      <td>{user?.episodes?.sName ? user?.episodes?.sName : '--'}</td>
      <td>{user?.seasons?.sSeasonNumber ? user?.seasons?.sSeasonNumber : '--'}</td>
      <td>{user?.episodes?.sEpisodeNumber ? user?.episodes?.sEpisodeNumber : '--'}</td>
      <td>{convertDateInDMY(user?.dCreatedDate)}</td>
    </tr>
  )
}
CustomerViewItemRow.propTypes = {
  user: PropTypes.object,
  index: PropTypes.number,
  selectedUser: PropTypes.array,
  actionPermission: PropTypes.array,
  bulkPermission: PropTypes.array,
  onDelete: PropTypes.func,
  onStatusChange: PropTypes.func,
  onSelect: PropTypes.func
}
export default CustomerViewItemRow
