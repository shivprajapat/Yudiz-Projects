import React, { useState, useEffect, useRef } from 'react'
import { Form, Button } from 'react-bootstrap'
import Select from 'react-select'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation, useNavigate } from 'react-router-dom'
import { useSnackbar } from 'react-notistack'

// Actions
import {
  getAllGradesAction,
  getAllCountriesAction,
  getAllStatesAction,
  getAllDistrictAction,
  getAllSchoolsAction,
  getAllBoardsAction,
  studentRegister
} from '../../../Actions/auth'

// Validations
import { validationSignupSchema } from '../../../Shared/ValidationSchemes/validation'

function EducationDetails () {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const { enqueueSnackbar } = useSnackbar()

  // useState
  const [standard, setStandard] = useState([])
  const [stateid, setStateid] = useState()
  const [schoolstateid, setSchoolStateid] = useState()
  const [countryid, setCountryid] = useState()
  const [schoolcountryid, setSchoolCountryid] = useState()
  const [selectedStandard] = useState([{ value: '10th', label: '10th' }])
  const [selectedBoard] = useState([{ value: 'C.B.S.E.', label: 'C.B.S.E.' }])
  const [selectedNationality] = useState([{ value: 'Indian', label: 'Indian' }])

  // useSelector
  // const schoolArray = useSelector((state) => state.auth.schoolDataArray)
  const gradesArray = useSelector((state) => state.auth.gradesData)
  const countriesArray = useSelector((state) => state.auth.countriesData)
  const statesData = useSelector((state) => state.auth.statesData)
  const districtData = useSelector((state) => state.auth.districtData)
  const registeredFlag = useSelector((state) => state.auth.isRegistered)
  const boardsDataArrayy = useSelector((state) => state.auth.boardsDataArray)
  const registredResMessage = useSelector((state) => state.auth.resMessage)
  const previousProps = useRef({
    gradesArray,
    countriesArray,
    statesData,
    districtData,
    registeredFlag,
    boardsDataArrayy,
    registredResMessage
  }).current

  // Toastify Notification for successfull registration
  useEffect(() => {
    if (previousProps?.registeredFlag !== registeredFlag) {
      if (registeredFlag === true) {
        enqueueSnackbar(`${registredResMessage}`, {
          variant: 'success',
          autoHide: true,
          hide: 3000
        })
        navigate('/dashboard')
      } else if (registeredFlag === false) {
        enqueueSnackbar(`${registredResMessage}`, {
          variant: 'error',
          autoHide: true,
          hide: 3000
        })
      }
    }
    return () => {
      previousProps.registeredFlag = registeredFlag
    }
  }, [registeredFlag])

  /* for nationality */
  const nationality = [
    { value: 'Indian', label: 'Indian' }
  ]
  /* for standard */
  useEffect(() => {
    if (previousProps?.gradesArray !== gradesArray) {
      const array = []
      if (gradesArray) {
        // eslint-disable-next-line array-callback-return
        gradesArray.map((data) => {
          array.push({
            value: data.id,
            label: data.title
          })
        })
        setStandard(array)
      }
    }
    return () => {
      previousProps.gradesArray = gradesArray
    }
  }, [gradesArray])

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
    setValue
  } = useForm({
    resolver: yupResolver(validationSignupSchema)
  })
  const { onChange, name } = register('pincode', 'address1', 'address2')

  // function to get all grades
  useEffect(() => {
    dispatch(getAllGradesAction())
    dispatch(getAllCountriesAction())
    dispatch(getAllSchoolsAction())
    dispatch(getAllBoardsAction())
  }, [])

  useEffect(() => {
    if (countryid) {
      dispatch(getAllStatesAction(countryid))
    }
  }, [countryid])

  useEffect(() => {
    if (schoolcountryid) {
      dispatch(getAllStatesAction(schoolcountryid))
    }
  }, [schoolcountryid])

  useEffect(() => {
    if (stateid) {
      dispatch(getAllDistrictAction(stateid))
    }
  }, [stateid])

  useEffect(() => {
    if (schoolstateid) {
      dispatch(getAllDistrictAction(schoolstateid))
    }
  }, [schoolstateid])

  // Form onSubmit Method
  const onSubmit = (data) => {
    const studentData = {
      // center_id: 1,
      // counselor_id: 1,
      first_name: location.state.data.firstName,
      middle_name: location.state.data.middleName,
      last_name: location.state.data.lastName,
      email: location?.state?.data?.email || null,
      mobile: location.state.data.mobileNumber,
      dob: location.state.data.dob,
      gender: location.state.data.gender,
      father_name: location.state.data.fName,
      mother_name: location.state.data.mName,
      password: location.state.data.password,
      OTP: location.state.data.otp,
      is_verify: 'y',
      verified_at: new Date(),
      grade_id: Number(data.standard.value),
      board_id: Number(data.board.id),
      // school_id: Number(data.school.id),
      nationality: data.nationality.value,
      student_country_id: Number(data.country.id),
      student_state_id: Number(data.state.id),
      student_district: Number(data.district.id),
      school_address_1: data.address1,
      school_address_2: data.address2,
      school_country_id: Number(data.schoolCountry.id),
      school_state_id: Number(data.schoolState.id),
      school_city_id: Number(data.schoolDistrict.id),
      school_district: Number(data.schoolDistrict.id),
      school_pin_code: data.schoolPincode,
      school_name: data.school_name,
      // school_title: data.school.value,
      // contact_name: data.school.label,
      // contact_email: 'school123@gmail.com',
      // contact_mobile: '9327211438',
      area: data.address2,
      country_id: Number(data.country.id),
      state_id: Number(data.state.id),
      city_id: Number(data.district.id)
    }

    if (studentData) {
      dispatch(studentRegister(studentData))
    }
  }
  return (
    <>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <div className='light-bg-box'>
          <h4>Home Details</h4>
          <Form.Group
            className='form-group common-select-style'
            controlId='formfullname'
          >
            <Form.Label>Nationality*</Form.Label>
            <Controller
              name='nationality'
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  isClearable
                  isSearchable={false}
                  Value={selectedNationality}
                  placeholder={'Select Nationality'}
                  className='react-dropdown'
                  classNamePrefix='dropdown'
                  options={nationality}
                />
              )}
            />
            <p className='error-msg'>
              {errors.nationality?.message || errors.nationality?.label.message}
            </p>
          </Form.Group>
          <div className='row'>
            <div className='col-xl-6'>
              <Form.Group
                className='form-group common-select-style'
                controlId='formfullname'
              >
                <Form.Label>Country*</Form.Label>
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
                  {errors.country?.message || errors.country?.title?.message}
                </p>
              </Form.Group>
            </div>
            <div className='col-xl-6'>
              <Form.Group
                className='form-group common-select-style'
                controlId='formfullname'
              >
                <Form.Label>State*</Form.Label>
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
                        options={statesData}
                        onChange={(e) => {
                          field.onChange(e)
                          setStateid(e.id)
                          setValue('district', '')
                        }}
                        getOptionLabel={(option) => option?.title}
                        getOptionValue={(option) => option?.id}
                        // isDisabled={!countryid && true}
                      />
                    )
                  }}
                />
                <p className='error-msg'>
                  {errors.state?.message || errors.state?.title.message}
                </p>
              </Form.Group>
            </div>
          </div>
          <div className='row'>
            <div className='col-xl-6'>
              <Form.Group
                className='form-group common-select-style'
                controlId='formfullname'
              >
                <Form.Label>District*</Form.Label>
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
                        options={districtData}
                        getOptionLabel={(option) => option?.title}
                        getOptionValue={(option) => option?.id}
                        // isDisabled={!stateid && true}
                      />
                    )
                  }}
                />
                <p className='error-msg'>
                  {errors.district?.message || errors.district?.title.message}
                </p>
              </Form.Group>
            </div>
            <div className='col-xl-6'>
              <Form.Group
                className={`form-group ${
                  errors.pincode?.message ? 'error-occured' : ''
                }`}
                controlId='formpincode1'
              >
                <Form.Label>PIN Code*</Form.Label>
                <Form.Control
                  type='number'
                  placeholder='Enter PIN Code'
                  name={name}
                  onChange={(e) => {
                    onChange(e)
                  }}
                  {...register('pincode', { required: true })}
                />
                <p className='error-msg'>
                  {errors.pincode?.message || errors.pincode?.label.message}
                </p>
              </Form.Group>
            </div>
          </div>
        </div>
        <div className='light-bg-box'>
          <h4>School Details</h4>
          <Form.Group
                className={`form-group ${
                  errors.school_name?.message ? 'error-occured' : ''
                }`}
                controlId='formpincode1'
              >
                <Form.Label>School Name*</Form.Label>
                <Form.Control
                  type='text'
                  placeholder='Enter School Name'
                  name={name}
                  onChange={(e) => {
                    onChange(e)
                  }}
                  {...register('school_name', { required: true })}
                />
                <p className='error-msg'>
                  {errors.school_name?.message || errors.school_name?.label.message}
                </p>
              </Form.Group>
          <Form.Group
            className='form-group common-select-style'
            controlId='formfullname'
          >
            <Form.Label>Board*</Form.Label>
            <Controller
              name='board'
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  isClearable
                  isSearchable={false}
                  Value={selectedBoard}
                  placeholder={'Select Board'}
                  className='react-dropdown'
                  classNamePrefix='dropdown'
                  options={boardsDataArrayy}
                  getOptionLabel={(option) => option?.title}
                  getOptionValue={(option) => option?.id}
                  onChange={(e) => {
                    field.onChange(e)
                  }}
                />
              )}
            />
            <p className='error-msg'>
              {errors.board?.message || errors.board?.title.message}
            </p>
          </Form.Group>
          <Form.Group
            className='form-group common-select-style'
            controlId='formfullname'
          >
            <Form.Label>Standard*</Form.Label>
            <Controller
              name='standard'
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  isClearable
                  isSearchable={false}
                  Value={selectedStandard}
                  placeholder={'Select Standard'}
                  className='react-dropdown'
                  classNamePrefix='dropdown'
                  options={standard}
                />
              )}
            />
            <p className='error-msg'>
              {errors.standard?.message || errors.standard?.label.message}
            </p>
          </Form.Group>
          <Form.Group
            className='form-group '
            controlId='exampleForm.ControlTextarea1'
          >
            <Form.Label>Address Line 1*</Form.Label>
            <Form.Control
              as='textarea'
              placeholder={'Address Line 1'}
              name={name}
              onChange={(e) => {
                onChange(e)
              }}
              {...register('address1', { required: true })}
            />
            <p className='error-msg'>
              {errors.address1?.message || errors.address1?.label.message}
            </p>
          </Form.Group>
          <Form.Group
            className='form-group '
            controlId='exampleForm.ControlTextarea2'
          >
            <Form.Label>Address Line 2*</Form.Label>
            <Form.Control
              as='textarea'
              placeholder={'Address Line 2'}
              name={name}
              onChange={(e) => {
                onChange(e)
              }}
              {...register('address2', { required: true })}
            />
            <p className='error-msg'>
              {errors.address2?.message || errors.address2?.label.message}
            </p>
          </Form.Group>
          <div className='row  '>
            <div className='col-xl-6'>
              <Form.Group
                className='form-group common-select-style'
                controlId='formfullname'
              >
                <Form.Label>Country*</Form.Label>
                 <Controller
                  name='schoolCountry'
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
                          setSchoolCountryid(e.id)
                        }}
                      />
                    )
                  }}
                />
                <p className='error-msg'>
                  {errors.schoolCountry?.message ||
                    errors.schoolCountry?.title.message}
                </p>
              </Form.Group>
            </div>
            <div className='col-xl-6'>
              <Form.Group
                className='form-group common-select-style'
                controlId='formfullname'
              >
                <Form.Label>State*</Form.Label>
                <Controller
                  name='schoolState'
                  control={control}
                  render={({ field }) => {
                    return (
                      <Select
                        {...field}
                        placeholder={'Select State'}
                        className='react-dropdown'
                        classNamePrefix='dropdown'
                        options={statesData}
                        onChange={(e) => {
                          field.onChange(e)
                          setSchoolStateid(e.id)
                          setValue('schoolDistrict', '')
                        }}
                        getOptionLabel={(option) => option?.title}
                        getOptionValue={(option) => option?.id}
                        // isDisabled={!countryid && true}
                      />
                    )
                  }}
                />
                <p className='error-msg'>
                  {errors.schoolState?.message ||
                    errors.schoolState?.title.message}
                </p>
              </Form.Group>
            </div>
          </div>
          <div className='row '>
            <div className='col-xl-6'>
              <Form.Group
                className='form-group common-select-style'
                controlId='formfullname'
              >
                <Form.Label>District*</Form.Label>
                <Controller
                  name='schoolDistrict'
                  control={control}
                  render={({ field }) => {
                    return (
                      <Select
                        {...field}
                        placeholder={'Select District'}
                        className='react-dropdown'
                        classNamePrefix='dropdown'
                        options={districtData}
                        getOptionLabel={(option) => option?.title}
                        getOptionValue={(option) => option?.id}
                        // isDisabled={!countryid && true}
                      />
                    )
                  }}
                />
                <p className='error-msg'>
                  {errors.schoolDistrict?.message ||
                    errors.schoolDistrict?.title.message}
                </p>
              </Form.Group>
            </div>
            <div className='col-xl-6'>
              <Form.Group
                className={`form-group ${
                  errors.pincode?.message ? 'error-occured' : ''
                }`}
                controlId='formpincode2'
              >
                <Form.Label>PIN Code*</Form.Label>
                <Form.Control
                  type='number'
                  placeholder='Enter PIN Code'
                  name={name}
                  onChange={(e) => {
                    onChange(e)
                  }}
                  {...register('schoolPincode', { required: true })}
                />
                <p className='error-msg'>
                  {errors.schoolPincode?.message ||
                    errors.schoolPincode?.label.message}
                </p>
              </Form.Group>
            </div>
          </div>
        </div>
        <Button variant='primary' type='submit' className='theme-btn large-btn'>
          Submit
        </Button>
      </Form>
    </>
  )
}

export default EducationDetails
