import React, { useEffect } from 'react'
/* Components */
import TitleHeader from '../../../Components/TitleHeader'

import { useNavigate, useParams } from 'react-router-dom'
import { Form } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { getSpecificStudentCen } from '../../../Actions/Center/student'
function ViewStudentCen () {
  // Constant
  const { id } = useParams()
  const dispatch = useDispatch()
  const token = localStorage.getItem('token')
  const navigate = useNavigate()

  // useSelector
  const mainData = useSelector(state => state.studentCenter.resData)

  useEffect(() => {
    dispatch(getSpecificStudentCen(+id, token))
  }, [])

  return (
    <>
          {/* <Header /> */}
          <TitleHeader name="View" title="View Students" />
          <div className="main-layout whitebox-layout my-editprofile-page">
            <Form >
            <div className="heading-box">
                  <h5>View Student</h5>
                  <div className="btn-box">
                    <button className="theme-btn dark-btn text-none" onClick={() => navigate('/center/students-management')}>
                      Cancel
                    </button>
                  </div>
                </div>
              <div className="light-bg-box">
                <div className="row">
                  <div className="col-xxl-12">
                    <div className="row">
                      <div className="col-lg-12">
                        <h4>Student Details</h4>
                      </div>
                      <div className="col-lg-6">
                        <Form.Group className="form-group" controlId="firstname">
                          <Form.Label>First Name</Form.Label>
                          <Form.Control placeholder="Enter Full Name"
                            type="text" value={mainData?.first_name} disabled
                          />
                        </Form.Group>
                      </div>
                      <div className="col-lg-6">
                        <Form.Group className="form-group" controlId="lasyname">
                          <Form.Label>Last Name</Form.Label>
                          <Form.Control placeholder="Enter Full Name"
                            type="text" value={mainData?.last_name} disabled
                          />
                        </Form.Group>
                      </div>
                      <div className="col-lg-6">
                        <Form.Group className="form-group" controlId="middlename">
                          <Form.Label>Middle Name</Form.Label>
                          <Form.Control placeholder="Enter Full Name"
                            type="text" value={mainData?.middle_name || '-'} disabled
                          />
                        </Form.Group>
                      </div>
                      <div className="col-lg-6">
                        <Form.Group className="form-group" controlId="mothername">
                          <Form.Label>Mother&apos;s Name</Form.Label>
                          <Form.Control placeholder="Enter Mother’s Name"
                            type="text" value={mainData?.mother_name || '-'} disabled
                          />
                        </Form.Group>
                      </div>
                      <div className="col-lg-6">
                        <Form.Group className="form-group" controlId="fathername">
                          <Form.Label>Father&apos;s Name</Form.Label>
                          <Form.Control placeholder="Enter Father’s Name"
                            type="text" value={mainData?.father_name || '-'} disabled
                          />
                        </Form.Group>
                      </div>
                      <div className="col-lg-6">
                        <Form.Group className="form-group" controlId="formdate">
                          <Form.Label>Date Of Birth</Form.Label>
                          <Form.Control
                            type="date" value={mainData?.dob} disabled />
                        </Form.Group>
                      </div>
                      <div className="col-lg-6">
                        <Form.Group className="form-group" controlId="formBasicmobile">
                          <Form.Label>Mobile Number</Form.Label>
                          <div className="position-relative">
                            <Form.Control placeholder="Enter Mobile Number"
                              type="tel" value={mainData?.mobile} disabled
                            />
                          </div>
                        </Form.Group>
                      </div>
                      <div className="col-lg-6">
                        <Form.Group className="form-group verified" controlId="formBasicEmail">
                          <Form.Label>Email ID</Form.Label>
                          <div className="position-relative">
                            <Form.Control placeholder="Enter Email ID"
                              type="email" value={mainData?.email} disabled
                            />
                          </div>
                        </Form.Group>
                      </div>
                      <div className="col-lg-12">
                        <div className="row">
                          <div className="col-md-6">
                            <div className="row">
                              <div className="col-xl-6">
                                <Form.Group
                                  className="form-group common-select-style"
                                  controlId="formCountry"
                                >
                                  <Form.Label>Country</Form.Label>
                                  <Form.Control type="text" value={mainData?.studentDetails?.countries?.title} disabled />
                                </Form.Group>
                              </div>
                              <div className="col-xl-6">
                                <Form.Group
                                  className="form-group common-select-style"
                                  controlId="formState"
                                >
                                  <Form.Label>State</Form.Label>
                                  <Form.Control type="text" value={mainData?.studentDetails?.states?.title} disabled />
                                </Form.Group>
                              </div>
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="row">
                              <div className="col-xl-6">
                                <Form.Group
                                  className="form-group common-select-style"
                                  controlId="formDistrict"
                                >
                                  <Form.Label>District</Form.Label>
                                  <Form.Control type="text" value={mainData?.studentDetails?.cities?.title} disabled />
                                </Form.Group>
                              </div>
                              <div className="col-xl-6">
                                <Form.Group className="form-group" controlId="formpincode1">
                                  <Form.Label>PIN Code</Form.Label>
                                  <Form.Control
                                    type="text"
                                    value={mainData?.studentDetails?.pin_code || '-'} disabled
                                  />
                                </Form.Group>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-lg-12">
                          <h4>Education Details</h4>
                        </div>
                        <div className="col-lg-6">
                          <Form.Group className="form-group common-select-style" controlId="HighestQualification ">
                            <Form.Label> Grade</Form.Label>
                            <Form.Control type="text" Value={mainData?.studentDetails?.grades?.title} disabled />
                          </Form.Group>
                        </div>
                        <div className="col-lg-6">
                          <Form.Group className="form-group common-select-style" controlId="formBoard">
                            <Form.Label>Board</Form.Label>
                            <Form.Control type="text" value={mainData?.studentDetails?.boards?.title} disabled />
                          </Form.Group>
                        </div>
                       <div className="col-12">
                        <div className="row">
                        <div className="col-lg-6">
                          <Form.Group className="form-group common-select-style" controlId="HighestQualification ">
                            <Form.Label>School Name</Form.Label>
                            <Form.Control type="text" value={mainData?.studentDetails?.school_name || '-'} disabled />
                          </Form.Group>
                        </div>
                        <div className="col-lg-6">
                          <Form.Group className="form-group common-select-style" controlId="HighestQualification ">
                            <Form.Label>Counsellor</Form.Label>
                            <Form.Control type="text" value={mainData?.counselors?.first_name + ' ' + mainData?.counselors?.last_name } disabled />
                          </Form.Group>
                        </div>
                        </div>
                       </div>
                       <div className="col-12">
                        <div className="row">
                        <div className="col-lg-6">
                          <Form.Group className="form-group common-select-style" controlId="HighestQualification ">
                            <Form.Label>Science Dropped</Form.Label>
                            <Form.Control type="text" value={mainData?.science_dropped ? 'Yes' : 'No'} disabled />
                          </Form.Group>
                        </div>
                        <div className="col-lg-6">
                          <Form.Group className="form-group common-select-style" controlId="HighestQualification ">
                            <Form.Label>Math Dropped</Form.Label>
                            <Form.Control type="text" value={mainData?.math_dropped ? 'Yes' : 'No'} disabled />
                          </Form.Group>
                        </div>
                        </div>
                       </div>
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

export default ViewStudentCen
