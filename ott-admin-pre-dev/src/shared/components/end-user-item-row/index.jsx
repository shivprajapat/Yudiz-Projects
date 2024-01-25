/* eslint-disable react-hooks/rules-of-hooks */
import React from 'react'
import PropTypes from 'prop-types'
import { Button, Form } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { useIntl } from 'react-intl'

// import { allRoutes } from 'shared/constants/AllRoutes'
import PermissionProvider from '../permission-provider'
import Verified from 'assets/images/blue-tick.svg'
import { convertDate } from 'shared/utils'

function EndUserItemRow({ user, index, selectedUser, onDelete, onStatusChange, onSelect, bulkPermission, actionPermission }) {
  return (
    <tr key={user._id}>
      <td>
        <PermissionProvider isAllowedTo={bulkPermission} isArray>
          <Form.Check
            type='checkbox'
            id={selectedUser[index]?._id}
            name={selectedUser[index]?._id}
            checked={selectedUser[index]?.value}
            className='form-check m-0'
            onChange={onSelect}
            label='&nbsp;'
          />
        </PermissionProvider>
      </td>
      <td>
        {user?.sFullName}
        {user?.bIsMobVerified && (
          <span>
            <img className='ms-2' src={Verified} alt={useIntl().formatMessage({ id: 'verifiedUser' })} />
          </span>
        )}
      </td>
      <td>{user?.sEmail}</td>
      <td>{convertDate(user?.dCreated)}</td>
      <td>
        <PermissionProvider isAllowedTo={actionPermission} isArray>
          <PermissionProvider isAllowedTo='UPDATE_USER_STATUS'>
            <Form.Check
              type='switch'
              name={user._id}
              className='d-inline-block me-1'
              checked={user.eStatus === 'a'}
              onChange={onStatusChange}
            />
          </PermissionProvider>
          <PermissionProvider isAllowedTo='VIEW_USER'>
            <Button variant='link' className='square icon-btn' as={Link}>
              {/* to={allRoutes.detailEndUser(user?._id)} */}
              <i className='icon-visibility d-block' />
            </Button>
          </PermissionProvider>
          <PermissionProvider isAllowedTo='DELETE_USER'>
            <Button variant='link' className='square icon-btn' onClick={() => onDelete(user._id)}>
              <i className='icon-delete d-block' />
            </Button>
          </PermissionProvider>
        </PermissionProvider>
      </td>
    </tr>
  )
}
EndUserItemRow.propTypes = {
  user: PropTypes.object,
  index: PropTypes.number,
  selectedUser: PropTypes.array,
  bulkPermission: PropTypes.array,
  actionPermission: PropTypes.array,
  onDelete: PropTypes.func,
  onStatusChange: PropTypes.func,
  onSelect: PropTypes.func
}
export default EndUserItemRow
