import React from 'react'
import UserHeader from '../components/UserHeader'
import VerifiedPage from './VerifiedPage'
// import PropTypes from 'prop-types'
import { FormattedMessage } from 'react-intl'
import { useLocation } from 'react-router-dom'

function Verified (props) {
  const { pathname } = useLocation()

  return (
    <>
      <UserHeader {...props} backURL='/profile/user-info' title={pathname === '/verify/email' ? <FormattedMessage id='Verify_Your_Email' /> : <FormattedMessage id='Verify_Your_Mobile' />}/>
      <VerifiedPage {...props}/>
    </>
  )
}

Verified.propTypes = {
}

export default Verified
