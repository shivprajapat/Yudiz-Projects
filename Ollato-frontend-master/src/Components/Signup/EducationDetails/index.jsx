import React from 'react'
import { useLocation, Link } from 'react-router-dom'
/* import LogoBg from '../../../assets/images/icon-bglogo.png' */
import { ProgressBar } from 'react-bootstrap'
import AuthLeftLogo from '../../AuthLeftLogo'
import EducationDetails from './educationDetails'
import BackArrow from '../../BackArrow'
function SignUp (props) {
  const location = useLocation()

  return (
    <>
      <div className="common-layout">
       <AuthLeftLogo />
        <div className="form-box-section">
        <ProgressBar now={50} />
         <div className="middle-form signup-page">
         <BackArrow location={location} />
          <div className="title-box">
              <h2>Sign Up</h2>
            </div>
              {/* <UserDetails /> */}
              <EducationDetails />
              {/* <Form>
              <Form.Group className="form-group checkbox-box" controlId="formBasicCheckbox">
                <Form.Check type="checkbox" id='checkbox-1'>
                  <Form.Check.Input type="checkbox" />
                  <Form.Check.Label>I agree with all <a href="#">Terms & Conditions</a></Form.Check.Label>
                </Form.Check>
               </Form.Group>
              <Button variant="primary" type="submit" className='theme-btn large-btn'> Next </Button>
            </Form> */}
          </div>
          <div className="redirect-to-signin">
            <p>Already have an account? <Link to="/">Login</Link></p>
          </div>
        </div>
      </div>
    </>
  )
}

export default SignUp
