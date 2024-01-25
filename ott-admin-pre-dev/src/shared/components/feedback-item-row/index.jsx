import React from 'react'
import PropTypes from 'prop-types'
import { Button, Form } from 'react-bootstrap'
import { Link } from 'react-router-dom'

import { allRoutes } from 'shared/constants/AllRoutes'
import PermissionProvider from '../permission-provider'
import { feedbackQueryType } from 'shared/utils'

function FeedbackItemRow({ feedback, index, selectedFeedback, onDelete, onStatusChange, onSelect, bulkPermission, actionPermission }) {
  return (
    <tr key={feedback._id}>
      <PermissionProvider isAllowedTo={bulkPermission} isArray>
        <td>
          <Form.Check
            type="checkbox"
            id={selectedFeedback[index]?._id}
            name={selectedFeedback[index]?._id}
            checked={selectedFeedback[index]?.value}
            className="form-check m-0"
            onChange={onSelect}
            label="&nbsp;"
          />
        </td>
      </PermissionProvider>
      <td>{feedback.sName}</td>
      <td>{feedback.sEmail}</td>
      <td>{feedbackQueryType(feedback.eQueryType)}</td>
      <td>{feedback.sSubject}</td>
      <td>
        <PermissionProvider isAllowedTo="GET_FEEDBACK">
          <Button variant="link" className="square icon-btn" as={Link} to={allRoutes.detailFeedback(feedback._id)}>
            <i className="icon-visibility d-block" />
          </Button>
        </PermissionProvider>
        <PermissionProvider isAllowedTo="DELETE_FEEDBACK">
          <Button variant="link" className="square icon-btn" onClick={() => onDelete(feedback._id)}>
            <i className="icon-delete d-block" />
          </Button>
        </PermissionProvider>
      </td>
    </tr>
  )
}
FeedbackItemRow.propTypes = {
  feedback: PropTypes.object,
  index: PropTypes.number,
  selectedFeedback: PropTypes.array,
  bulkPermission: PropTypes.array,
  actionPermission: PropTypes.array,
  onDelete: PropTypes.func,
  onStatusChange: PropTypes.func,
  onSelect: PropTypes.func
}
export default FeedbackItemRow
