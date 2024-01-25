import React, { useEffect, useRef, useState } from 'react'
import { Badge, Form } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import {
  applycouponcode,
  centerPackages,
  purchasePackageAction
} from '../../../Actions/Center/purchaseLicense'
import TitleHeader from '../../../Components/TitleHeader'
import { useSnackbar } from 'react-notistack'
import { useNavigate } from 'react-router-dom'

function PurchaseCredit () {
  const [count, setCount] = useState([])
  const [afterCouponApplyData, setAfterCouponApplydata] = useState({})
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const token = localStorage.getItem('token')
  // const profile = JSON.parse(localStorage.getItem('profile'))
  const { enqueueSnackbar } = useSnackbar()

  // useSelector
  const packageData = useSelector((state) => state.centerPackages.packageData)
  const packagePurchasedData = useSelector(
    (state) => state.centerPackages.packagePurchasedDetails
  )
  const isPackagePurchaseFlag = useSelector(
    (state) => state.centerPackages.isPackagePurchase
  )
  const responseMessage = useSelector(
    (state) => state.centerPackages.ressMessage
  )
  const applyCoupon = useSelector((state) => state.centerPackages.applyCoupon)
  const CouponCodeData = useSelector(
    (state) => state.centerPackages.CouponCodeData
  )
  const previousProps = useRef({
    packagePurchasedData,
    isPackagePurchaseFlag,
    applyCoupon
  }).current

  useEffect(() => {
    dispatch(centerPackages(token))
  }, [])

  useEffect(() => {
    if (previousProps?.isPackagePurchaseFlag !== isPackagePurchaseFlag) {
      if (isPackagePurchaseFlag === true) {
        enqueueSnackbar(`${responseMessage}`, {
          variant: 'success',
          autoHide: true,
          hide: 3000
        })
        navigate('/center/purchase-license')
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
    if (packageData) {
      setAfterCouponApplydata({})
      const newarray = packageData.map((i) => {
        return {
          id: i.id,
          count: 1,
          code: ''
        }
      })
      setCount(newarray)
    }
  }, [packageData])

  const decreaser = (id) => {
    setCount(
      count?.map((key) => {
        if (key.id === id) {
          return { ...key, count: key.count - 1 }
        }
        return key
      })
    )
  }
  const increaser = (id) => {
    // Counter state is incremented
    setCount(
      count?.map((key) => {
        if (key.id === id) {
          return { ...key, count: +key.count + 1 }
        }
        return key
      })
    )
  }

  const handleActivePackage = async (id) => {
    const data = {
      packageId: id,
      total_packages: +count.find((key) => key.id === id).count,
      coupon_code: afterCouponApplyData
        ? afterCouponApplyData?.checkCoupon?.code
        : ''
    }
    if (data) {
      dispatch(purchasePackageAction(data, token, navigate))
    }
  }

  const removeCouponHandler = (id) => {
    setAfterCouponApplydata({})
    setCount(
      count.map((key) => {
        if (key.id === id) {
          return { ...key, code: '' }
        }
        return key
      })
    )
  }

  const handlecouponOnchange = (e, id) => {
    setCount(
      count.map((key) => {
        if (key.id === id) {
          return { ...key, code: e.target.value }
        }
        return key
      })
    )
  }

  const applyCouponCode = (id) => {
    if (id !== afterCouponApplyData?.package_id) {
      setAfterCouponApplydata({})
    }
    setCount(
      count.map((key) => {
        if (key.id !== id) {
          return { ...key, code: '' }
        }
        return key
      })
    )
    const data = {
      packageId: id,
      coupon_code: count.find((i) => i.id === id).code
    }
    dispatch(applycouponcode(data, token))
  }

  useEffect(() => {
    if (CouponCodeData !== null) {
      setAfterCouponApplydata(CouponCodeData)
    }
  }, [CouponCodeData])

  // Toast msg for coupon code
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

  return (
    <>
      <TitleHeader name='Credit' title='Purchase Credit' />
      <div className='cards'>
        <div className='row'>
          {packageData?.map((i) => {
            return (
              <div className='col-md-4 mb-3' key={i.id}>
                <div className='package-card'>
                  <div>
                    <h5>{i?.title}</h5>
                    <div
                      className='desc-card'
                      dangerouslySetInnerHTML={{ __html: i?.description }}
                    ></div>
                  </div>
                  <div>
                    <div className='counter'>
                      <button
                        onClick={() => decreaser(i.id)}
                        className='theme-btn'
                        disabled={
                          +count?.find((item) => item.id === i.id)?.count === 1
                        }
                      >
                        -
                      </button>
                      <Form.Group className='form-group' controlId='name'>
                        <Form.Control
                          type='number'
                          onChange={(e) =>
                            setCount(
                              count.map((key) => {
                                if (key.id === i.id) {
                                  return { ...key, count: e.target.value }
                                }
                                return key
                              })
                            )
                          }
                          value={count?.find((item) => item.id === i.id)?.count}
                        />
                      </Form.Group>
                      <button
                        onClick={() => increaser(i.id)}
                        className='theme-btn'
                      >
                        +
                      </button>
                    </div>
                    <div className='right-box'>
                      <div className='coupon_code'>
                        <input
                          className='form-control'
                          placeholder='Coupon Code'
                          type='text'
                          value={
                            count?.find((item) => item.id === i.id)?.code || ''
                          }
                          onChange={(e) => handlecouponOnchange(e, i.id)}
                          disabled={afterCouponApplyData?.package_id === i.id}
                        />
                        {afterCouponApplyData?.package_id === i.id &&
                        count?.find((item) => item.id === i.id).code
                          ? (
                          <button onClick={() => removeCouponHandler(i.id)}>
                            Remove
                          </button>
                            )
                          : (
                          <button onClick={() => applyCouponCode(i.id)}>
                            Apply
                          </button>
                            )}
                      </div>
                      <div className='price-box'>
                        {afterCouponApplyData?.package_id === i.id
                          ? (
                          <>
                            <h5 className='m-0 p-0'>
                              <s>{i.amount}/- Rs </s>
                            </h5>
                            {afterCouponApplyData?.checkCoupon?.coupon_type === 'percentage' ? <Badge bg="success">{afterCouponApplyData?.checkCoupon?.amount_percentage}% off</Badge> : <Badge bg="success">{afterCouponApplyData?.checkCoupon?.amount_percentage} Rs. off</Badge> }
                            <h5>
                              {afterCouponApplyData?.package_amount}/- Rs{' '}
                            </h5>
                          </>
                            )
                          : (
                          <h5>{i.amount}/- Rs</h5>
                            )}
                        <p style={{ color: 'black' }}> (inclusive GST)</p>
                      </div>
                      <button
                        className='theme-btn text-none'
                        onClick={() => handleActivePackage(i.id)}
                      >
                        Active Package Now
                      </button>
                    </div>
                    {/* <div className='price-box'>
                      <h5>{i?.amount}/-RS</h5>
                      <p>(inclusive GST)</p>
                      <button
                        className='theme-btn'
                        onClick={() => handleActivePackage(i.id)}
                      >
                        Active Package Now
                      </button>
                    </div> */}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </>
  )
}

export default PurchaseCredit
