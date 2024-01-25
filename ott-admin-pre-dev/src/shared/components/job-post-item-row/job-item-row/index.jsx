import React from 'react'
import PropTypes from 'prop-types'
import { Button, Form } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { FormattedMessage, useIntl } from 'react-intl'

import { convertDate, getDesignationInJob } from 'shared/utils'
import { allRoutes } from 'shared/constants/AllRoutes'
import PermissionProvider from 'shared/components/permission-provider'
import { URL_PREFIX } from 'shared/constants'
import CustomToolTips from 'shared/components/custom-tooltip'

function JobPostItemRow({ job, index, selectedJob, onDelete, onStatusChange, onSelect, bulkPermission, actionPermission }) {
  return (
    <tr key={job._id}>
      <td>
        <PermissionProvider isAllowedTo={bulkPermission} isArray>
          <Form.Check
            type="checkbox"
            id={selectedJob[index]?._id}
            name={selectedJob[index]?._id}
            checked={selectedJob[index]?.value}
            className="form-check m-0"
            onChange={onSelect}
            label="&nbsp;"
          />
        </PermissionProvider>
      </td>
      <td>
        <p className="title">{job.eDesignation ? getDesignationInJob(job.eDesignation) : '-'}</p>
        <p className="date">
          <span>
            <FormattedMessage id="d" />
          </span>
          {convertDate(job.dCreated)}
          <span>
            <FormattedMessage id="lm" />
          </span>
          {convertDate(job.dUpdated)}
        </p>
      </td>
      <td>{job.sTitle ? job.sTitle : '-'}</td>
      <td>{`${job?.fExperienceFrom} - ${job?.fExperienceTo} ${useIntl().formatMessage({ id: 'years' })}`}</td>
      <td>{`${job?.fSalaryFrom} - ${job?.fSalaryTo} ${useIntl().formatMessage({ id: 'lpa' })}`}</td>
      <td>{job?.nEnquiryCount}</td>
      <td>
        <PermissionProvider isAllowedTo={actionPermission} isArray>
          <PermissionProvider isAllowedTo="CHANGE_STATUS_ACTIVE_TAG">
            <Form.Check
              type="switch"
              name={job._id}
              className="d-inline-block me-1"
              checked={job.eStatus === 'a'}
              onChange={onStatusChange}
            />
          </PermissionProvider>
          <PermissionProvider isAllowedTo="EDIT_ACTIVE_TAG">
            <CustomToolTips tooltip="View">
              <Button variant="link" className="square icon-btn" as={Link} to={allRoutes.editJobPost('detail-job', job._id)}>
                <i className="icon-visibility d-block" />
              </Button>
            </CustomToolTips>
          </PermissionProvider>
          <PermissionProvider isAllowedTo="EDIT_ACTIVE_TAG">
            <CustomToolTips tooltip="Edit">
              <Button variant="link" className="square icon-btn" as={Link} to={allRoutes.editJobPost('edit-job', job._id)}>
                <i className="icon-create d-block" />
              </Button>
            </CustomToolTips>
          </PermissionProvider>
          <CustomToolTips tooltip="Open in new tab">
            <a className="link" href={`${URL_PREFIX}careers/${job?.oSeo?.sSlug}`} target="_blank" rel="noreferrer">
              <Button variant="link" className="square icon-btn">
                <i className="icon-language d-block" />
              </Button>
            </a>
          </CustomToolTips>
          <PermissionProvider isAllowedTo="DELETE_ACTIVE_TAG">
            <CustomToolTips tooltip="Delete">
              <Button variant="link" className="square icon-btn" onClick={() => onDelete(job._id)}>
                <i className="icon-delete d-block" />
              </Button>
            </CustomToolTips>
          </PermissionProvider>
        </PermissionProvider>
      </td>
    </tr>
  )
}
JobPostItemRow.propTypes = {
  job: PropTypes.object,
  index: PropTypes.number,
  selectedJob: PropTypes.array,
  bulkPermission: PropTypes.array,
  actionPermission: PropTypes.array,
  onDelete: PropTypes.func,
  onStatusChange: PropTypes.func,
  onSelect: PropTypes.func
}
export default JobPostItemRow
