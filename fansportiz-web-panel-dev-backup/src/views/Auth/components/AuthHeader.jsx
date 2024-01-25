import React from 'react'
import { Link, useLocation, useParams } from 'react-router-dom'
import PropTypes from 'prop-types'
import { FormattedMessage } from 'react-intl'
import qs from 'query-string'
import HeaderText from '../../../assests/images/fansportiz_header.svg'

function AuthHeader (props) {
  const { backURL, title } = props
  const { pathname, state } = useLocation()
  const { shareCode } = useParams()

  return (
    <div className={title ? 'auth-header d-flex align-items-center' : 'auth-header d-flex align-items-center justify-content-center'}>
      {pathname === '/login'
        ? <Link className={document.dir === 'rtl' ? 'icon-right btn-icon' : 'icon-left btn-icon'} to="/" />
        : (
          <Link
            className={document.dir === 'rtl' ? 'icon-right btn-icon' : 'icon-left btn-icon'}
            state={state}
            to={{
              pathname: backURL,
              search: `?${qs.stringify({
                shareCode: shareCode || undefined
              })}`
            }}
          />
          )}
      {title ? <p className="auth-header-title">{ title }</p> : <img alt={<FormattedMessage id="Fansportiz" />} src={HeaderText} />}
    </div>
  )
}

AuthHeader.defaultProps = {
  title: ''
}

AuthHeader.propTypes = {
  backURL: PropTypes.string.isRequired,
  title: PropTypes.string
}

export default AuthHeader
