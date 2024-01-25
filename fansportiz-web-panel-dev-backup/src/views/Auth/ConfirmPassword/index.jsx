import React, { lazy, Suspense } from 'react'
import Loading from '../../../component/Loading'
import AuthHeader from '../components/AuthHeader'
const ConfirmPasswordForm = lazy(() => import('./ConfirmPassword'))

function ConfirmPassword (props) {
  return (
    <div className="auth-box">
      <AuthHeader backURL="/sign-up" {...props} />
      <Suspense fallback={<Loading />}>
        <ConfirmPasswordForm {...props} />
      </Suspense>
    </div>
  )
}

export default ConfirmPassword
