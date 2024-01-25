import React, { useEffect, useRef, useState } from 'react'
import TitleHeader from '../../../Components/TitleHeader'
import { useNavigate, useParams } from 'react-router-dom'
import { Form } from 'react-bootstrap'
import Select from 'react-select'
import * as yup from 'yup'
import { useSnackbar } from 'react-notistack'
import { yupResolver } from '@hookform/resolvers/yup'
import { Controller, useForm } from 'react-hook-form'
import {
  getAllBoardsAction,
  getAllGradeAction
  // getAllSchoolAction
} from '../../../Actions/auth'
import { useDispatch, useSelector } from 'react-redux'
import {
  editSpecificStudent,
  getSpecificStudent
} from '../../../Actions/Admin/student'
import { useAddress } from '../../../Shared/Hooks/UseAddress'

function EditStudents () {
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
      .matches(/^([a-zA-z]+([\s][a-zA-Z]+)*)?$/, 'Special Characters & Numeric value are not allowed'),
    lastName: yup
      .string()
      .required('Last Name is required')
      .min(2, 'Last Name must be at least 2 characters')
      .max(20, 'Last Name must be at most 20 characters')
      .matches(/^[a-zA-z]+([\s][a-zA-Z]+)*$/, 'Special Characters & Numeric value are not allowed'),
    dob: yup.string().required('Date of Birth is required'),
    mobileNumber: yup
      .string()
      .required('Mobile Number is required')
      .matches(/^(\+\d{1,3}[- ]?)?\d{10}$/, 'Enter valid Mobile Number'),
    email: yup
      .string()
      // .required('Email is required')
      .matches(/^$|^\S+.*.+@.+\.[A-Za-z]+$/, 'Enter valid E-Mail'),
    country: yup
      .object()
      .nullable()
      .required('Country is required'),
    state: yup
      .object()
      .nullable()
      .required('State is required'),
    district: yup
      .object()
      .nullable()
      .required('District is required'),
    board: yup
      .object()
      .nullable()
      .required('Board is required'),
    school_name: yup
      .string()
      .required('School Name is required')
      .matches(/^[ A-Za-z0-9_./-]*$/, 'Invalid Format')
      .min(5, 'School Name must be greater than & equals to 5 characters'),
    grade: yup
      .object()
      .nullable()
      .required('Board is required')
  })

  // Constant
  const navigate = useNavigate()
  const { id } = useParams()
  const token = localStorage.getItem('token')
  const { enqueueSnackbar } = useSnackbar()
  const dispatch = useDispatch()
  const [scienceChecked, setScienceChecked] = useState()
  const [mathsChecked, setmathsChecked] = useState()

  // useSelector
  const boardListArray = useSelector((state) => state.auth.boardsData)
  // const schoolListArray = useSelector((state) => state.auth.schoolData)
  const gradeListArray = useSelector((state) => state.auth.gradeData)
  const mainData = useSelector((state) => state.student.resData)
  const isStudentDataEdited = useSelector(
    (state) => state.student.isStudentEdited
  )
  const isStudentEditedMessage = useSelector(
    (state) => state.student.resMessage
  )

  // custom hook
  const { setCountryid, setStateid, countriesArray, statesArray, districtArray } = useAddress()

  const previousProps = useRef({
    isStudentDataEdited,
    isStudentEditedMessage
  }).current

  useEffect(() => {
    dispatch(getSpecificStudent(+id, token))
    dispatch(getAllBoardsAction())
    // dispatch(getAllSchoolAction())
    dispatch(getAllGradeAction())
  }, [])

  useEffect(() => {
    if (previousProps?.isStudentDataEdited !== isStudentDataEdited) {
      if (isStudentDataEdited) {
        enqueueSnackbar(`${isStudentEditedMessage}`, {
          variant: 'success',
          hide: 2000,
          autoHide: true
        })
        navigate('/admin/students-management')
        reset()
      } else if (isStudentDataEdited === false) {
        enqueueSnackbar(`${isStudentEditedMessage}`, {
          variant: 'error',
          hide: 2000,
          autoHide: true,
          TransitionComponent: 'Fade'
        })
      }
    }
    return () => {
      previousProps.isStudentDataEdited = isStudentDataEdited
    }
  }, [isStudentDataEdited])

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    getValues
  } = useForm({
    resolver: yupResolver(validationSchema)
  })
  const { onChange, name } = register()

  useEffect(() => {
    if (
      mainData
    ) {
      setScienceChecked(mainData?.science_dropped)
      setmathsChecked(mainData?.math_dropped)
      setCountryid(mainData?.studentDetails?.countries?.id)
      setStateid(mainData?.studentDetails?.states?.id)
      reset({
        firstName: mainData.first_name,
        lastName: mainData.last_name,
        middleName: mainData.middle_name,
        motherName: mainData.mother_name,
        fatherName: mainData.father_name,
        dob: mainData.dob,
        mobileNumber: mainData.mobile,
        email: mainData?.email || '',
        school_name: mainData?.studentDetails?.school_name !== null ? mainData?.studentDetails?.school_name : '',
        country: {
          id: mainData?.studentDetails?.countries?.id,
          title: mainData?.studentDetails?.countries?.title
        },
        district: {
          id: mainData?.studentDetails?.cities?.id,
          title: mainData?.studentDetails?.cities?.title
        },
        state: {
          id: mainData?.studentDetails?.states?.id,
          title: mainData?.studentDetails?.states?.title
        },
        pincode: mainData?.studentDetails?.pin_code,
        // Education Details
        grade: gradeListArray?.find(
          (g) => g.title === mainData?.studentDetails?.grades?.title
        ),
        board: boardListArray?.find(
          (b) => b.title === mainData?.studentDetails?.boards?.title
        )
        // school: schoolListArray?.find(
        //   (s) => s.id === mainData?.studentDetails?.schools?.id
        // )
      })
    }
  }, [
    mainData, gradeListArray, boardListArray
  ])

  const onSubmit = (data) => {
    const studentData = {
      id,
      first_name: data.firstName,
      last_name: data.lastName,
      middle_name: data.middleName,
      mother_name: data.motherName,
      father_name: data.fatherName,
      dob: data.dob,
      mobile: data.mobileNumber,
      email: data?.email || null,
      student_pin_code: data.pincode,
      grade_id: +data.grade.id,
      board_id: +data?.board?.id,
      // school_id: +data.school.id,
      // school_title: data.school.title,
      school_name: data?.school_name,
      country_id: +data.country.id,
      state_id: +data.state.id,
      city_id: +data.district.id,
      science_dropped: scienceChecked,
      math_dropped: mathsChecked
    }
    if (studentData) {
      dispatch(editSpecificStudent(studentData, token))
    }
  }

  return (
    <>
          <TitleHeader name='Edit' title='Edit Student' />
          <div className='main-layout whitebox-layout my-editprofile-page'>
            <Form className='light-bg'>
              <div className='heading-box'>
                <h5>Edit Student</h5>
                <div className='btn-box'>
                  <button
                    className='theme-btn dark-btn text-none'
                    onClick={() => navigate('/admin/students-management')}
                  >
                    Cancel
                  </button>
                  <button
                    className='theme-btn text-none'
                    onClick={handleSubmit(onSubmit)}
                  >
                    Save
                  </button>
                </div>
              </div>
              <div className='light-bg-box'>
                <div className='row'>
                  <div className='col-xxl-12 '>
                    <div className='row'>
                      <div className='col-lg-12'>
                        <h4>Student Details</h4>
                      </div>
                      <div className='col-lg-6'>
                        <Form.Group
                          className={`form-group ${
                            errors.firstName?.message ? 'error-occured' : ''
                          }`}
                          controlId='firstName'
                        >
                          <Form.Label>First Name</Form.Label>
                          <Form.Control
                            placeholder='Enter First Name'
                            type='text'
                            {...register('firstName', { required: true })}
                          />
                          {errors.firstName?.message && (
                            <Form.Text className='error-msg'>
                              {errors.firstName?.message}
                            </Form.Text>
                          )}
                        </Form.Group>
                      </div>
                      <div className='col-lg-6'>
                        <Form.Group
                          className={`form-group ${
                            errors.firstName?.message ? 'error-occured' : ''
                          }`}
                          controlId='lastName'
                        >
                          <Form.Label>Last Name</Form.Label>
                          <Form.Control
                            placeholder='Enter Last Name'
                            type='text'
                            {...register('lastName', { required: true })}
                          />
                          {errors.lastName?.message && (
                            <Form.Text className='error-msg'>
                              {errors.lastName?.message}
                            </Form.Text>
                          )}
                        </Form.Group>
                      </div>
                      <div className='col-lg-6'>
                        <Form.Group
                          className={`form-group ${
                            errors.middleName?.message ? 'error-occured' : ''
                          }`}
                          controlId='middleName'
                        >
                          <Form.Label>Middle Name</Form.Label>
                          <Form.Control
                            placeholder='Enter Middle Name'
                            type='text'
                            {...register('middleName')}
                          />
                           {errors.middleName
                             ?.message && (
                            <Form.Text className='error-msg'>
                              {errors.middleName?.message}
                            </Form.Text>
                           )}
                        </Form.Group>
                      </div>
                      <div className='col-lg-6'>
                        <Form.Group
                          className='form-group'
                          controlId='mothername'
                        >
                          <Form.Label>Mother&apos;s Name</Form.Label>
                          <Form.Control
                            placeholder='Enter Mother’s Name'
                            type='text'
                            {...register('motherName')}
                          />
                        </Form.Group>
                      </div>
                      <div className='col-lg-6'>
                        <Form.Group
                          className='form-group'
                          controlId='formfathername'
                        >
                          <Form.Label>Father&apos;s Name</Form.Label>
                          <Form.Control
                            placeholder='Enter Father’s Name'
                            type='text'
                            {...register('fatherName')}
                          />
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
                          <Form.Control
                            type='date'
                            placeholder='Date Of Birth'
                            max={new Date().toISOString().slice(0, 10)}
                            name={name}
                            onChange={(e) => {
                              onChange(e)
                              setValue('dob', e.target.value)
                            }}
                            {...register('dob', { required: true })}
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
                          controlId='formBasicEmail'
                          className={`form-group ${
                            errors.mobileNumber?.message ? 'error-occured' : ''
                          }`}
                        >
                          <Form.Label>Mobile Number</Form.Label>
                          <Form.Control
                            placeholder='Enter Mobile Number'
                            type='text'
                            {...register('mobileNumber', { required: true })}
                          />
                          {errors.mobileNumber?.message && (
                            <Form.Text className='error-msg'>
                              {errors.mobileNumber?.message}{' '}
                            </Form.Text>
                          )}
                        </Form.Group>
                      </div>
                      <div className='col-lg-6'>
                        <Form.Group
                          className={`form-group verified ${
                            errors.email?.message ? 'error-occured' : ''
                          }`}
                          controlId='formBasicEmail'
                        >
                          <Form.Label>Email ID</Form.Label>
                          <div className='position-relative'>
                            <Form.Control
                              placeholder='Enter Email ID'
                              type='email'
                              {...register('email', { required: true })}
                            />
                          </div>
                          {errors.email?.message && (
                            <Form.Text className='error-msg'>
                              {errors.email?.message}
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
                                      field
                                    }) => {
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
                                          getOptionValue={(option) =>
                                            option?.id
                                          }
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
                                      errors?.country?.title?.message}
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
                                    render={({
                                      field
                                    }) => {
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
                                  <p className='error-msg'>
                                    {errors.state?.message ||
                                      errors.state?.title?.message}
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
                                    render={({ field }) => (
                                      <Select
                                          {...field}
                                          placeholder={'Select District'}
                                          className='react-dropdown'
                                          classNamePrefix='dropdown'
                                          options={districtArray}
                                          getOptionLabel={(option) =>
                                            option?.title
                                          }
                                          getOptionValue={(option) =>
                                            option?.id
                                          }
                                        />
                                    )}
                                  />
                                  <p className='error-msg'>
                                    {errors.district?.message ||
                                      errors.district?.title?.message}
                                  </p>
                                </Form.Group>
                              </div>
                              <div className='col-xl-6'>
                                <Form.Group
                                  className='form-groupc'
                                  controlId='formpincode1'
                                >
                                  <Form.Label>PIN Code</Form.Label>
                                  <Form.Control
                                    type='text'
                                    placeholder='Enter PIN Code'
                                    name={name}
                                    onChange={(e) => {
                                      onChange(e)
                                    }}
                                    {...register('pincode')}
                                  />
                                  <p className='error-msg'>
                                    {errors.pincode?.message ||
                                      errors.pincode?.title?.message}
                                  </p>
                                </Form.Group>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className='row'>
                        <div className='col-lg-12'>
                          <h4>Education Details</h4>
                        </div>
                        <div className='col-lg-6'>
                          <Form.Group
                            className='form-group common-select-style'
                            controlId='formfullname'
                          >
                            <Form.Label>Grade</Form.Label>
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
                            <p className='error-msg'>
                              {errors.grade?.message ||
                                errors.grade?.title?.message}
                            </p>
                          </Form.Group>
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
                            <p className='error-msg'>
                              {errors.board?.message ||
                                errors.board?.title?.message}
                            </p>
                          </Form.Group>
                        </div>
                        <div className='col-12'>
                          <div className='row'>
                            <div className='col-lg-6'>
                            <Form.Group
                                  className={`form-group verified ${
                                    errors.school_name?.message ? 'error-occured' : ''
                                  }`}
                                  controlId='formpincode1'
                                >
                                  <Form.Label>School Name</Form.Label>
                                  <Form.Control
                                    type='text'
                                    placeholder='Enter School Name'
                                    name={name}
                                    onChange={(e) => {
                                      onChange(e)
                                    }}
                                    {...register('school_name')}
                                  />
                                  <p className='error-msg'>
                                    {errors.school_name?.message }
                                  </p>
                                </Form.Group>
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
              </div>
            </Form>
          </div>
    </>
  )
}

export default EditStudents
