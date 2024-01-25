import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'

import './style.scss'
import PermissionProvider from '../permission-provider'

const PageHeader = ({ title, btnText, route, isAdminAction }) => {
  return (
    <div className="page-header">
      <h3 className="page-header-title text-capitalize">{title}</h3>
      {btnText &&
        (isAdminAction ? (
          <PermissionProvider>
            <Link to={route}>
              <button className="white-btn page-header-btn">{btnText}</button>
            </Link>
          </PermissionProvider>
        ) : (
          <Link to={route}>
            <button className="white-btn page-header-btn">{btnText}</button>
          </Link>
        ))}
    </div>
  )
}
PageHeader.propTypes = {
  title: PropTypes.object,
  btnText: PropTypes.string,
  route: PropTypes.string,
  isAdminAction: PropTypes.bool
}
export default PageHeader
