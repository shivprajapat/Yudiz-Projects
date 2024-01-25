/* eslint-disable */
import React, { useState, useEffect, useContext } from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import PropTypes from 'prop-types'
import { useNavigate } from 'react-router-dom'
import { useSnackbar } from 'react-notistack'
import { useDispatch, useSelector } from 'react-redux'
import moment from 'moment'

// React Bootstrap Components
import { Form, Button } from 'react-bootstrap'

// Images
import verified from '../../../assets/images/verified.svg'

// Components
import Modal from '../../VerificationModal'

// Action File
import { emailVerification, mobileVerification } from '../../../Actions/auth'
import { AppContext } from '../../../context'

// Validation-Scheme file
import { validationSignUpUserSchema } from '../../../Shared/ValidationSchemes/validation'

function UserDetails (props) {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { enqueueSnackbar } = useSnackbar()
  let startdate = moment()
  startdate = startdate.subtract(15, 'years')
  startdate = startdate.format('YYYY-MM-DD')

  // useForm
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(validationSignUpUserSchema),
    mode: 'onChange'
  })
  const { onChange, onBlur, name } = register(
    'firstName',
    'middleName',
    'lastName',
    'dob',
    'gender',
    'fName',
    'mName',
    'mobileNumber',
    'email',
    'terms'
  )

  // useState
  const [, setIsVerifiedFlag] = useState(false)
  const [isMobileVerifiedFlag, setMobileVerificationFlag] = useState(false)
  const [otp, setOTP] = useState('')
  const [otp2, setOTP2] = useState('')
  // const [, setFieldType] = useState('')
  const [type, setType] = useState('password')
  const [isShowPassword, setShowPassword] = useState(false)
  const [show, setShow] = useState(false)
  const [email, setEmail] = useState('')
  const [mobile, setMobile] = useState('')
  const [inputType, setInputType] = useState('')
  const { userDetails } = useContext(AppContext)
  const [user, setUser] = userDetails

  // useSelector
  const isVerified = useSelector((state) => state.auth.isOTPSignupVerified)
  const isMobileVerified = useSelector((state) => state.auth.isMobileOTPVerification)
  const isDone = useSelector((state) => state.auth.isMobileOTPSend)

  // Handle method for show/hide password
  const handleShowHidePassword = () => {
    if (type === 'password') {
      setType('text')
      setShowPassword(true)
    } else {
      setType('password')
      setShowPassword(false)
    }
  }

  // To verify otp useEffect
  useEffect(() => {
    if (isVerified === true) {
      setIsVerifiedFlag(true)
    } else {
      setIsVerifiedFlag(false)
    }
  }, [isVerified])

  // Mobile verification useEffect
  useEffect(() => {
    if (isMobileVerifiedFlag === true) {
      setMobileVerificationFlag(true)
    } else {
      setMobileVerificationFlag(false)
    }
  }, [isMobileVerified])

  // Modal show/hide method
  const handleShow1 = (e, type) => {
    if (mobile) {
      setInputType(type)
      const userData = {
        emailMobile: mobile
      }
      if (userData) {
        dispatch(mobileVerification(userData))
      }
      setShow(true)
    }
  }

  const handleShow2 = (e, type) => {
    if (email) {
      setInputType(type)

      const userData = {
        emailMobile: email
      }
      if (userData) {
        dispatch(emailVerification(userData))
      }
      setShow(true)
    }
  }

  // Set OTP from props
  const handleCallback = (childData) => {
    setOTP(childData)
  }

  // Set Field Type
  // const handleCallbackOTP = (childData) => {
  //   setFieldType(childData)
  // }

  // Set OTP
  const handleEmailIOTP = (childData) => {
    setOTP2(childData)
  }
  // Form onSubmit Method
  const onSubmit = (data) => {
    setIsVerifiedFlag(false)
    // if (otp === '' || otp2 === '' || otp === undefined || otp2 === undefined) {
    if (otp2 === '' || otp2 === undefined || (email && !otp)) {
      enqueueSnackbar('Please verify mobile number and email', {
        variant: 'error',
        autoHide: true,
        hide: 3000,
        TransitionComponent: 'Fade'
      })
    } 
    else {
      const array = {
        firstName: data.firstName,
        middleName: data.middleName,
        lastName: data.lastName,
        dob: moment(data.dob).format('YYYY-MM-DD'),
        gender: data.gender,
        fName: data.fName,
        mName: data.mName,
        mobileNumber: data.mobileNumber,
        email: data.email,
        password: data.password,
        cPassword: data.cPassword,
        otp,
        otp2,
        isSubmit: true,
        terms: data?.terms
      }
      if (array) {
        // setStudentData({
        //   ...array
        // })
        setUser(array)
      }
      navigate('/signup-educationdetails', { state: { data: array } })
    }
  }

  useEffect(() => {
    reset({
      firstName: user?.firstName,
      middleName: user?.middleName,
      lastName: user?.lastName,
      dob: user?.dob,
      gender: user?.gender,
      fName: user?.fName,
      mName: user?.mName,
      mobileNumber: user?.mobileNumber,
      email: user?.email,
      password: user?.password,
      cPassword: user?.cPassword
    })
    setOTP(user?.otp)
    setOTP2(user?.otp2)
  }, [])

  return (
    <>
      <Form onSubmit={handleSubmit(onSubmit)} noValidate>
        <Form.Group
          className={`form-group ${
            errors.firstName?.message ? 'error-occured' : ''
          }`}
          controlId='formfullname'
        >
          <Form.Label>First Name*</Form.Label>
          <Form.Control
            type='text'
            name={name}
            placeholder='Enter First Name'
            onChange={(e) => {
              onChange(e)
              setValue('firstName', e.target.value)
            }}
            {...register('firstName', { required: true })}
          />
          {errors.firstName?.message && (
            <Form.Text className='error-msg'>
              {errors.firstName?.message}{' '}
            </Form.Text>
          )}
        </Form.Group>
        <Form.Group
          className={`form-group ${
            errors.middleName?.message ? 'error-occured' : ''
          }`}
          controlId='formfullname'
        >
          <Form.Label>Middle Name*</Form.Label>
          <Form.Control
            type='text'
            name={name}
            placeholder='Enter Middle Name'
            onChange={(e) => {
              onChange(e)
              setValue('middleName', e.target.value)
            }}
            {...register('middleName', { required: true })}
          />
          {errors.middleName?.message && (
            <Form.Text className='error-msg'>
              {errors.middleName?.message}{' '}
            </Form.Text>
          )}
        </Form.Group>
        <Form.Group
          className={`form-group ${
            errors.lastName?.message ? 'error-occured' : ''
          }`}
          controlId='formfullname'
        >
          <Form.Label>Last Name*</Form.Label>
          <Form.Control
            type='text'
            name={name}
            placeholder='Enter Last Name'
            onChange={(e) => {
              onChange(e)
              setValue('lastName', e.target.value)
            }}
            {...register('lastName', { required: true })}
          />
          {errors.lastName?.message && (
            <Form.Text className='error-msg'>
              {errors.lastName?.message}{' '}
            </Form.Text>
          )}
        </Form.Group>
        <Form.Group
          className={`form-group ${errors.dob?.message ? 'error-occured' : ''}`}
          controlId='formdate'
        >
          <Form.Label>Date Of Birth*</Form.Label>
          <Form.Control
            type='date'
            placeholder='Date Of Birth'
            name={name}
            max={startdate}
            onChange={(e) => {
              onChange(e)
              setValue('dob', e.target.value)
            }}
            {...register('dob', { required: true })}
          />
          {errors.dob?.message && (
            <Form.Text className='error-msg'>{errors.dob?.message} </Form.Text>
          )}
        </Form.Group>
        <Form.Group
          className='form-group gender-box d-flex align-items-center'
          controlId='formgender'
        >
          <Form.Label>Gender*</Form.Label>
          <Form.Check type='radio' id='radio-1'>
            <div className='radio-input'>
              <Form.Check.Input
                type='radio'
                name={name}
                onBlur={onBlur}
                value='male'
                onChange={(e) => {
                  onChange(e)
                  setValue('gender', e.target.value)
                }}
                {...register('gender', { required: true })}
              />
            </div>
            <Form.Check.Label>Male</Form.Check.Label>
          </Form.Check>
          <Form.Check type='radio' id='radio-2'>
            <div className='radio-input'>
              <Form.Check.Input
                type='radio'
                name={name}
                value='female'
                onBlur={onBlur}
                onChange={(e) => {
                  onChange(e)
                  setValue('gender', e.target.value)
                }}
                {...register('gender', { required: true })}
              />
            </div>
            <Form.Check.Label>Female</Form.Check.Label>
          </Form.Check>
        </Form.Group>
        {errors.gender?.message && (
          <Form.Text className='error-msg'>{errors.gender?.message} </Form.Text>
        )}
        <Form.Group
          className={`form-group ${
            errors.fName?.message ? 'error-occured' : ''
          }`}
          controlId='formfathername'
        >
          <Form.Label>Father&apos;s Name*</Form.Label>
          <Form.Control
            type='text'
            placeholder="Enter Father's Name"
            name={name}
            onBlur={onBlur}
            onChange={(e) => {
              onChange(e)
              setValue('fName', e.target.value)
            }}
            {...register('fName', { required: true })}
          />
          {errors.fName?.message && (
            <Form.Text className='error-msg'>
              {errors.fName?.message}{' '}
            </Form.Text>
          )}
        </Form.Group>
        <Form.Group
          className={`form-group ${
            errors.mName?.message ? 'error-occured' : ''
          }`}
          controlId='formmothername'
        >
          <Form.Label>Mother&apos;s Name*</Form.Label>
          <Form.Control
            type='text'
            placeholder="Enter Mother's Name"
            name={name}
            onBlur={onBlur}
            onChange={(e) => {
              onChange(e)
              setValue('mName', e.target.value)
            }}
            {...register('mName', { required: true })}
          />
          {errors.mName?.message && (
            <Form.Text className='error-msg'>
              {errors.mName?.message}{' '}
            </Form.Text>
          )}
        </Form.Group>
        <Form.Group
          className={`form-group ${
            errors.mobileNumber?.message ? 'error-occured' : ''
          } ${isDone ? 'verified' : ''}`}
          controlId='formBasicmobile'
        >
          <Form.Label>Mobile Number*</Form.Label>
          <div className='position-relative d-flex'>
            <Form.Control
              type='number'
              placeholder='Enter Mobile Number'
              name={name}
              onBlur={onBlur}
              {...register('mobileNumber', { required: true })}
              onChange={(e) => {
                onChange(e)
                setMobile(e.target.value)
                setValue('mobileNumber', e.target.value)
              }}
              disabled={otp2}
            />
            <button
              type='button'
              onClick={(e) => handleShow1(e, 'mobile')}
              className='otp-verification-link'
              disabled={errors.mobileNumber?.message}
            >
              <span>OTP Verification</span>{' '}
            </button>
            <img src={verified} className='verification-sign' alt='' />
          </div>
          {errors.mobileNumber?.message && (
            <Form.Text className='error-msg'>
              {errors.mobileNumber?.message}{' '}
            </Form.Text>
          )}
        </Form.Group>
        <Form.Group
          className={`form-group ${
            errors.email?.message ? 'error-occured' : ''
          } ${isVerified ? 'verified' : ''}`}
          controlId='formBasicEmail'
        >
          <Form.Label>Email ID*</Form.Label>
          <div className='position-relative d-flex'>
            <Form.Control
              type='email'
              placeholder='Enter Email ID'
              name={name}
              {...register('email', { required: true })}
              onChange={(e) => {
                onChange(e)
                setEmail(e.target.value)
                setValue('email', e.target.value)
              }}
              disabled={otp && otp !== 'undefined'}
            />
            <button
              type='button'
              onClick={(e) => handleShow2(e, 'email')}
              className='otp-verification-link '
              disabled={errors.email?.message}
            >
              <span>OTP Verification</span>{' '}
            </button>
            <img src={verified} className='verification-sign' alt='' />
          </div>
          {errors.email?.message && (
            <Form.Text className='error-msg'>
              {errors.email?.message}{' '}
            </Form.Text>
          )}
        </Form.Group>
        <Form.Group
          className={`form-group ${
            errors.password?.message ? 'error-occured' : ''
          }`}
          controlId='formnewPassword'
        >
          <Form.Label>Password*</Form.Label>
          <div className='password-box no-eye'>
            <Form.Control
              type={type}
              placeholder='Enter Password'
              name={name}
              onChange={(e) => {
                onChange(e)
                setValue('password', e.target.value)
              }}
              {...register('password', { required: true })}
            />
            {errors.password?.message && (
              <Form.Text className='error-msg'>
                {errors.password?.message}{' '}
              </Form.Text>
            )}
            <span
            className={`show-hide-pass ${isShowPassword ? 'show-pass' : ''}`}
            onClick={handleShowHidePassword}
          ></span>
          </div>
         </Form.Group>
        <Form.Group
          className={`form-group ${
            errors.cPassword?.message ? 'error-occured' : ''
          }`}
          controlId='formconfirmPassword'
        >
          <Form.Label>Confirm Password*</Form.Label>
          <div className='password-box no-eye'>
            <Form.Control
              type='password'
              placeholder='Re-enter New Password'
              name={name}
              onChange={(e) => {
                onChange(e)
                setValue('cPassword', e.target.value)
              }}
              {...register('cPassword', { required: true })}
            />
            {errors.cPassword?.message && (
              <Form.Text className='error-msg'>
                {errors.cPassword?.message}{' '}
              </Form.Text>
            )}
          </div>
        </Form.Group>
        <Form.Group
          className='form-group checkbox-box'
          controlId='formBasicCheckbox'
        >
          <Form.Check type='checkbox' id='checkbox-1'>
            <Form.Check.Input
              type='checkbox'
              id='terms'
              onBlur={onBlur}
              onChange={(e) => {
                onChange(e)
                setValue('terms', user?.terms)
              }}
              checked={user?.terms}
              {...register('terms', { required: true })}
            />
            <Form.Check.Label>
              I agree with all <a href='https://www.ollato.com/terms-of-use/' target="_blank" rel="noreferrer">Terms & Conditions</a>
            </Form.Check.Label>
          </Form.Check>
          {errors.terms?.message && (
            <Form.Text className='error-msg'>
              {errors.terms?.message}{' '}
            </Form.Text>
          )}
        </Form.Group>
        <Button variant='primary' type='submit' className='theme-btn large-btn'>
          {' '}
          Next{' '}
        </Button>
      </Form>

      {/* OTP Modal */}
      <Modal
        show={show}
        email={email}
        mobile={mobile}
        fieldType={inputType}
        setShow={setShow}
        parentCallback={handleCallback}
        // parentCallback2={handleCallbackOTP}
        emailOTP={handleEmailIOTP}
        aria-labelledby='contained-modal-title-vcenter'
        centered
      />
    </>
  )
}

export default UserDetails
UserDetails.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func
  })
}
