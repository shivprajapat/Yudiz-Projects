import React, { useEffect, useRef } from 'react'

/* Components */
import { useSnackbar } from 'react-notistack'
import TitleHeader from '../../../Components/TitleHeader'
import * as yup from 'yup'
import { Form, Spinner } from 'react-bootstrap'
import Select from 'react-select'
import { useDispatch, useSelector } from 'react-redux'
import { Controller, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { addCounsellorAction, getAllCenters } from '../../../Actions/Admin/counsellor'
import { useNavigate } from 'react-router-dom'
import moment from 'moment'
import { useAddress } from '../../../Shared/Hooks/UseAddress'
import ls from 'localstorage-slim'

function AddCounsellor () {
  // Constant
  const navigate = useNavigate()
  const token = localStorage.getItem('token')
  const profile = JSON.parse(localStorage.getItem('profile'))
  const adminType = ls.get('admin-type', { decrypt: true, secret: profile?.id })
  const { enqueueSnackbar } = useSnackbar()
  const dispatch = useDispatch()
  let startdate = moment()
  startdate = startdate.subtract(20, 'years')
  startdate = startdate.format('YYYY-MM-DD')

  // useSelector
  const isCounsellorAdded = useSelector(
    (state) => state.counsellorManAdmin.isCounsellorAdded
  )
  const centers = useSelector(
    (state) => state.counsellorManAdmin.centers
  )
  const isLoading = useSelector((state) => state.counsellorManAdmin.isLoading)
  const isCounsellorAddedMessage = useSelector(
    (state) => state.counsellorManAdmin.resMessage
  )

  useEffect(() => {
    dispatch(getAllCenters())
  }, [])
  // custom hook
  const {
    countryid,
    setCountryid,
    stateid,
    setStateid,
    countriesArray,
    statesArray,
    districtArray
  } = useAddress()

  const previousProps = useRef({
    isCounsellorAdded
  }).current

  useEffect(() => {
    if (previousProps?.isCounsellorAdded !== isCounsellorAdded) {
      if (isCounsellorAdded) {
        enqueueSnackbar(`${isCounsellorAddedMessage}`, {
          variant: 'success',
          hide: 2000,
          autoHide: true
        })
        if (adminType === 'center') {
          navigate('/center/counsellor-management')
        } else {
          navigate('/admin/counsellor-management')
        }
      } else if (isCounsellorAdded === false) {
        enqueueSnackbar(`${isCounsellorAddedMessage}`, {
          variant: 'error',
          hide: 2000,
          autoHide: true,
          TransitionComponent: 'Fade'
        })
      }
    }
    return () => {
      previousProps.isCounsellorAdded = isCounsellorAdded
    }
  }, [isCounsellorAdded])

  const validationSchema = yup.object().shape({
    firstName: yup
      .string()
      .required('First Name is required')
      .min(2, 'First Name must be at least 2 characters')
      .max(20, 'First Name must be at most 20 characters')
      .matches(/^[a-zA-z]+([\s][a-zA-Z]+)*$/, 'Special Characters & Numeric value are not allowed'),
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
      .max(20, 'last Name must be at most 20 characters')
      .matches(/^[a-zA-z]+([\s][a-zA-Z]+)*$/, 'Special Characters & Numeric value are not allowed'),
    mobileNumber: yup
      .string()
      .required('Mobile Number is required')
      .matches(/^(\+\d{1,3}[- ]?)?\d{10}$/, 'Enter valid Mobile Number'),
    country: yup.object().nullable().required('Country is required'),
    state: yup.object().nullable().required('State is required'),
    district: yup.object().nullable().required('District is required'),
    professional_expertness: yup
      .string()
      .nullable(true)
      .matches(/^([a-zA-z0-9]+([\s][a-zA-Z0-9]+)*)?$/, 'Special Characters are not allowed'),
    email: yup.string().required('Email is required').email(),
    commision: yup.number()
      .positive()
      .typeError('Numbers only')
      .required('Required')
      .min(0)
      .max(100),
    counsellortype: yup.array().test({
      name: 'categories_test',
      exclusive: true,
      message: 'At least select one',
      test: (value) => value.length > 0
    }),
    pin_code: yup.string()
      .matches(/^[\w]*$/, 'Negative numbers not allowed')
      .max(10, 'Pincode must be less than & equals to 10 digits')
  })

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue
  } = useForm({
    resolver: yupResolver(validationSchema)
  })

  const onSubmit = (data) => {
    const formData = new FormData()
    formData.append('first_name', data.firstName)
    formData.append('middle_name', data.middleName)
    formData.append('last_name', data.lastName)
    formData.append('email', data?.email)
    formData.append('mobile', data.mobileNumber)
    formData.append('dob', data.dob)
    formData.append('country_id', data.country.id)
    formData.append('state_id', data.state.id)
    formData.append('city_id', data.district.id)
    formData.append('pin_code', data.pin_code)
    formData.append('commission', data.commision)
    formData.append('center_id', data?.center?.id)
    formData.append('professional_expertness', data?.professional_expertness)
    formData.append(
      'career_counsellor',
      data?.counsellortype?.includes('career_counsellor') ? 1 : 0
    )
    formData.append(
      'psychologist',
      data?.counsellortype?.includes('pycho') ? 1 : 0
    )
    formData.append(
      'overseas_counsellor',
      data.counsellortype.includes('overseas') ? 1 : 0
    )
    formData.append(
      'subject_expert',
      data.counsellortype.includes('subject_expert') ? 1 : 0
    )
    if (data.files.length !== 0) {
      formData.append('resume', data.files[0])
    }

    if (formData) {
      if (adminType === 'super' || adminType === 'sub') {
        dispatch(addCounsellorAction(formData, token, 'admin'))
      } else {
        dispatch(addCounsellorAction(formData, token, 'center'))
      }
    }
  }

  return (
    <>
      {/* <Header /> */}
      <TitleHeader name='Add New' title='Add New Counsellor' />
      <div className='main-layout whitebox-layout my-editprofile-page'>
        <Form className='light-bg' onSubmit={handleSubmit(onSubmit)}>
          <div className='heading-box'>
            <h5>Add counsellor</h5>
            <div className='btn-box'>
              <button
                className='theme-btn dark-btn text-none'
                onClick={() => navigate(-1)}
              >
                Cancel
              </button>
              <button className='theme-btn text-none'>
                Save {isLoading && <Spinner animation='border' size='sm' />}
              </button>
            </div>
          </div>
          <div className='light-bg-box'>
            <div className='row'>
              <div className='col-xxl-12 '>
                <div className='row'>
                  <div className='col-lg-12'>
                    <h4>Counsellor Details</h4>
                  </div>
                  <div className='col-lg-6'>
                    <Form.Group
                      className={`form-group ${
                        errors?.firstName?.message ? 'error-occured' : ''
                      }`}
                      controlId='firstName'
                    >
                      <Form.Label>First Name</Form.Label>
                      <Form.Control
                        placeholder='Enter First Name'
                        type='text'
                        {...register('firstName', { required: true })}
                      />
                      {errors?.firstName?.message && (
                        <Form.Text className='error-msg'>
                          {errors?.firstName?.message}
                        </Form.Text>
                      )}
                    </Form.Group>
                  </div>
                  <div className='col-lg-6'>
                    <Form.Group
                      className={`form-group ${
                        errors?.middleName?.message ? 'error-occured' : ''
                      }`}
                      controlId='firstName'
                    >
                      <Form.Label>Middle Name</Form.Label>
                      <Form.Control
                        placeholder='Enter Middle Name'
                        type='text'
                        {...register('middleName', { required: true })}
                      />
                      {errors?.middleName?.message && (
                        <Form.Text className='error-msg'>
                          {errors?.middleName?.message}
                        </Form.Text>
                      )}
                    </Form.Group>
                  </div>
                  <div className='col-lg-6'>
                    <Form.Group
                      className={`form-group ${
                        errors?.lastName?.message ? 'error-occured' : ''
                      }`}
                      controlId='lastName'
                    >
                      <Form.Label>Last Name</Form.Label>
                      <Form.Control
                        placeholder='Enter Last Name'
                        type='text'
                        {...register('lastName', { required: true })}
                      />
                      {errors?.lastName?.message && (
                        <Form.Text className='error-msg'>
                          {errors?.lastName?.message}
                        </Form.Text>
                      )}
                    </Form.Group>
                  </div>
                  <div className='col-lg-6'>
                    <Form.Group className='form-group' controlId='dob'>
                      <Form.Label>Date Of Birth</Form.Label>
                      <Form.Control
                        name='dob'
                        type='date'
                        {...register('dob')}
                        max={startdate}
                      />
                    </Form.Group>
                  </div>
                  <div className='col-lg-6'>
                    <Form.Group
                      controlId='formBasicEmail'
                      className={`form-group ${
                        errors?.mobileNumber?.message ? 'error-occured' : ''
                      }`}
                    >
                      <Form.Label>Mobile Number</Form.Label>
                      <Form.Control
                        placeholder='Enter Mobile Number'
                        type='text'
                        {...register('mobileNumber', { required: true })}
                      />
                      {errors?.mobileNumber?.message && (
                        <Form.Text className='error-msg'>
                          {errors?.mobileNumber?.message}{' '}
                        </Form.Text>
                      )}
                    </Form.Group>
                  </div>
                  <div className='col-lg-6'>
                    <Form.Group
                      className={`form-group ${
                        errors?.email?.message ? 'error-occured' : ''
                      }`}
                      controlId='formBasicEmail'
                    >
                      <Form.Label>Email ID</Form.Label>
                      <div className='position-relative'>
                        <Form.Control
                          placeholder='Enter Email ID'
                          type='email'
                          {...register('email')}
                        />
                      </div>
                      {errors?.email?.message && (
                        <Form.Text className='error-msg'>
                          {errors?.email?.message}{' '}
                        </Form.Text>
                      )}
                    </Form.Group>
                  </div>
                  <div className='col-lg-6'>
                    <Form.Group
                      controlId='formBasicEmail'
                      className={`form-group ${
                        errors?.commision?.message ? 'error-occured' : ''
                      }`}
                    >
                      <Form.Label>Commision (%)</Form.Label>
                      <Form.Control
                        placeholder='Enter Commision'
                        type='text'
                        {...register('commision', { required: true })}
                      />
                      {errors?.commision?.message && (
                        <Form.Text className='error-msg'>
                          {errors?.commision?.message}{' '}
                        </Form.Text>
                      )}
                    </Form.Group>
                  </div>
                  <div className='col-lg-6'>
                  <Form.Group
                              className='form-group common-select-style'
                              controlId='formfullname'
                            >
                              <Form.Label>Center</Form.Label>
                              <Controller
                                name='center'
                                control={control}
                                render={({ field, onChange }) => {
                                  return (
                                    <Select
                                      {...field}
                                      placeholder={'Select Center'}
                                      className='react-dropdown'
                                      classNamePrefix='dropdown'
                                      options={centers}
                                      getOptionLabel={(option) => option?.title}
                                      getOptionValue={(option) => option?.id}
                                      onChange={(e) => {
                                        field.onChange(e)
                                      }}
                                    />
                                  )
                                }}
                              />
                            </Form.Group>
                  </div>
                  <div className='col-lg-12'>
                    <div className='row'>
                      <div className='col-md-6'>
                        <div className='row'>
                          <div className='col-xl-6'>
                            <Form.Group
                              className='form-group common-select-style'
                              controlId='formfullname'
                            >
                              <Form.Label>Country</Form.Label>
                              <Controller
                                name='country'
                                control={control}
                                render={({ field, onChange }) => {
                                  return (
                                    <Select
                                      {...field}
                                      placeholder={'Select Country'}
                                      className='react-dropdown'
                                      classNamePrefix='dropdown'
                                      options={countriesArray}
                                      getOptionLabel={(option) => option?.title}
                                      getOptionValue={(option) => option?.id}
                                      onChange={(e) => {
                                        field.onChange(e)
                                        setCountryid(e.id)
                                      }}
                                    />
                                  )
                                }}
                              />
                              <p className='error-msg'>
                                {errors?.country?.message ||
                                  errors?.country?.id?.message}
                              </p>
                            </Form.Group>
                          </div>
                          <div className='col-xl-6'>
                            <Form.Group
                              className='form-group common-select-style'
                              controlId='formfullname'
                            >
                              <Form.Label>State</Form.Label>
                              <Controller
                                name='state'
                                control={control}
                                render={({ field }) => {
                                  return (
                                    <Select
                                      {...field}
                                      placeholder={'Select State'}
                                      className='react-dropdown'
                                      classNamePrefix='dropdown'
                                      options={statesArray}
                                      onChange={(e) => {
                                        field.onChange(e)
                                        setStateid(e.id)
                                        setValue('district', '')
                                      }}
                                      getOptionLabel={(option) => option?.title}
                                      getOptionValue={(option) => option?.id}
                                      isDisabled={!countryid && true}
                                    />
                                  )
                                }}
                              />
                              <p className='error-msg'>
                                {errors?.state?.message ||
                                  errors?.state?.id?.message}
                              </p>
                            </Form.Group>
                          </div>
                        </div>
                      </div>
                      <div className='col-md-6'>
                        <div className='row'>
                          <div className='col-xl-6'>
                            <Form.Group
                              className='form-group common-select-style'
                              controlId='formfullname'
                            >
                              <Form.Label>District</Form.Label>
                              <Controller
                                name='district'
                                control={control}
                                render={({ field }) => {
                                  return (
                                    <Select
                                      {...field}
                                      placeholder={'Select District'}
                                      className='react-dropdown'
                                      classNamePrefix='dropdown'
                                      options={districtArray}
                                      getOptionLabel={(option) => option?.title}
                                      getOptionValue={(option) => option?.id}
                                      isDisabled={!stateid && true}
                                    />
                                  )
                                }}
                              />
                              <p className='error-msg'>
                                {errors?.district?.message ||
                                  errors?.district?.id?.message}
                              </p>
                            </Form.Group>
                          </div>
                          <div className='col-xl-6'>
                            <Form.Group
                              className='form-group'
                              controlId='formpincode1'
                              name='pin_code'
                            >
                              <Form.Label>PIN Code</Form.Label>
                              <Form.Control
                                type='text's
                                {...register('pin_code')}
                                placeholder='Enter Pin Code'
                              />
                               <p className='error-msg'>
                                {errors?.pin_code?.message}
                              </p>
                            </Form.Group>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className='col-lg-6'>
                        <Form.Group
                          className={`form-group ${
                            errors.professional_expertness?.message ? 'error-occured' : ''
                          }`}
                          controlId='formBasicmobile'
                        >
                          <Form.Label>Professional Expertness</Form.Label>
                          <div className='position-relative'>
                            <Form.Control
                              type='text'
                              {...register('professional_expertness', { required: true })}
                              placeholder='Enter Expertness'
                            />
                          </div>
                          {errors.professional_expertness?.message && (
                            <Form.Text className='error-msg'>
                              {errors.professional_expertness?.message}{' '}
                            </Form.Text>
                          )}
                        </Form.Group>
                      </div>
                  <div className='col-lg-6'>
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
                          <p className='m-0 file-name-resume'>
                            {watch('files')[0].name}
                          </p>
                            )}
                        <button className='browse-btn'>Browse</button>
                      </div>
                      <p className='error-msg'>
                        {errors.files?.message || errors.files?.label.message}
                      </p>
                    </Form.Group>
                  </div>
                  <div className='col-lg-12 rowspacer'>
                    <div className='p-3'>
                      <div className='row'>
                        <Form.Group
                          controlId='formgstnumber'
                          className='form-group document-file-input common-input-file  uploaded-doc counsellor-checkbox'
                        >
                          <Form.Label>Types:</Form.Label>
                          <Form.Check type='checkbox'>
                            <Form.Check.Input
                              name='counsellortype'
                              value='career_counsellor'
                              {...register('counsellortype', {
                                required: {
                                  value: true,
                                  message: 'Required'
                                }
                              })}

                              // checked={profileData?.career_counsellor === '1'}
                            />
                            <Form.Check.Label>
                              Career Counsellor
                            </Form.Check.Label>
                          </Form.Check>
                          <Form.Check type='checkbox'>
                            <Form.Check.Input
                              name='counsellortype'
                              type='checkbox'
                              value='pycho'
                              {...register('counsellortype', {
                                required: {
                                  value: true,
                                  message: 'Required'
                                }
                              })}
                              // checked={profileData?.psychologist === '1'}
                            />
                            <Form.Check.Label>Psychologist</Form.Check.Label>
                          </Form.Check>
                          <Form.Check type='checkbox'>
                            <Form.Check.Input
                              type='checkbox'
                              name='counsellortype'
                              value='overseas'
                              {...register('counsellortype', {
                                required: {
                                  value: true,
                                  message: 'Required'
                                }
                              })}
                              // checked={profileData?.overseas_counsellor === '1'}
                            />
                            <Form.Check.Label>
                              Overseas Counsellor
                            </Form.Check.Label>
                          </Form.Check>
                          <Form.Check type='checkbox'>
                            <Form.Check.Input
                              type='checkbox'
                              name='counsellortype'
                              value='subject_expert'
                              {...register('counsellortype', {
                                required: {
                                  value: true,
                                  message: 'Required'
                                }
                              })}
                            />
                            <Form.Check.Label>Subject Expert</Form.Check.Label>
                          </Form.Check>
                        </Form.Group>
                        {/* </div> */}
                      </div>
                      {errors?.counsellortype?.message && (
                        <p className='error-msg text-left'>
                          Select atleast one type
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Form>
      </div>
    </>
  )
}

export default AddCounsellor
