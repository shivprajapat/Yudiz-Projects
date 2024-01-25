import React from 'react'
import PropTypes from 'prop-types'
import { Button, Form } from 'react-bootstrap'

import { convertDate } from 'shared/utils'
import { Link } from 'react-router-dom'
import { allRoutes } from 'shared/constants/AllRoutes'
import PermissionProvider from 'shared/components/permission-provider'

function SubAdminItemRow({ user, index, selectedUser, onStatusChange, onDelete, onSelect, actionPermission, bulkPermission }) {
  return (
    <tr key={user._id}>
      <PermissionProvider isAllowedTo={bulkPermission} isArray>
        <td>
          <Form.Check
            type="checkbox"
            id={selectedUser[index]?._id}
            name={selectedUser[index]?._id}
            checked={selectedUser[index]?.value}
            className="form-check m-0"
            onChange={onSelect}
            label="&nbsp;"
          />
        </td>
      </PermissionProvider>
      <td>
        {user.sFName}
        {user.bIsVerified && <i className="icon-check verified-icon" />}
      </td>
      <td>
        {user.bIsCustom && <span className="custom">c</span>}
        {user.aRole.aRoleId.map((parent, index) => {
          if (index > 1) {
            return '.'
          } else {
            return `${parent.sName}${user.aRole.aRoleId.length - 1 !== index ? ', ' : ''}`
          }
        })}
      </td>
      <td>{user.sEmail}</td>
      <td>{convertDate(user.dCreated)}</td>
      <PermissionProvider isAllowedTo={actionPermission} isArray>
        <td>
          <PermissionProvider isAllowedTo="CHANGE_STATUS_SUBADMIN">
            <Form.Check
              type="switch"
              name={user._id}
              className="d-inline-block me-1"
              checked={user.eStatus === 'a'}
              onChange={onStatusChange}
            />
          </PermissionProvider>
          <PermissionProvider isAllowedTo="EDIT_SUBADMIN">
            <Button variant="link" className="square icon-btn" as={Link} to={allRoutes.editSubAdmin(user._id)}>
              <i className="icon-create d-block" />
            </Button>
          </PermissionProvider>
          <PermissionProvider isAllowedTo="DELETE_SUBADMIN">
            <Button variant="link" className="square icon-btn" onClick={() => onDelete(user._id)}>
              <i className="icon-delete d-block" />
            </Button>
          </PermissionProvider>
        </td>
      </PermissionProvider>
    </tr>
  )
}
SubAdminItemRow.propTypes = {
  user: PropTypes.object,
  index: PropTypes.number,
  selectedUser: PropTypes.array,
  actionPermission: PropTypes.array,
  bulkPermission: PropTypes.array,
  onDelete: PropTypes.func,
  onStatusChange: PropTypes.func,
  onSelect: PropTypes.func
}
export default SubAdminItemRow
