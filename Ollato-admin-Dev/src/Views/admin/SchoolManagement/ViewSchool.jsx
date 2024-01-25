import React, { useEffect } from 'react'
import { Form } from 'react-bootstrap'
// import Select from 'react-select'
import { useNavigate, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'

/* Components */
import Header from '../../../Components/Header'
import TitleHeader from '../../../Components/TitleHeader'

/* Action file */
import { getSpecificSchoolData } from '../../../Actions/Admin/school'
import { getAllBoardsAction } from '../../../Actions/auth'

function ViewSchool () {
  const navigate = useNavigate()
  const params = useParams()
  const dispatch = useDispatch()
  const id = params.id
  const token = localStorage.getItem('token')
  const specificSchoolData = useSelector(state => state.school.specificSchoolData)
  const boardData = useSelector(state => state.auth.boardsData)

  useEffect(() => {
    dispatch(getAllBoardsAction())
    if (id) {
      dispatch(getSpecificSchoolData(Number(id), token))
    }
  }, [id])

  /* Cancel button */
  const handleclick = () => {
    navigate('/admin/school-management')
  }

  return (
    <>
              <Header />
              <TitleHeader name='School'/>
              <div className='main-layout'>
                  <div className="heading-box">
                      <h5>View School</h5>
                      <div className="btn-box">
                        <button type="button" onClick={handleclick} className='theme-btn dark-btn text-none'>Cancel</button>
                      </div>
                  </div>
                    <div className="form-middle-layout">
                      <Form className='light-bg'>
                          <div className="row">
                            <div className="col-md-6">
                              <Form.Group className="form-group" controlId="formschoolfullname">
                                <Form.Label>School Full Name</Form.Label>
                                <Form.Control
                                  type="text"
                                  placeholder="Enter School Full Name"
                                  Value={ specificSchoolData?.title ? specificSchoolData?.title : '-' }
                                  disabled
                                />
                              </Form.Group>
                            </div>
                            <div className="col-md-6">
                              <Form.Group className="form-group" controlId="formschoolabbreviation">
                                <Form.Label>School Abbreviation</Form.Label>
                                <Form.Control
                                  type="text"
                                  placeholder="Enter School Abbreviation"
                                  Value={ specificSchoolData?.abbreviation ? specificSchoolData?.abbreviation : '-' }
                                  disabled
                                />
                              </Form.Group>
                            </div>
                            <div className="col-md-6">
                              <Form.Group className="form-group common-select-style" controlId="formfullname">
                                <Form.Label>Country</Form.Label>
                                <Form.Control
                                  type="text"
                                  value={specificSchoolData?.countries?.title}
                                  disabled
                                />
                              </Form.Group>
                            </div>
                            <div className="col-md-6">
                              <Form.Group className="form-group common-select-style" controlId="formfullname">
                                <Form.Label>State</Form.Label>
                                <Form.Control
                                  type="text"
                                  placeholder="Enter School Abbreviation"
                                  value={specificSchoolData?.states?.title}
                                  disabled
                                />
                              </Form.Group>
                            </div>
                            <div className="col-md-6">
                              <Form.Group className="form-group common-select-style" controlId="formfullname">
                                <Form.Label>District</Form.Label>
                                <Form.Control
                                  type="text"
                                  placeholder="Enter School Abbreviation"
                                  value={specificSchoolData?.city?.title}
                                  disabled
                                />
                              </Form.Group>
                            </div>
                            <div className="col-md-6">
                              <Form.Group className="form-group common-select-style" controlId="formfullname">
                                <Form.Label>Board</Form.Label>
                                <Form.Control
                                  type="text"
                                  placeholder="Enter School Abbreviation"
                                 value={boardData?.find(i => i.id === specificSchoolData?.board_id)?.title}
                                  disabled
                                />
                              </Form.Group>
                            </div>
                            <div className="col-md-6">
                              <Form.Group className="form-group" controlId="formaddressline1">
                                <Form.Label>Address Line 1</Form.Label>
                                <Form.Control
                                  type="text"
                                  placeholder="Enter Address Line 1"
                                  Value={ specificSchoolData?.address_1 ? specificSchoolData?.address_1 : '-' }
                                  disabled
                                />
                              </Form.Group>
                            </div>
                            <div className="col-md-6">
                              <Form.Group className="form-group" controlId="formaddressline2">
                                <Form.Label>Address Line 2</Form.Label>
                                <Form.Control
                                  type="text"
                                  placeholder="Enter Address Line 2"
                                  Value={ specificSchoolData?.address_2 ? specificSchoolData?.address_2 : '-' }
                                  disabled
                                />
                              </Form.Group>
                            </div>
                            <div className="col-md-6">
                              <Form.Group className="form-group" controlId="formpincode1">
                                <Form.Label>PIN Code</Form.Label>
                                <Form.Control
                                  type="number"
                                  placeholder="Enter PIN Code"
                                  Value={ specificSchoolData?.pin_code ? specificSchoolData?.pin_code : '-' }
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

export default ViewSchool
