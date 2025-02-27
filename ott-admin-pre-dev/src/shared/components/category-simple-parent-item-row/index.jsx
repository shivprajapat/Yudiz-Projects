import React from 'react'
import PropTypes from 'prop-types'
import { Button, Form } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { FormattedMessage } from 'react-intl'

import { convertDate } from 'shared/utils'
import { allRoutes } from 'shared/constants/AllRoutes'
import PermissionProvider from '../permission-provider'
import { URL_PREFIX } from 'shared/constants'

function CategorySimpleParentItemRow({ category, index, selectedCategory, onDelete, onStatusChange, onSelect, bulkPermission }) {
  return (
    <tr key={category?._id}>
      <PermissionProvider isAllowedTo={bulkPermission} isArray>
        <td>
          <Form.Check
            type="checkbox"
            id={selectedCategory[index]?._id}
            name={selectedCategory[index]?._id}
            checked={selectedCategory[index]?.value}
            className="form-check m-0"
            onChange={onSelect}
            label="&nbsp;"
          />
        </td>
      </PermissionProvider>
      <td>
        <p className="title">{category?.sName}</p>
        <p className="date">
          <span>
            <FormattedMessage id="d" />
          </span>
          {convertDate(category?.dCreated)}
          <span>
            <FormattedMessage id="lm" />
          </span>
          {convertDate(category?.dUpdated)}
        </p>
      </td>
      <td>{category?.oSeo?.sSlug || '-'}</td>
      <td>{category?.oParentCategory?.sName || '-'}</td>
      <td>{category?.oSubAdmin?.sFName || '-'}</td>
      <td>{category?.nCount}</td>
      <td>
        <PermissionProvider isAllowedTo="CHANGE_STATUS_CATEGORY">
          <Form.Check
            type="switch"
            name={category?._id}
            className="d-inline-block me-1"
            checked={category?.eStatus === 'a'}
            onChange={onStatusChange}
          />
        </PermissionProvider>
        <PermissionProvider isAllowedTo="EDIT_CATEGORY">
          <Button variant="link" className="square icon-btn" as={Link} to={allRoutes.editCategory(category?._id)}>
            <i className="icon-create d-block" />
          </Button>
        </PermissionProvider>
        <a className="link" href={`${URL_PREFIX}${category?.oSeo?.sSlug}`} target="_blank" rel="noreferrer">
          <Button variant="link" className="square icon-btn">
            <i className="icon-language d-block" />
          </Button>
        </a>
        <PermissionProvider isAllowedTo="DELETE_CATEGORY">
          <Button variant="link" className="square icon-btn" onClick={() => onDelete(category?._id)}>
            <i className="icon-delete d-block" />
          </Button>
        </PermissionProvider>
      </td>
    </tr>
  )
}
CategorySimpleParentItemRow.propTypes = {
  category: PropTypes.object,
  index: PropTypes.number,
  selectedCategory: PropTypes.array,
  bulkPermission: PropTypes.array,
  onDelete: PropTypes.func,
  onStatusChange: PropTypes.func,
  onSelect: PropTypes.func
}
export default CategorySimpleParentItemRow
