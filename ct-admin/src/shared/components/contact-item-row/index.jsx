import React from 'react'
import PropTypes from 'prop-types'
import { Button, Form } from 'react-bootstrap'
import { Link } from 'react-router-dom'

import { allRoutes } from 'shared/constants/AllRoutes'
import PermissionProvider from '../permission-provider'

function ContactItemRow({ contact, index, selectedContact, onDelete, onStatusChange, onSelect, bulkPermission, actionPermission }) {
  return (
    <tr key={contact._id}>
      <PermissionProvider isAllowedTo={bulkPermission} isArray>
        <td>
          <Form.Check
            type="checkbox"
            id={selectedContact[index]?._id}
            name={selectedContact[index]?._id}
            checked={selectedContact[index]?.value}
            className="form-check m-0"
            onChange={onSelect}
            label="&nbsp;"
          />
        </td>
      </PermissionProvider>
      <td>{contact.sName}</td>
      <td>{contact.sEmail}</td>
      {/* <td>{queryType(contact.eQueryType)}</td> */}
      <td>{contact.sSubject}</td>
      <td>
        <PermissionProvider isAllowedTo="GET_CONTACT">
          <Button variant="link" className="square icon-btn" as={Link} to={allRoutes.detailContact(contact._id)}>
            <i className="icon-visibility d-block" />
          </Button>
        </PermissionProvider>
        <PermissionProvider isAllowedTo="DELETE_CONTACT">
          <Button variant="link" className="square icon-btn" onClick={() => onDelete(contact._id)}>
            <i className="icon-delete d-block" />
          </Button>
        </PermissionProvider>
      </td>
    </tr>
  )
}
ContactItemRow.propTypes = {
  contact: PropTypes.object,
  index: PropTypes.number,
  selectedContact: PropTypes.array,
  bulkPermission: PropTypes.array,
  actionPermission: PropTypes.array,
  onDelete: PropTypes.func,
  onStatusChange: PropTypes.func,
  onSelect: PropTypes.func
}
export default ContactItemRow
