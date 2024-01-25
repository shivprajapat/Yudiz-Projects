import React, { useState, useEffect, useRef } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Helmet } from 'react-helmet'
import { useSnackbar } from 'react-notistack'
import { Badge } from 'react-bootstrap'

/* Components */
import TitleHeader from '../../Components/TitleHeader'

/* Action File */
import {
  applycouponcode,
  getAllAddOnPackagesDataAction,
  getPackagesDataAction,
  purchasePackageActionn
} from '../../Actions/packages'

const Package = () => {
  const location = useLocation()
  const dispatch = useDispatch()
  const token = localStorage.getItem('token')
  const { enqueueSnackbar } = useSnackbar()
  const navigate = useNavigate()

  // useState
  const [couponCode, setCouponCode] = useState()
  const [afterCouponApplyData, setAfterCouponApplydata] = useState({})
  const [sort] = useState('title')
  const [start] = useState(0)
  const [sortOrder] = useState('asc')
  const [limit] = useState(10)
  const [search] = useState('')
  // const isPurchased = useSelector(state => state.packages.packagePurchased)
  const packagePurchasedData = useSelector(
    (state) => state.packages.packagePurchasedDetails
  )
  const isPackagePurchaseFlag = useSelector(
    (state) => state.packages.isPackagePurchase
  )
  const applyCoupon = useSelector((state) => state.packages.applyCoupon)
  const CouponCodeData = useSelector((state) => state.packages.CouponCodeData)
  const meData = useSelector((state) => state.auth.profileData)
  const data = useSelector((state) => state.packages.packageDataById)
  const responseMessage = useSelector((state) => state.packages.ressMessage)
  const [addOnPackagesArray, setAddOnPackagesArray] = useState([])
  const addOnPackagesArrayData = useSelector(
    (state) => state.packages.addOnPackagesArray
  )
  const previousProps = useRef({
    data,
    packagePurchasedData,
    meData,
    isPackagePurchaseFlag,
    applyCoupon
  }).current

  // useSelector
  const packagesArrayData = useSelector((state) => state.packages.packagesData)

  console.log('addOnPackagesArray', addOnPackagesArray)

  useEffect(() => {
    const data = {
      start,
      limit,
      sort,
      order: sortOrder
    }
    if (token && location.pathname === '/package') {
      dispatch(getPackagesDataAction(data, token))
      dispatch(getAllAddOnPackagesDataAction(token))
    }
  }, [token && location.pathname])

  useEffect(() => {
    const data = {
      start,
      limit,
      sort,
      order: sortOrder,
      search
    }
    if (search) {
      dispatch(getPackagesDataAction(data, token))
    }
  }, [search])
  const handleActivePackage = async (id) => {
    // Data to be Sent to API to generate hash.
    const data = {
      packageId: id,
      coupon_code: afterCouponApplyData
        ? afterCouponApplyData?.checkCoupon?.code
        : ''
    }
    if (data) {
      dispatch(purchasePackageActionn(data, token, navigate))
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
        })
      }
    }
    return () => {
      previousProps.isPackagePurchaseFlag = isPackagePurchaseFlag
    }
  }, [isPackagePurchaseFlag])

  useEffect(() => {
    if (previousProps?.addOnPackagesArrayData !== addOnPackagesArrayData) {
      if (addOnPackagesArrayData) {
        setAddOnPackagesArray(addOnPackagesArrayData)
      }
    }
    return () => {
      previousProps.addOnPackagesArrayData = addOnPackagesArrayData
    }
  }, [addOnPackagesArrayData])

  useEffect(() => {
    if (previousProps?.applyCoupon !== applyCoupon) {
      if (applyCoupon === true) {
        enqueueSnackbar(`${responseMessage}`, {
          variant: 'success',
          autoHide: true,
          hide: 2000
        })
      } else if (applyCoupon === false) {
        enqueueSnackbar(
          `${
            responseMessage !== undefined
              ? responseMessage
              : 'Enter valid Coupon Code'
          }`,
          {
            variant: 'error',
            autoHide: true,
            hide: 2000
          }
        )
      }
    }
    return () => {
      previousProps.applyCoupon = applyCoupon
    }
  }, [applyCoupon])
  // useEffect(() => {
  //   if (previousProps?.isPurchased !== isPurchased) {
  //     if (isPurchased) {
  //       enqueueSnackbar(`${responseMessage}`, {
  //         variant: 'success',
  //         autoHide: true,
  //         hide: 3000
  //       })
  //     } else if (isPurchased === false) {
  //       enqueueSnackbar(`${responseMessage}`, {
  //         variant: 'error',
  //         autoHide: true,
  //         hide: 3000
  //       }
  //       )
  //     }
  //   }
  //   return () => {
  //     previousProps.isPurchased = isPurchased
  //   }
  // }, [isPurchased])
  useEffect(() => {
    if (CouponCodeData !== null) {
      setAfterCouponApplydata(CouponCodeData)
    }
  }, [CouponCodeData])

  useEffect(() => {
    if (packagesArrayData) {
      const newarray = packagesArrayData.map((i) => {
        return {
          id: i.id,
          code: ''
        }
      })
      setCouponCode(newarray)
    }
  }, [packagesArrayData])

  const applyCouponCode = (id) => {
    if (id !== afterCouponApplyData?.package_id) {
      setAfterCouponApplydata({})
    }
    setCouponCode(
      couponCode.map((key) => {
        if (key.id !== id) {
          return { ...key, code: '' }
        }
        return key
      })
    )
    const data = {
      packageId: id,
      coupon_code: couponCode.find((i) => i.id === id).code
    }
    dispatch(applycouponcode(data, token))
  }

  const handlecouponOnchange = (e, id) => {
    setCouponCode(
      couponCode.map((key) => {
        if (key.id === id) {
          return { ...key, code: e.target.value }
        }
        return key
      })
    )
  }

  const removeCouponHandler = (id) => {
    setAfterCouponApplydata({})
    setCouponCode(
      couponCode.map((key) => {
        if (key.id === id) {
          return { ...key, code: '' }
        }
        return key
      })
    )
  }

  return (
    <>
      <Helmet>
        <meta charSet='utf-8' />
        <title>Package - Ollato</title>
      </Helmet>
      <>
        <div className='price-grid'>
          <TitleHeader title='Your Courses Package' location={location} />
          <div>
            <div className='package-module'>
              <ul>
                {packagesArrayData && packagesArrayData.length >= 0
                  ? (
                      packagesArrayData.map((data) => {
                        return (
                      <li className='common-white-box' key={data.id}>
                        <div className='left-box'>
                          <h5>{data.title}</h5>
                          <div className='bullet-point'>
                            <h4
                              className='text-align-left'
                              dangerouslySetInnerHTML={{
                                __html: data?.description
                              }}
                            ></h4>
                          </div>
                        </div>
                        <div className='right-box'>
                          <div className='coupon_code'>
                            <input
                              className='form-control'
                              placeholder='Coupon Code'
                              type='text'
                              value={
                                couponCode?.find((item) => item.id === data.id)
                                  ?.code || ''
                              }
                              onChange={(e) => handlecouponOnchange(e, data.id)}
                              disabled={
                                afterCouponApplyData?.package_id === data.id
                              }
                            />
                            {afterCouponApplyData?.package_id === data.id &&
                            couponCode?.find((i) => i.id === data.id).code
                              ? (
                              <button
                                onClick={() => removeCouponHandler(data.id)}
                              >
                                Remove
                              </button>
                                )
                              : (
                              <button onClick={() => applyCouponCode(data.id)}>
                                Apply
                              </button>
                                )}
                          </div>
                          <div className='price-box'>
                            {afterCouponApplyData?.package_id === data.id
                              ? (
                              <>
                                <h5>
                                  <s>{data.amount}/- Rs </s>
                                </h5>
                                {afterCouponApplyData?.checkCoupon
                                  ?.coupon_type === 'percentage'
                                  ? (
                                  <Badge bg='success'>
                                    {
                                      afterCouponApplyData?.checkCoupon
                                        ?.amount_percentage
                                    }
                                    % off
                                  </Badge>
                                    )
                                  : (
                                  <Badge bg='success'>
                                    {
                                      afterCouponApplyData?.checkCoupon
                                        ?.amount_percentage
                                    }{' '}
                                    Rs. off
                                  </Badge>
                                    )}
                                <h5>
                                  {afterCouponApplyData?.package_amount}/- Rs{' '}
                                </h5>
                              </>
                                )
                              : (
                              <h5>{data.amount}/- Rs</h5>
                                )}
                            <p style={{ color: 'black' }}> (inclusive GST)</p>
                          </div>
                          <button
                            className='theme-btn text-none'
                            onClick={() => handleActivePackage(data.id)}
                          >
                            Active Package Now
                          </button>
                        </div>
                      </li>
                        )
                      })
                    )
                  : (
                  <></>
                    )}
              </ul>
            </div>
          </div>
          <h3> Add-ons Packages</h3>
          <ul className='p-0'>
            {addOnPackagesArray && addOnPackagesArray.length >= 0
              ? addOnPackagesArray.map((data) => {
                return (
                    <>
                      <li className='common-white-box mt-3'>
                        <div className='left-box'>
                          <h5>{data?.title}</h5>
                          <h5>{data?.package_name}</h5>
                          <h4>
                            {data?.f2f_call === true
                              ? ' Face-2-Face meeting'
                              : ''}
                          </h4>
                          <h4>
                            {data?.online_test === true
                              ? ' Online Testing'
                              : ''}
                          </h4>
                          <h4>
                            {data?.video_call === true ? 'Video Call' : ''}
                          </h4>
                          <p
                            dangerouslySetInnerHTML={{
                              __html: data?.description
                            }}
                          ></p>
                        </div>
                        <div className='right-box'>
                          <div className='price-box'>
                            <h5>{data?.amount}/- Rs</h5>
                            <p>(inclusive GST)</p>
                          </div>
                          <div className='package-description'></div>
                          <button
                            className='theme-btn text-none'
                            onClick={() => handleActivePackage(data?.id)}
                          >
                            Active Package Now
                          </button>
                        </div>
                      </li>
                    </>
                )
              })
              : 'No data Found'}
          </ul>
        </div>
      </>
    </>
  )
}

export default Package
