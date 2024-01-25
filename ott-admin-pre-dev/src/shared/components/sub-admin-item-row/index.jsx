import React from 'react'
import PropTypes from 'prop-types'

function SubAdminItemRow({ user }) {
  return (
    <tr key={user._id}>
      <td>{user.sUserName}</td>
      <td>{user.sEmail}</td>
      <td>{user.sMobile}</td>
      <td>
        <p>user Type : {user.iAddedBy?.eUserType}</p>
      </td>
    </tr>
  )
}
SubAdminItemRow.propTypes = {
  user: PropTypes.object
}
export default SubAdminItemRow
