/* eslint-disable react/prop-types */
import React, { useEffect, useState } from 'react'
import backarrow from '../../assets/images/backarrow.svg'
import { Link } from 'react-router-dom'
function BackArrow (props) {
  const [url, setUrl] = useState('/')
  useEffect(() => {
    if (props?.location?.pathname === '/educationdetails') {
      setUrl('/counsellor/signup')
    } else if (props?.location?.pathname === '/kycdetails') {
      setUrl('/educationdetails')
    } else if (props?.location?.pathname === '/counsellor/signup') {
      setUrl('/counsellor/login')
    } else if (props?.location?.pathname === '/admin/forgot-password' || props.token) {
      setUrl('/admin/login')
    } else if (props?.location?.pathname === '/admin/one-time-password' || props.token) {
      setUrl('/admin/forgot-password')
    } else {
      setUrl('/')
    }
  }, [])

  return (
    <>
       <div className="back-btn">
             {/* <a href="#"><img src={backarrow} alt="" /> <span>Back</span> </a> */}
             <Link to={url}><img src={backarrow} alt="" /> <span>Back</span> </Link>
        </div>
    </>
  )
}

export default BackArrow
