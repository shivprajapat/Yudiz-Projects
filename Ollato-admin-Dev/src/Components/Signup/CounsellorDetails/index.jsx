import React, { useContext, useEffect, useState } from 'react'
import { Button, Form } from 'react-bootstrap'
import verified from '../../../assets/images/verified.svg'
import { useForm } from 'react-hook-form'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { emailVerification, mobileVerification } from '../../../Actions/auth'
import Modal from '../VerificationModal'
import { useSnackbar } from 'react-notistack'
import moment from 'moment'
import { AppContext } from '../../../context'
// Phone Number Validation
const phoneRegex = /^(\+\d{1,3}[- ]?)?\d{10}$/
const emailRegex = /.+@.+\.[A-Za-z]+$/
const passRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
let startdate = moment()
startdate = startdate.subtract(15, 'years')
startdate = startdate.format('YYYY-MM-DD')

// Validation-Scheme for fields
const validationSchema = yup.object().shape({
  firstName: yup
    .string()
    .required('First Name is required')
    .min(2, 'First Name must be at least 2 characters')
    .max(20, 'First Name must be at most 20 characters')
    .matches(
      /^[a-zA-z]+([\s][a-zA-Z]+)*$/,
      'Special Characters & Numeric value are not allowed'
    ),
  middleName: yup
    .string()
    .nullable(true)
    .max(20, 'Middle Name must be at most 20 characters')
    .matches(
      /^[a-zA-z]*$/,
      'Special Characters & Numeric value are not allowed'
    ),
  lastName: yup
    .string()
    .required('Last Name is required')
    .min(2, 'Last Name must be at least 2 characters')
    .max(20, 'Last Name must be at most 20 characters')
    .matches(
      /^[a-zA-z]+([\s][a-zA-Z]+)*$/,
      'Special Characters & Numeric value are not allowed'
    ),
  dob: yup
    .date()
    .required('Date of Birth is required')
    .typeError('Date of Birth is required')
    .max(startdate, 'Enter valid date'),
  gender: yup.string().required('Gender is required').nullable(),
  fName: yup
    .string()
    .required('Father Name is required')
    .min(2, 'Father Name must be at least 2 characters')
    .max(20, 'Father Name must be at most 20 characters')
    .matches(
      /^[a-zA-z]+([\s][a-zA-Z]+)*$/,
      'Special Characters & Numeric value are not allowed'
    ),
  mName: yup
    .string()
    .required('Mother Name is required')
    .min(2, 'Mother Name must be at least 2 characters')
    .max(20, 'Mother Name must be at most 20 characters')
    .matches(
      /^[a-zA-z]+([\s][a-zA-Z]+)*$/,
      'Special Characters & Numeric value are not allowed'
    ),
  mobileNumber: yup
    .string()
    .required('Mobile Number is required')
    .matches(phoneRegex, 'Enter valid Mobile Number'),
  email: yup
    .string()
    .required('Email is required')
    .matches(emailRegex, 'Enter valid E-Mail'),
  professional_expertness: yup
    .string()
    .nullable(true)
    .matches(/^([a-zA-z0-9]+([\s][a-zA-Z0-9]+)*)?$/, 'Invalid format'),
  files: yup.mixed().test('required', 'Please select a file', (value) => {
    return value && value.length
  }),
  password: yup
    .string()
    .required('Password is required')
    .matches(
      passRegex,
      'Password must contain at least eight characters, at least one number and both lower and uppercase letters and special characters'
    ),
  cPassword: yup
    .string()
    .required('Confirm Password is required')
    .oneOf(
      [yup.ref('password'), null],
      'Password and Confirm password must be same '
    )
  // uResume: yup.array()
  // .nullable()
  // .required('File is required')
  // uResume: yup.object().required('File is required').nullable()
})

