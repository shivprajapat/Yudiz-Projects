import React, { useEffect, useRef } from 'react'
/* Components */

import TitleHeader from '../../../Components/TitleHeader'
import Select from 'react-select'

import { useNavigate } from 'react-router-dom'
import { Form, Spinner } from 'react-bootstrap'

import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { useDispatch, useSelector } from 'react-redux'
import { useSnackbar } from 'react-notistack'
import { addCenterAction } from '../../../Actions/Admin/center'
import { useAddress } from '../../../Shared/Hooks/UseAddress'
import { validationSchemaCenter } from '../../../Shared/Utills/validationschema'

function AddNewCenter () {
  // Constant
  const navigate = useNavigate()
  const token = localStorage.getItem('token')
  const { enqueueSnackbar } = useSnackbar()
  const dispatch = useDispatch()

  // useSelector
  const isCenterAdded = useSelector((state) => state.centerManAdmin.isCenterAdded)
  const isLoading = useSelector((state) => state.centerManAdmin.isLoading)
  const isCenterAddedMessage = useSelector((state) => state.centerManAdmin.resMessage)

  // custom hook
  const { countryid, setCountryid, stateid, setStateid, countriesArray, statesArray, districtArray } = useAddress()

  const previousProps = useRef({
    isCenterAdded
  }).current

  useEffect(() => {
    if (previousProps?.isCenterAdded !== isCenterAdded) {
      if (isCenterAdded) {
        enqueueSnackbar(`${isCenterAddedMessage}`, {
          variant: 'success',
          hide: 2000,
          autoHide: true
        })
        navigate('/admin/center-management')
      } else if (isCenterAdded === false) {
        enqueueSnackbar(`${isCenterAddedMessage}`, {
          variant: 'error',
          hide: 2000,
          autoHide: true,
          TransitionComponent: 'Fade'
        })
      }
    }
    return () => {
      previousProps.isCenterAdded = isCenterAdded
    }
  }, [isCenterAdded])

  // useForm
  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
    setValue
  } = useForm({
    resolver: yupResolver(validationSchemaCenter)
  })

  const onSubmit = (data) => {
    const centerData = {
      title: data.name,
      email: data.email,
      mobile: data.mobileNumber,
      country_id: +data.country.id,
      state_id: +data.state.id,
      city_id: +data.district.id
    }
    if (centerData) {
      dispatch(addCenterAction(centerData, token))
    }
  }

  return (
    <>
          {/* <Header /> */}
          <TitleHeader name='Add' title='Add New Center' />
          <div className='main-layout whitebox-layout my-editprofile-page'>
            <Form className='light-bg' onSubmit={handleSubmit(onSubmit)}>
              <div className='heading-box'>
                <h5>Add Center</h5>
                <div className='btn-box'>
                  <button
                    className='theme-btn dark-btn text-none'
                    onClick={() => navigate(-1)}
                  >
                    Cancel
                  </button>
                  <button className='theme-btn text-none'>Save {isLoading && <Spinner animation='border' size="sm" />}</button>
                </div>
              </div>
              <div className='light-bg-box'>
                <div className='row'>
                  {/* <div className='col-xxl-3 '></div> */}
                  <div className='col-xxl-12'>
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
                            placeholder='Enter Name'
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
                                          getOptionLabel={(option) =>
                                            option?.title
                                          }
                                          getOptionValue={(option) =>
                                            option?.id
                                          }
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
                      <div className='col-lg-6'>
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
                                          getOptionLabel={(option) =>
                                            option?.title
                                          }
                                          getOptionValue={(option) =>
                                            option?.id
                                          }
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
                    </div>
                  </div>
                </div>
              </div>
            </Form>
          </div>
    </>
  )
}

export default AddNewCenter
