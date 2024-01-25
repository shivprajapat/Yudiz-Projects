import React, { useEffect } from 'react'
/* Components */

import TitleHeader from '../../../Components/TitleHeader'

import { useNavigate, useParams } from 'react-router-dom'
import { Form } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { getSpecificCenter } from '../../../Actions/Admin/center'
function ViewCenter () {
  // Constant
  const { id } = useParams()
  const dispatch = useDispatch()
  const token = localStorage.getItem('token')
  const navigate = useNavigate()

  // useSelector
  const mainData = useSelector(state => state.centerManAdmin.resData)

  useEffect(() => {
    dispatch(getSpecificCenter(+id, token))
  }, [])

  return (
    <>
          {/* <Header /> */}
          <TitleHeader name='View' title='View Center' />
          <div className='main-layout whitebox-layout my-editprofile-page'>
            <Form className='light-bg'>
              <div className='heading-box'>
                <h5>View Center</h5>
                <div className='btn-box'>
                  <button
                    className='theme-btn dark-btn text-none'
                    onClick={() => navigate('/admin/center-management')}
                  >
                    Cancel
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
                          className='form-group'
                          controlId='title'
                        >
                          <Form.Label>Title</Form.Label>
                          <Form.Control
                            placeholder='Enter Title'
                            type='text'
                            value={mainData?.title}
                            disabled
                          />
                        </Form.Group>
                      </div>
                      <div className='col-lg-6'>
                        <Form.Group
                          controlId='formBasicEmail'
                          className='form-group'
                        >
                          <Form.Label>Mobile Number</Form.Label>
                          <Form.Control
                            placeholder='Enter Mobile Number'
                            type='text'
                           value={mainData?.mobile}
                           disabled
                          />
                        </Form.Group>
                      </div>
                      <div className='col-lg-6'>
                        <Form.Group
                          className='form-group'
                          controlId='formBasicEmail'
                        >
                          <Form.Label>Email ID</Form.Label>
                          <div className='position-relative'>
                            <Form.Control
                              placeholder='Enter Email ID'
                              type='email'
                              value={mainData?.email}
                              disabled
                            />
                          </div>
                        </Form.Group>
                      </div>
                      <div className='col-lg-6'>
                        <Form.Group
                          className='form-group common-select-style'
                          controlId='formfullname'
                        >
                          <Form.Label>Country</Form.Label>
                          <Form.Control
                              type='text'
                              value={mainData?.country?.title}
                              disabled
                            />
                        </Form.Group>
                      </div>
                      <div className='col-lg-6'>
                      <Form.Group
                          className='form-group common-select-style'
                          controlId='formfullname'
                        >
                          <Form.Label>State</Form.Label>
                          <Form.Control
                              placeholder='Enter Email ID'
                              type='text'
                              value={mainData?.states?.title}
                              disabled
                            />
                        </Form.Group>
                      </div>
                      <div className='col-lg-6'>
                        <Form.Group
                          className='form-group common-select-style'
                          controlId='formfullname'
                        >
                          <Form.Label>District</Form.Label>
                          <Form.Control
                              placeholder='Enter Email ID'
                              type='text'
                              value={mainData?.city?.title}
                              disabled
                            />
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

export default ViewCenter
