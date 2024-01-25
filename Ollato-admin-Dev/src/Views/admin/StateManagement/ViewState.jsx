import React, { useEffect, useRef, useState } from 'react'
import { Form, Spinner } from 'react-bootstrap'
import Header from '../../../Components/Header'
import TitleHeader from '../../../Components/TitleHeader'
import { useNavigate, useParams } from 'react-router-dom'

import { useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import { getAllCountriesAction } from '../../../Actions/auth'
import { getSpecificState } from '../../../Actions/Admin/states'

function ViewState () {
  // Constant
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const token = localStorage.getItem('token')
  const { id } = useParams()

  // useSelector
  const countryArry = useSelector((state) => state.auth.countriesData)
  const mainData = useSelector((state) => state.state.resData)
  const isEditedData = useSelector((state) => state.state.isStateEdited)
  const [country, setCountry] = useState([])
  const editedResMessage = useSelector((state) => state.state.resMessage)

  // previousProps
  const previousProps = useRef({
    countryArry,
    editedResMessage,
    isEditedData
  }).current
  const { register, reset } = useForm({})

  // useEffect to get data
  useEffect(() => {
    dispatch(getSpecificState(Number(id), token))
    dispatch(getAllCountriesAction())
  }, [])

  // For Country Array
  useEffect(() => {
    if (previousProps?.countriesArray !== countryArry) {
      const array = []
      if (countryArry) {
        // eslint-disable-next-line array-callback-return
        countryArry.map((data) => {
          array.push({
            value: data.id,
            label: data.title
          })
        })
        setCountry(array)
      }
    }
    return () => {
      previousProps.countriesArray = countryArry
    }
  }, [countryArry])

  useEffect(() => {
    if (mainData && country?.length) {
      const contryV = country.filter((c) => c.value === mainData?.county_id)[0]
      reset({
        country: contryV,
        stateName: mainData?.title,
        stateAbbreviation: mainData?.abbreviation
      })
    }
  }, [mainData, country])

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
                        <Form.Control
                          type='text'
                          disabled
                          {...register('country.label', {
                            required: 'true'
                          })}
                        />
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
                          disabled
                          {...register('stateName', {
                            required: 'true'
                          })}
                        />
                      </Form.Group>
                    </div>
                    <div className='col-md-6'>
                      <Form.Group className='form-group'>
                        <Form.Label>State Abbreviation</Form.Label>
                        <Form.Control
                          type='text'
                          disabled
                          {...register('stateAbbreviation', {
                            required: 'true'
                          })}
                        />
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

export default ViewState