function CounsellorDetails (props) {
  const navigate = useNavigate()
  const { enqueueSnackbar } = useSnackbar()

  /* modal */
  const [show, setShow] = useState(false)
  const [, setIsVerifiedFlag] = useState(false)
  const [isMobileVerifiedFlag, setMobileVerificationFlag] = useState(false)
  const [email, setEmail] = useState('')
  const [mobile, setMobile] = useState('')
  const [otp, setOTP] = useState('')
  const [otp2, setOTP2] = useState('')
  const [type, setType] = useState('password')
  const [isShowPassword, setShowPassword] = useState(false)
  const [inputType, setInputType] = useState('')
  const { userDetails } = useContext(AppContext)
  const [user, setUser] = userDetails
  const handleCallback = (childData) => {
    setOTP(childData)
  }

  const dispatch = useDispatch()
  let startdate = moment()
  startdate = startdate.subtract(20, 'years')
  startdate = startdate.format('YYYY-MM-DD')
  const isVerified = useSelector((state) => state.auth.isOTPSignupVerified)
  const isDone = useSelector((state) => state.auth.isMobileOTPSend)
  const isOtpSent = useSelector((state) => state.auth.isMobileOTPVerification)
  const {
    register,
    watch,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm({
    resolver: yupResolver(validationSchema),
    mode: 'onChange'
  })

  // Mobile verification useEffect
  useEffect(() => {
    if (isMobileVerifiedFlag === true) {
      setMobileVerificationFlag(true)
    } else {
      setMobileVerificationFlag(false)
    }
  }, [isOtpSent])

  // To verify otp useEffect
  useEffect(() => {
    if (isVerified === true) {
      setIsVerifiedFlag(true)
    } else {
      setIsVerifiedFlag(false)
    }
  }, [isVerified])

  const { onChange, onBlur, name } = register(
    'firstName',
    'dob',
    'gender',
    'fName',
    'mName',
    'mobileNumber',
    'email',
    'terms',
    'files',
    'professional'
  )

  const handleShow1 = () => {
    let userData = {}
    if (email) {
      setInputType('email')
      userData = {
        emailMobile: email
      }
      if (userData) {
        dispatch(emailVerification(userData))
      }
      setShow(true)
    }
  }

  // Set OTP
  const handleEmailIOTP = (childData) => {
    setOTP2(childData)
  }
  const handleShow2 = () => {
    let userData = {}
    if (mobile) {
      setInputType('mobile')
      userData = {
        emailMobile: mobile
      }
      if (userData) {
        dispatch(mobileVerification(userData))
      }
      setShow(true)
    }
  }

  // Handle method show/hide password
  const handleShowHidePassword = () => {
    if (type === 'password') {
      setType('text')
      setShowPassword(true)
    } else {
      setType('password')
      setShowPassword(false)
    }
  }

  const onSubmit = (data) => {
    // eslint-disable-next-line react/prop-types
    props.setNow(33.3)
    if (otp === '' || otp2 === '' || otp === undefined || otp2 === undefined) {
      enqueueSnackbar('Please verify mobile number and email', {
        variant: 'error',
        autoHide: true,
        hide: 3000,
        TransitionComponent: 'Fade'
      })
    } else {
      const array = {
        firstName: data.firstName,
        middleName: data.middleName,
        lastName: data.lastName,
        dob: data.dob,
        gender: data.gender,
        fName: data.fName,
        mName: data.mName,
        mobileNumber: data.mobileNumber,
        email: data.email,
        file: data.files,
        professional_expertness: data?.professional_expertness,
        otp,
        otp2,
        password: data?.password,
        cPassword: data?.cPassword,
        isDone: true,
        isVerified: true
      }

      if (array) {
        setUser(array)

        navigate('/educationdetails', { state: { data: array } })
      }
    }
  }

  useEffect(() => {
    if (Object.keys(user).length !== 0) {
      reset({
        firstName: user?.firstName,
        middleName: user.middleName,
        lastName: user.lastName,
        dob: user && moment(user.dob).format('YYYY-MM-DD'),
        gender: user.gender,
        fName: user.fName,
        mName: user.mName,
        mobileNumber: user.mobileNumber,
        email: user.email,
        files: user?.file,
        professional_expertness: user?.professional_expertness,
        password: user.password,
        cPassword: user?.cPassword
      })
      setOTP(user?.otp)
      setOTP2(user?.otp2)
    }
  }, [])
  return (
    <>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Form.Group
          className={`form-group ${
            errors.firstName?.message ? 'error-occured' : ''
          }`}
          controlId='formfirstname'
        >
          <Form.Label>First Name</Form.Label>
          <Form.Control
            type='text'
            placeholder='Enter First Name'
            name={name}
            onBlur={onBlur}
            onChange={(e) => {
              onChange(e)
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
          <Form.Label>Middle Name</Form.Label>
          <Form.Control
            type='text'
            name={name}
            placeholder='Enter Middle Name'
            onChange={(e) => {
              onChange(e)
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
          <Form.Label>Last Name</Form.Label>
          <Form.Control
            type='text'
            name={name}
            placeholder='Enter Last Name'
            onChange={(e) => {
              onChange(e)
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
          <Form.Label>Date Of Birth</Form.Label>
          <Form.Control
            type='date'
            placeholder='Date Of Birth'
            name={name}
            max={startdate}
            onChange={(e) => {
              onChange(e)
            }}
            {...register('dob', { required: true })}
          />
          {errors.dob?.message && (
            <Form.Text className='error-msg'>{errors.dob?.message} </Form.Text>
          )}
        </Form.Group>
        <Form.Group
          className='form-group gender-box d-flex align-items-center'
          // className={`form-group gender-box d-flex align-items-center ${errors.dob?.message ? 'error-occured' : ''}`}
          controlId='formgender'
        >
          <Form.Label>Gender</Form.Label>
          <Form.Check type='radio' id='radio-1'>
            <div className='radio-input'>
              <Form.Check.Input
                type='radio'
                name={name}
                onBlur={onBlur}
                value='male'
                onChange={(e) => {
                  onChange(e)
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
          <Form.Label>Father&apos;s Name</Form.Label>
          <Form.Control
            type='text'
            placeholder="Enter Father's Name"
            name={name}
            onBlur={onBlur}
            onChange={(e) => {
              onChange(e)
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
          <Form.Label>Mother&apos;s Name</Form.Label>
          <Form.Control
            type='text'
            placeholder="Enter Mother's Name"
            name={name}
            onBlur={onBlur}
            onChange={(e) => {
              onChange(e)
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
          // className="form-group"
          className={`form-group ${
            errors.mobileNumber?.message ? 'error-occured' : ''
          } ${isDone || user?.isDone ? 'verified' : ''}`}
          controlId='formBasicmobile'
        >
          <Form.Label>Mobile Number</Form.Label>
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
              }}
              disabled={otp2}
            />
            <button
              type='button'
              onClick={handleShow2}
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
          // className="form-group verified"
          className={`form-group ${
            errors.email?.message ? 'error-occured' : ''
          } ${isVerified || user?.isVerified ? 'verified' : ''}`}
          controlId='formBasicEmail'
        >
          <Form.Label>Email ID</Form.Label>
          <div className='position-relative d-flex'>
            <Form.Control
              type='email'
              placeholder='Enter Email ID'
              name={name}
              {...register('email', { required: true })}
              onChange={(e) => {
                onChange(e)
                setEmail(e.target.value)
              }}
              disabled={otp && otp !== 'undefined'}
            />
            <button
              type='button'
              disabled={errors.email?.message}
              onClick={handleShow1}
              className='otp-verification-link'
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
            errors.professional_expertness?.message ? 'error-occured' : ''
          }`}
          controlId='formfathername'
        >
          <Form.Label>Professional Expertness</Form.Label>
          <Form.Control
            type='text'
            placeholder="Enter Expertness"
            name={name}
            onBlur={onBlur}
            // onChange={(e) => {
            //   onChange(e)
            // }}
            {...register('professional_expertness', { required: true })}
          />
          {errors.professional_expertness?.message && (
            <Form.Text className='error-msg'>
              {errors.professional_expertness?.message}{' '}
            </Form.Text>
          )}
        </Form.Group>
        <Form.Group
          controlId='formFile'
          className='form-group resume-file-input'
        >
          <Form.Label>Resume</Form.Label>
          <Form.Control
            type='file'
            title='Upload Resume'
            className='hidden-file'
            name='files'
            accept='application/pdf,application/msword'
            {...register('files', { required: true })}
          />
          <div className='form-control d-flex justify-content-between align-items-center'>
            {/* <p className='m-0'>Upload Resume</p> */}
            {!watch('files') || watch('files').length === 0
              ? (
              <p className='m-0'>Upload Resume</p>
                )
              : (
              <p className='m-0 file-name-resume'>{watch('files')[0].name}</p>
                )}
            <button className='browse-btn'>Browse</button>
          </div>
          <p className='error-msg'>
            {errors.files?.message || errors.files?.label.message}
          </p>
        </Form.Group>
        <Form.Group
          className={`form-group ${
            errors.password?.message ? 'error-occured' : ''
          }`}
          controlId='formnewPassword'
        >
          <Form.Label>New Password</Form.Label>
          <div className='password-box'>
            <Form.Control
              type={type}
              placeholder='Enter New Password'
              name={name}
              onChange={(e) => {
                onChange(e)
              }}
              {...register('password', { required: true })}
            />
            <span
              className={`show-hide-pass ${isShowPassword ? 'show-pass' : ''}`}
              onClick={handleShowHidePassword}
            ></span>
          </div>
          {errors.password?.message && (
            <Form.Text className='error-msg'>
              {errors.password?.message}{' '}
            </Form.Text>
          )}
        </Form.Group>
        <Form.Group
          className={`form-group ${
            errors.cPassword?.message ? 'error-occured' : ''
          }`}
          controlId='formconfirmPassword'
        >
          <Form.Label>Confirm Passwod</Form.Label>
          <div className='password-box no-eye'>
            <Form.Control
              type='password'
              placeholder='Re-enter New Password'
              name={name}
              onChange={(e) => {
                onChange(e)
              }}
              {...register('cPassword', { required: true })}
            />
          </div>
          {errors.cPassword?.message && (
            <Form.Text className='error-msg'>
              {errors.cPassword?.message}
            </Form.Text>
          )}
        </Form.Group>
        <Button
          variant='primary'
          type='submit'
          className='theme-btn large-btn'
          // onClick={() => onSubmit()}
        >
          Next
        </Button>
      </Form>
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

export default CounsellorDetails
