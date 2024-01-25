import React, { useEffect, useRef } from 'react'
import { Form, Spinner } from 'react-bootstrap'
import Select from 'react-select'
import Header from '../../../Components/Header'
import TitleHeader from '../../../Components/TitleHeader'
import { useNavigate, useParams } from 'react-router-dom'

import * as yup from 'yup'
import { Controller, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { useDispatch, useSelector } from 'react-redux'
import {
  editSpecificState,
  getSpecificState
} from '../../../Actions/Admin/states'
import { useSnackbar } from 'react-notistack'
import { useAddress } from '../../../Shared/Hooks/UseAddress'

const validationSchema = yup.object().shape({
  country: yup.object().nullable().required('Country is required'),
  stateName: yup
    .string()
    .required('State Name is required')
    .matches(/^[aA-zZ\s]+$/, 'Special Charaters & Numbers are not Allowed'),
  stateAbbreviation: yup
    .string()
    .required('State Abbreviation is required')
    .matches(/^[aA-zZ\s]+$/, 'Special Charaters & Numbers are not Allowed')
})
function EditState () {
  // Constant
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const token = localStorage.getItem('token')
  const { id } = useParams()
  const { enqueueSnackbar } = useSnackbar()

  // custom hook
  const { countriesArray, setCountryid } = useAddress()

  // useSelector
  const mainData = useSelector((state) => state.state.resData)
  const isEditedData = useSelector((state) => state.state.isStateEdited)
  const editedResMessage = useSelector((state) => state.state.resMessage)

  // previousProps
  const previousProps = useRef({
    editedResMessage,
    isEditedData
  }).current

  // useForm
  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm({
    resolver: yupResolver(validationSchema)
  })

  // useEffect to get data
  useEffect(() => {
    dispatch(getSpecificState(Number(id), token))
  }, [])

  // reSet Form
  useEffect(() => {
    if (mainData) {
      reset({
        country: {
          id: mainData?.country?.id,
          title: mainData?.country?.title
        },
        stateName: mainData?.title,
        stateAbbreviation: mainData?.abbreviation
      })
    }
  }, [mainData])

  // onSubmit
  const onSubmit = (data) => {
    const stateData = {
      countyId: +data.country.id,
      title: data.stateName,
      abbreviation: data.stateAbbreviation,
      custom_id: 'r2uvmulx',
      id: mainData.id
    }
    if (stateData) {
      dispatch(editSpecificState(stateData, token))
    }
  }

  // Notification for Edit
  useEffect(() => {
    if (previousProps?.isEditedData !== isEditedData) {
      if (isEditedData) {
        enqueueSnackbar(`${editedResMessage}`, {
          variant: 'success',
          hide: 2000,
          autoHide: true
        })
        navigate('/admin/state-management')
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
      <TitleHeader title='State' name='State' />
      <div className='main-layout'>
        <div className='heading-box'>
          <h5>Edit State</h5>
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
                      {errors.country?.message || errors.country?.label.message}
                    </p>
                  </Form.Group>
                </div>
                <div className='col-md-6'>
                  <Form.Group className='form-group' controlId='formstatename'>
                    <Form.Label>State Name</Form.Label>
                    <Form.Control
                      type='text'
                      placeholder='Enter State Name'
                      {...register('stateName', {
                        required: 'true'
                      })}
                    />
                    {errors.stateName?.message && (
                      <Form.Text className='error-msg'>
                        {errors.stateName?.message}
                      </Form.Text>
                    )}
                  </Form.Group>
                </div>
                <div className='col-md-6'>
                  <Form.Group className='form-group'>
                    <Form.Label>State Abbreviation</Form.Label>
                    <Form.Control
                      type='text'
                      placeholder='Enter State abbreviation'
                      {...register('stateAbbreviation', {
                        required: 'true'
                      })}
                    />
                    {errors.stateAbbreviation?.message && (
                      <Form.Text className='error-msg'>
                        {errors.stateAbbreviation?.message}
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

export default EditState
