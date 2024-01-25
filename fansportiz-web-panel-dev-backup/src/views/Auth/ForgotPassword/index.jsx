import React, { lazy, Suspense, useState } from 'react'
import { FormattedMessage } from 'react-intl'
import AuthHeader from '../components/AuthHeader'
import Loading from '../../../component/Loading'
const ForgotPasswordForm = lazy(() => import('./ForgotPassword'))

function ForgotPassword (props) {
  const [title, setTitle] = useState(<FormattedMessage id="Forgot_Password" />)

  return (
    <div className="auth-box">
      <AuthHeader backURL="/login" title={title} {...props} />
      <Suspense fallback={<Loading />}>
        <ForgotPasswordForm setTitle={setTitle} title={title} {...props} />
      </Suspense>
    </div>
  )
}

export default ForgotPassword
