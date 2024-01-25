import React, { useState } from 'react'
/* import LogoBg from '../../../assets/images/icon-bglogo.png' */
import { ProgressBar } from 'react-bootstrap'
import { useLocation, Link } from 'react-router-dom'
import AuthLeftLogo from '../../../Components/AuthLeftLogo'
// import CounsellorEducationDetails from '../../../Components/Signup/CounsellorEducationDetails'
// import CounsellorKYCDetails from '../../../Components/Signup/CounsellorKYCDetails'
import BackArrow from '../../../Components/BackArrow'
import CounsellorDetails from '../../../Components/Signup/CounsellorDetails'
function SignUp () {
  const [now, setNow] = useState(0)
  const location = useLocation()
  // const [url, setUrl] = useState(['/'])
  // useEffect(() => {
  //   if (location?.pathname === '/educationdetails') {
  //     setUrl('/signup')
  //   } else {
  //     setUrl('/')
  //   }
  // }, [])
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
              <CounsellorDetails setNow={ setNow } />
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
