import React, { useEffect } from 'react'
import { Form, Spinner } from 'react-bootstrap'
import Header from '../../../Components/Header'
import TitleHeader from '../../../Components/TitleHeader'
import { useNavigate, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { getSpecificCareerProfileData } from '../../../Actions/Admin/careerProfile'
import PdfIcon from '../../../assets/images/pdf-icon.svg'
function ViewCareerProfile () {
  // Constatnt
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const token = localStorage.getItem('token')
  const { id } = useParams()

  // useEffect to get data by ID
  useEffect(() => {
    dispatch(getSpecificCareerProfileData(Number(id), token))
  }, [])

  // useSelector
  const mainData = useSelector((state) => state.careerProfile.resData)
  return (
    <>
          <Header />
          <TitleHeader name='View Career Profile' title='Career Profile' />
          <div className='main-layout'>
            <div className='heading-box'>
              <h5>View Career Profile</h5>
              <div className='btn-box'>
                <button
                  className='theme-btn dark-btn text-none'
                  onClick={() => navigate(-1)}
                >
                  Cancel
                </button>
              </div>
            </div>
            {mainData[0]?.id
              ? (
              <div className='form-middle-layout'>
                <Form className='light-bg'>
                  <div className='row'>
                    <div className='col-md-6'>
                      <Form.Group
                        className='form-group'
                        controlId='formprofiletype'
                      >
                        <Form.Label>Profile Type</Form.Label>
                        <Form.Control
                          type='text'
                          disabled
                          value={mainData[0]?.profile_type}
                        />
                      </Form.Group>
                    </div>
                    <div className='col-md-6'>
                      <Form.Group
                        controlId='formFile'
                        className='form-group resume-file-input'
                      >
                        <Form.Label>File</Form.Label>
                        <div>
                          <a
                            href={`${process.env.REACT_APP_AXIOS_BASE_URL}${mainData[0]?.path}`}
                            target='_blank'
                            rel='noreferrer'
                          >
                            <img src={PdfIcon} alt='ollato-img' />
                             {' '}Resume
                          </a>
                        </div>
                      </Form.Group>
                    </div>
                    <div className='col-md-12'>
                      <h4 className='black-font mb-4'>Profile Details</h4>
                      <div className='addmoreaddbox d-flex align-items-start'>
                        <div className='option-item'>
                          <div className='optionitembox'>
                            <Form.Group
                              className='form-group'
                              controlId='formsubprofile'
                            >
                              <Form.Label>Sub Profile</Form.Label>
                              {mainData[0]?.career_detail.map((data, i) => {
                                return (
                                  <>
                                    <Form.Control
                                      type='text'
                                      disabled
                                      placeholder='Enter Sub Profile'
                                      key={i}
                                      value={data?.profile_type_det}
                                    />
                                  </>
                                )
                              })}
                            </Form.Group>
                          </div>
                        </div>
                      </div>
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

export default ViewCareerProfile
