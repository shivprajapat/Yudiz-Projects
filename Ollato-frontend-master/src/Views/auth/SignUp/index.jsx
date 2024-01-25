import React from 'react'
import { ProgressBar } from 'react-bootstrap'
import { useLocation, Link } from 'react-router-dom'
import { Helmet } from 'react-helmet'

// Components
import AuthLeftLogo from '../../../Components/AuthLeftLogo'
import BackArrow from '../../../Components/BackArrow'
import UserDetails from '../../../Components/Signup/UserDetails'

function SignUp () {
  const location = useLocation()
  return (
    <>
      <div className="common-layout">
        <Helmet>
          <meta charSet='utf-8' />
          <title>Signup - Ollato</title>
        </Helmet>
        <AuthLeftLogo />
        <div className="form-box-section">
          <ProgressBar now={50} />
          <div className="middle-form signup-page">
            <BackArrow location={location} />
            <div className="title-box">
              <h2>Sign Up</h2>
            </div>
            <UserDetails />
          </div>
          <div className="redirect-to-signin">
            <p>Already have an account? <Link to="/login">Login</Link></p>
          </div>
        </div>
      </div>
    </>
  )
}

export default SignUp
