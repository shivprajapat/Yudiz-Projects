import { yupResolver } from '@hookform/resolvers/yup'
import moment from 'moment'
import React, { useEffect, useRef, useState } from 'react'
import { Form } from 'react-bootstrap'
import { Controller, useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import Header from '../../../Components/Header'
import Select from 'react-select'
import TitleHeader from '../../../Components/TitleHeader'
import { validationCouponCode } from '../../../Shared/Utills/validationschema'
import { useDispatch, useSelector } from 'react-redux'
import { addNewCoupon } from '../../../Actions/Admin/coupenCode'
import { useSnackbar } from 'react-notistack'

function AddNewCoupen () {
  // constants
  const token = localStorage.getItem('token')
  const { enqueueSnackbar } = useSnackbar()
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const couponTypeArray = [
    { id: 1, title: 'fix amount' },
    { id: 2, title: 'percentage' }
  ]

  // usestate
  const [couponType, setCoupontype] = useState('fix amount')

  // useSelector
  const isCouponAdded = useSelector(state => state.CoupenCodesAdmin.isCouponAdded)
  const resMessage = useSelector(state => state.CoupenCodesAdmin.resMessage)
  const previousProps = useRef({ isCouponAdded, resMessage }).current
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    control
  } = useForm({
    resolver: yupResolver(validationCouponCode)
  })

  const generatestring = () => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    // const code = Math.random().toString(36).slice(2).slice(0, 8)
    let result = ' '
    const charactersLength = characters.length
    for (let i = 0; i < 8; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength))
    }

    return setValue('code', result.slice(1))
  }

  const onSubmit = (data) => {
    const coupondata = {
      title: data?.title,
      code: data?.code,
      description: data?.description,
      from_date: moment(data.start_date).format('YYYY-MM-DD'),
      to_date: moment(data.end_date).format('YYYY-MM-DD'),
      coupon_type: couponType === 'percentage' ? 'percentage' : 'fixed_amount',
      amount_percentage: data.amount_percentage,
      number_time_use: data.number_time_use
    }
    if (coupondata) {
      dispatch(addNewCoupon(coupondata, token))
    }
  }

  // Toastify Notification
  useEffect(() => {
    if (previousProps?.isCouponAdded !== isCouponAdded) {
      if (isCouponAdded) {
        enqueueSnackbar(`${resMessage}`, {
          variant: 'success',
          hide: 2000,
          autoHide: true
        })
        navigate('/admin/coupon-codes')
      } else if (isCouponAdded === false) {
        enqueueSnackbar(`${resMessage}`, {
          variant: 'error',
          hide: 2000,
          autoHide: true,
          TransitionComponent: 'Fade'
        }
        )
      }
    }
    return () => {
      previousProps.isCouponAdded = isCouponAdded
    }
  }, [isCouponAdded])
  return (
    <>
      <Header />
      <TitleHeader name='Add Coupon' title='Coupon Code' />
      <div className='main-layout'>
        <Form className='light-bg' onSubmit={handleSubmit(onSubmit)}>
          <div className='heading-box'>
            <h5>Add Coupon</h5>
            <div className='btn-box'>
              <button
                type='button'
                className='theme-btn dark-btn text-none'
                onClick={() => navigate(-1)}
              >
                Cancel
              </button>
              <button type='submit' className='theme-btn text-none'>
                Save
              </button>
            </div>
          </div>
          <div className='form-middle-layout'>
            <div className='row'>
              <div className='col-md-6'>
                <Form.Group
                  className={`form-group ${
                    errors.title?.message ? 'error-occured' : ''
                  }`}
                  controlId='formgradenumber'
                >
                  <Form.Label>Title</Form.Label>
                  <Form.Control
                    type='text'
                    placeholder='Enter Title'
                    name={name}
                    {...register('title', { required: true })}
                  />
                  {errors.title?.message && (
                    <Form.Text className='error-msg'>
                      {errors.title?.message}{' '}
                    </Form.Text>
                  )}
                </Form.Group>
              </div>
              <div className='col-md-6'>
                <Form.Group
                  className={`form-group ${
                    errors.code?.message ? 'error-occured' : ''
                  }`}
                  controlId='formgradenumber'
                >
                  <Form.Label>Code</Form.Label>
                  <div className='coupon-div'>
                  <Form.Control
                    type='text'
                    placeholder='Enter Code'
                    className='file-btn d-inline'
                    name={name}
                    {...register('code', { required: true })}
                  />
                  <button
                    type='button'
                    className='coupon-code-btn  btn'
                    onClick={generatestring}
                  >
                    Generate
                  </button>
                  </div>
                  {errors.code?.message && (
                    <Form.Text className='error-msg'>
                      {errors.code?.message}{' '}
                    </Form.Text>
                  )}
                </Form.Group>
              </div>
              <div className='col-md-6'>
                <Form.Group
                  className={`form-group ${
                    errors.start_date?.message ? 'error-occured' : ''
                  }`}
                  controlId='formstartdate'
                >
                  <Form.Label>Start Date</Form.Label>
                  <Form.Control
                    type='date'
                    name={name}
                    max='2999-12-31'
                    min={moment().format('YYYY-MM-DD')}
                    {...register('start_date', { required: true })}
                    // onChange={(e) => {
                    //   onChange(e)
                    //   handleChange(e, 'startdate')
                    // }}
                  />
                  {errors.start_date?.message && (
                    <Form.Text className='error-msg'>
                      {errors.start_date?.message}{' '}
                    </Form.Text>
                  )}
                </Form.Group>
              </div>
              <div className='col-md-6'>
                <Form.Group
                  className={`form-group ${
                    errors.end_date?.message ? 'error-occured' : ''
                  }`}
                  controlId='formstartdate'
                >
                  <Form.Label>End Date</Form.Label>
                  <Form.Control
                    type='date'
                    name={name}
                    max='2999-12-31'
                    {...register('end_date', { required: true })}
                    // onChange={(e) => {
                    //   onChange(e)
                    //   handleChange(e, 'startdate')
                    // }}
                  />
                  {errors.end_date?.message && (
                    <Form.Text className='error-msg'>
                      {errors.end_date?.message}{' '}
                    </Form.Text>
                  )}
                </Form.Group>
              </div>
              <div className='col-md-6'>
                <Form.Group
                  className='form-group common-select-style'
                  controlId='formfullname'
                >
                  <Form.Label>Coupon Type</Form.Label>
                  <Controller
                    name='status'
                    control={control}
                    render={({ field }) => (
                      <Select
                        {...field}
                        options={couponTypeArray}
                        placeholder={'Select Coupon Type'}
                        className='react-dropdown'
                        classNamePrefix='dropdown'
                        defaultValue={{ id: 1, title: 'fix amount' }}
                        getOptionLabel={(option) => option?.title}
                        getOptionValue={(option) => option?.id}
                        onChange={(e) => setCoupontype(e.title)
                        }
                      />
                    )}
                  />
                </Form.Group>
              </div>
              <div className='col-md-6'>
                <Form.Group
                  className={`form-group ${
                    errors.amount_percentage?.message ? 'error-occured' : ''
                  }`}
                  controlId='formgradenumber'
                >
                  <Form.Label>Amount or Percentage</Form.Label>
                  <Form.Control
                    type='number'
                    placeholder='Enter Amount or Percentage'
                    name={name}
                    {...register('amount_percentage', { required: true })}
                  />
                  {errors.amount_percentage?.message && (
                    <Form.Text className='error-msg'>
                      {errors.amount_percentage?.message}{' '}
                    </Form.Text>
                  )}
                </Form.Group>
              </div>
              <div className='col-md-6'>
                <Form.Group
                  className={`form-group ${
                    errors.description?.message ? 'error-occured' : ''
                  }`}
                  controlId='formgradenumber'
                >
                  <Form.Label>Description</Form.Label>
                  <Form.Control
                    type='text'
                    placeholder='Enter Discription'
                    name={name}
                    {...register('description', { required: true })}
                  />
                  {errors.description?.message && (
                    <Form.Text className='error-msg'>
                      {errors.description?.message}{' '}
                    </Form.Text>
                  )}
                </Form.Group>
              </div>
              <div className='col-md-6'>
                <Form.Group
                  className={`form-group ${
                    errors.number_time_use?.message ? 'error-occured' : ''
                  }`}
                  controlId='formgradenumber'
                >
                  <Form.Label>Number of time use</Form.Label>
                  <Form.Control
                    type='text'
                    placeholder='Enter Discription'
                    name={name}
                    {...register('number_time_use', { required: true })}
                  />
                  {errors.number_time_use?.message && (
                    <Form.Text className='error-msg'>
                      {errors.number_time_use?.message}{' '}
                    </Form.Text>
                  )}
                </Form.Group>
              </div>
            </div>
          </div>
        </Form>
      </div>
    </>
  )
}

export default AddNewCoupen
