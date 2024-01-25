import React, { useEffect, useState } from 'react'
import { Form, Spinner } from 'react-bootstrap'
import Header from '../../../Components/Header'
import TitleHeader from '../../../Components/TitleHeader'
import { useDispatch, useSelector } from 'react-redux'
import { getSpecificsoftwareMetricsData } from '../../../Actions/Admin/softwareMetrix'
import { useNavigate, useParams } from 'react-router-dom'
import { getAllSubCategory } from '../../../Actions/Admin/Test/Question'
import { profileDetail } from '../../../Actions/Admin/careerProfile'

function ViewSoftwareMatrix () {
  // Constant
  const dispatch = useDispatch()
  const token = localStorage.getItem('token')
  const { id } = useParams()
  const navigate = useNavigate()

  // useSelector
  const mainData = useSelector((state) => state.softwareMetrics.resData)
  const careerProfileArray = useSelector(
    (state) => state.careerProfile.careerProfileData
  )
  const subTest = useSelector((state) => state.question.testSubCategoryList)

  // useState
  const [profileDetails, setProfileDetails] = useState([])
  const [matrixArray, setMatrixArray] = useState(
    mainData?.softwareAllMatrix || []
  )

  // useEffect
  useEffect(() => {
    dispatch(getSpecificsoftwareMetricsData(Number(id), token))
    dispatch(getAllSubCategory(token))
    dispatch(profileDetail(token))
  }, [])

  useEffect(() => {
    mainData && setMatrixArray(mainData?.softwareAllMatrix)
  }, [mainData])

  // useEffect
  useEffect(() => {
    careerProfileArray &&
      setProfileDetails(
        careerProfileArray?.filter(
          (data) => data?.id === mainData?.career_profile_detail_id
        )
      )
  }, [mainData, careerProfileArray])
  return (
    <>
          <Header />
          <TitleHeader name='View Software Matrix' title='Software Matrix' />
          <div className='main-layout'>
            <div className='heading-box'>
              <h5>View SoftwareMatrix</h5>
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
                        className='form-group'
                        controlId='formtestabbrevation1'
                      >
                        <Form.Label>Test Abbrevation 1</Form.Label>
                        <Form.Control
                          type='text'
                          disabled
                          value={mainData?.test_abb_1}
                        />
                      </Form.Group>
                    </div>
                    <div className='col-md-6'>
                      <Form.Group
                        className='form-group'
                        controlId='formtestabbrevation2'
                      >
                        <Form.Label>Test Abbrevation 2</Form.Label>
                        <Form.Control
                          type='text'
                          disabled
                          value={mainData?.test_abb_2}
                        />
                      </Form.Group>
                    </div>
                    <div className='col-md-6'>
                      <Form.Group
                        className='form-group'
                        controlId='formtestabbrevation3'
                      >
                        <Form.Label>Test Abbrevation 3</Form.Label>
                        <Form.Control
                          type='text'
                          disabled
                          value={mainData?.test_abb_3}
                        />
                      </Form.Group>
                    </div>
                    <div className='col-md-6'>
                      <Form.Group
                        className='form-group common-select-style'
                        controlId='formfullname'
                      >
                        <Form.Label>Profile Details</Form.Label>
                        <Form.Control
                          value={profileDetails[0]?.profile_type_det}
                          disabled
                        />
                      </Form.Group>
                    </div>
                    <div className='col-md-6 align-self-center'>
                      <div className='row align-items-center'>
                        <div className='col-xxl-6'>
                          <Form.Group
                            className='form-group switchbox mb-2 d-flex align-items-center'
                            controlId='formfullname'
                          >
                            <Form.Label className='mb-0'>
                              Math Dropped
                            </Form.Label>
                            <label className='switch'>
                              <input
                                type='checkbox'
                                name='mathDropped'
                                disabled
                                checked={mainData?.math_dropped}
                              />

                              <span className='slider blue' id='round'></span>
                            </label>
                          </Form.Group>
                        </div>
                        <div className='col-xxl-6'>
                          <Form.Group
                            className='form-group switchbox mb-2 d-flex align-items-center'
                            controlId='formfullname'
                          >
                            <Form.Label className='mb-0'>
                              Science Dropped
                            </Form.Label>
                            <label className='switch'>
                              <input
                                type='checkbox'
                                name='scienceDropped'
                                disabled
                                checked={mainData?.science_dropped}
                              />
                              <span className='slider blue' id='round'></span>
                            </label>
                          </Form.Group>
                        </div>
                      </div>
                    </div>
                    <div className='col-md-6'>
                      <Form.Group
                        className='form-group'
                        controlId='formsortorder'
                      >
                        <Form.Label>Sort Order</Form.Label>
                        <Form.Control
                          type='text'
                          disabled
                          value={mainData?.sort_order}
                        />
                      </Form.Group>
                    </div>
                    <div className='software-det-box'>
                      <h4 className='black-font mb-4'>Software Details</h4>

                      {matrixArray?.map((i, count) => {
                        return (
                          <>
                            <div className='grade-profile d-flex align-items-start'>
                              <div className='row addmoreaddbox d-flex align-items-start'>
                                <div className=' col-md-12 '>
                                  <div className='option-item w-100'>
                                    <div className='optionitembox'>
                                      <Form.Group
                                        className='form-group text-input'
                                        controlId='formoption'
                                      >
                                        <Form.Label>Norms Grade</Form.Label>
                                        <Form.Control
                                          type='text'
                                          value={i.norm_values}
                                          disabled
                                        />
                                      </Form.Group>
                                    </div>
                                  </div>
                                </div>
                                <div className='col-md-12'>
                                  <div className='option-item w-100'>
                                    <div className='optionitembox'>
                                      <Form.Group
                                        className='form-group common-select-style'
                                        controlId='formfullname'
                                      >
                                        <Form.Label>Sub Test</Form.Label>
                                        <Form.Control
                                          placeholder={'Select SubTest'}
                                          value={
                                            subTest?.find(
                                              (data) =>
                                                data?.id ===
                                                mainData?.softwareAllMatrix[
                                                  count
                                                ]?.test_detail_id
                                            )?.title
                                          }
                                          disabled
                                        />
                                      </Form.Group>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </>
                        )
                      })}
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

export default ViewSoftwareMatrix
