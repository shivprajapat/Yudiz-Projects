import React from 'react'
import LoginHeader from '../../../components/LoginHeader'
import ForgotPasswordForm from './forgotPassword'

function ForgotPassword () {
  return (
    <div>
      <section className="login-section d-flex justify-content-center align-items-center">
        <div className="login-block">
          <LoginHeader data={{
            title: 'Forgot Password',
            description: 'Enter your registered Email to reset your password'
          }}
          />
          <ForgotPasswordForm />
        </div>
      </section>
    </div>
  )
}
export default ForgotPassword
