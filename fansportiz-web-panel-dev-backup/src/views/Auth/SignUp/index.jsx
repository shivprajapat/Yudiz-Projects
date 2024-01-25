import React, { lazy, Suspense } from 'react'
import AuthHeader from '../components/AuthHeader'
import Loading from '../../../component/Loading'
const SignUpForm = lazy(() => import('./SignUp'))

function SignUp (props) {
  return (
    <div className="auth-box">
      <AuthHeader backURL="/login" {...props} />
      <Suspense fallback={<Loading />}>
        <SignUpForm {...props} />
      </Suspense>
    </div>
  )
}

export default SignUp
