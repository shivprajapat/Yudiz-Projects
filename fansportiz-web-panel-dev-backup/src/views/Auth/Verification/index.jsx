import React, { lazy, Suspense } from 'react'
import { FormattedMessage } from 'react-intl'
// import PropTypes from 'prop-types'
import AuthHeader from '../components/AuthHeader'
import Loading from '../../../component/Loading'
import UserHeader from '../../User/components/UserHeader'
import { verifyEmail } from '../../../utils/helper'
import { useLocation } from 'react-router-dom'

const VerificationForm = lazy(() => import('./Verification'))

function Verification () {
  const location = useLocation()
  return (
    <div className="auth-box">
      {location?.state?.profile
        ? <UserHeader backURL={`/verification/${verifyEmail(location?.state?.userName) ? 'Email' : 'Phone'}`} title={<FormattedMessage id="Verification" />} />
        : <AuthHeader backURL="/login" title={<FormattedMessage id="Verification" />} />}
      <Suspense fallback={<Loading />}>
        <VerificationForm location={location} />
      </Suspense>
    </div>
  )
}

Verification.propTypes = {
}

export default Verification
