import React from 'react'
import LoginHeader from '../../../components/LoginHeader'
import LoginForm from './Login'

function Login (props) {
  return (
    <section className="login-section d-flex justify-content-center align-items-center">
      <div className="login-block">
        <LoginHeader data={{
          title: 'Welcome',
          description: 'Log in to Fantasy App Admin Panel'
        }}
        />
        <LoginForm {...props} />
      </div>
    </section>
  )
}
export default Login
