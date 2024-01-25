import React, { useEffect, useRef } from 'react'
import { Form, Spinner } from 'react-bootstrap'
import Select from 'react-select'
import Header from '../../../Components/Header'
import TitleHeader from '../../../Components/TitleHeader'
import { useNavigate, useParams } from 'react-router-dom'
import * as yup from 'yup'
import { Controller, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import {
  editSpecificCity,
  getSpecificCityData
} from '../../../Actions/Admin/cities'
import { useDispatch, useSelector } from 'react-redux'
import { useSnackbar } from 'react-notistack'
import { useAddress } from '../../../Shared/Hooks/UseAddress'

const validationSchema = yup.object().shape({
  cityName: yup
    .string()
    .required('City is required')
    .matches(/^[aA-zZ\s]+$/, 'Special Charaters & Numbers are not Allowed')
    .min(2, 'City Name must be at least 2 characters')
    .max(20, 'City Name must be at most 20 characters'),
  country: yup
    .object()
    .nullable()
    .required('Country is required'),
  state: yup
    .object()
    .nullable()
    .required('State is required'),
  cityAbbreviation: yup
    .string()
    .required('City Abbreviation is required')
    .matches(/^[aA-zZ\s]+$/, 'Special Charaters & Numbers are not Allowed')
    .min(2, 'City Abbreviation must be at least 2 characters')
    .max(10, 'City Abbreviation must be at most 10 characters')
})

function EditCity () {
  // Constant
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const token = localStorage.getItem('token')
  const { id } = useParams()
  const { enqueueSnackbar } = useSnackbar()

  // custom hook
  const { setCountryid, countriesArray, statesArray } = useAddress()

  // useSelector
  const mainData = useSelector((state) => state.city.resData)
  const isEditedData = useSelector((state) => state.city.isCityEdited)
  const editedResMessage = useSelector((state) => state.city.resMessage)

  // previousProps
  const previousProps = useRef({
    statesArray,
    countriesArray,
    editedResMessage,
    isEditedData
  }).current

  // useEffect to get data
  useEffect(() => {
    dispatch(getSpecificCityData(Number(id), token))
  }, [])

  // useForm
  const {
    control,
    register,
    handleSubmit,
    getValues,
    formState: { errors },
    reset
  } = useForm({
    resolver: yupResolver(validationSchema)
  })

  // onSubmit
  const onSubmit = (data) => {
    const cityData = {
      countyId: +data.country.id,
      stateId: data.state.id,
      title: data.cityName,
      abbreviation: data.cityAbbreviation,
      id: mainData?.id
    }
    if (cityData) {
      dispatch(editSpecificCity(cityData, token))
    }
    reset()
  }

  // reSet Form
  useEffect(() => {
    if (mainData) {
      setCountryid(mainData?.country?.id)
      reset({
        country: {
          id: mainData?.country?.id,
          title: mainData?.country?.title
        },
        state: {
          id: mainData?.states?.id,
          title: mainData?.states?.title
        },
        cityName: mainData?.title,
        cityAbbreviation: mainData?.abbreviation
      })
    }
  }, [mainData])

  // Notification for Edit
  useEffect(() => {
    if (previousProps?.isEditedData !== isEditedData) {
      if (isEditedData) {
        enqueueSnackbar(`${editedResMessage}`, {
          variant: 'success',
          hide: 2000,
          autoHide: true
        })
        navigate('/admin/city-management')
      } else if (isEditedData === false) {
        enqueueSnackbar(`${editedResMessage}`, {
          variant: 'error',
          hide: 2000,
          autoHide: true,
          TransitionComponent: 'Fade'
        })
      }
    }
    return () => {
      previousProps.isEditedData = isEditedData
    }
  }, [isEditedData])
  return (
    <>
      <Header />
      <TitleHeader name='City' title='City' />
      <div className='main-layout'>
        <div className='heading-box'>
          <h5>Edit City</h5>
          <div className='btn-box'>
            <button
              className='theme-btn dark-btn text-none'
              onClick={() => navigate(-1)}
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
        {mainData?.id
          ? (
          <div className='form-middle-layout'>
            <Form className='light-bg'>
              <div className='row'>
                <div className='col-md-6'>
                  <Form.Group
                    className='form-group common-select-style'
                    controlId='formfullname'
                  >
                    <Form.Label>Country Name</Form.Label>
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
                      {errors.country?.message || errors.country?.label.message}
                    </p>
                  </Form.Group>
                </div>
                <div className='col-md-6'>
                  <Form.Group
                    className='form-group common-select-style'
                    controlId='formstatename'
                  >
                    <Form.Label>State Name</Form.Label>
                    <Controller
                      name='state'
                      control={control}
                      render={({ field }) => (
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
                          }}
                        />
                      )}
                    />
                    <p className='error-msg'>
                      {errors.state?.message || errors.state?.label.message}
                    </p>
                  </Form.Group>
                </div>
                <div className='col-md-6'>
                  <Form.Group className='form-group' controlId='formcityname'>
                    <Form.Label>City Name</Form.Label>
                    <Form.Control
                      type='text'
                      placeholder='Enter City Name'
                      {...register('cityName', {
                        required: 'true'
                      })}
                    />
                    {errors.cityName?.message && (
                      <Form.Text className='error-msg'>
                        {errors.cityName?.message}
                      </Form.Text>
                    )}
                  </Form.Group>
                </div>
                <div className='col-md-6'>
                  <Form.Group className='form-group' controlId='formcityname'>
                    <Form.Label>City Abbreviation</Form.Label>
                    <Form.Control
                      type='text'
                      placeholder='Enter City abbreviation'
                      {...register('cityAbbreviation', {
                        required: 'true'
                      })}
                    />
                    {errors.cityAbbreviation?.message && (
                      <Form.Text className='error-msg'>
                        {errors.cityAbbreviation?.message}
                      </Form.Text>
                    )}
                  </Form.Group>
                </div>
              </div>
            </Form>
          </div>
            )
          : (
          <Spinner animation='border' />
            )}
      </div>
    </>
  )
}

export default EditCity
