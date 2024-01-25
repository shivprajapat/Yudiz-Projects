import React, { useEffect, useRef } from 'react'
import { Form } from 'react-bootstrap'
import { useForm, Controller } from 'react-hook-form'
import Select from 'react-select'

import TitleHeader from '../../../Components/TitleHeader'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import { yupResolver } from '@hookform/resolvers/yup'
import { useSnackbar } from 'react-notistack'
import {
  editSpecificCenter,
  getSpecificCenter
} from '../../../Actions/Admin/center'
import { useAddress } from '../../../Shared/Hooks/UseAddress'
import { validationSchemaCenter } from '../../../Shared/Utills/validationschema'

function EditCenter () {
  const { enqueueSnackbar } = useSnackbar()
  const params = useParams()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const id = params.id
  const token = localStorage.getItem('token')

  const specificCenterData = useSelector(
    (state) => state.centerManAdmin.resData
  )

  const boardData = useSelector((state) => state.auth.boardsData)
  const isCenterEdited = useSelector(
    (state) => state.centerManAdmin.isCenterEdited
  )
  const isCenterEditedMessage = useSelector(
    (state) => state.centerManAdmin.resMessage
  )

  // custom hook
  const { setCountryid, setStateid, countriesArray, statesArray, districtArray } = useAddress()

  const previousProps = useRef({
    specificCenterData,
    boardData,
    isCenterEdited,
    isCenterEditedMessage
  }).current
  // const previousProps = useRef({ specificCenterData }).current
  useEffect(() => {
    if (previousProps?.isCenterEdited !== isCenterEdited) {
      if (isCenterEdited) {
        enqueueSnackbar(`${isCenterEditedMessage}`, {
          variant: 'success',
          hide: 2000,
          autoHide: true
        })
        navigate('/admin/center-management')
        reset()
      } else if (isCenterEdited === false) {
        enqueueSnackbar(`${isCenterEditedMessage}`, {
          variant: 'error',
          hide: 2000,
          autoHide: true,
          TransitionComponent: 'Fade'
        })
      }
    }
    return () => {
      previousProps.isCenterEdited = isCenterEdited
    }
  }, [isCenterEdited])

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
    getValues,
    reset,
    setValue
  } = useForm({
    resolver: yupResolver(validationSchemaCenter)
  })

  useEffect(() => {
    if (id) {
      dispatch(getSpecificCenter(+id, token))
    }
  }, [id])

  useEffect(() => {
    if (specificCenterData) {
      setCountryid(specificCenterData?.country?.id)
      setStateid(specificCenterData?.states?.id)
      reset({
        name: specificCenterData?.title,
        email: specificCenterData?.email,
        mobileNumber: specificCenterData?.mobile,
        country: {
          id: specificCenterData?.country?.id,
          title: specificCenterData?.country?.title
        },
        state: {
          id: specificCenterData?.states?.id,
          title: specificCenterData?.states?.title
        },
        district: {
          id: specificCenterData?.city?.id,
          title: specificCenterData?.city?.title
        }
      })
    }
  }, [specificCenterData, countriesArray, statesArray])

  const onSubmit = (data) => {
    const centerData = {
      id,
      title: data.name,
      email: data.email,
      mobile: data.mobileNumber,
      state_id: +data.state.id,
      city_id: +data.district.id,
      country_id: +data.country.id
    }
    if (centerData) {
      dispatch(editSpecificCenter(centerData, token))
    }
  }
  return (
    <>
          {/* <Header /> */}
          <TitleHeader name='Edit' title='Edit Center' />
          <div className='main-layout whitebox-layout my-editprofile-page'>
            <Form className='light-bg' onSubmit={handleSubmit(onSubmit)}>
              <div className='heading-box'>
                <h5>Edit Center</h5>
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
              <div className='light-bg-box'>
                <div className='row'>

                  <div className='col-xxl-12 '>
                    <div className='row'>
                      <div className='col-lg-12'>
                        <h4>Center Details</h4>
                      </div>
                      <div className='col-lg-6'>
                        <Form.Group
                          className={`form-group ${
                            errors.name?.message ? 'error-occured' : ''
                          }`}
                          controlId='title'
                        >
                          <Form.Label>Name</Form.Label>
                          <Form.Control
                            placeholder='Enter Title'
                            type='text'
                            {...register('name', { required: true })}
                          />
                          {errors.name?.message && (
                            <Form.Text className='error-msg'>
                              {errors.name?.message}
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
                      <div className='col-lg-6'>
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
                                      errors?.country?.id?.message}
                                  </p>
                                </Form.Group>
                      </div>
                      <div className='col-lg-6'>
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
                          <p className='error-msg'>
                            {errors?.state?.message ||
                              errors?.state?.id?.message}
                          </p>
                        </Form.Group>
                      </div>
                      <div className='col-lg-6'>
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
                          {errors?.district?.message}
                          </p>
                        </Form.Group>
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

export default EditCenter
