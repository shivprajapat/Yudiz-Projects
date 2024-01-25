import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment/moment'
// import { Button, Form } from 'react-bootstrap'

// import { convertDate } from 'shared/utils'
// import { Link } from 'react-router-dom'
// import { route } from 'shared/constants/AllRoutes'
import PermissionProvider from 'shared/components/permission-provider'

function LanguageItemRow({ lang, index, selectedUser, onStatusChange, onDelete, onSelect, actionPermission, bulkPermission }) {
  return (
    <tr key={lang._id}>
      {/* <PermissionProvider isAllowedTo={bulkPermission} isArray>
        <td>
          <Form.Check
            type='checkbox'
            id={selectedUser[index]?._id}
            name={selectedUser[index]?._id}
            checked={selectedUser[index]?.value}
            className='form-check m-0'
            onChange={onSelect}
            label='&nbsp;'
          />
        </td>
      </PermissionProvider> */}
      <td>{lang.sName}</td>
      <td>{lang.sCode}</td>
      <td>{lang.isDefault ? 'Default' : '-'}</td>
      <td>{moment(lang.dCreatedDate).format('DD MMMM YYYY, h:mm:ss A') || '-'}</td>
      {/* <td>
        {user.bIsCustom && <span className='custom'>c</span>}
        {user.aRole.aRoleId.map((parent, index) => {
          if (index > 1) {
            return '.'
          } else {
            return `${parent.sName}${user.aRole.aRoleId.length - 1 !== index ? ', ' : ''}`
          }
        })}
      </td> */}
      {/* <td>
        {convertDate(user.dCreated)}
      </td> */}
      {/* <PermissionProvider isAllowedTo={actionPermission} isArray>
        <td>
          <PermissionProvider isAllowedTo='CHANGE_STATUS_SUBADMIN'>
            <Form.Check
              type='switch'
              name={user._id}
              className='d-inline-block me-1'
              checked={user.eStatus === 'a'}
              onChange={onStatusChange}
            />
          </PermissionProvider>
          <PermissionProvider isAllowedTo='EDIT_SUBADMIN'>
            <Button variant='link' className='square icon-btn' as={Link} to={route.editSubAdmin(user._id)}>
              <i className='icon-create d-block' />
            </Button>
          </PermissionProvider>
          <PermissionProvider isAllowedTo='DELETE_SUBADMIN'>
            <Button variant='link' className='square icon-btn' onClick={() => onDelete(user._id)}>
              <i className='icon-delete d-block' />
            </Button>
          </PermissionProvider>
        </td>
      </PermissionProvider> */}
    </tr>
  )
}
LanguageItemRow.propTypes = {
  user: PropTypes.object,
  index: PropTypes.number,
  selectedUser: PropTypes.array,
  actionPermission: PropTypes.array,
  bulkPermission: PropTypes.array,
  onDelete: PropTypes.func,
  onStatusChange: PropTypes.func,
  onSelect: PropTypes.func
}
export default LanguageItemRow
