import React from 'react'
import PropTypes from 'prop-types'
import { Button, Form } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { FormattedMessage } from 'react-intl'

import { convertDate, getDesignationInJob } from 'shared/utils'
import { allRoutes } from 'shared/constants/AllRoutes'
import PermissionProvider from 'shared/components/permission-provider'
import { S3_PREFIX } from 'shared/constants'

function EnquiryItemRow({ enquiry, index, selectedEnquiry, onDelete, onSelect, bulkPermission, actionPermission }) {
  return (
    <tr key={enquiry._id}>
      <td>
        <PermissionProvider isAllowedTo={bulkPermission} isArray>
          <Form.Check
            type="checkbox"
            id={selectedEnquiry[index]?._id}
            name={selectedEnquiry[index]?._id}
            checked={selectedEnquiry[index]?.value}
            className="form-check m-0"
            onChange={onSelect}
            label="&nbsp;"
          />
        </PermissionProvider>
      </td>
      <td>
        <p className="title jobTitle">{enquiry.sFullName}</p>
        <p className="date">
          <span>
            <FormattedMessage id="d" />
          </span>
          {convertDate(enquiry.dCreated)}
        </p>
      </td>
      <td>{getDesignationInJob(enquiry?.oJobData?.eDesignation)}</td>
      <td>{enquiry?.oJobData?.sTitle}</td>
      <td>{enquiry?.sEmail}</td>
      <td>{enquiry?.sPhone}</td>
      <td>
        <PermissionProvider isAllowedTo={actionPermission} isArray>
          <PermissionProvider isAllowedTo="EDIT_ACTIVE_TAG">
            <Button variant="link" className="square icon-btn" as={Link} to={allRoutes.detailEnquiry(enquiry._id)}>
              <i className="icon-visibility d-block" />
            </Button>
          </PermissionProvider>
          <PermissionProvider isAllowedTo="EDIT_ACTIVE_TAG">
            <Button variant="link" className="square icon-btn">
              <a href={`${S3_PREFIX}${enquiry?.sUploadCV}`} download rel="noreferrer" target="_blank" className="text-reset">
                <i className="icon-download d-block" />
              </a>
            </Button>
            <Button variant="link" className="square icon-btn">
              <a href={`${S3_PREFIX}${enquiry?.sUploadSample}`} download rel="noreferrer" target="_blank" className="text-reset">
                <i className="icon-file d-block" />
              </a>
            </Button>
          </PermissionProvider>
          <PermissionProvider isAllowedTo="DELETE_ACTIVE_TAG">
            <Button variant="link" className="square icon-btn" onClick={() => onDelete(enquiry._id)}>
              <i className="icon-delete d-block" />
            </Button>
          </PermissionProvider>
        </PermissionProvider>
      </td>
    </tr>
  )
}
EnquiryItemRow.propTypes = {
  enquiry: PropTypes.object,
  index: PropTypes.number,
  selectedEnquiry: PropTypes.array,
  bulkPermission: PropTypes.array,
  actionPermission: PropTypes.array,
  onDelete: PropTypes.func,
  onSelect: PropTypes.func
}
export default EnquiryItemRow
