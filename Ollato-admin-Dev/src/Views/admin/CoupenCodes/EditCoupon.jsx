import { yupResolver } from '@hookform/resolvers/yup'
import moment from 'moment'
import React, { useEffect, useRef } from 'react'
import { Form } from 'react-bootstrap'
import { Controller, useForm } from 'react-hook-form'
import { useNavigate, useParams } from 'react-router-dom'
import Header from '../../../Components/Header'
import Select from 'react-select'
import TitleHeader from '../../../Components/TitleHeader'
import * as yup from 'yup'
import { ref } from 'yup'
import { useDispatch, useSelector } from 'react-redux'
import { editSpecificCoupon, getSpecificCouponData } from '../../../Actions/Admin/coupenCode'
import { useSnackbar } from 'react-notistack'

function EditCoupon () {
  // constants
  const token = localStorage.getItem('token')
  const params = useParams()
  const id = params.id
  const { enqueueSnackbar } = useSnackbar()
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const couponTypeArray = [
    { id: 1, title: 'fix amount' },
    { id: 2, title: 'percentage' }
  ]

  const validationCouponCode = yup.object().shape({
    title: yup
      .string()
      .required('Title is required')
      .min(2, 'Title must be at least 2 characters'),
    code: yup.string()
      .required('Coupon Code is required')
      .min(5, 'Coupon Code must be at least 5 characters')
      .max(10, 'Coupon Code must be at most 10 characters')
      .matches(/^[a-zA-Z0-9]*$/, 'Special Characters & Numeric value are not allowed'),
    start_date: yup
      .date()
      .typeError('Start date is required'),
    // .min(
    //   moment().format('YYYY-MM-DD'),
    //   `Min start date is ${moment().format('YYYY-MM-DD')}`
    // ),
    // .max(
    //   ref('end_date'),
    //   'Invalid date or Min date must be earlier than the max date'
    // ),
    end_date: yup
      .date()
      .typeError('End date is required')
      .min(
        ref('start_date'),
        'Invalid date or Max date must be later than min date'
      ),
    amount_percentage: yup.number()
      .required('This is required')
      .typeError('This is Required')
      .min(1, 'Amount or Percentage must be greater than zero'),
    number_time_use: yup.number()
      .required('This is required')
      .typeError('This is Required')
      .min(1, 'This must be greater than zero')
  })

  // useSelector
  const specificCouponData = useSelector((state) => state.CoupenCodesAdmin.specificCouponData)
  const isCouponCodeEdited = useSelector(state => state.CoupenCodesAdmin.isCouponCodeEdited)
  const resMessage = useSelector(state => state.CoupenCodesAdmin.resMessage)
  const previousProps = useRef({ isCouponCodeEdited, resMessage }).current
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    control,
    reset
  } = useForm({
    resolver: yupResolver(validationCouponCode)
  })

  // useEffect to get data by id
  useEffect(() => {
    if (id) {
      dispatch(getSpecificCouponData(Number(id), token))
    }
  }, [id])

  const generatestring = () => {
    const code = Math.random().toString(36).slice(2).slice(0, 8)
    setValue('code', code)
  }

  const onSubmit = (data) => {
    const coupondata = {
      id,
      title: data?.title,
      code: data?.code,
      description: data?.description,
      from_date: moment(data.start_date).format('YYYY-MM-DD'),
      to_date: moment(data.end_date).format('YYYY-MM-DD'),
      coupon_type: data?.coupon_type?.title === 'percentage' ? 'percentage' : 'fixed_amount',
      amount_percentage: data.amount_percentage,
      number_time_use: data.number_time_use
    }
    if (coupondata) {
      dispatch(editSpecificCoupon(coupondata, token))
    }
  }

  useEffect(() => {
    if (specificCouponData) {
      reset({
        title: specificCouponData?.title,
        code: specificCouponData?.code,
        start_date: specificCouponData?.from_date,
        end_date: specificCouponData?.to_date,
        coupon_type: {
          id: specificCouponData?.coupon_type === 'percentage' ? 2 : 1,
          title: specificCouponData?.coupon_type === 'percentage' ? 'percentage' : 'fix amount'
        },
        amount_percentage: specificCouponData?.amount_percentage,
        description: specificCouponData?.description,
        number_time_use: specificCouponData?.number_time_use

      })
    }
  }, [specificCouponData])

  // Notification for status
  useEffect(() => {
    if (previousProps?.isCouponCodeEdited !== isCouponCodeEdited) {
      if (isCouponCodeEdited) {
        enqueueSnackbar(`${resMessage}`, {
          variant: 'success',
          hide: 2000,
          autoHide: true
        })
        navigate('/admin/coupon-codes')
      } else if (isCouponCodeEdited === false) {
        enqueueSnackbar(`${resMessage}`, {
          variant: 'error',
          hide: 2000,
          autoHide: true,
          TransitionComponent: 'Fade'
        })
      }
    }
    return () => {
      previousProps.isCouponCodeEdited = isCouponCodeEdited
    }
  }, [isCouponCodeEdited])

  return (
    <>
      <Header />
      <TitleHeader name='Edit Coupon' title='Coupon Code' />
      <div className='main-layout'>
        <Form className='light-bg' onSubmit={handleSubmit(onSubmit)}>
          <div className='heading-box'>
            <h5>Edit Coupon</h5>
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
                    // min={moment().format('YYYY-MM-DD')}
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
                    name='coupon_type'
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
                        onChange={(e) => {
                          field.onChange(e)
                        }
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

export default EditCoupon
