import React, { useEffect } from 'react'
import { Form } from 'react-bootstrap'
import Header from '../../../Components/Header'
import TitleHeader from '../../../Components/TitleHeader'
import { useNavigate, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { getSpecificPackageData } from '../../../Actions/Admin/package'

function ViewPackage () {
  // Constant
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { id } = useParams()
  const token = localStorage.getItem('token')

  // useSelector
  const mainData = useSelector((state) => state.packages.resData)

  // useEffect to get data by Id
  useEffect(() => {
    dispatch(getSpecificPackageData(Number(id), token))
  }, [])

  return (
    <>
          <Header />
          <TitleHeader name='View Package' title='Package Management' />
          <div className='main-layout'>
            <div className='heading-box'>
              <h5>Add Package</h5>
              <div className='btn-box'>
                <button
                  className='theme-btn dark-btn text-none'
                  onClick={() => navigate(-1)}
                >
                  Cancel
                </button>
              </div>
            </div>
            <div className='form-middle-layout'>
              <Form className='light-bg'>
                <div className='row'>
                  <div className='col-md-12'>
                    <div className='row selected-type'>
                      <div className='col-md-6'>
                        <Form.Group
                          className='form-group common-select-style'
                          controlId='formpackagetype'
                        >
                          <Form.Label>PackageType</Form.Label>
                          <Form.Control
                            value={mainData.package_type}
                            disabled
                          />
                        </Form.Group>
                      </div>
                      <div className='col-md-12 checkbox-packagetype'>
                        <Form.Group
                          className='form-group package-type-checkbox checkbox-box d-flex align-items-center '
                          controlId='formBasicCheckbox'
                        >
                          <Form.Check type='checkbox' id='checkbox-1'>
                            <Form.Check.Input checked={mainData?.online_test} disabled />
                            <Form.Check.Label>Online Test</Form.Check.Label>
                          </Form.Check>
                          <Form.Check type='checkbox' id='checkbox-2'>
                            <Form.Check.Input checked={mainData?.test_report} disabled/>
                            <Form.Check.Label>
                              Report Generation
                            </Form.Check.Label>
                          </Form.Check>
                          <Form.Check type='checkbox' id='checkbox-3'>
                            <Form.Check.Input checked={mainData?.video_call} disabled />
                            <Form.Check.Label>
                              Virtual Counseling
                            </Form.Check.Label >
                          </Form.Check>
                          <Form.Check type='checkbox' id='checkbox-4'>
                            <Form.Check.Input checked={mainData?.f2f_call} disabled />
                            <Form.Check.Label>F2F Counseling</Form.Check.Label>
                          </Form.Check>
                        </Form.Group>
                      </div>
                    </div>
                  </div>
                  <div className='col-md-6'>
                    <Form.Group
                      className='form-group'
                      controlId='formpackagename'
                    >
                      <Form.Label>Package Name</Form.Label>
                      <Form.Control
                        type='text'
                        value={mainData?.title}
                        disabled
                      />
                    </Form.Group>
                  </div>
                  <div className='col-md-6'>
                    <Form.Group
                      className='form-group'
                      controlId='formpackagenumber'
                    >
                      <Form.Label>Package Number</Form.Label>
                      <Form.Control
                        type='number'
                        value={mainData?.package_number}
                        disabled
                      />
                    </Form.Group>
                  </div>
                  <div className='col-md-6'>
                    <Form.Group
                      className='form-group'
                      controlId='formpackageprice'
                    >
                      <Form.Label>Package Price</Form.Label>
                      <Form.Control
                        type='number'
                        value={mainData?.amount}
                        disabled
                      />
                    </Form.Group>
                  </div>
                  <div className='col-md-12'>
                    <Form.Group
                      className='form-group'
                      controlId='formpackagedescription'
                    >
                      <Form.Label>Package Description</Form.Label>
                      <Form.Control
                        as='textarea'
                        className='big-textarea'
                        value={mainData?.description}
                        disabled
                      />
                    </Form.Group>
                  </div>
                </div>
              </Form>
            </div>
          </div>
    </>
  )
}

export default ViewPackage
