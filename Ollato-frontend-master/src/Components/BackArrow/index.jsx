import React, { useEffect, useState } from 'react'
import backarrow from '../../assets/images/backarrow.svg'
import { Link } from 'react-router-dom'
import { propTypes } from 'react-bootstrap/esm/Image'
function BackArrow (props) {
  // eslint-disable-next-line react/prop-types
  const [url, setUrl] = useState('/')
  useEffect(() => {
    if (props?.location?.pathname === '/signup-educationdetails') {
      setUrl('/signup')
    } else if (props?.location?.pathname === '/package-detail/:id') {
      setUrl('/package')
    } else {
      setUrl('/')
    }
  }, [])
  return (
    <>
       <div className="back-btn">
             <Link to={url}><img src={backarrow} alt="" /> <span>Back</span> </Link>
             {/* <Link to="/forgot-password" >Forgot Password?</Link> */}
        </div>
    </>
  )
}

export default BackArrow

BackArrow.propTypes = {
  location: propTypes.string
}
