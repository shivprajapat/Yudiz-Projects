import React, { useEffect } from 'react'
import { Form, Spinner } from 'react-bootstrap'
import Header from '../../../Components/Header'
import TitleHeader from '../../../Components/TitleHeader'
import { useNavigate, useParams } from 'react-router-dom'
import { getSpecificCityData } from '../../../Actions/Admin/cities'
import { useDispatch, useSelector } from 'react-redux'

function ViewCity () {
  // Constant
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const token = localStorage.getItem('token')
  const { id } = useParams()

  // useSelector
  const mainData = useSelector((state) => state.city.resData)

  // useEffect to get data by id
  useEffect(() => {
    dispatch(getSpecificCityData(Number(id), token))
  }, [])

  return (
    <>
          <Header />
          <TitleHeader name='City' title='City' />
          <div className='main-layout'>
            <div className='heading-box'>
              <h5>View City</h5>
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
                        <Form.Label>Country Name</Form.Label>
                        <Form.Control
                          type='text'
                          value={mainData?.country?.title}
                          disabled
                        />
                      </Form.Group>
                    </div>
                    <div className='col-md-6'>
                      <Form.Group
                        className='form-group common-select-style'
                        controlId='formstatename'
                      >
                        <Form.Label>State Name</Form.Label>
                        <Form.Control
                          type='text'
                          value={mainData?.states?.title}
                          disabled
                        />
                      </Form.Group>
                    </div>
                    <div className='col-md-6'>
                      <Form.Group
                        className='form-group'
                        controlId='formcityname'
                      >
                        <Form.Label>City Name</Form.Label>
                        <Form.Control
                          type='text'
                          value={mainData?.title}
                          disabled
                          placeholder='Enter City Name'
                        />
                      </Form.Group>
                    </div>
                    <div className='col-md-6'>
                      <Form.Group
                        className='form-group'
                        controlId='formcityname'
                      >
                        <Form.Label>City Abbreviation</Form.Label>
                        <Form.Control
                          type='text'
                          value={mainData?.abbreviation}
                          disabled
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

export default ViewCity
