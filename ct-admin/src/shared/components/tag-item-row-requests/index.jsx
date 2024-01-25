import React from 'react'
import PropTypes from 'prop-types'
import { Form } from 'react-bootstrap'
import { convertDateInDMY, eTypeName } from 'shared/utils'
import PermissionProvider from '../permission-provider'

function TagItemRowRequestes({ tag, index, selectedTag, onDelete, onSelect, onIsApprove, bulkPermission, actionPermission }) {
  return (
    <tr key={tag?._id}>
      <PermissionProvider isAllowedTo={bulkPermission} isArray>
        <td>
          <Form.Check
            type="checkbox"
            id={selectedTag[index]?._id}
            name={selectedTag[index]?._id}
            checked={selectedTag[index]?.value}
            className="form-check m-0"
            onChange={onSelect}
            label="&nbsp;"
          />
        </td>
      </PermissionProvider>
      <td>{tag?.sName}</td>
      <td>{eTypeName(tag?.eType)}</td>
      <td>{tag?.oSeo?.sSlug || '-'}</td>
      <td>{convertDateInDMY(tag?.dCreated)}</td>
      <td>{tag?.oSubAdmin?.sFName || '-'}</td>
      <PermissionProvider isAllowedTo={actionPermission} isArray>
        <td>
          <PermissionProvider isAllowedTo="APPROVE_REJECT_REQUESTS_TAG">
            <i className="icon-check approved" onClick={() => onIsApprove(tag?._id, 'approved')} />
          </PermissionProvider>
          <PermissionProvider isAllowedTo="APPROVE_REJECT_REQUESTS_TAG">
            <i className="icon-close decline" onClick={() => onIsApprove(tag?._id, 'decline')} />
          </PermissionProvider>
          <PermissionProvider isAllowedTo="DELETE_REQUESTS_TAG">
            <i className="icon-delete delete" onClick={() => onDelete(tag?._id)} />
          </PermissionProvider>
        </td>
      </PermissionProvider>
    </tr>
  )
}
TagItemRowRequestes.propTypes = {
  tag: PropTypes.object,
  index: PropTypes.number,
  selectedTag: PropTypes.array,
  bulkPermission: PropTypes.array,
  actionPermission: PropTypes.array,
  onDelete: PropTypes.func,
  onIsApprove: PropTypes.func,
  onSelect: PropTypes.func
}
export default TagItemRowRequestes
