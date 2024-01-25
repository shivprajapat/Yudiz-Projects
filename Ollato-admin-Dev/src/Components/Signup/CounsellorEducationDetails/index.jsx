import React, { useState } from 'react'
import { ProgressBar } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import AuthLeftLogo from '../../../Components/AuthLeftLogo'
import BackArrow from '../../../Components/BackArrow'
import CounsellorDetails from './educationDetails'
function SignUp () {
  const [now, setNow] = useState(33.3)
  return (
    <>
      <div className="common-layout">
       <AuthLeftLogo />
        <div className="form-box-section">
        <ProgressBar now={now} />
         <div className="middle-form signup-page">
         <BackArrow location={location} />
          <div className="title-box">
              <h2>Sign Up</h2>
            </div>
              <CounsellorDetails setNow={ setNow }/>
              {/* <CounsellorEducationDetails /> */}
         {/* <CounsellorKYCDetails /> */}
          </div>
          <div className="redirect-to-signin">
            <p>Already have an account? <Link to="/counsellor/login">Login</Link></p>
          </div>
        </div>
      </div>
    </>
  )
}
export default SignUp
