import React from 'react'
import PropTypes from 'prop-types'
import { ReactComponent as Eye } from 'Assets/Icons/eye.svg'
import Edit from 'Assets/Icons/Edit'
import Delete from 'Assets/Icons/Delete'

export default function ActionColumn({ view, handleView, handleEdit, handleDelete }) {
  return (
    <td style={{ textAlign: 'right' }}>
      {view && (
        <span className="mx-3 cursor-pointer" onClick={handleView}>
          <Eye />
        </span>
      )}
      <span className="mx-3 cursor-pointer" onClick={handleEdit}>
        <Edit fill="#B2BFD2" />
      </span>
      <span className="mx-3 cursor-pointer" onClick={handleDelete}>
        <Delete fill="#B2BFD2" />
      </span>
    </td>
  )
}

ActionColumn.propTypes = {
  view: PropTypes.bool,
  handleView: PropTypes.func,
  handleEdit: PropTypes.func,
  handleDelete: PropTypes.func,
}
