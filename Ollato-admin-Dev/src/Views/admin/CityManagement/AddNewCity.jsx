import React, { useEffect, useRef } from 'react'
import { Form } from 'react-bootstrap'
import Select from 'react-select'
import Header from '../../../Components/Header'
import TitleHeader from '../../../Components/TitleHeader'
import { useNavigate } from 'react-router-dom'

import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm, Controller } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import { addCityAction } from '../../../Actions/Admin/cities'
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

function AddNewCity () {
  // Constant
  const navigate = useNavigate()
  const token = localStorage.getItem('token')
  const { enqueueSnackbar } = useSnackbar()
  const dispatch = useDispatch()

  // hooks
  const { countryid, setCountryid, setStateid, countriesArray, statesArray } = useAddress()

  // useSelector
  const isCityDataAdded = useSelector(state => state.city.isCityAdded)
  const isCityAddedMessage = useSelector(state => state.city.resMessage)

  // previousProps
  const previousProps = useRef({
    statesArray,
    countriesArray,
    isCityDataAdded,
    isCityAddedMessage
  }).current

  // useForm
  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue
  } = useForm({
    resolver: yupResolver(validationSchema)
  })

  // onSubmit
  const onSubmit = data => {
    const cityData = {
      countyId: +data.country.id,
      stateId: +data.state.id,
      title: data.cityName,
      abbreviation: data.cityAbbreviation
    }
    if (cityData) {
      dispatch(addCityAction(cityData, token, reset))
    }
  }

  // Notification for Add
  useEffect(() => {
    if (previousProps?.isCityDataAdded !== isCityDataAdded) {
      if (isCityDataAdded) {
        enqueueSnackbar(`${isCityAddedMessage}`, {
          variant: 'success',
          hide: 2000,
          autoHide: true
        })
        navigate('/admin/city-management')
      } else if (isCityDataAdded === false) {
        enqueueSnackbar(`${isCityAddedMessage}`, {
          variant: 'error',
          hide: 2000,
          autoHide: true,
          TransitionComponent: 'Fade'
        })
      }
    }
    return () => {
      previousProps.isCityDataAdded = isCityDataAdded
    }
  }, [isCityDataAdded])
  return (
    <>
          <Header />
          <TitleHeader name="City" />
          <div className="main-layout">
            <Form className="light-bg">
              <div className="heading-box">
                <h5>Add City</h5>
                <div className="btn-box">
                  <button
                    className="theme-btn dark-btn text-none"
                    onClick={e => {
                      e.preventDefault()
                      navigate(-1)
                    }}
                  >
                    Cancel
                  </button>
                  <button className="theme-btn text-none" type="submit" form="my-form" onClick={handleSubmit(onSubmit)}>
                    Save
                  </button>
                </div>
              </div>
              <div className="form-middle-layout">
                <div className="row">
                  <div className="col-md-6">
                    <Form.Group className="form-group common-select-style" controlId="formfullname">
                      <Form.Label>Country Name</Form.Label>
                      <Controller
                        name="country"
                        control={control}
                        render={({ field }) => (
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
                        )}
                      />
                      <p className="error-msg">{errors.country?.message || errors.country?.label.message}</p>
                    </Form.Group>
                  </div>
                  <div className="col-md-6">
                    <Form.Group className="form-group common-select-style" controlId="formfullname">
                      <Form.Label>State Name</Form.Label>
                      <Controller
                        name="state"
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
                          getOptionLabel={(option) =>
                            option?.title
                          }
                          getOptionValue={(option) =>
                            option?.id
                          }
                          isDisabled={!countryid && true}
                        />
                        )}
                      />
                      <p className="error-msg">{errors.state?.message || errors.state?.label.message}</p>
                    </Form.Group>
                  </div>
                  <div className="col-md-6">
                    <Form.Group className="form-group" controlId="formcityname">
                      <Form.Label>City Name</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Enter City Name"
                        {...register('cityName', {
                          required: 'true'
                        })}
                      />
                      {errors.cityName?.message && <Form.Text className="error-msg">{errors.cityName?.message}</Form.Text>}
                    </Form.Group>
                  </div>
                  <div className="col-md-6">
                    <Form.Group className="form-group" controlId="formcityname">
                      <Form.Label>City Abbreviation</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Enter City abbreviation"
                        {...register('cityAbbreviation', {
                          required: 'true'
                        })}
                      />
                      {errors.cityAbbreviation?.message && <Form.Text className="error-msg">{errors.cityAbbreviation?.message}</Form.Text>}
                    </Form.Group>
                  </div>
                </div>
              </div>
            </Form>
          </div>
    </>
  )
}

export default AddNewCity
