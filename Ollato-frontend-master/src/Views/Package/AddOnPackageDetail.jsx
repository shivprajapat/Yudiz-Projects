import React, { useEffect, useRef, useState } from 'react'

/* React Packages */
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'

/* Components */
import TitleHeader from '../../Components/TitleHeader'
import backarrow from '../../assets/images/backarrow.svg'

/* Action file */
import {
  getPackageDataByIDAction,
  purchasePackageActionn
} from '../../Actions/packages'

const PackageDetail = () => {
  const dispatch = useDispatch()
  const location = useLocation()
  const navigate = useNavigate()
  console.log(location)
  const params = useParams()

  // Token
  const token = localStorage.getItem('token')

  // useState
  const [packageArrayData, setPackagesArrayData] = useState([])
  // useSelector
  const data = useSelector((state) => state.packages.packageDataById)
  const previousProps = useRef({ data }).current

  useEffect(() => {
    if (token) {
      dispatch(getPackageDataByIDAction(params.id, token))
    }
  }, [token])
  useEffect(() => {
    if (previousProps?.data !== data) {
      if (data) {
        setPackagesArrayData(data)
      }
    }
    return () => {
      previousProps.data = data
    }
  }, [data])

  const handleActivePackage = async (id) => {
    // Data to be Sent to API to generate hash.
    const data = {
      packageId: id
    }
    if (data) {
      dispatch(purchasePackageActionn(data, token, navigate))
    }
  }

  return (
    <>
      <div className=''>
        <TitleHeader title='Your Courses Package' />
        <div className='main-layout whitebox-layout'>
          <div className='back-btn'>
            <button className='back-btn' onClick={() => navigate(-1)}>
              <img src={backarrow} alt='' /> <span>Back</span>{' '}
            </button>
          </div>
          <div className='common-white-box'>
            <div className='left-box'>
              <h5>{packageArrayData?.title}</h5>
              <h4>
                {packageArrayData?.f2f_call ? ' Face-2-Face meeting' : ''}
              </h4>
              <h4>{packageArrayData?.online_test ? ' Online Testing' : ''}</h4>
              <h4>{packageArrayData?.video_call ? 'Video Call' : ''}</h4>
            </div>
            <div className='right-box'>
              <div className='price-box'>
                <h5>{packageArrayData?.amount}/- Rs</h5>
                <p>(inclusive GST)</p>
                <button
                  className='theme-btn text-none'
                  onClick={() => handleActivePackage(data.id)}
                >
                  Active Package
                </button>
              </div>
            </div>
          </div>
          <div className='package-description'>
            <p>{packageArrayData?.description}</p>
          </div>
          {/* <button className="theme-btn text-none">Active Package Now</button> */}
          {/* <Link className="theme-btn text-none" to={`/package-detail/active/${packageArrayData?.id}`}>Active Package Now</Link> */}
        </div>
      </div>
    </>
  )
}

export default PackageDetail
