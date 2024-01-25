import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { Badge, Form, Dropdown } from 'react-bootstrap'
import { eStatus, colorBadge, convertDate } from 'shared/utils'
import { FormattedMessage } from 'react-intl'

function CommentItemRow({ comment, index, selectedComment, onSelect, onChangeStatus }) {
  const [action, setAction] = useState(['Approve', 'Pending', 'Reject', 'Move to Spam', 'Move to Trash'])
  useEffect(() => {
    if (comment.eStatus === 'all') {
      setAction(['Approve', 'Reject', 'Pending', 'Move to Spam', 'Move to Trash', 'Delete'])
    } else if (comment.eStatus === 'a') {
      setAction(['Reject', 'Pending', 'Move to Spam', 'Move to Trash', 'Delete'])
    } else if (comment.eStatus === 'p') {
      setAction(['Approve', 'Reject', 'Move to Spam', 'Move to Trash', 'Delete'])
    } else if (comment.eStatus === 'sp') {
      setAction(['Approve', 'Pending', 'Reject', 'Move to Trash', 'Delete'])
    } else if (comment.eStatus === 't') {
      setAction(['Approve', 'Pending', 'Reject', 'Move to Spam', 'Delete'])
    } else if (comment.eStatus === 'r') {
      setAction(['Approve', 'Pending', 'Move to Spam', 'Move to Trash', 'Delete'])
    }
  }, [comment])

  function getStatus() {
    if (eStatus(comment.eStatus) === 'Spam') {
      return `(${comment.nReportCount})` + ' ' + eStatus(comment.eStatus)
    } else {
      return eStatus(comment.eStatus)
    }
  }

  return (
    <>
      <tr>
        <td>
          <Form.Check
            type="checkbox"
            id={selectedComment[index]?._id}
            name={selectedComment[index]?._id}
            checked={selectedComment[index]?.value}
            className="form-check m-0"
            onChange={onSelect}
            label="&nbsp;"
          />
        </td>
        <td>
          <div className="icons">
            <Badge bg={colorBadge(comment.eStatus)}>
              {getStatus()}
            </Badge>
          </div>
          <p className="title">{comment.sContent}</p>
          <p className="date">
            <span>
              <FormattedMessage id="d" />
            </span>
            {convertDate(comment.dCreated)}{' '}
            <span>
              <FormattedMessage id="lm" />
            </span>
            {convertDate(comment.dUpdated)}
          </p>
        </td>
        <td>
          <p className="cat">{comment?.oArticle?.sTitle || '-'}</p>
        </td>
        <td>{comment?.nReportCount}</td>
        <td>
          <p>{comment?.oCreatedBy?.sUsername}</p>
        </td>
        <td>
          <Dropdown>
            <Dropdown.Toggle variant="link" className="actionButton">
              <i className="icon-dots-verticle d-block" />
            </Dropdown.Toggle>
            <Dropdown.Menu>
              {action.map((item) => (
                <Dropdown.Item
                  key={item}
                  onClick={() => {
                    onChangeStatus(item, comment._id, comment.eStatus)
                  }}
                >
                  {item}
                </Dropdown.Item>
              ))}
            </Dropdown.Menu>
          </Dropdown>
        </td>
      </tr>
    </>
  )
}
CommentItemRow.propTypes = {
  comment: PropTypes.object,
  index: PropTypes.number,
  selectedComment: PropTypes.array,
  onSelect: PropTypes.func,
  onChangeStatus: PropTypes.func
}
export default CommentItemRow
