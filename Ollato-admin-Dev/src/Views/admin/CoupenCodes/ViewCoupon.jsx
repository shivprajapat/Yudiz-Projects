import React, { useEffect } from 'react'
import { Form } from 'react-bootstrap'
/* React Packages */
// import { useDispatch, useSelector } from 'react-redux'
// import { useSnackbar } from 'react-notistack'
import { useNavigate, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'

/* Components */
import Header from '../../../Components/Header'
import TitleHeader from '../../../Components/TitleHeader'
/* Action File */
import { getSpecificCouponData } from '../../../Actions/Admin/coupenCode'

function ViewCoupon () {
  // Constants
  const navigate = useNavigate()
  const params = useParams()
  const dispatch = useDispatch()
  const id = params.id
  const token = localStorage.getItem('token')

  // useSelector
  const specificCouponData = useSelector((state) => state.CoupenCodesAdmin.specificCouponData)

  useEffect(() => {
    if (id) {
      dispatch(getSpecificCouponData(Number(id), token))
    }
  }, [id])

  return (
    <>
          <Header name='View Coupon' />
          <TitleHeader name='View Coupon' />
          <div className='main-layout'>
        <Form className='light-bg'>
          <div className='heading-box'>
            <h5>View Coupon</h5>
            <div className='btn-box'>
              <button
                type='button'
                className='theme-btn dark-btn text-none'
                onClick={() => navigate(-1)}
              >
                Cancel
              </button>
            </div>
          </div>
          <div className='form-middle-layout'>
            <div className='row'>
              <div className='col-md-6'>
                <Form.Group
                 className='form-group'
                  controlId='formgradenumber'
                >
                  <Form.Label>Title</Form.Label>
                  <Form.Control
                    type='text'
                    placeholder='Enter Title'
                    name={name}
                    defaultValue={specificCouponData?.title || ''}
                    disabled
                  />
                </Form.Group>
              </div>
              <div className='col-md-6'>
                <Form.Group
                 className='form-group'
                  controlId='formgradenumber'
                >
                  <Form.Label>Code</Form.Label>
                  <div className='coupon-div'>
                  <Form.Control
                    type='text'
                    placeholder='Enter Code'
                    className='file-btn d-inline'
                    name={name}
                    defaultValue={specificCouponData?.code || ''}
                    disabled
                  />
                  </div>
                </Form.Group>
              </div>
              <div className='col-md-6'>
                <Form.Group
                  className='form-group'
                  controlId='formstartdate'
                >
                  <Form.Label>Start Date</Form.Label>
                  <Form.Control
                   type='text'
                    name={name}
                    defaultValue={specificCouponData?.from_date || ''
                  }
                  disabled
                  />
                </Form.Group>
              </div>
              <div className='col-md-6'>
                <Form.Group
                 className='form-group'
                  controlId='formstartdate'
                >
                  <Form.Label>End Date</Form.Label>
                  <Form.Control
                    type='text'
                    name={name}
                    defaultValue={specificCouponData?.to_date || ''
                  }
                  disabled
                  />
                </Form.Group>
              </div>
              <div className='col-md-6'>
                <Form.Group
                 className='form-group'
                  controlId='formstartdate'
                >
                  <Form.Label>Coupon Type</Form.Label>
                  <Form.Control
                   type='text'
                    name={name}
                    defaultValue={specificCouponData?.coupon_type || ''
                  }
                  disabled
                  />
                </Form.Group>
              </div>
              <div className='col-md-6'>
                <Form.Group
                 className='form-group'
                  controlId='formgradenumber'
                >
                  <Form.Label>Amount or Percentage</Form.Label>
                  <Form.Control
                    type='text'
                    placeholder='Enter Amount or Percentage'
                    name={name}
                    defaultValue={specificCouponData?.amount_percentage || ''}
                    disabled
                  />
                </Form.Group>
              </div>
              <div className='col-md-6'>
                <Form.Group
                 className='form-group'
                  controlId='formgradenumber'
                >
                  <Form.Label>Description</Form.Label>
                  <Form.Control
                    type='text'
                    placeholder='Enter Discription'
                    name={name}
                    defaultValue={specificCouponData?.description !== null ? specificCouponData?.description : '-' || ''}
                    disabled
                  />
                </Form.Group>
              </div>
              <div className='col-md-6'>
                <Form.Group
                 className='form-group'
                  controlId='formgradenumber'
                >
                  <Form.Label>Number of time use</Form.Label>
                  <Form.Control
                    type='text'
                    placeholder='Enter Discription'
                    name={name}
                    defaultValue={specificCouponData?.number_time_use || ''}
                    disabled
                  />
                </Form.Group>
              </div>
            </div>
          </div>
        </Form>
      </div>
    </>
  )
}

export default ViewCoupon
