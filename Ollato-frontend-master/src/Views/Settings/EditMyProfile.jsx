import React, { useState, useRef, useEffect } from 'react'
import Select from 'react-select'
import { Form } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { useSnackbar } from 'react-notistack'
import { useNavigate } from 'react-router-dom'
import defaultImage from '../../assets/default_profile copy.jpg'

/* Components */
import {
  viewProfileAction,
  getAllBoardsAction,
  getAllCountriesAction,
  getAllDistrictAction,
  getAllGradesAction,
  getAllStatesAction,
  // getAllSchoolAction,
  editProfileAction
} from '../../Actions/auth'

// Validation Schema
import { validationEditProfileSchema } from '../../Shared/ValidationSchemes/validation'
import moment from 'moment'

function EditMyProfile () {
  const dispatch = useDispatch()
  const token = localStorage.getItem('token')
  const navigate = useNavigate()
  const { enqueueSnackbar } = useSnackbar()
  let startdate = moment()
  startdate = startdate.subtract(15, 'years')
  startdate = startdate.format('YYYY-MM-DD')

  // useState
  const [data, setData] = useState({})
  const [scienceChecked, setScienceChecked] = useState()
  const [mathsChecked, setmathsChecked] = useState()
  const [selectedImage, setSelectedFile] = useState()
  const [countryid, setCountryid] = useState()
  const [countryid2, setCountryid2] = useState()
  const [stateid, setStateid] = useState()
  const [stateid2, setStateid2] = useState()

  // useSelector
  const profileDataArray = useSelector((state) => state.auth.profileData)
  const boardListArray = useSelector((state) => state.auth.boardsDataArray)
  const countriesArray = useSelector((state) => state.auth.countriesData)
  const districtArray = useSelector((state) => state.auth.districtData)
  const gradeListArray = useSelector((state) => state.auth.gradesData)
  const statesArray = useSelector((state) => state.auth.statesData)
  // const schoolListArray = useSelector((state) => state.auth.schoolDataArray)
  const isProfileEditedFlag = useSelector((state) => state.auth.isProfileEdited)
  const resMessageFlag = useSelector((state) => state.auth.resMessage)
  const previousProps = useRef({
    profileDataArray,
    isProfileEditedFlag
  }).current

  const nationality = [{ id: 'Indian', title: 'Indian' }]

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
    resolver: yupResolver(validationEditProfileSchema)
  })
  const { onChange, name } = register()

  useEffect(() => {
    if (token) {
      dispatch(viewProfileAction(token))
      dispatch(getAllBoardsAction(token))
      dispatch(getAllCountriesAction(token))
      dispatch(getAllGradesAction(token))
      // dispatch(getAllSchoolAction())
    }
  }, [token])

  useEffect(() => {
    if (countryid) {
      dispatch(getAllStatesAction(countryid))
    }
  }, [countryid])

  useEffect(() => {
    if (countryid2) {
      dispatch(getAllStatesAction(countryid2))
    }
  }, [countryid2])

  useEffect(() => {
    if (stateid) {
      dispatch(getAllDistrictAction(stateid))
    }
  }, [stateid])

  useEffect(() => {
    if (stateid2) {
      dispatch(getAllDistrictAction(stateid2))
    }
  }, [stateid2])

  useEffect(() => {
    if (previousProps?.profileDataArray !== profileDataArray) {
      if (profileDataArray) {
        setData(profileDataArray)
      }
    }
    return () => {
      previousProps.profileDataArray = profileDataArray
    }
  }, [profileDataArray])

  useEffect(() => {
    if (data) {
      setCountryid(data?.studentDetails?.countries?.id)
      setStateid(data?.studentDetails?.states?.id)
      setScienceChecked(data?.science_dropped)
      setmathsChecked(data?.math_dropped)

      reset({
        files: {
          0: {
            name: `${process.env.REACT_APP_AXIOS_BASE_URL}${data?.profile}`,
            type: 'image/png'
          },
          length: 1
        },
        firstName: data.first_name,
        lastName: data.last_name,
        middleName: data.middle_name,
        motherName: data.mother_name,
        fatherName: data.father_name,
        dob: data.dob,
        mobileNumber: data.mobile,
        email: data?.email || '',
        school_name: data?.studentDetails?.school_name !== null ? data?.studentDetails?.school_name : '',
        addressLine1: data?.studentDetails?.school_address_1 !== null ? data?.studentDetails?.school_address_1 : '',
        addressLine2: data?.studentDetails?.school_address_2 !== null ? data?.studentDetails?.school_address_2 : '',
        pincode2: data?.studentDetails?.school_pin_code !== null ? data?.studentDetails?.school_pin_code : '',
        pincode: data?.studentDetails?.pin_code || '',
        nationality: {
          id: data?.studentDetails?.nationality !== null ? data?.studentDetails?.nationality : 'Indian',
          title: data?.studentDetails?.nationality !== null ? data?.studentDetails?.nationality : 'Indian'
        },
        board: boardListArray?.find(
          (b) => b.id === data?.studentDetails?.board_id
        ),
        country: {
          id: data?.studentDetails?.countries?.id,
          title: data?.studentDetails?.countries?.title
        },
        country2: {
          id: data?.studentDetails?.school_country?.id,
          title: data?.studentDetails?.school_country?.title
        },
        district: {
          id: data?.studentDetails?.cities?.id,
          title: data?.studentDetails?.cities?.title
        },
        district2: {
          id: data?.studentDetails?.school_city?.id,
          title: data?.studentDetails?.school_city?.title
        },
        grade: gradeListArray?.find(
          (g) => g.id === data?.studentDetails?.grade_id
        ),
        state: {
          id: data?.studentDetails?.states?.id,
          title: data?.studentDetails?.states?.title
        },
        state2: {
          id: data?.studentDetails?.school_state?.id,
          title: data?.studentDetails?.school_state?.title
        }
        // school: schoolListArray?.find(
        //   (s) => s.id === data?.studentDetails?.school_id
        // )
      })
      if (!data?.studentDetails?.school_country?.id) {
        setValue('country2', '')
      }
      if (!data?.studentDetails?.school_state?.id) {
        setValue('state2', '')
      }
      if (!data?.studentDetails?.school_city?.id) {
        setValue('district2', '')
      }
    }
  }, [data, boardListArray, gradeListArray])

  const onSubmit = (data) => {
    const formData = new FormData()
    formData.append('firstName', data?.firstName)
    formData.append('lastName', data?.lastName)
    formData.append('email', data?.email)
    formData.append('motherName', data?.motherName)
    formData.append('fatherName', data?.fatherName)
    formData.append('dob', data?.dob)
    formData.append('mobile', data?.mobileNumber)
    formData.append('sCountryId', data?.country2?.id)
    formData.append('sStateId', data?.state2?.id)
    formData.append('sCityId', data?.district2?.id)
    formData.append('sPinCode', +data?.pincode2)
    formData.append('grade', data?.grade?.id)
    formData.append('board', data?.board?.id)
    // formData.append('school', data?.school?.id)
    formData.append('school_name', data?.school_name)
    formData.append('sAddress1', data?.addressLine1)
    formData.append('sAddress2', data?.addressLine2)
    formData.append('countryId', data?.country2?.id)
    formData.append('stateId', data?.state?.id)
    formData.append('cityId', data?.district?.id)
    formData.append('pinCode', +data?.pincode)
    formData.append('mathDropped', mathsChecked)
    formData.append('scienceDropped', scienceChecked)
    formData.append('profile', data?.files[0])
    formData.append('nationality', data?.nationality?.id)
    if (formData) {
      dispatch(editProfileAction(formData, token))
    }
  }

  useEffect(() => {
    if (previousProps?.isProfileEditedFlag !== isProfileEditedFlag) {
      if (isProfileEditedFlag === true) {
        enqueueSnackbar(`${resMessageFlag}`, {
          variant: 'success',
          autoHide: true,
          hide: 3000
        })
        navigate('/settings/my-profile')
      } else if (isProfileEditedFlag === false) {
        enqueueSnackbar(`${resMessageFlag}`, {
          variant: 'error',
          autoHide: true,
          hide: 3000
        })
      }
    }
    return () => {
      previousProps.isProfileEditedFlag = isProfileEditedFlag
    }
  }, [isProfileEditedFlag])

  return (
    <>
      <div className=''>
        <div className='main-layout whitebox-layout my-editprofile-page'>
          <Form onSubmit={handleSubmit(onSubmit)}>
            <div className='profilebutton-box text-end'>
              <button type='submit' className='theme-btn text-none'>
                Save
              </button>
            </div>
            <div className='light-bg-box'>
              <div className='row'>
                <div className='col-xxl-3 profile-update'>
                  <Form.Group
                    controlId='formFile'
                    className='form-group profile-picture common-input-file '
                  >
                    <Form.Control
                      type='file'
                      className='hidden-file'
                      name='files'
                      {...register('files', { required: true })}
                      onChange={(e) => {
                        onChange(e)
                        setSelectedFile(e.target.files[0])
                      }}
                    />
                    <div className='form-control  d-flex align-items-center flex-column justify-content-center text-center '>
                      <div className='img-box'>
                        {selectedImage
                          ? (
                          <>
                            <img
                              src={URL.createObjectURL(selectedImage)}
                              alt=''
                            />
                            <p className='m-0 blue-placeholder'>
                              Upload Profile Photo
                            </p>
                          </>
                            )
                          : (
                          <>
                            <img
                              src={
                                data?.profile !== null
                                  ? `${process.env.REACT_APP_AXIOS_BASE_URL}${data?.profile}`
                                  : defaultImage
                              }
                              alt=''
                            />
                          </>
                            )}
                      </div>
                    </div>
                  </Form.Group>
                  <p className='error-msg'>
                    {errors.files?.message || errors.files?.label.message}
                  </p>
                </div>
                <div className='col-xxl-9 '>
                  <div className='row'>
                    <div className='col-lg-12'>
                      <h4>Student Details</h4>
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
                          errors.motherName?.message ? 'error-occured' : ''
                        }`}
                        controlId='formmothername'
                      >
                        <Form.Label>Mother&apos;s Name</Form.Label>
                        <Form.Control
                          type='text'
                          {...register('motherName', { required: true })}
                          placeholder='Enter Mother&apos;s Name'
                        />
                        {errors.motherName?.message && (
                          <Form.Text className='error-msg'>
                            {errors.motherName?.message}{' '}
                          </Form.Text>
                        )}
                      </Form.Group>
                    </div>
                    <div className='col-lg-6'>
                      <Form.Group
                        className={`form-group ${
                          errors.fatherName?.message ? 'error-occured' : ''
                        }`}
                        controlId='formfathername'
                      >
                        <Form.Label>Father&apos;s Name</Form.Label>
                        <Form.Control
                          type='text'
                          {...register('fatherName', { required: true })}
                          placeholder='Enter Father&apos;s Name'
                        />
                        {errors.fatherName?.message && (
                          <Form.Text className='error-msg'>
                            {errors.fatherName?.message}{' '}
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
                              max={startdate}
                              name={name}
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
                            placeholder='Enter Email ID'
                          />
                        </div>
                        {errors.email?.message && (
                          <Form.Text className='error-msg'>
                            {errors.email?.message}{' '}
                          </Form.Text>
                        )}
                      </Form.Group>
                    </div>
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
                                    getOptionLabel={(option) => option?.title}
                                    getOptionValue={(option) => option?.id}
                                  />
                                )
                              }}
                            />
                          </Form.Group>
                          <p className='error-msg'>
                            {errors?.district?.message ||
                              errors?.district?.title?.message}
                          </p>
                        </div>
                        <div className='col-xl-6'>
                          <Form.Group
                            className={`form-group ${
                              errors.pincode?.message ? 'error-occured' : ''
                            }`}
                            controlId='formpincode1'
                          >
                            <Form.Label>PIN Code</Form.Label>
                            <Form.Control
                              type='number'
                              {...register('pincode', { required: true })}
                              placeholder='Enter PIN Code'
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
                    <div className='col-md-6'>
                      <Form.Group
                        className='form-group common-select-style'
                        controlId='formfullname'
                      >
                        <Form.Label>Nationality</Form.Label>
                        <Controller
                          name='nationality'
                          control={control}
                          placeholder="dsadas"
                          render={({ field }) => {
                            return (
                              <Select
                                {...field}
                                placeholder={'Select Nationality'}
                                className='react-dropdown'
                                classNamePrefix='dropdown'
                                options={nationality}
                                getOptionLabel={(option) => option?.title}
                                getOptionValue={(option) => option?.id}
                                isSearchable
                              />
                            )
                          }}
                        />
                      </Form.Group>
                      <p className='error-msg'>
                        {errors.nationality?.message ||
                          errors.nationality?.title?.message}
                      </p>
                    </div>

                    <div className='col-lg-12'>
                      <h4>Education Details</h4>
                    </div>
                    <div className='col-lg-6'>
                      <Form.Group
                        className='form-group common-select-style'
                        controlId='formfullname'
                      >
                        <Form.Label>Board</Form.Label>
                        <Controller
                          name='board'
                          control={control}
                          render={({ field }) => (
                            <Select
                              {...field}
                              isClearable
                              isSearchable={false}
                              placeholder={'Select Board'}
                              className='react-dropdown'
                              classNamePrefix='dropdown'
                              options={boardListArray}
                              getOptionLabel={(option) => option?.title}
                              getOptionValue={(option) => option?.id}
                            />
                          )}
                        />
                      </Form.Group>
                      <p className='error-msg'>
                        {errors.board?.message || errors.board?.title.message}
                      </p>
                    </div>
                    <div className='col-lg-6'>
                      <Form.Group
                        className='form-group common-select-style'
                        controlId='formfullname'
                      >
                        <Form.Label>Standard</Form.Label>
                        <Controller
                          name='grade'
                          control={control}
                          render={({ field }) => (
                            <Select
                              {...field}
                              isClearable
                              isSearchable={false}
                              placeholder={'Select Grade'}
                              className='react-dropdown'
                              classNamePrefix='dropdown'
                              options={gradeListArray}
                              getOptionLabel={(option) => option?.title}
                              getOptionValue={(option) => option?.id}
                            />
                          )}
                        />
                      </Form.Group>
                      <p className='error-msg'>
                        {errors.grade?.message || errors.grade?.title.message}
                      </p>
                    </div>
                    <div className='col-lg-6'>
                          <Form.Group
                            className={`form-group ${
                              errors.school_name?.message
                                ? 'error-occured'
                                : ''
                            }`}
                            controlId='formaddressline1'
                          >
                            <Form.Label>School Name</Form.Label>
                            <Form.Control
                              type='text'
                              {...register('school_name', {
                                required: true
                              })}
                              placeholder='Enter School Name'
                            />
                            {errors.school_name?.message && (
                              <Form.Text className='error-msg'>
                                {errors.school_name?.message}{' '}
                              </Form.Text>
                            )}
                          </Form.Group>
                        </div>
                    {/* <div className='col-lg-6'>
                      <Form.Group
                        className='form-group common-select-style'
                        controlId='formfullname'
                      >
                        <Form.Label>School</Form.Label>
                        <Controller
                          name='school'
                          control={control}
                          render={({ field }) => (
                            <Select
                              {...field}
                              isClearable
                              isSearchable={false}
                              placeholder={'Select School'}
                              className='react-dropdown'
                              classNamePrefix='dropdown'
                              options={schoolListArray}
                              getOptionLabel={(option) => option?.title}
                              getOptionValue={(option) => option?.id}
                            />
                          )}
                        />
                      </Form.Group>
                      <p className='error-msg'>
                        {errors.school?.message || errors.school?.title.message}
                      </p>
                    </div> */}
                    <div className='col-lg-12'>
                      <div className='row'>
                        <div className='col-lg-6'>
                          <Form.Group
                            className={`form-group ${
                              errors.addressLine1?.message
                                ? 'error-occured'
                                : ''
                            }`}
                            controlId='formaddressline1'
                          >
                            <Form.Label>Address Line 1</Form.Label>
                            <Form.Control
                              type='text'
                              {...register('addressLine1', {
                                required: true
                              })}
                              placeholder='Enter Address'
                            />
                            {errors.addressLine1?.message && (
                              <Form.Text className='error-msg'>
                                {errors.addressLine1?.message}{' '}
                              </Form.Text>
                            )}
                          </Form.Group>
                        </div>
                        <div className='col-lg-6'>
                          <Form.Group
                            className={`form-group ${
                              errors.addressLine2?.message
                                ? 'error-occured'
                                : ''
                            }`}
                            controlId='formaddressline2'
                          >
                            <Form.Label>Address Line 2</Form.Label>
                            <Form.Control
                              type='text'
                              {...register('addressLine2', {
                                required: true
                              })}
                              placeholder='Enter Address'
                            />
                            {errors.addressLine2?.message && (
                              <Form.Text className='error-msg'>
                                {errors.addressLine2?.message}{' '}
                              </Form.Text>
                            )}
                          </Form.Group>
                        </div>
                        <div className='col-md-6'>
                          <div className='row'>
                            <div className='col-xl-6'>
                              <Form.Group
                                className='form-group common-select-style'
                                controlId='formfullname'
                              >
                                <Form.Label>Country</Form.Label>
                                <Controller
                                  name='country2'
                                  control={control}
                                  render={({ field }) => {
                                    return (
                                      <Select
                                        {...field}
                                        placeholder={'Select Country'}
                                        className='react-dropdown'
                                        classNamePrefix='dropdown'
                                        options={countriesArray}
                                        getOptionLabel={(option) =>
                                          option?.title
                                        }
                                        getOptionValue={(option) => option?.id}
                                        onChange={(e) => {
                                          field.onChange(e)
                                          setCountryid2(e.id)
                                        }}
                                      />
                                    )
                                  }}
                                />
                              </Form.Group>
                              <p className='error-msg'>
                                {errors.country2?.message ||
                                  errors.country2?.tittle.message}
                              </p>
                            </div>
                            <div className='col-xl-6'>
                              <Form.Group
                                className='form-group common-select-style'
                                controlId='formfullname'
                              >
                                <Form.Label>State</Form.Label>
                                <Controller
                                  name='state2'
                                  control={control}
                                  render={({ field }) => {
                                    return (
                                      <Select
                                        placeholder='Select State'
                                        className='react-dropdown'
                                        classNamePrefix='dropdown'
                                        options={statesArray}
                                        getOptionLabel={(option) =>
                                          option?.title
                                        }
                                        getOptionValue={(option) => option?.id}
                                        value={
                                          field.value || getValues().state2
                                        }
                                        onChange={(e) => {
                                          field.onChange(e)
                                          setStateid2(e.id)
                                          setValue('district2', '')
                                        }}
                                      />
                                    )
                                  }}
                                />
                              </Form.Group>
                              <p className='error-msg'>
                                {errors.state2?.message ||
                                  errors.state2?.title?.message}
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
                                  name='district2'
                                  control={control}
                                  render={({
                                    field: { onChange, value = {} }
                                  }) => (
                                    <Select
                                      isClearable
                                      isSearchable={false}
                                      placeholder={'Select District'}
                                      className='react-dropdown'
                                      classNamePrefix='dropdown'
                                      options={districtArray}
                                      getOptionLabel={(option) => option?.title}
                                      getOptionValue={(option) => option?.id}
                                      value={value || getValues().district2}
                                      onChange={(e) => {
                                        onChange(e)
                                      }}
                                    />
                                  )}
                                />
                              </Form.Group>
                              <p className='error-msg'>
                                {errors.district2?.message ||
                                  errors.district2?.title.message}
                              </p>
                            </div>
                            <div className='col-xl-6'>
                              <Form.Group
                                className={`form-group ${
                                  errors.pincode2?.message
                                    ? 'error-occured'
                                    : ''
                                }`}
                                controlId='formpincode1'
                              >
                                <Form.Label>PIN Code</Form.Label>
                                <Form.Control
                                  type='text'
                                  {...register('pincode2', {
                                    required: true
                                  })}
                                  placeholder='Enter PIN Code'
                                />
                                {errors.pincode2?.message && (
                                  <Form.Text className='error-msg'>
                                    {errors.pincode2?.message}{' '}
                                  </Form.Text>
                                )}
                              </Form.Group>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className='col-md-12'>
                      <div className='row'>
                        <Form.Label>Subject Dropout</Form.Label>
                        <div className='col-lg-6'>
                          <Form.Group
                            className='form-group drop-boxes gender-box d-flex align-items-center'
                            controlId='formsubjectdropout'
                          >
                            <Form.Label>Science drop</Form.Label>
                            <Form.Check type='radio' id='radio-3'>
                              <div className='radio-input'>
                                <input
                                  type='radio'
                                  checked={scienceChecked === true}
                                  // {...register('sciencedrop')}
                                  onChange={(e) => {
                                    setScienceChecked(true)
                                  }}
                                />
                              </div>
                              <Form.Check.Label>Yes</Form.Check.Label>
                            </Form.Check>
                            <Form.Check type='radio' id='radio-4'>
                              <div className='radio-input'>
                                <input
                                  type='radio'
                                  checked={scienceChecked === false}
                                  // {...register('sciencedrop')}
                                  onChange={(e) => {
                                    setScienceChecked(false)
                                  }}
                                />
                              </div>
                              <Form.Check.Label>No</Form.Check.Label>
                            </Form.Check>
                          </Form.Group>
                        </div>
                        <div className='col-lg-6'>
                          <Form.Group
                            className='form-group drop-boxes gender-box d-flex align-items-center'
                            controlId='formsubjectdropout'
                          >
                            <Form.Label>Maths drop</Form.Label>
                            <Form.Check type='radio' id='radio-5'>
                              <div className='radio-input'>
                                <input
                                  type='radio'
                                  name='mathsdrop'
                                  checked={mathsChecked === true}
                                  // {...register('sciencedrop')}
                                  onChange={(e) => {
                                    setmathsChecked(true)
                                  }}
                                />
                              </div>
                              <Form.Check.Label>Yes</Form.Check.Label>
                            </Form.Check>
                            <Form.Check type='radio' id='radio-6'>
                              <div className='radio-input'>
                                <input
                                  type='radio'
                                  checked={mathsChecked === false}
                                  // {...register('sciencedrop')}
                                  onChange={(e) => {
                                    setmathsChecked(false)
                                  }}
                                />
                              </div>
                              <Form.Check.Label>No</Form.Check.Label>
                            </Form.Check>
                          </Form.Group>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Form>
        </div>
      </div>
    </>
  )
}

export default EditMyProfile
