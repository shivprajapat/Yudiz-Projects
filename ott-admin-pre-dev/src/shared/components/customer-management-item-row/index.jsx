import React from 'react'
import PropTypes from 'prop-types'
import { convertDateInDMY } from 'helper/helper'
import { Button, Form } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { route } from 'shared/constants/AllRoutes'
// import PermissionProvider from 'shared/components/permission-provider'

function CustomerManagementItemRow({ user, index, selectedUser, onStatusChange, onDelete, onSelect, actionPermission }) {
  return (
    <tr key={user._id}>
      <td>{user.sUserName ? user.sUserName : '--'}</td>
      <td>{user.sEmail}</td>
      <td>{user.sMobile ? user.sMobile : '--'}</td>
      <td>{user.eGender ? user.eGender : 'unspecified'}</td>
      <td>{convertDateInDMY(user.dCreatedDate)}</td>
      <td>
        <Form.Check
          type='switch'
          name={user._id}
          className='d-inline-block me-1'
          checked={user.eStatus === 'y'}
          onChange={(e) => onStatusChange(user?._id, e.target.checked)}
        />
        <Button variant='link' className='square icon-btn' as={Link} to={route.customerView(user?._id)}>
          <i className='icon-visibility d-block' />
        </Button>
      </td>
    </tr>
  )
}
CustomerManagementItemRow.propTypes = {
  user: PropTypes.object,
  index: PropTypes.number,
  selectedUser: PropTypes.array,
  actionPermission: PropTypes.array,
  bulkPermission: PropTypes.array,
  onDelete: PropTypes.func,
  onStatusChange: PropTypes.func,
  onSelect: PropTypes.func
}
export default CustomerManagementItemRow
