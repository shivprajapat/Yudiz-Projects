import React, { useEffect, useRef } from 'react'

/* React Packages */
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { useSnackbar } from 'react-notistack'
/* Components */
import TitleHeader from '../../Components/TitleHeader'
import backarrow from '../../assets/images/backarrow.svg'

/* Action file */
import {
  getPackageDataByIDAction,
  purchasePackageAction
} from '../../Actions/packages'
import {
  viewProfileAction
} from '../../Actions/auth'
const PackageDetail = () => {
  function loadScript (src) {
    return new Promise((resolve) => {
      const script = document.createElement('script')
      script.src = src
      script.onload = () => {
        resolve(true)
      }
      script.onerror = () => {
        resolve(false)
      }
      document.body.appendChild(script)
    })
  }
  const dispatch = useDispatch()
  const location = useLocation()
  console.log(location)
  const navigate = useNavigate()
  const params = useParams()
  const { enqueueSnackbar } = useSnackbar()
  const token = localStorage.getItem('token')
  // const studentDetails = useSelector(state => state.auth.userData)
  // const [data, setPackagesArrayData] = useState([])
  const data = useSelector(state => state.packages.packageDataById)
  const responseMessage = useSelector(state => state.packages.ressMessage)
  const isPurchased = useSelector(state => state.packages.packagePurchased)
  const packagePurchasedData = useSelector(state => state.packages.packagePurchasedDetails)
  const isPackagePurchaseFlag = useSelector(state => state.packages.isPackagePurchase)
  const meData = useSelector(state => state.auth.profileData)
  const previousProps = useRef({ data, packagePurchasedData, meData, isPackagePurchaseFlag }).current
  useEffect(() => {
    if (token) {
      dispatch(viewProfileAction(token))
      dispatch(getPackageDataByIDAction(params.id, token))
    }
  }, [token])

  const handleActivePackage = async () => {
    const dataa = {
      packageId: data.id
    }
    if (data) {
      dispatch(purchasePackageAction(dataa, token))
    }
    const res = await loadScript(
      'https://checkout.razorpay.com/v1/checkout.js'
    )

    if (!res) {
      alert('Razorpay SDK failed to load. Are you online?')
    }
  }
  // Toastify Notification
  useEffect(() => {
    if (previousProps?.isPackagePurchaseFlag !== isPackagePurchaseFlag) {
      if (isPackagePurchaseFlag === true) {
        enqueueSnackbar(`${responseMessage}`, {
          variant: 'success',
          autoHide: true,
          hide: 3000
        })
        navigate('/thank-you')
      } else if (isPackagePurchaseFlag === false) {
        enqueueSnackbar(`${responseMessage}`, {
          variant: 'error',
          autoHide: true,
          hide: 3000
        }
        )
      }
    }
    return () => {
      previousProps.isPackagePurchaseFlag = isPackagePurchaseFlag
    }
  }, [isPackagePurchaseFlag])
  useEffect(() => {
    if (previousProps?.isPurchased !== isPurchased) {
      if (isPurchased) {
        enqueueSnackbar(`${responseMessage}`, {
          variant: 'success',
          autoHide: true,
          hide: 3000
        })
      } else if (isPurchased === false) {
        enqueueSnackbar(`${responseMessage}`, {
          variant: 'error',
          autoHide: true,
          hide: 3000
        }
        )
      }
    }
    return () => {
      previousProps.isPurchased = isPurchased
    }
  }, [isPurchased])

  return (
    <>
          <div className=''>
            <TitleHeader title='Your Courses Package'/>
            <div className='main-layout whitebox-layout'>
              <div className="back-btn">
              <Link to="/package"><img src={backarrow} alt="" /> <span>Back</span> </Link>
              </div>
                <div className='common-white-box'>
                    <div className="left-box">
                        <h5>{data?.title}</h5>
                        <h4>{data?.f2f_call ? ' Face-2-Face meeting' : ''}</h4>
                        <h4>{data?.online_test ? ' Online Testing' : ''}</h4>
                        <h4>{data?.video_call ? 'Video Call' : ''}</h4>
                    </div>
                    <div className="right-box">
                        <div className="price-box">
                            <h5>{data?.amount}/- Rs</h5>
                            <p>+ 18% GST</p>
                        </div>
                    </div>
                </div>
                <div className="package-description">
                    <p>{data?.description}</p>
                </div>
                <button className="theme-btn text-none" onClick={handleActivePackage} >Active Package Now</button>
            </div>
          </div>
  </>
  )
}

export default PackageDetail
