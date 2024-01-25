import React from 'react'
import './_table-popup.scss'
import { ListGroup } from 'react-bootstrap'
import PropTypes from 'prop-types'
const TablePopup = ({ EmployeeReviewFun }) => {
  return (
    <div className="tablePopup">
      <ListGroup>
        <ListGroup.Item onClick={EmployeeReviewFun}>View</ListGroup.Item>
        <ListGroup.Item>Edit</ListGroup.Item>
        <ListGroup.Item>Delete</ListGroup.Item>
      </ListGroup>
    </div>
  )
}

TablePopup.propTypes = {
  EmployeeReviewFun: PropTypes.func,
}
export default TablePopup
