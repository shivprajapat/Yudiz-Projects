import React from 'react'
import PropTypes from 'prop-types'
import { Form } from 'react-bootstrap'
import { FaRegEye } from 'react-icons/fa'
import { AiOutlineEdit, AiOutlineDelete } from 'react-icons/ai'

import { adminRoutes } from 'shared/constants/adminRoutes'
import { Link } from 'react-router-dom'

const Row = ({ apiUser = {}, onStatusChange, onEdit, onDelete }) => {
  return (
    <tr key={apiUser.id}>
      <td>{apiUser.name || '-'}</td>
      <td>{apiUser.email || '-'}</td>
      <td>
        <a href={apiUser?.link} target='_blank' rel="noreferrer">
          {apiUser?.link || '-'}
        </a>
      </td>
      <td>
        <Form.Check
          className="admin-switch d-inline-block"
          type="switch"
          id={apiUser.id}
          checked={!apiUser.isBlocked}
          onChange={() => onStatusChange(apiUser)}
        />
      </td>
      <td>
        <Link rel="noreferrer" to={`${adminRoutes.previewApi(apiUser?.id)}`}>
          <FaRegEye />
        </Link>
        <a onClick={() => onEdit(apiUser)}>
          <AiOutlineEdit />
        </a>
        <a onClick={() => onDelete(apiUser)}>
          <AiOutlineDelete />
        </a>
      </td>
    </tr>
  )
}
Row.propTypes = {
  apiUser: PropTypes.object,
  onStatusChange: PropTypes.func,
  onEdit: PropTypes.func,
  onDelete: PropTypes.func
}
export default Row
