import React from 'react'
import PropTypes from 'prop-types'
import { Form, Button } from 'react-bootstrap'
import { Link } from 'react-router-dom'

import { allRoutes } from 'shared/constants/AllRoutes'
import PermissionProvider from 'shared/components/permission-provider'
import { URL_PREFIX } from 'shared/constants'

function TeamTagItemRow({ tag, index, selectedTag, onSelect, onIsApprove, bulkPermission, actionPermission, selectedTab, onStatusChange }) {
  return (
    <tr key={tag._id}>
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
      <td>{tag.sTitle ? tag.sTitle : '-'}</td>
      <td>{tag.oSeo.sSlug ? tag.oSeo.sSlug : '-'}</td>
      <td>{tag.sCountryFull ? tag.sCountryFull : '-'}</td>
      <PermissionProvider isAllowedTo={actionPermission} isArray>
        <td className="action-btn">
          {selectedTab !== 'allTags' && tag.eTagStatus !== 'a' && (
            <PermissionProvider isAllowedTo="UPDATE_PLAYER_TAG_STATUS">
              <Button variant="link" className="square icon-btn" onClick={() => onIsApprove(tag._id, 'approved')}>
                <i className="icon-check approved" />
              </Button>
            </PermissionProvider>
          )}
          {selectedTab !== 'allTags' && tag.eTagStatus !== 'r' && (
            <PermissionProvider isAllowedTo="UPDATE_PLAYER_TAG_STATUS">
              <Button variant="link" className="square icon-btn" onClick={() => onIsApprove(tag._id, 'decline')}>
                <i className="icon-close decline" />
              </Button>
            </PermissionProvider>
          )}
          {selectedTab === 'allTags' && (
            <PermissionProvider isAllowedTo="UPDATE_PLAYER_TAG_STATUS">
              <Form.Check
                type="switch"
                name={tag._id}
                className="d-inline-block me-1"
                checked={tag.bTagEnabled}
                onChange={onStatusChange}
              />
            </PermissionProvider>
          )}
          {(selectedTab === 'allTags' || selectedTab === 'approvedTags') && (
            <a
              className={`link ps-1 ${tag?.eTagStatus === 'a' ? '' : 'disabled'}`}
              href={`${URL_PREFIX}${tag?.oSeo?.sSlug}`}
              target="_blank"
              rel="noreferrer"
            >
              <Button variant="link" className="square icon-btn">
                <i className="icon-language d-block" />
              </Button>
            </a>
          )}
          <PermissionProvider isAllowedTo="EDIT_TEAM">
            <Button
              variant="link"
              className="square icon-btn"
              as={Link}
              to={selectedTab === 'approvedTags' ? allRoutes.editTag(tag._id) : allRoutes.editTeam(tag._id)}
            >
              <i className="icon-create delete" />
            </Button>
          </PermissionProvider>
        </td>
      </PermissionProvider>
    </tr>
  )
}
TeamTagItemRow.propTypes = {
  tag: PropTypes.object,
  index: PropTypes.number,
  selectedTag: PropTypes.array,
  bulkPermission: PropTypes.array,
  actionPermission: PropTypes.array,
  onIsApprove: PropTypes.func,
  onSelect: PropTypes.func,
  selectedTab: PropTypes.string,
  onStatusChange: PropTypes.func
}
export default TeamTagItemRow
