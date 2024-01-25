import React from 'react'
import { Link } from 'react-router-dom'
/* import LogoBg from '../../../assets/images/icon-bglogo.png' */
import { ProgressBar } from 'react-bootstrap'
import AuthLeftLogo from '../../../Components/AuthLeftLogo'
// import CounsellorEducationDetails from '../../../Components/Signup/CounsellorEducationDetails'
import CounsellorKYCDetails from './kycDetails'
import BackArrow from '../../../Components/BackArrow'
function SignUp () {
  return (
    <>
      <div className="common-layout">
       <AuthLeftLogo />
        <div className="form-box-section">
        <ProgressBar now={66.6} />
         <div className="middle-form signup-page">
         <BackArrow location={location} />
          <div className="title-box">
              <h2>Sign Up</h2>
            </div>
              {/* <CounsellorDetails /> */}
              {/* <CounsellorEducationDetails /> */}
         <CounsellorKYCDetails />
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
