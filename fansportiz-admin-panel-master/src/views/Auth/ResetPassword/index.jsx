import React from 'react'
import LoginHeader from '../../../components/LoginHeader'
import ResetPasswordForm from './ResetPassword'

function ResetPassword (props) {
  return (
    <section className="login-section d-flex justify-content-center align-items-center">
      <div className="login-block">
        <div>
          <LoginHeader data={{
            title: 'Reset Password',
            description: 'Enter your new password'
          }}
          />
          <ResetPasswordForm {...props} />
        </div>
      </div>
    </section>
  )
}
export default ResetPassword
