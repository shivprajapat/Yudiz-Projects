import React, { useState, useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { Button, Form } from 'react-bootstrap'
import Select from 'react-select'
import { useForm, Controller } from 'react-hook-form'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import moment from 'moment'
import { useSnackbar } from 'react-notistack'

/* Components */
import TitleHeader from '../../../Components/TitleHeader'
import crossWhite from '../../../assets/images/crosswhite.svg'
import otherdocPlaceholder from '../../../assets/images/other-img-placeholder.svg'
// import pancard from '../../../assets/images/pancard-img.png'

import defaultimage from '../../../assets/images/default.jpeg'
// import sign from '../../../assets/images/sign.svg'

// import { Controller } from 'react-hook-form'
// import profilePlaceholder from '../../../assets/images/profile-placeholder.svg'

import { useAddress } from '../../../Shared/Hooks/UseAddress'

// Action Files
import { getCounsellorDataAction, editCounsellorProfileAction } from '../../../Actions/Counsellor/dashboard'
import {
  GetAllUniversityData,
  GetQualificationAction
} from '../../../Actions/auth'
import { useS3Upload } from '../../../Shared/Hooks/UseS3UPload'

// Regex
const phoneRegex = /^(\+\d{1,3}[- ]?)?\d{10}$/
const emailRegex = /.+@.+\.[A-Za-z]+$/
const panCard = /([A-Z]){5}([0-9]){4}([A-Z]){1}$/
const aadharCard = /^\d{4}\s\d{4}\s\d{4}$/
// const gstNo = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/

// startdate
let startdate = moment()
startdate = startdate.subtract(15, 'years')
startdate = startdate.format('YYYY-MM-DD')

const validationSchema = yup.object().shape({
  firstName: yup.string()
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
  lastName: yup.string().required('Middle Name is required')
    .min(2, 'Last Name must be at least 2 characters')
    .max(20, 'Last Name must be at most 20 characters')
    .matches(/^[a-zA-z]+([\s][a-zA-Z]+)*$/, 'Special Characters & Numeric value are not allowed'),
  dob: yup
    .date()
    .required('Date of Birth is required')
    .typeError('Date of Birth is required')
    .max(startdate, 'Enter valid date'),
  mobileNumber: yup
    .string()
    .required('Mobile Number is required')
    .matches(phoneRegex, 'Enter valid Mobile Number'),
  email: yup
    .string()
    .required('Email is required')
    .matches(emailRegex, 'Enter valid E-Mail'),
  country: yup
    .object()
    .shape({
      id: yup.string().required('Country is required'),
      title: yup.string().required('Country is required')
    })
    .nullable() // for handling null value when clearing options via clicking "x"
    .required('Country is required'),
  district: yup
    .object()
    .shape({
      title: yup.string().required('District is required'),
      id: yup.string().required('District is required')
    })
    .nullable() // for handling null id when clearing options via clicking "x"
    .required('District is required'),
  state: yup
    .object()
    .shape({
      title: yup.string().required('State is required'),
      id: yup.string().required('State is required')
    })
    .nullable() // for handling null id when clearing options via clicking "x"
    .required('State is required'),
  pincode: yup
    .string()
    .matches(/^[\w]*$/, 'Negative numbers not allowed')
    .min(5, 'Pincode must be greater than & equals to 5 digits')
    .max(10, 'Pincode must be less than & equals to 10 digits')
    .required('Pincode is required'),
  panNo: yup
    .string()
    .required('PanCard number is required')
    .typeError('PanCard number is required')
    .matches(panCard, 'Please enter valid pancard number. for ex. ABCTY1234D'),
  aadharNo: yup
    .string()
    .required('AadharCard number is required')
    .typeError('AadharCard number is required')
    .matches(aadharCard, 'Please enter valid aadhar number. for ex. 1111 1111 1111'),
  gstNo: yup
    .string()
    .nullable(true)
    .matches(
      /^[a-zA-z0-9]*$/,
      'Special Characters and space are not allowed'
    ),
  university: yup
    .object()
    .shape({
      title: yup.string().required('University is required'),
      id: yup.string().required('University is required')
    })
    .nullable() // for handling null id when clearing options via clicking "x"
    .required('University is required'),
  lQualification: yup
    .object()
    .shape({
      title: yup.string().required('Last Qualification is required'),
      id: yup.string().required('Last Qualification is required')
    })
    .nullable() // for handling null id when clearing options via clicking "x"
    .required('Last Qualification is required'),
  universityLast: yup
    .object()
    .shape({
      title: yup.string().required('University is required'),
      id: yup.string().required('University is required')
    })
    .nullable() // for handling null id when clearing options via clicking "x"
    .required('University is required'),
  certificate: yup
    .object()
    .shape({
      title: yup.string().required('Certificate is required'),
      id: yup.string().required('Certificate is required')
    })
    .nullable() // for handling null id when clearing options via clicking "x"
    .required('Certificate is required'),
  certificate_university: yup
    .object()
    .shape({
      title: yup.string().required('University is required'),
      id: yup.string().required('University is required')
    })
    .nullable() // for handling null id when clearing options via clicking "x"
    .required('University is required'),
  panCardFiles: yup
    .mixed()
    .required('File is required')
    .test('required', 'Please select a file', (value) => {
      return value && value.length
    }),
  total_experience: yup
    .string()
    .nullable(true)
    .matches(
      /^(([a-zA-Z0-9]+\s)*[a-zA-Z0-9]+)?$/,
      'Invalid format'
    ),
  professional_expertness: yup
    .string()
    .nullable(true)
    .matches(/^([a-zA-z0-9]+([\s][a-zA-Z0-9]+)*)?$/, 'Special Characters are not allowed')
})

function Editmyprofile () {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { enqueueSnackbar } = useSnackbar()

  const token = localStorage.getItem('token')

  // useState
  const [data, setData] = useState({})
  const [selectedImage, setSelectedFile] = useState()
  const [fieName, setFileName] = useState('')
  const [selectedPanCard, setPanCardImage] = useState()
  const [selectedACardFront, setACardFront] = useState()
  const [selectedACardBack, setACardBack] = useState()
  const [signature, setSignature] = useState()
  const [careerChecked, setCareerChecked] = useState(false)
  const [psyChecked, setPsyChecked] = useState(false)
  const [overChecked, setOverChecked] = useState(false)
  const [studentExpert, setStudentExpert] = useState(false)

  // useSelector
  const profileData = useSelector((state) => state.dashboard.counsellorData)
  const universityData = useSelector((state) => state.auth.universityData)
  const qualificationData = useSelector((state) => state.auth.qData)
  const isProfileUpdatedFlag = useSelector((state) => state.dashboard.isProfileUpdated)
  const resMessageFlag = useSelector((state) => state.dashboard.resMessage)
  const { getImage, uploadFile } = useS3Upload()

  const previousProps = useRef({
    profileData,
    universityData,
    qualificationData,
    isProfileUpdatedFlag,
    resMessageFlag
  }).current

  useEffect(() => {
    // if (location?.state?.id?.id) {
    dispatch(getCounsellorDataAction(token))
    // }
  }, [])

  // useForm
  const {
    control,
    register,
    handleSubmit,
    setValue,
    getValues,
    reset,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(validationSchema)
  })
  const { onChange } = register()

  const { setCountryid, setStateid, countriesArray, statesArray, districtArray } = useAddress()

  useEffect(() => {
    dispatch(GetAllUniversityData(token))
    dispatch(GetQualificationAction(token))
  }, [])

  useEffect(() => {
    if (previousProps?.profileData !== profileData) {
      if (profileData) {
        async function getImageUrl () {
          // if (profileData?.profile_pic) {
          const data = [
            {
              path: profileData?.details?.pan_file,
              flag: 'pancard'
            },
            {
              path: profileData?.details?.adhar_card_number_front,
              flag: 'adharFront'
            },
            {
              path: profileData?.details?.adhar_card_number_back,
              flag: 'adharBack'
            },
            {
              path: profileData?.details?.signature,
              flag: 'signature'
            },
            {
              path: profileData?.details?.profile_picture,
              flag: 'profile_picture'
            }
          ]
          const result = await getImage(data, token)
          setPanCardImage(result?.url?.pancard)
          setACardFront(result?.url?.adharFront)
          setACardBack(result?.url?.adharBack)
          setSignature(result?.url?.signature)
          setSelectedFile(result?.url?.profile_picture)
        }
        getImageUrl()
        setData(profileData)
      }
    }
    return () => {
      previousProps.profileData = profileData
    }
  }, [profileData])

  useEffect(() => {
    if (data) {
      setCountryid(data?.details?.country?.id)
      setStateid(data?.details?.state?.id)
      setCareerChecked(data?.career_counsellor === '1')
      setPsyChecked(data?.psychologist === '1')
      setOverChecked(data?.overseas_counsellor === '1')
      setStudentExpert(data?.subject_expert === '1')

      reset({
        files: data?.details?.profile_picture,
        // resumefiles: data?.resume,
        panCardFiles: `${process.env.REACT_APP_AXIOS_BASE_URL}${data?.details?.pan_file}`,
        firstName: data.first_name,
        lastName: data.last_name,
        middleName: data.middle_name,
        dob: moment(data.dob).format('YYYY-MM-DD'),
        mobileNumber: data.mobile,
        email: data.email,
        pincode: data?.details?.pin_code,
        panNo: data?.details?.pan_number,
        aadharNo: data?.details?.adhar_card_number,
        gstNo: data?.details?.gst_no,
        total_experience: data?.details?.total_experience,
        professional_expertness: data?.details?.professional_expertness,
        country: {
          id: data?.details?.country?.id,
          title: data?.details?.country?.title
        },
        district: {
          id: data?.details?.city?.id,
          title: data?.details?.city?.title
        },
        state: {
          id: data?.details?.state?.id,
          title: data?.details?.state?.title
        },
        university: {
          id: data?.details?.high_university?.id,
          title: data?.details?.high_university?.title
        },
        lQualification: {
          id: data?.details?.last_qualification?.id,
          title: data?.details?.last_qualification?.title
        },
        hQualification: {
          id: data?.details?.high_qualification?.id,
          title: data?.details?.high_qualification?.title
        },
        universityLast: {
          id: data?.details?.last_university?.id,
          title: data?.details?.last_university?.title
        },
        certificate: {
          id: data?.details?.certificate_qualification
            ?.id,
          title: data?.details?.certificate_qualification
            ?.title
        },
        certificate_university: {
          id: data?.details?.certificate_university
            ?.id,
          title: data?.details?.certificate_university
            ?.title
        }
      })
    }
  }, [data])

  const onSubmit = async (data) => {
    if (careerChecked === false && psyChecked === false && overChecked === false && studentExpert === false) {
      return null
    } else {
      const imagePayload = []
      // let result
      const payload = {
        first_name: data?.firstName,
        middle_name: data?.middleName,
        last_name: data?.lastName,
        mobile: data?.mobileNumber,
        email: data?.email,
        dob: moment(data.dob).format('YYYY-MM-DD'),
        country_id: data?.country?.id,
        state_id: data?.state?.id,
        city_id: data?.district?.id,
        pin_code: data?.pincode,
        professional_expertness: data?.professional_expertness,
        resume: fieName ? fieName[0] : profileData?.details?.resume,
        total_experience: data?.total_experience,
        high_qualification_id: Number(data?.hQualification?.id),
        high_university_id: Number(data?.university?.id),
        last_qualification_id: Number(data?.lQualification?.id),
        last_university_id: Number(data?.universityLast?.id),
        certificate_qualification_id: Number(data?.certificate?.id),
        certificate_university_id: Number(data?.certificate_university?.id),
        pan_number: data?.panNo,
        adhar_card_number: data?.aadharNo,
        pancard: profileData?.details?.pan_file,
        adharcard_front: profileData?.details?.adhar_card_number_front,
        adharcard_back: profileData?.details?.adharcard_back,
        signature: profileData?.details?.signature,
        career_counsellor: careerChecked ? '1' : '0',
        psychologist: psyChecked ? '1' : '0',
        overseas_counsellor: overChecked ? '1' : '0',
        subject_expert: studentExpert ? '1' : '0',
        profile_picture: profileData?.details?.profile_picture

      }
      const selections = [
        { selected: selectedPanCard, flag: 'pancard' },
        { selected: selectedACardFront, flag: 'adharcard_front' },
        { selected: selectedACardBack, flag: 'adharcard_back' },
        { selected: signature, flag: 'signature' },
        { selected: selectedImage, flag: 'profile_picture' }
      ]
      for (const selection of selections) {
        const { selected, flag } = selection
        if (typeof selected === 'object') {
          imagePayload.push({
            fileName: selected.name.replace(/\.(\w+)$/, ''),
            sContentType: selected.type,
            flag,
            file: selected
          })
        }
      }
      if (imagePayload.length > 0) {
        const result = await uploadFile(imagePayload)
        if (result?.err) {
          return null
        } else {
          for (const key in result) {
            // if (result.hasOwnProperty(key)) {
            payload[key] = result[key]?.sPath
            // }
          }
        }
      }
      if (payload) {
        dispatch(editCounsellorProfileAction(payload, token))
      }
    }
  }

  const handleImageClose = (e, type) => {
    e.preventDefault()
    switch (type) {
      case 'panCardFile':
        return setPanCardImage(null)
      case 'frontAdharCard':
        return setACardFront(null)
      case 'backAdharCard':
        return setACardBack(null)
      case 'signature':
        return setSignature(null)
      default:
        return null
    }
  }

  const removeImage = (e) => {
    e.preventDefault()
    setSelectedFile(null)
  }

  const onSelectFile = (e) => {
    setFileName(e.target.files)
  }

  // Toastify Notification
  useEffect(() => {
    if (previousProps?.isProfileUpdatedFlag !== isProfileUpdatedFlag) {
      if (isProfileUpdatedFlag === true) {
        enqueueSnackbar(`${resMessageFlag}`, {
          variant: 'success',
          autoHide: true,
          hide: 3000
        })
        navigate('/counsellor/profile')
      } else if (isProfileUpdatedFlag === false) {
        enqueueSnackbar(`${resMessageFlag}`, {
          variant: 'error',
          autoHide: true,
          hide: 3000
        })
      }
    }
    return () => {
      previousProps.isProfileUpdatedFlag = isProfileUpdatedFlag
    }
  }, [isProfileUpdatedFlag])

  return (
    <>
          <TitleHeader name='Edit' title='My Profile' />
          <div className='main-layout whitebox-layout my-editprofile-page'>
            <Form onSubmit={handleSubmit(onSubmit)}>
              <div className='profilebutton-box text-end'>
                <Button
                  className='theme-btn text-none d-inline-block'
                  type='submit'
                >
                  Save
                </Button>
              </div>
              <div className='light-bg-box'>
                <div className='row'>
                  <div className='col-xxl-3 profile-update'>
                  <Form.Group
                  controlId='formFile'
                  className='form-group profile-picture common-input-file d-flex justify-content-center'
                >
                  <div className='close-dp'>
                    <Form.Control
                      type='file'
                      className='hidden-file'
                      name='files'
                      accept='image/*'
                      {...register('files', { required: true })}
                      onChange={(e) => {
                        onChange(e)
                        setSelectedFile(e.target.files[0])
                      }}
                    />
                    <div className='form-control d-flex align-items-center flex-column justify-content-center text-center '>
                      <div className='img-box'>
                        {/* {selectedImage
                            ? ( */}
                        <img
                          src={
                            selectedImage === null
                              ? defaultimage
                              : typeof selectedImage === 'string'
                                ? selectedImage
                                : typeof selectedImage === 'object'
                                  ? URL.createObjectURL(selectedImage)
                                  : null
                          }
                          alt='profile-pic'
                        />
                      </div>
                    </div>
                    <button
                      onClick={(e) => removeImage(e)}
                      className='dp-remove'
                    >
                      <img src={crossWhite} alt='' />
                    </button>
                  </div>
                </Form.Group>

                  </div>
                  <div className='col-xxl-9 '>
                    <div className='row'>
                      <div className='col-lg-12'>
                        <h4>Counsellor Details</h4>
                      </div>
                      <div className='col-lg-6'>
                        <Form.Group
                          className={`form-group ${
                            errors.firstName?.message ? 'error-occured' : ''
                          }`}
                          controlId='formfirstname'
                        >
                          <Form.Label>First Name</Form.Label>
                          <Form.Control
                            type='text'
                            {...register('firstName', { required: true })}
                          />
                          {errors.firstName?.message && (
                            <Form.Text className='error-msg'>
                              {errors.firstName?.message}{' '}
                            </Form.Text>
                          )}
                        </Form.Group>
                      </div>
                      <div className='col-lg-6'>
                        <Form.Group
                          className={`form-group ${
                            errors.middleName?.message ? 'error-occured' : ''
                          }`}
                          controlId='formmiddlename'
                        >
                          <Form.Label>Middle Name</Form.Label>
                          <Form.Control
                            type='text'
                            {...register('middleName', { required: true })}
                            placeholder='Enter Middle Name'
                          />
                          {errors.middleName?.message && (
                            <Form.Text className='error-msg'>
                              {errors.middleName?.message}{' '}
                            </Form.Text>
                          )}
                        </Form.Group>
                      </div>
                      <div className='col-lg-6'>
                        <Form.Group
                          className={`form-group ${
                            errors.lastName?.message ? 'error-occured' : ''
                          }`}
                          controlId='formlastname'
                        >
                          <Form.Label>Last Name</Form.Label>
                          <Form.Control
                            type='text'
                            {...register('lastName', { required: true })}
                          />
                          {errors.lastName?.message && (
                            <Form.Text className='error-msg'>
                              {errors.lastName?.message}{' '}
                            </Form.Text>
                          )}
                        </Form.Group>
                      </div>
                      <div className='col-lg-6'>
                        <Form.Group
                          className={`form-group ${
                            errors.dob?.message ? 'error-occured' : ''
                          }`}
                          controlId='formdate'
                        >
                          <Form.Label>Date Of Birth</Form.Label>
                          <Controller
                            control={control}
                            name='dob'
                            render={(props) => (
                              <Form.Control
                                type='date'
                                name={name}
                                max={startdate}
                                onChange={(e) => {
                                  onChange(e)
                                  setValue('dob', e.target.value)
                                }}
                                {...register('dob', { required: true })}
                              />
                            )}
                          />
                          {errors.dob?.message && (
                            <Form.Text className='error-msg'>
                              {errors.dob?.message}{' '}
                            </Form.Text>
                          )}
                        </Form.Group>
                      </div>
                      <div className='col-lg-6'>
                        <Form.Group
                          className={`form-group ${
                            errors.mobileNumber?.message ? 'error-occured' : ''
                          }`}
                          controlId='formBasicmobile'
                        >
                          <Form.Label>Mobile Number</Form.Label>
                          <div className='position-relative'>
                            <Form.Control
                              type='text'
                              {...register('mobileNumber', { required: true })}
                            />
                          </div>
                          {errors.mobileNumber?.message && (
                            <Form.Text className='error-msg'>
                              {errors.mobileNumber?.message}{' '}
                            </Form.Text>
                          )}
                        </Form.Group>
                      </div>
                      <div className='col-lg-6'>
                        <Form.Group
                          className={`form-group ${
                            errors.email?.message ? 'error-occured' : ''
                          }`}
                          controlId='formBasicEmail'
                        >
                          <Form.Label>Email ID</Form.Label>
                          <div className='position-relative'>
                            <Form.Control
                              type='text'
                              {...register('email', { required: true })}
                            />
                          </div>
                          {errors.email?.message && (
                            <Form.Text className='error-msg'>
                              {errors.email?.message}{' '}
                            </Form.Text>
                          )}
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
                                    render={({
                                      field: { onChange, value = {} }
                                    }) => {
                                      return (
                                        <Select
                                          placeholder={'Select Country'}
                                          className='react-dropdown'
                                          classNamePrefix='dropdown'
                                          options={countriesArray}
                                          isSearchable={true}
                                          getOptionLabel={(option) =>
                                            option?.title
                                          }
                                          getOptionValue={(option) =>
                                            option?.id
                                          }
                                          value={value || getValues().country}
                                          onChange={(e) => {
                                            onChange(e)
                                            setCountryid(e.id)
                                          }}
                                        />
                                      )
                                    }}
                                  />
                                  <p className='error-msg'>
                                    {errors.country?.message ||
                                      errors.country?.title.message}
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
                                          placeholder={'Select State'}
                                          className='react-dropdown'
                                          classNamePrefix='dropdown'
                                          options={statesArray}
                                          isSearchable={true}
                                          getOptionLabel={(option) => option?.title}
                                          getOptionValue={(option) => option?.id}
                                          value={field.value || getValues().state}
                                          onChange={(e) => {
                                            field.onChange(e)
                                            setStateid(e.id)
                                            setValue('district', '')
                                          }}
                                        />
                                      )
                                    }}
                                  />

                                </Form.Group>
                                <p className='error-msg'>
                                  {errors.state?.message ||
                                    errors.state?.title.message}
                                </p>
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
                                          isSearchable={true}
                                          getOptionLabel={(option) =>
                                            option?.title
                                          }
                                          getOptionValue={(option) =>
                                            option?.id
                                          }
                                        />
                                      )
                                    }}
                                  />
                                </Form.Group>
                                <p className='error-msg'>
                                  {errors.district?.message ||
                                    errors.district?.title.message}
                                </p>
                              </div>
                              <div className='col-xl-6'>
                                <Form.Group
                                  className={`form-group ${
                                    errors.pincode?.message
                                      ? 'error-occured'
                                      : ''
                                  }`}
                                  controlId='formpincode1'
                                >
                                  <Form.Label>PIN Code</Form.Label>
                                  <Form.Control
                                    type='number'
                                    {...register('pincode', { required: true })}
                                  />
                                  {errors.pincode?.message && (
                                    <Form.Text className='error-msg'>
                                      {errors.pincode?.message}{' '}
                                    </Form.Text>
                                  )}
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
                      className='form-group resume-file-input d-flex flex-wrap flex-column '
                    >
                      <Form.Label>File</Form.Label>
                     <div className='form-control resume-field'>
                     {profileData?.details?.resume &&
                      <a
                        href={`${process.env.REACT_APP_AXIOS_BASE_URL}${profileData?.details?.resume}`}
                        style={fieName ? { pointerEvents: 'none' } : null}
                        target='_blank'
                        rel='noreferrer'
                      >
                        {fieName
                          ? fieName[0]?.name
                          : 'Resume'}
                      </a>}
                      <div className='fixed-size'>
                      <Form.Control
                        type='file'
                        title='Upload Resume'
                        className='file-btn d-inline'
                        name='files'
                        accept='application/pdf,application/msword'
                        onChange={(e) => onSelectFile(e)}
                      />
                      <button className='browse-btn theme-btn btn'>
                        Browse
                      </button>
                    </div>
                     </div>
                    </Form.Group>
                  </div>
                      <div className='col-lg-12'>
                        <h4>Experience Details</h4>
                      </div>
                      <div className='col-lg-12'>
                        <div className='row'>
                          <div className='col-md-6'>
                            <div className='row'>

                        <Form.Group
                          className={`form-group ${
                            errors.total_experience?.message ? 'error-occured' : ''
                          }`}
                          controlId='formmiddlename'
                        >
                          <Form.Label>Experience Detail</Form.Label>
                          <Form.Control
                            type='text'
                            {...register('total_experience', { required: true })}
                            placeholder='E.g. 11 years 3 months'
                          />
                          {errors.total_experience?.message && (
                            <Form.Text className='error-msg'>
                              {errors.total_experience?.message}{' '}
                            </Form.Text>
                          )}
                        </Form.Group>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className='row'>
                        <div className='col-lg-12'>
                          <h4>Counsellor Details</h4>
                        </div>
                        <div className='col-lg-6'>
                          <Form.Group
                            className={`form-group ${errors.panNo?.message ? 'error-occured' : ''}`}
                            controlId='HighestQualification '
                          >
                            <Form.Label> Pan card number</Form.Label>
                            <Form.Control
                              type='text'
                            placeholder="Enter Pan Card Number"
                              {...register('panNo', { required: true })}
                            />
                            {errors.panNo?.message && (
                              <Form.Text className='error-msg'>
                                {errors.panNo?.message}{' '}
                              </Form.Text>
                            )}
                          </Form.Group>
                        </div>
                        <div className='col-lg-6'>
                          <Form.Group className={`form-group ${errors.aadharNo?.message ? 'error-occured' : ''}`} controlId="formaadharcardnumber">
                          <Form.Label>Aadhar Card Number</Form.Label>
                          <Form.Control
                            type="text"
                            placeholder="Enter Aadhar Card Number"
                            name={name}
                            onChange={(e) => { onChange(e) }}
                            {...register('aadharNo', { required: true })}
                          />
                          <p className="error-msg">{errors.aadharNo?.message || errors.aadharNo?.label.message}</p>
                        </Form.Group>
                        </div>
                        <div className='col-lg-6'>
                          <Form.Group className={`form-group ${errors.gstNo?.message ? 'error-occured' : ''}`} controlId="formgstnumber">
                          <Form.Label>GST No</Form.Label>
                          <Form.Control
                              type="text"
                              placeholder="Enter GST No"
                              name={name}
                              onChange={(e) => { onChange(e) }}
                              {...register('gstNo', { required: true })}
                          />
                        <p className="error-msg">{errors.gstNo?.message || errors.gstNo?.label.message}</p>
                        </Form.Group>
                        </div>
                        <div className='col-lg-6'>
                          <Form.Group
                            className='form-group common-select-style'
                            controlId='HighestQualification '
                          >
                            <Form.Label>High Qualification</Form.Label>
                            <Controller
                              name='hQualification'
                              control={control}
                              render={({ field: { onChange, value = {} } }) => (
                                <Select
                                  isClearable
                                  isSearchable={false}
                                  placeholder={'Select High Qualification'}
                                  className='react-dropdown'
                                  classNamePrefix='dropdown'
                                  options={qualificationData}
                                  getOptionLabel={(option) => option?.title}
                                  getOptionValue={(option) => option?.id}
                                  value={value || getValues().hQualification}
                                  onChange={(e) => {
                                    onChange(e)
                                  }}
                                />
                              )}
                            />
                          </Form.Group>
                          <p className='error-msg'>
                            {errors.hQualification?.message ||
                              errors.hQualification?.label.message}
                          </p>
                        </div>
                        <div className='col-lg-6'>
                          <Form.Group
                            className='form-group common-select-style'
                            controlId='UniversityInstitution'
                          >
                            <Form.Label>University/Institution</Form.Label>
                            <Controller
                              name='university'
                              control={control}
                              render={({ field: { onChange, value = {} } }) => (
                                <Select
                                  isClearable
                                  isSearchable={true}
                                  placeholder={'Select University'}
                                  className='react-dropdown'
                                  classNamePrefix='dropdown'
                                  options={universityData}
                                  getOptionLabel={(option) => option?.title}
                                  getOptionValue={(option) => option?.id}
                                  value={value || getValues().university}
                                  onChange={(e) => {
                                    onChange(e)
                                  }}
                                />
                              )}
                            />
                            <p className='error-msg'>
                              {errors.university?.message ||
                                errors.university?.title?.message}
                            </p>
                          </Form.Group>
                        </div>
                        <div className='col-lg-6'>
                          <Form.Group
                            className='form-group common-select-style'
                            controlId='HighestQualification '
                          >
                            <Form.Label>Last Qualification</Form.Label>
                            <Controller
                              name='lQualification'
                              control={control}
                              render={({ field: { onChange, value = {} } }) => (
                                <Select
                                  isClearable
                                  isSearchable={false}
                                  placeholder={'Select Last Qualification'}
                                  className='react-dropdown'
                                  classNamePrefix='dropdown'
                                  options={qualificationData}
                                  getOptionLabel={(option) => option?.title}
                                  getOptionValue={(option) => option?.id}
                                  value={value || getValues().lQualification}
                                  onChange={(e) => {
                                    onChange(e)
                                  }}
                                />
                              )}
                            />
                          </Form.Group>
                          <p className='error-msg'>
                            {errors.lQualification?.message ||
                              errors.lQualification?.title.message}
                          </p>
                        </div>
                        <div className='col-lg-6'>
                          <Form.Group
                            className='form-group common-select-style'
                            controlId='UniversityInstitution'
                          >
                            <Form.Label>University/Institution</Form.Label>
                            <Controller
                              name='universityLast'
                              control={control}
                              render={({ field: { onChange, value = {} } }) => (
                                <Select
                                  isClearable
                                  isSearchable={true}
                                  placeholder={'Select University'}
                                  className='react-dropdown'
                                  classNamePrefix='dropdown'
                                  options={universityData}
                                  getOptionLabel={(option) => option?.title}
                                  getOptionValue={(option) => option?.id}
                                  value={value || getValues().universityLast}
                                  onChange={(e) => {
                                    onChange(e)
                                  }}
                                />
                              )}
                            />
                            <p className='error-msg'>
                              {errors.universityLast?.message ||
                                errors.universityLast?.title.message}
                            </p>
                          </Form.Group>
                        </div>
                        <div className='col-lg-6'>
                          <Form.Group
                            className='form-group common-select-style'
                            controlId='HighestQualification '
                          >
                            <Form.Label>Certification</Form.Label>
                            <Controller
                              name='certificate'
                              control={control}
                              render={({ field: { onChange, value = {} } }) => (
                                <Select
                                  isClearable
                                  isSearchable={false}
                                  placeholder={'Select Certificate'}
                                  className='react-dropdown'
                                  classNamePrefix='dropdown'
                                  options={qualificationData}
                                  getOptionLabel={(option) => option?.title}
                                  getOptionValue={(option) => option?.id}
                                  value={value || getValues().certificate}
                                  onChange={(e) => {
                                    onChange(e)
                                  }}
                                />
                              )}
                            />
                          </Form.Group>
                          <p className='error-msg'>
                            {errors.certificate?.message ||
                              errors.certificate?.title.message}
                          </p>
                        </div>
                        <div className='col-lg-6'>
                          <Form.Group
                            className='form-group common-select-style'
                            controlId='UniversityInstitution1'
                          >
                            <Form.Label>University/Institution</Form.Label>
                            <Controller
                              name='certificate_university'
                              control={control}
                              render={({ field: { onChange, value = {} } }) => (
                                <Select
                                  isClearable
                                  isSearchable={true}
                                  placeholder={'Select University'}
                                  className='react-dropdown'
                                  classNamePrefix='dropdown'
                                  options={universityData}
                                  getOptionLabel={(option) => option?.title}
                                  getOptionValue={(option) => option?.id}
                                  value={value || getValues().certificate_university}
                                  onChange={(e) => {
                                    onChange(e)
                                  }}
                                />
                              )}
                            />
                          </Form.Group>
                          <p className='error-msg'>
                            {errors.certificate_university?.message ||
                              errors.certificate_university?.title.message}
                          </p>
                        </div>
                        <div className='col-lg-12'>
                          <h4>KYC Details</h4>
                        </div>
                        <div className='col-lg-12'>
                          <div className='row'>
                            <div className='col-lg-6'>
                              <Form.Group
                                controlId='formgstnumber'
                                className='form-group document-file-input common-input-file  uploaded-doc'
                              >
                                <Form.Label>Upload Pan Card</Form.Label>
                                <Form.Control
                                  type='file'
                                  className='hidden-file'
                                  name='panCardFiles'
                                  {...register('panCardFiles', {
                                    required: true
                                  })}
                                  onChange={(e) => {
                                    onChange(e)
                                    setPanCardImage(e.target.files[0])
                                  }}
                                  accept="image/*"
                                />
                                <div className='form-control d-flex align-items-center flex-column justify-content-center text-center'>
                                  <div className='img-box'>
                                    <>
                                      <img src={typeof selectedPanCard === 'string' ? selectedPanCard : typeof selectedPanCard === 'object' && selectedPanCard !== null ? URL?.createObjectURL(selectedPanCard) : otherdocPlaceholder} alt='' />
                                      {selectedPanCard !== null && <button
                                        className='close-cross-btn'
                                        onClick={(e) =>
                                          handleImageClose(e, 'panCardFile')
                                        }
                                      >
                                        <img src={crossWhite} alt='' />
                                      </button>}
                                    </>
                                  </div>
                                </div>
                              </Form.Group>
                            </div>
                          </div>
                        </div>
                        <div className='col-lg-12'>
                          <div className='row align-items-end'>
                            <div className='col-lg-6'>
                              <Form.Group
                                controlId='formgstnumber'
                                className='form-group document-file-input common-input-file  uploaded-doc'
                              >
                                <Form.Label>Update Aadhar card</Form.Label>
                                <Form.Control
                                  type='file'
                                  className='hidden-file'
                                  accept='image/*'
                                  name='frontAdharCard'
                                  {...register('frontAdharCard', {
                                    required: true
                                  })}
                                  onChange={(e) => {
                                    onChange(e)
                                    setACardFront(e.target.files[0])
                                  }}
                                />
                                <div className='form-control d-flex align-items-center flex-column justify-content-center text-center'>
                                  <div className='img-box'>
                                  <>
                                      <img src={typeof selectedACardFront === 'string' ? selectedACardFront : typeof selectedACardFront === 'object' && selectedACardFront !== null ? URL?.createObjectURL(selectedACardFront) : otherdocPlaceholder} alt='' />
                                      {selectedACardFront !== null
                                        ? <button
                                        className='close-cross-btn'
                                        onClick={(e) =>
                                          handleImageClose(e, 'frontAdharCard')
                                        }
                                      >
                                        <img src={crossWhite} alt='' />
                                      </button>
                                        : null}
                                    </>
                                  </div>
                                </div>
                              </Form.Group>
                            </div>
                            <div className='col-lg-6'>
                              <Form.Group
                                controlId='formgstnumber'
                                className='form-group document-file-input common-input-file  uploaded-doc'
                              >
                                <Form.Control
                                  type='file'
                                  className='hidden-file'
                                  name='backAdharCard'
                                  {...register('backAdharCard', {
                                    required: true
                                  })}
                                  onChange={(e) => {
                                    onChange(e)
                                    setACardBack(e.target.files[0])
                                  }}
                                  accept="image/*"
                                />
                                <div className='form-control d-flex align-items-center flex-column justify-content-center text-center'>
                                  <div className='img-box'>
                                    <>
                                      <img src={typeof selectedACardBack === 'string' ? selectedACardBack : typeof selectedACardBack === 'object' && selectedACardBack !== null ? URL.createObjectURL(selectedACardBack) : otherdocPlaceholder } alt='' />
                                      {selectedACardBack !== null && <button
                                        className='close-cross-btn'
                                        onClick={(e) =>
                                          handleImageClose(e, 'backAdharCard')
                                        }
                                      >
                                        <img src={crossWhite} alt='' />
                                      </button>}
                                    </>
                                  </div>
                                </div>
                              </Form.Group>
                            </div>
                          </div>
                        </div>
                        <div className='col-lg-6'>
                          <Form.Group
                            controlId='formgstnumber'
                            className='form-group document-file-input common-input-file  uploaded-doc'
                          >
                            <Form.Label>Update Signature</Form.Label>
                            <Form.Control
                              type='file'
                              className='hidden-file'
                              name='signature'
                              {...register('signature', {
                                required: true
                              })}
                              onChange={(e) => {
                                onChange(e)
                                setSignature(e.target.files[0])
                              }}
                              accept="image/*"
                            />
                            <div className='form-control d-flex align-items-center flex-column justify-content-center text-center'>
                              <div className='img-box'>
                                <>
                                      <img src={typeof signature === 'string' ? signature : typeof signature === 'object' && signature !== null ? URL.createObjectURL(signature) : otherdocPlaceholder} alt='' />
                                      {signature !== null && <button
                                        className='close-cross-btn'
                                        onClick={(e) =>
                                          handleImageClose(e, 'signature')
                                        }
                                      >
                                        <img src={crossWhite} alt='' />
                                      </button>}
                                    </>
                              </div>
                            </div>
                          </Form.Group>
                        </div>
                        <div className='col-lg-6'>

                        </div>
                        <div className='col-lg-6'>
                        <Form.Group
                            controlId='formgstnumber'
                            className='form-group document-file-input common-input-file  uploaded-doc'
                          >
                            <Form.Label>Types</Form.Label>
                            <Form.Check
                            type='checkbox'
                          >
                            <Form.Check.Input
                              name='is_image'
                              checked={careerChecked}
                              // onChange={(e) => handleCheckboxChange(e, 'career')}
                              onChange={() => {
                                setCareerChecked(!careerChecked)
                              }}
                            />
                              <Form.Check.Label>
                                 Career Counsellor
                              </Form.Check.Label>
                              </Form.Check>
                              <Form.Check
                                type='checkbox'
                              >
                                <Form.Check.Input
                                  name='is_math'
                                  type='checkbox'
                                  checked={psyChecked}
                                  // onChange={(e) => handleCheckboxChange(e, 'career')}
                                  onChange={() => {
                                    setPsyChecked(!psyChecked)
                                  }}
                                />
                              <Form.Check.Label>
                                 Psychologist
                              </Form.Check.Label>
                            </Form.Check>
                            <Form.Check
                              type='checkbox'
                            >
                              <Form.Check.Input
                                type='checkbox'
                                name='is_correct_ans'
                                checked={overChecked}
                                onChange={() => {
                                  setOverChecked(!overChecked)
                                }}
                              />
                                <Form.Check.Label>
                                  Overseas Counsellor
                                </Form.Check.Label>
                                </Form.Check>
                                <Form.Check
                                  type='checkbox'
                                >
                                  <Form.Check.Input
                                    type='checkbox'
                                    name='is_correct_ans'
                                    checked={studentExpert}
                                    onChange={() => {
                                      setStudentExpert(!studentExpert)
                                    }}
                                  />
                                    <Form.Check.Label>
                                      Student Expert Counsellor
                                    </Form.Check.Label>
                                </Form.Check>
                          </Form.Group>
                           {careerChecked === false && psyChecked === false && overChecked === false && studentExpert === false && (
                              <Form.Text className='error-msg'>
                                Please select any one counsellor type
                              </Form.Text>
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

export default Editmyprofile
