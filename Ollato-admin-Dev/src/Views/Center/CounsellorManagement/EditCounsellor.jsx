import React, { useCallback, useEffect, useRef, useState } from 'react'
/* eslint-disable */
/* Components */
import TitleHeader from '../../../Components/TitleHeader'
import { Form } from 'react-bootstrap'
import Select from 'react-select'
import { Controller, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { useSnackbar } from 'react-notistack'
import { useDispatch, useSelector } from 'react-redux'
import { editSpecificCounsellor, getAllCenters, getSpecificCounsellor } from '../../../Actions/Admin/counsellor'
import { useNavigate, useParams } from 'react-router-dom'
import moment from 'moment'
import { useAddress } from '../../../Shared/Hooks/UseAddress'
import ls from 'localstorage-slim'
import ImageViewer from 'react-simple-image-viewer'
import { validationSchemaCounsellor } from '../../../Shared/Utills/validationschema'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useS3Upload } from '../../../Shared/Hooks/UseS3UPload'
function EditCounsellor() {
  const { enqueueSnackbar } = useSnackbar()
  const params = useParams()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const id = params.id
  const token = localStorage.getItem('token')
  const profile = JSON.parse(localStorage.getItem('profile'))
  const adminType = ls.get('admin-type', { decrypt: true, secret: profile?.id })
  const [fieName, setFileName] = useState('')
  const [currentImage, setCurrentImage] = useState(0)
  const [isViewerOpen, setIsViewerOpen] = useState(false)
  const [type, setType] = useState('')
  const [panCard, setPancard] = useState([])
  const [aFront, setAFront] = useState([])
  const [aBack, setABack] = useState([])
  const [sign, setSign] = useState([])
  const [careercountypecoun, setCareercoun] = useState({
    career_counsellor: false,
    pycho: false,
    overseas: false,
    subject_expert: false
  })

  const statusArray = [
    { id: 1, title: 'approved' },
    { id: 2, title: 'pending' },
    { id: 3, title: 'rejected' }
  ]

  let startdate = moment()
  startdate = startdate.subtract(20, 'years')
  startdate = startdate.format('DD-MM-YYYY')

  // useSelector
  const mainData = useSelector((state) => state.counsellorManAdmin.resData)
  const isConsellorEditedMessage = useSelector((state) => state.counsellorManAdmin.resMessage)
  const isCounsellorEdited = useSelector((state) => state.counsellorManAdmin.isCounsellorEdited)
  const centers = useSelector((state) => state.counsellorManAdmin.centers)
  const dateref = useRef()
  const { getImage } = useS3Upload()


  const openImageViewer = useCallback((index, pan) => {
    setCurrentImage(index)
    setIsViewerOpen(true)
    setType(pan)
  }, [])

  const closeImageViewer = () => {
    setCurrentImage(0)
    setIsViewerOpen(false)
  }

  useEffect(() => {
    if (mainData?.counsellorDetail) {
      async function getImageUrl () {
        const data = [
          {
            path: mainData?.counsellorDetail?.pan_file,
            flag: 'pancard'
          },
          {
            path: mainData?.counsellorDetail?.adhar_card_number_front,
            flag: 'adharFront'
          },
          {
            path: mainData?.counsellorDetail?.adhar_card_number_back,
            flag: 'adharBack'
          },
          {
            path: mainData?.counsellorDetail?.signature,
            flag: 'signature'
          }
        ]
        const result = await getImage(data, token)
        const array = []
        const array2 = []
        const array3 = []
        const array4 = []
        array.push(result?.url?.pancard)
        array2.push(result?.url?.adharFront)
        array3.push(result?.url?.adharBack)
        array4.push(result?.url?.signature)
        setPancard(array)
        setAFront(array2)
        setABack(array3)
        setSign(array4)
      }
      getImageUrl()
    }
  }, [mainData])

  // custom hook
  const { setCountryid, setStateid, countriesArray, statesArray, districtArray } = useAddress()

  const previousProps = useRef({
    mainData,
    isCounsellorEdited
  }).current

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
    getValues,
    reset,
    setValue
    // resetField
  } = useForm({
    resolver: yupResolver(validationSchemaCounsellor)
  })

  useEffect(() => {
    if (adminType === 'super' || adminType === 'sub') {
      dispatch(getSpecificCounsellor(+id, token, 'admin'))
    } else {
      dispatch(getSpecificCounsellor(+id, token, 'center'))
    }
    dispatch(getAllCenters())
  }, [])

  useEffect(() => {
    if (mainData) {
      setCountryid(mainData?.counsellorDetail?.country?.id)
      setStateid(mainData?.counsellorDetail?.state?.id)
      setCareercoun({
        career_counsellor: mainData?.counsellor?.career_counsellor === '1',
        pycho: mainData?.counsellor?.psychologist === '1',
        overseas: mainData?.counsellor?.overseas_counsellor === '1',
        subject_expert: mainData?.counsellor?.subject_expert === '1'
      })
      reset({
        firstName: mainData?.counsellor?.first_name,
        middleName: mainData?.counsellor?.middle_name,
        lastName: mainData?.counsellor?.last_name,
        email: mainData?.counsellor?.email,
        dob: moment(mainData?.counsellor?.dob).format('YYYY-MM-DD'),
        mobileNumber: mainData?.counsellor?.mobile,
        pin_code: mainData?.counsellorDetail?.pin_code,
        commision: mainData?.counsellor?.commission,
        country: {
          id: mainData?.counsellorDetail?.country?.id,
          title: mainData?.counsellorDetail?.country?.title
        },
        center: {
          id: mainData?.counsellor?.center_id !== null ? centers?.find((i) => i.id === mainData?.counsellor?.center_id)?.id : '',
          title:
            mainData?.counsellor?.center_id !== null
              ? centers?.find((i) => i.id === mainData?.counsellor?.center_id)?.title
              : 'Select Center'
        },
        state: {
          id: mainData?.counsellorDetail?.state?.id,
          title: mainData?.counsellorDetail?.state?.title
        },
        district: {
          id: mainData?.counsellorDetail?.city?.id,
          title: mainData?.counsellorDetail?.city?.title
        },
        professional_expertness: mainData?.counsellorDetail?.professional_expertness,
        status: {
          id: statusArray?.find((i) => i.title === mainData?.counsellor?.status)?.id,
          title: mainData?.counsellor?.status
        }
      })
      if( !mainData?.counsellor?.center_id) {
        setValue("center","")
      }
    }
  }, [mainData, centers])

  useEffect(() => {
    if (previousProps?.isCounsellorEdited !== isCounsellorEdited) {
      if (isCounsellorEdited) {
        enqueueSnackbar(`${isConsellorEditedMessage}`, {
          variant: 'success',
          hide: 2000,
          autoHide: true
        })
        if (adminType === 'center') {
          navigate('/center/counsellor-management')
        } else {
          navigate('/admin/counsellor-management')
        }
        reset()
      } else if (isCounsellorEdited === false) {
        enqueueSnackbar(`${isConsellorEditedMessage}`, {
          variant: 'error',
          hide: 2000,
          autoHide: true,
          TransitionComponent: 'Fade'
        })
      }
    }
    return () => {
      previousProps.isCounsellorEdited = isCounsellorEdited
    }
  }, [isCounsellorEdited])

  
  const onSubmit = (data) => {
    const formData = new FormData()
    formData.append('first_name', data.firstName)
    formData.append('counsellor_id', id)
    formData.append('middle_name', data.middleName)
    formData.append('last_name', data.lastName)
    formData.append('email', data?.email)
    formData.append('mobile', data.mobileNumber)
    formData.append('dob', data.dob)
    formData.append('country_id', data.country.id)
    formData.append('state_id', data.state.id)
    formData.append('city_id', data.district.id)
    formData.append('pin_code', data.pin_code)
    formData.append('center_id', data?.center?.id ? data?.center?.id : null)
    formData.append('counsellor_status', data.status.title)
    formData.append('commission', data.commision)
    formData.append('professional_expertness', data.professional_expertness)
    formData.append('career_counsellor', careercountypecoun.career_counsellor ? 1 : 0)
    formData.append('psychologist', careercountypecoun.pycho ? 1 : 0)
    formData.append('overseas_counsellor', careercountypecoun.overseas ? 1 : 0)
    formData.append('subject_expert', careercountypecoun.subject_expert ? 1 : 0)
    if (fieName) {
      formData.append('resume', fieName[0])
    } else {
      formData.append('resume', mainData?.counsellorDetail?.resume)
    }

    if (formData) {
      if (adminType === 'super' || adminType === 'sub') {
        dispatch(editSpecificCounsellor(formData, token, 'admin'))
      } else {
        dispatch(editSpecificCounsellor(formData, token, 'center'))
      }
    }
  }

  const onSelectFile = (e) => {
    setFileName(e.target.files)
  }

  return (
    <>
      {/* <Header /> */}
      <TitleHeader name='Edit' title='Edit Counsellor' />
      <div className='main-layout whitebox-layout my-editprofile-page'>
        <Form className='light-bg' onSubmit={handleSubmit(onSubmit)}>
          <div className='heading-box'>
            <h5>Edit counsellor</h5>
            <div className='btn-box'>
              <button type='button' className='theme-btn dark-btn text-none' onClick={() => navigate(-1)}>
                Cancel
              </button>
              <button type='submit' className='theme-btn text-none'>
                Save
              </button>
            </div>
          </div>
          <div className='light-bg-box'>
            <div className='row'>
              <div className='col-xxl-12'>
                <div className='row'>
                  <div className='col-lg-12'>
                    <h4>Counsellor Details</h4>
                  </div>
                  <div className='col-lg-6'>
                    <Form.Group className={`form-group ${errors?.firstName?.message ? 'error-occured' : ''}`} controlId='firstName'>
                      <Form.Label>First Name</Form.Label>
                      <Form.Control placeholder='Enter First Name' type='text' {...register('firstName', { required: true })} />
                      {errors?.firstName?.message && <Form.Text className='error-msg'>{errors?.firstName?.message}</Form.Text>}
                    </Form.Group>
                  </div>
                  <div className='col-lg-6'>
                    <Form.Group className={`form-group ${errors?.middleName?.message ? 'error-occured' : ''}`} controlId='firstName'>
                      <Form.Label>Middle Name</Form.Label>
                      <Form.Control placeholder='Enter Middle Name' type='text' {...register('middleName', { required: true })} />
                      {errors?.middleName?.message && <Form.Text className='error-msg'>{errors?.middleName?.message}</Form.Text>}
                    </Form.Group>
                  </div>
                  <div className='col-lg-6'>
                    <Form.Group className={`form-group ${errors?.lastName?.message ? 'error-occured' : ''}`} controlId='lastName'>
                      <Form.Label>Last Name</Form.Label>
                      <Form.Control placeholder='Enter Last Name' type='text' {...register('lastName', { required: true })} />
                      {errors?.lastName?.message && <Form.Text className='error-msg'>{errors?.lastName?.message}</Form.Text>}
                    </Form.Group>
                  </div>
                  <div className='col-lg-6'>
                    <Form.Group className='form-group' controlId='dob'>
                      <Form.Label>Date Of Birth</Form.Label>
                      <Controller
                        control={control}
                        name='dob'
                        render={(props) => (
                          <Form.Control type='date' max={startdate} name={name} {...register('dob', { required: true })} />
                        )}
                      />
                    </Form.Group>
                  </div>
                  <div className='col-lg-6'>
                    <Form.Group controlId='formBasicEmail' className={`form-group ${errors?.mobileNumber?.message ? 'error-occured' : ''}`}>
                      <Form.Label>Mobile Number</Form.Label>
                      <Form.Control placeholder='Enter Mobile Number' type='text' {...register('mobileNumber', { required: true })} />
                      {errors?.mobileNumber?.message && <Form.Text className='error-msg'>{errors?.mobileNumber?.message} </Form.Text>}
                    </Form.Group>
                  </div>
                  <div className='col-lg-6'>
                    <Form.Group className={`form-group ${errors?.email?.message ? 'error-occured' : ''}`} controlId='formBasicEmail'>
                      <Form.Label>Email ID</Form.Label>
                      <div className='position-relative'>
                        <Form.Control placeholder='Enter Email ID' type='email' {...register('email')} />
                      </div>
                      {errors?.email?.message &&
                       <Form.Text className='error-msg'>{errors?.email?.message} </Form.Text>}
                    </Form.Group>
                  </div>

                  <div className='col-lg-6'>
                    <Form.Group className='form-group common-select-style' controlId='formfullname'>
                      <Form.Label>Status</Form.Label>
                      <Controller
                        name='status'
                        control={control}
                        render={({ field }) => (
                          <Select
                            {...field}
                            options={statusArray}
                            placeholder={'Select Professional Expertness'}
                            isSearchable={false}
                            className='react-dropdown'
                            classNamePrefix='dropdown'
                            getOptionLabel={(option) => option?.title}
                            getOptionValue={(option) => option?.id}
                            isDisabled={adminType === 'center'}
                          />
                        )}
                      />
                    </Form.Group>
                  </div>
                  {adminType !== 'center' && (
                    <div className='col-lg-6'>
                      <div className=''>
                      <Form.Group className='form-group common-select-style' controlId='formfullname'>
                        <Form.Label>Center</Form.Label>
                        <div className='clear_dropdown'>
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
                        {mainData?.counsellor?.center_id &&
                        <button type="button" onClick={()=> setValue('center', '')}>
                        <FontAwesomeIcon icon="fas fa-times" />
                        </button> }
                        </div>
                      </Form.Group>
                      </div>
                    </div>
                  )}
                  <div className='col-lg-6'>
                    <Form.Group controlId='formBasicEmail' className={`form-group ${errors?.mobileNumber?.message ? 'error-occured' : ''}`}>
                      <Form.Label>Commision (%)</Form.Label>
                      <Form.Control
                        placeholder='Enter Commision'
                        type='text'
                        {...register('commision', { required: true })}
                        disabled={mainData?.counsellor?.center_id !== null}
                      />
                      {errors?.commision?.message && <Form.Text className='error-msg'>{errors?.commision?.message} </Form.Text>}
                    </Form.Group>
                  </div>
                  <div className='col-lg-12'>
                    <div className='row'>
                      <div className='col-md-6'>
                        <div className='row'>
                          <div className='col-xl-6'>
                            <Form.Group className='form-group common-select-style' controlId='formfullname'>
                              <Form.Label>Country</Form.Label>
                              <Controller
                                name='country'
                                control={control}
                                render={({ field }) => {
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
                              <p className='error-msg'>{errors?.country?.message || errors?.country?.id?.message}</p>
                            </Form.Group>
                          </div>
                          <div className='col-xl-6'>
                            <Form.Group className='form-group common-select-style' controlId='formfullname'>
                              <Form.Label>State</Form.Label>
                              <Controller
                                name='state'
                                control={control}
                                render={({ field }) => {
                                  return (
                                    <Select
                                      placeholder={'Select State'}
                                      ref={dateref}
                                      className='react-dropdown'
                                      classNamePrefix='dropdown'
                                      options={statesArray}
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
                              <p className='error-msg'>{errors?.state?.message || errors?.state?.id?.message}</p>
                            </Form.Group>
                          </div>
                        </div>
                      </div>
                      <div className='col-md-6'>
                        <div className='row'>
                          <div className='col-xl-6'>
                            <Form.Group className='form-group common-select-style' controlId='formfullname'>
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
                                    />
                                  )
                                }}
                              />
                              <p className='error-msg'>{errors?.district?.message || errors?.district?.id?.message}</p>
                            </Form.Group>
                          </div>
                          <div className='col-xl-6'>
                            <Form.Group className='form-group' controlId='formpincode1' name='pin_code'>
                              <Form.Label>PIN Code</Form.Label>
                              <Form.Control type='text' placeholder='Enter Pin Code' {...register('pin_code')} />
                            </Form.Group>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className='col-lg-6'>
                    <Form.Group
                      className={`form-group ${errors?.professional_expertness?.message ? 'error-occured' : ''}`}
                      controlId='firstName'
                    >
                      <Form.Label>Professional Expertness</Form.Label>
                      <Form.Control
                        placeholder='Enter Expertness'
                        type='text'
                        {...register('professional_expertness', {
                          required: true
                        })}
                      />
                      {errors?.professional_expertness?.message && (
                        <Form.Text className='error-msg'>{errors?.professional_expertness?.message}</Form.Text>
                      )}
                    </Form.Group>
                  </div>
                  <div className='col-lg-6'>
                    <Form.Group controlId='formFile' className='form-group resume-file-input d-flex flex-wrap flex-column '>
                      <Form.Label>File</Form.Label>
                      {mainData?.counsellorDetail?.resume && (
                        <a
                          href={`${process.env.REACT_APP_AXIOS_BASE_URL}${mainData?.counsellorDetail?.resume}`}
                          style={fieName ? { pointerEvents: 'none' } : null}
                          target='_blank'
                          rel='noreferrer'
                        >
                          {fieName ? fieName[0]?.name : 'Resume'}
                        </a>
                      )}
                    </Form.Group>
                    <div className='fixed-size '>
                      <Form.Control
                        type='file'
                        title='Upload Resume'
                        className='file-btn d-inline'
                        name='files'
                        accept='application/pdf,application/msword'
                        onChange={(e) => onSelectFile(e)}
                      />
                      <button className='browse-btn theme-btn btn'>Browse</button>
                    </div>
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
                              checked={careercountypecoun.career_counsellor}
                              onChange={() =>
                                setCareercoun({
                                  ...careercountypecoun,
                                  career_counsellor: !careercountypecoun.career_counsellor
                                })
                              }

                              // checked={profileData?.career_counsellor === '1'}
                            />
                            <Form.Check.Label>Career Counsellor</Form.Check.Label>
                          </Form.Check>
                          <Form.Check type='checkbox'>
                            <Form.Check.Input
                              name='counsellortype'
                              type='checkbox'
                              checked={careercountypecoun.pycho}
                              onChange={() =>
                                setCareercoun({
                                  ...careercountypecoun,
                                  pycho: !careercountypecoun.pycho
                                })
                              }
                            />
                            <Form.Check.Label>Psychologist</Form.Check.Label>
                          </Form.Check>
                          <Form.Check type='checkbox'>
                            <Form.Check.Input
                              type='checkbox'
                              name='counsellortype'
                              checked={careercountypecoun.overseas}
                              onChange={() =>
                                setCareercoun({
                                  ...careercountypecoun,
                                  overseas: !careercountypecoun.overseas
                                })
                              }
                              // checked={profileData?.overseas_counsellor === '1'}
                            />
                            <Form.Check.Label>Overseas Counsellor</Form.Check.Label>
                          </Form.Check>
                          <Form.Check type='checkbox'>
                            <Form.Check.Input
                              type='checkbox'
                              name='counsellortype'
                              checked={careercountypecoun.subject_expert}
                              onChange={() =>
                                setCareercoun({
                                  ...careercountypecoun,
                                  subject_expert: !careercountypecoun.subject_expert
                                })
                              }
                              // checked={profileData?.overseas_counsellor === '1'}
                            />
                            <Form.Check.Label>Subject Expert</Form.Check.Label>
                          </Form.Check>
                        </Form.Group>
                        {/* </div> */}
                      </div>
                      {!careercountypecoun.subject_expert &&
                      !careercountypecoun.career_counsellor &&
                      !careercountypecoun.pycho &&
                      !careercountypecoun.overseas ? (
                        <p className='error-msg text-left'>Select atleast one type</p>
                      ) : null}
                    </div>
                  </div>
                  <h4>Other Details</h4>
                  <div className='col-xl-6'>
                    <Form.Group className='form-group common-select-style' controlId='formState'>
                      <Form.Label>Experience</Form.Label>
                      <Form.Control type='text' value={mainData?.counsellorDetail?.total_experience || '-'} disabled />
                    </Form.Group>
                  </div>
                  <div className='col-xl-6'>
                    <Form.Group className='form-group common-select-style' controlId='formState'>
                      <Form.Label>High Qualification</Form.Label>
                      <Form.Control type='text' value={mainData?.counsellorDetail?.high_qualification?.title || '-'} disabled />
                    </Form.Group>
                  </div>
                  <div className='col-xl-6'>
                    <Form.Group className='form-group common-select-style' controlId='formState'>
                      <Form.Label>Last Qualification</Form.Label>
                      <Form.Control type='text' value={mainData?.counsellorDetail?.last_qualification?.title || '-'} disabled />
                    </Form.Group>
                  </div>
                  <div className='col-xl-6'>
                    <Form.Group className='form-group common-select-style' controlId='formState'>
                      <Form.Label>Certification</Form.Label>
                      <Form.Control
                        type='text'
                        value={
                          mainData?.counsellorDetail?.certificate_qualification?.title
                            ? mainData?.counsellorDetail?.certificate_qualification?.title +
                              ' ' +
                              mainData?.counsellorDetail?.certificate_university?.title
                            : '-'
                        }
                        disabled
                      />
                    </Form.Group>
                  </div>
                  <div className='row'>
                    <div className='col-xl-12 rowspacer'>
                      <div className=''>
                        <div className='row'>
                          <div className='col-xl-4'>
                            <div className='d-xl-block d-flex flex-wrap justify-content-between mb-sm-20'>
                              <label>Pan Card Number</label>
                              <h5>{mainData?.counsellorDetail?.pan_number || '-'}</h5>
                            </div>
                          </div>
                          <div className='col-xl-4 '>
                            <div className=''>
                              <label>Pan Card</label>
                              <div
                                className={
                                  mainData?.counsellorDetail?.pan_file !== null ? 'aadhar-box d-flex flex-wrap' : 'd-flex flex-wrap'
                                }
                              >
                                {mainData?.counsellorDetail?.pan_file !== null ? (
                                  <img
                                    className='m-0'
                                    src={panCard}
                                    alt='ollato-img'
                                    onClick={() => openImageViewer(0, 'pan')}
                                  />
                                ) : (
                                  <h5>-</h5>
                                )}
                              </div>
                            </div>
                            {isViewerOpen && (
                              <ImageViewer
                                src={type === 'pan' ? panCard : type === 'front' ? aFront : type === 'sign' ? sign : aBack}
                                currentIndex={currentImage}
                                onClose={closeImageViewer}
                                disableScroll={false}
                                backgroundStyle={{
                                  backgroundColor: 'rgba(0,0,0,0.9)',
                                  zIndex: 99999
                                }}
                                closeOnClickOutside={true}
                                style={{
                                  width: '10% !important',
                                  height: '10% !important'
                                }}
                              />
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className='col-xl-12 rowspacer'>
                      <div className=''>
                        <div className='row'>
                          <div className='col-xl-4'>
                            <div className='d-xl-block d-flex flex-wrap justify-content-between  mb-sm-20'>
                              <label>Aadhar Card Number</label>
                              <h5>{mainData?.counsellorDetail?.adhar_card_number || '-'}</h5>
                            </div>
                          </div>
                          <div className='col-xl-4 '>
                            <div className=''>
                              <label>Aadhar Card</label>
                              <div
                                className={
                                  mainData?.counsellorDetail?.adhar_card_number_front !== null
                                    ? 'aadhar-box d-flex flex-wrap'
                                    : 'd-flex flex-wrap'
                                }
                              >
                                {mainData?.counsellorDetail?.adhar_card_number_front !== null ? (
                                  <img
                                    src={aFront}
                                    onClick={() => openImageViewer(0, 'front')}
                                    alt='ollato-img'
                                  />
                                ) : (
                                  <h5>-</h5>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className='col-xl-4 '>
                            <div className=''>
                              <label>Aadhar Card</label>
                              <div
                                className={
                                  mainData?.counsellorDetail?.adhar_card_number_back !== null
                                    ? 'aadhar-box d-flex flex-wrap'
                                    : 'd-flex flex-wrap'
                                }
                              >
                                {mainData?.counsellorDetail?.adhar_card_number_back !== null ? (
                                  <img
                                    src={aBack}
                                    onClick={() => openImageViewer(0, 'back')}
                                    alt='ollato-img'
                                  />
                                ) : (
                                  <h5>-</h5>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className='col-xl-12 rowspacer'>
                      <div className=''>
                        <div className='row'>
                          <div className='col-xl-4'>
                            <div className='d-xl-block d-flex flex-wrap justify-content-between mb-sm-20'>
                              <label>GST No</label>
                              <h5>{mainData?.counsellorDetail?.gst_no || '-'}</h5>
                            </div>
                          </div>
                          <div className='col-xl-4 '>
                            <div className=''>
                              <label>Signature</label>
                              <div
                                className={
                                  mainData?.counsellorDetail?.signature !== null ? 'aadhar-box d-flex flex-wrap' : 'd-flex flex-wrap'
                                }
                              >
                                {mainData?.counsellorDetail?.signature !== null ? (
                                  <img
                                    src={sign}
                                    onClick={() => openImageViewer(0, 'sign')}
                                    alt='ollato-img'
                                  />
                                ) : (
                                  <h5>-</h5>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
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

export default EditCounsellor
