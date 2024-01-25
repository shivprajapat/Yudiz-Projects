import React, { useEffect, useRef } from 'react'

/* React Packages */
import { useForm, Controller } from 'react-hook-form'
import { Form } from 'react-bootstrap'
import Select from 'react-select'
import { useDispatch, useSelector } from 'react-redux'
import { yupResolver } from '@hookform/resolvers/yup'
import { useSnackbar } from 'react-notistack'
import { useNavigate } from 'react-router-dom'

/* Components */
import Header from '../../../Components/Header'
import TitleHeader from '../../../Components/TitleHeader'

/* Action File */
import { getAllBoardsAction } from '../../../Actions/auth'
import { addSchoolAction } from '../../../Actions/Admin/school'
import { useAddress } from '../../../Shared/Hooks/UseAddress'
import { validationSchemaSchool } from '../../../Shared/Utills/validationschema'

function AddNewSchool () {
  // Constant
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { enqueueSnackbar } = useSnackbar()
  const token = localStorage.getItem('token')
  const handleclick = () => {
    navigate(-1)
  }

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

  // useSelector
  const boardData = useSelector((state) => state.auth.boardsData)
  const isSchoolDataAdded = useSelector((state) => state.school.isSchoolAdded)
  const isSchoolAddedMessage = useSelector((state) => state.school.resMessage)
  const previousProps = useRef({
    boardData,
    isSchoolDataAdded,
    isSchoolAddedMessage
  }).current

  // useEffect to get Data
  useEffect(() => {
    dispatch(getAllBoardsAction())
  }, [])

  // useForm
  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue
  } = useForm({
    resolver: yupResolver(validationSchemaSchool)
  })

  // onSubmit
  const onSubmit = (data) => {
    const schoolData = {
      title: data.schoolName,
      abbreviation: data.schoolAbb,
      address_1: data.address1,
      address_2: data.address2,
      county_id: Number(data.country.id),
      state_id: Number(data.state.id),
      city_id: Number(data.district.id),
      board_id: Number(data.board.id),
      pin_code: data.pincode
    }
    if (schoolData) {
      dispatch(addSchoolAction(schoolData, token))
    }
  }

  // Notification for add
  useEffect(() => {
    if (previousProps?.isSchoolDataAdded !== isSchoolDataAdded) {
      if (isSchoolDataAdded) {
        enqueueSnackbar(`${isSchoolAddedMessage}`, {
          variant: 'success',
          hide: 2000,
          autoHide: true
        })
        navigate('/admin/school-management')
        reset()
      } else if (isSchoolDataAdded === false) {
        enqueueSnackbar(`${isSchoolAddedMessage}`, {
          variant: 'error',
          hide: 2000,
          autoHide: true,
          TransitionComponent: 'Fade'
        })
      }
    }
    return () => {
      previousProps.isSchoolDataAdded = isSchoolDataAdded
    }
  }, [isSchoolDataAdded])

  return (
    <>
      <Header />
      <TitleHeader name='School List' title='School' />
      <div className='main-layout'>
        <Form className='light-bg' onSubmit={handleSubmit(onSubmit)}>
          <div className='heading-box'>
            <h5>Add School</h5>
            <div className='btn-box'>
              <button
                className='theme-btn dark-btn text-none'
                onClick={handleclick}
              >
                Cancel
              </button>
              <button className='theme-btn text-none'>Save</button>
            </div>
          </div>
          <div className='form-middle-layout'>
            <div className='row'>
              <div className='col-md-6'>
                <Form.Group
                  className='form-group'
                  controlId='formschoolfullname'
                >
                  <Form.Label>School Full Name</Form.Label>
                  <Form.Control
                    type='text'
                    placeholder='Enter School Full Name'
                    name={name}
                    {...register('schoolName', { required: true })}
                  />
                  {errors.schoolName?.message && (
                    <Form.Text className='error-msg'>
                      {errors.schoolName?.message}
                    </Form.Text>
                  )}
                </Form.Group>
              </div>
              <div className='col-md-6'>
                <Form.Group
                  className='form-group'
                  controlId='formschoolabbreviation'
                >
                  <Form.Label>School Abbreviation</Form.Label>
                  <Form.Control
                    type='text'
                    placeholder='Enter School Abbreviation'
                    name={name}
                    {...register('schoolAbb', { required: true })}
                  />
                </Form.Group>
              </div>
              <div className='col-md-6'>
                <Form.Group
                  className='form-group common-select-style'
                  controlId='formfullname'
                >
                  <Form.Label>Country</Form.Label>
                  <Controller
                    name='country'
                    control={control}
                    render={({ field }) => (
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
                    )}
                  />
                  <p className='error-msg'>
                    {errors.country?.message || errors.country?.label.message}
                  </p>
                </Form.Group>
              </div>
              <div className='col-md-6'>
                <Form.Group
                  className='form-group common-select-style'
                  controlId='formfullname'
                >
                  <Form.Label>State</Form.Label>
                  <Controller
                    name='state'
                    control={control}
                    render={({ field }) => (
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
                    )}
                  />
                  <p className='error-msg'>
                    {errors.state?.message || errors.state?.label.message}
                  </p>
                </Form.Group>
              </div>
              <div className='col-md-6'>
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
                        getOptionLabel={(option) => option?.title}
                        getOptionValue={(option) => option?.id}
                        isDisabled={!stateid && true}
                      />
                    )}
                  />
                  <p className='error-msg'>
                    {errors.district?.message || errors.district?.label.message}
                  </p>
                </Form.Group>
              </div>
              <div className='col-md-6'>
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
                      placeholder={'Select District'}
                      className='react-dropdown'
                      classNamePrefix='dropdown'
                      options={boardData}
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
                    {errors.board?.message || errors.board?.label.message}
                  </p>
                </Form.Group>
              </div>
              <div className='col-md-6'>
                <Form.Group className='form-group' controlId='formaddressline1'>
                  <Form.Label>Address Line 1</Form.Label>
                  <Form.Control
                    as='textarea'
                    placeholder='Enter Address Line 1'
                    name={name}
                    {...register('address1', { required: true })}
                  />
                  {errors.address1?.message && (
                    <Form.Text className='error-msg'>
                      {errors.address1?.message}
                    </Form.Text>
                  )}
                </Form.Group>
              </div>
              <div className='col-md-6'>
                <Form.Group className='form-group' controlId='formaddressline2'>
                  <Form.Label>Address Line 2</Form.Label>
                  <Form.Control
                    as='textarea'
                    name={name}
                    placeholder='Enter Address Line 2'
                    {...register('address2', { required: true })}
                  />
                  {errors.address2?.message && (
                    <Form.Text className='error-msg'>
                      {errors.address2?.message}
                    </Form.Text>
                  )}
                </Form.Group>
              </div>
              <div className='col-md-6'>
                <Form.Group className='form-group' controlId='formpincode1'>
                  <Form.Label>PIN Code</Form.Label>
                  <Form.Control
                    type='number'
                    placeholder='Enter PIN Code'
                    name={name}
                    {...register('pincode', { required: true })}
                  />
                  {errors.pincode?.message && (
                    <Form.Text className='error-msg'>
                      {errors.pincode?.message}
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

export default AddNewSchool
