import React, { lazy, Suspense } from 'react'
import Loading from '../../../component/Loading'
import AuthHeader from '../components/AuthHeader'
const LoginForm = lazy(() => import('./Login'))

function Login () {
  return (
    <div className="auth-box">
      <AuthHeader backURL="/" />
      <Suspense fallback={<Loading />}>
        <LoginForm />
      </Suspense>
    </div>
  )
}

export default Login
