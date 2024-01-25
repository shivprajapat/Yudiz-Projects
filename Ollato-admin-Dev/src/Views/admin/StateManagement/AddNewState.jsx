import React, { useEffect, useRef } from 'react'
import { Form } from 'react-bootstrap'
import Select from 'react-select'
import Header from '../../../Components/Header'
import TitleHeader from '../../../Components/TitleHeader'
import { useNavigate } from 'react-router-dom'
import { useSnackbar } from 'react-notistack'

import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm, Controller } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import { addStateAction } from '../../../Actions/Admin/states'
import { useAddress } from '../../../Shared/Hooks/UseAddress'

const validationSchema = yup.object().shape({
  country: yup
    .object()
    .nullable()
    .required('Country is required'),
  stateName: yup.string().required('State Name is required').matches(/^[aA-zZ\s]+$/, 'Special Charaters & Numbers are not Allowed'),
  stateAbbreviation: yup.string().required('State Abbreviation is required').matches(/^[aA-zZ\s]+$/, 'Special Charaters & Numbers are not Allowed')
})

function AddNewState () {
  const navigate = useNavigate()
  const token = localStorage.getItem('token')
  const { enqueueSnackbar } = useSnackbar()
  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm({
    resolver: yupResolver(validationSchema)
  })

  const dispatch = useDispatch()

  // custom hook
  const { countriesArray } = useAddress()

  // useselector
  const isStateDataAdded = useSelector((state) => state.state.isStateAdded)
  const isStateAddedMessage = useSelector((state) => state.state.resMessage)
  const previousProps = useRef({ countriesArray }).current

  const onSubmit = (data) => {
    const stateData = {
      title: data.stateName,
      countyId: +data.country.id,
      abbreviation: data.stateAbbreviation
    }
    if (stateData) {
      dispatch(addStateAction(stateData, token))
    }
    reset()
  }

  useEffect(() => {
    if (previousProps?.isStateDataAdded !== isStateDataAdded) {
      if (isStateDataAdded) {
        enqueueSnackbar(`${isStateAddedMessage}`, {
          variant: 'success',
          hide: 2000,
          autoHide: true
        })
        navigate('/admin/state-management')
      } else if (isStateDataAdded === false) {
        enqueueSnackbar(`${isStateAddedMessage}`, {
          variant: 'error',
          hide: 2000,
          autoHide: true,
          TransitionComponent: 'Fade'
        }
        )
      }
    }
    return () => {
      previousProps.isStateDataAdded = isStateDataAdded
    }
  }, [isStateDataAdded])

  return (
    <>
          <Header />
          <TitleHeader name='State' />
          <div className='main-layout'>
            <div className='heading-box'>
              <h5>Add State</h5>
              <div className='btn-box'>
                <button
                  className='theme-btn dark-btn text-none'
                  onClick={() => navigate(-1)}
                >
                  Cancel
                </button>
                <button className='theme-btn text-none' onClick={handleSubmit(onSubmit)} >Save</button>
              </div>
            </div>
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
                                        />
                        )}
                      />
                      <p className='error-msg'>
                        {errors.country?.message ||
                          errors.country?.label.message}
                      </p>
                    </Form.Group>
                  </div>
                  <div className='col-md-6'>
                    <Form.Group
                      className='form-group'
                      controlId='formstatename'
                    >
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
                    <Form.Group
                      className='form-group'
                      controlId='formstatename'
                    >
                      <Form.Label>State Abbreviation</Form.Label>
                      <Form.Control
                          type='text'
                          placeholder='Enter State Abbreviation'
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
          </div>
    </>
  )
}

export default AddNewState
