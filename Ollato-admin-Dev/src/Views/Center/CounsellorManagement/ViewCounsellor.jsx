import React, { useCallback, useEffect, useState } from 'react'
/* Components */
import TitleHeader from '../../../Components/TitleHeader'
import PdfIcon from '../../../assets/images/pdf-icon.svg'
import { Form } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import { getSpecificCounsellor } from '../../../Actions/Admin/counsellor'
import moment from 'moment'
import ls from 'localstorage-slim'
import ImageViewer from 'react-simple-image-viewer'
import { useS3Upload } from '../../../Shared/Hooks/UseS3UPload'
// import localStorage from 'react-secure-storage'

// import { Controller } from 'react-hook-form'
function ViewCounsellor () {
  // Constant
  const { id } = useParams()
  const dispatch = useDispatch()
  const token = localStorage.getItem('token')
  const navigate = useNavigate()

  // useState
  const [currentImage, setCurrentImage] = useState(0)
  const [isViewerOpen, setIsViewerOpen] = useState(false)
  const [type, setType] = useState('')
  const [panCard, setPancard] = useState([])
  const [aFront, setAFront] = useState([])
  const [aBack, setABack] = useState([])
  const [sign, setSign] = useState([])
  // useSelector
  const mainData = useSelector((state) => state.counsellorManAdmin.resData)
  const profile = JSON.parse(localStorage.getItem('profile'))
  const adminType = ls.get('admin-type', { decrypt: true, secret: profile?.id })
  const { getImage } = useS3Upload()

  useEffect(() => {
    if (adminType === 'super' || adminType === 'sub') {
      dispatch(getSpecificCounsellor(+id, token, 'admin'))
    } else {
      dispatch(getSpecificCounsellor(+id, token, 'center'))
    }
  }, [])

  const openImageViewer = useCallback((index, pan) => {
    setCurrentImage(index)
    setIsViewerOpen(true)
    setType(pan)
  }, [])

  const closeImageViewer = () => {
    setCurrentImage(0)
    setIsViewerOpen(false)
  }

  useEffect(() => {
    if (mainData?.counsellorDetail) {
      async function getImageUrl () {
        const data = [
          {
            path: mainData?.counsellorDetail?.pan_file,
            flag: 'pancard'
          },
          {
            path: mainData?.counsellorDetail?.adhar_card_number_front,
            flag: 'adharFront'
          },
          {
            path: mainData?.counsellorDetail?.adhar_card_number_back,
            flag: 'adharBack'
          },
          {
            path: mainData?.counsellorDetail?.signature,
            flag: 'signature'
          }
        ]
        const result = await getImage(data, token)
        const array = []
        const array2 = []
        const array3 = []
        const array4 = []
        array.push(result?.url?.pancard)
        array2.push(result?.url?.adharFront)
        array3.push(result?.url?.adharBack)
        array4.push(result?.url?.signature)
        setPancard(array)
        setAFront(array2)
        setABack(array3)
        setSign(array4)
      }
      getImageUrl()
    }
  }, [mainData])

  return (
    <>
      <TitleHeader name='View' title='View Counsellor' />
      <div className='main-layout whitebox-layout my-editprofile-page'>
        <Form className='light-bg'>
          <div className='heading-box'>
            <h5>View Counsellor</h5>
            <div className='btn-box'>
              <button
                className='theme-btn dark-btn text-none'
                onClick={(e) => {
                  navigate(-1)
                  e.preventDefault()
                }}
              >
                Cancel
              </button>
            </div>
          </div>
          <div className='light-bg-box'>
            <div className='row'>
              <div className='col-xxl-12'>
                <div className='row'>
                  <div className='col-lg-12'>
                    <h4>Counsellor Details</h4>
                  </div>
                  <div className='col-lg-6'>
                    <Form.Group className='form-group' controlId='firstName'>
                      <Form.Label>First Name</Form.Label>
                      <Form.Control placeholder='Enter First Name' type='text' value={mainData?.counsellor?.first_name || '-'} disabled />
                    </Form.Group>
                  </div>
                  <div className='col-lg-6'>
                    <Form.Group className='form-group' controlId='firstName'>
                      <Form.Label>Middle Name</Form.Label>
                      <Form.Control placeholder='Enter Middle Name' type='text' value={mainData?.counsellor?.middle_name || '-'} disabled />
                    </Form.Group>
                  </div>
                  <div className='col-lg-6'>
                    <Form.Group className='form-group' controlId='lastName'>
                      <Form.Label>Last Name</Form.Label>
                      <Form.Control placeholder='Enter Last Name' type='text' value={mainData?.counsellor?.last_name || '-'} disabled />
                    </Form.Group>
                  </div>
                  <div className='col-lg-6'>
                    <Form.Group className='form-group' controlId='formdate'>
                      <Form.Label>Date Of Birth</Form.Label>
                      <Form.Control name='dob' type='text' value={moment(mainData?.counsellor?.dob).format('DD-MM-YYYY') || '-'} disabled />
                    </Form.Group>
                  </div>
                  <div className='col-lg-6'>
                    <Form.Group controlId='formBasicEmail' className='form-group'>
                      <Form.Label>Mobile Number</Form.Label>
                      <Form.Control placeholder='Enter Mobile Number' type='text' value={mainData?.counsellor?.mobile || '-'} disabled />
                    </Form.Group>
                  </div>
                  <div className='col-lg-6'>
                    <Form.Group className='form-group verified' controlId='formBasicEmail'>
                      <Form.Label>Email ID</Form.Label>
                      <div className='position-relative'>
                        <Form.Control placeholder='Enter Email ID' type='email' value={mainData?.counsellor?.email || '-'} disabled />
                      </div>
                    </Form.Group>
                  </div>
                  <div className='col-lg-6'>
                    <Form.Group controlId='formBasicEmail' className='form-group'>
                      <Form.Label>Status</Form.Label>
                      <Form.Control placeholder='Enter Mobile Number' type='text' value={mainData?.counsellor?.status || '-'} disabled />
                    </Form.Group>
                  </div>
                  <div className='col-lg-6'>
                    <Form.Group className='form-group verified' controlId='formBasicEmail'>
                      <Form.Label>Commission (%)</Form.Label>
                      <div className='position-relative'>
                        <Form.Control placeholder='Enter Email ID' type='email' value={mainData?.counsellor?.commission || '-'} disabled />
                      </div>
                    </Form.Group>
                  </div>
                  <div className='col-lg-12'>
                    <div className='row'>
                      <div className='col-md-6'>
                        <div className='row'>
                          <div className='col-xl-6'>
                            <Form.Group className='form-group common-select-style' controlId='formCountry'>
                              <Form.Label>Country</Form.Label>
                              <Form.Control type='text' value={mainData?.counsellorDetail?.country?.title || '-'} disabled />
                            </Form.Group>
                          </div>
                          <div className='col-xl-6'>
                            <Form.Group className='form-group common-select-style' controlId='formState'>
                              <Form.Label>State</Form.Label>
                              <Form.Control type='text' value={mainData?.counsellorDetail?.state?.title || '-'} disabled />
                            </Form.Group>
                          </div>
                        </div>
                      </div>
                      <div className='col-md-6'>
                        <div className='row'>
                          <div className='col-xl-6'>
                            <Form.Group className='form-group common-select-style' controlId='formDistrict'>
                              <Form.Label>District</Form.Label>
                              <Form.Control type='text' value={mainData?.counsellorDetail?.city?.title || '-'} disabled />
                            </Form.Group>
                          </div>
                          <div className='col-xl-6'>
                            <Form.Group className='form-group' controlId='formpincode1'>
                              <Form.Label>PIN Code</Form.Label>
                              <Form.Control type='text' value={mainData?.counsellorDetail?.pin_code || '-'} disabled />
                            </Form.Group>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className='col-lg-6'>
                    <Form.Group className='form-group common-select-style' controlId='formfullname'>
                      <Form.Label>Professional Expertness</Form.Label>
                      <Form.Control type='text' value={mainData?.counsellorDetail?.professional_expertness || '-'} disabled />
                    </Form.Group>
                  </div>
                  <div className='col-lg-6'>
                    {mainData?.counsellorDetail?.resume && (
                      <Form.Group controlId='formFile' className='form-group resume-file-input'>
                        <Form.Label>File</Form.Label>
                        <div>
                          <a
                            href={`${process.env.REACT_APP_AXIOS_BASE_URL}${mainData?.counsellorDetail?.resume}`}
                            target='_blank'
                            rel='noreferrer'
                          >
                            <img src={PdfIcon} alt='ollato-img' />
                            {'    '}Resume
                          </a>
                        </div>
                      </Form.Group>
                    )}
                  </div>
                  <div className='col-lg-12 rowspacer'>
                    <div className='p-3'>
                      <div className='row'>
                        <Form.Group
                          controlId='formgstnumber'
                          className='form-group document-file-input common-input-file  uploaded-doc counsellor-checkbox'
                        >
                          <Form.Label>Types :</Form.Label>
                          <Form.Check type='checkbox'>
                            <Form.Check.Input checked={mainData?.counsellor?.career_counsellor === '1'} disabled />
                            <Form.Check.Label>Career Counsellor</Form.Check.Label>
                          </Form.Check>
                          <Form.Check type='checkbox'>
                            <Form.Check.Input
                              name='is_math'
                              type='checkbox'
                              checked={mainData?.counsellor?.psychologist === '1'}
                              disabled
                            />
                            <Form.Check.Label>Psychologist</Form.Check.Label>
                          </Form.Check>
                          <Form.Check type='checkbox'>
                            <Form.Check.Input
                              type='checkbox'
                              name='is_correct_ans'
                              checked={mainData?.counsellor?.overseas_counsellor === '1'}
                              disabled
                            />
                            <Form.Check.Label>Overseas Counsellor</Form.Check.Label>
                          </Form.Check>
                          <Form.Check type='checkbox'>
                            <Form.Check.Input
                              type='checkbox'
                              name='is_correct_ans'
                              checked={mainData?.counsellor?.subject_expert === '1'}
                              disabled
                            />
                            <Form.Check.Label>Subject Expert</Form.Check.Label>
                          </Form.Check>
                        </Form.Group>
                        {/* </div> */}
                      </div>
                    </div>
                  </div>
                  <h4>Other Details</h4>
                  <div className='col-xl-6'>
                    <Form.Group className='form-group common-select-style' controlId='formState'>
                      <Form.Label>Experience</Form.Label>
                      <Form.Control type='text' value={mainData?.counsellorDetail?.total_experience || '-'} disabled />
                    </Form.Group>
                  </div>
                  <div className='col-xl-6'>
                    <Form.Group className='form-group common-select-style' controlId='formState'>
                      <Form.Label>High Qualification</Form.Label>
                      <Form.Control type='text' value={mainData?.counsellorDetail?.high_qualification?.title || '-'} disabled />
                    </Form.Group>
                  </div>
                  <div className='col-xl-6'>
                    <Form.Group className='form-group common-select-style' controlId='formState'>
                      <Form.Label>Last Qualification</Form.Label>
                      <Form.Control type='text' value={mainData?.counsellorDetail?.last_qualification?.title || '-'} disabled />
                    </Form.Group>
                  </div>
                  <div className='col-xl-6'>
                    <Form.Group className='form-group common-select-style' controlId='formState'>
                      <Form.Label>Certification</Form.Label>
                      <Form.Control
                        type='text'
                        value={
                          mainData?.counsellorDetail?.certificate_qualification?.title
                            ? mainData?.counsellorDetail?.certificate_qualification?.title +
                              ' ' +
                              mainData?.counsellorDetail?.certificate_university?.title
                            : '-'
                        }
                        disabled
                      />
                    </Form.Group>
                  </div>
                  <div className='row'>
                    <div className='col-xl-12 rowspacer'>
                      <div className=''>
                        <div className='row'>
                          <div className='col-xl-4'>
                            <div className='d-xl-block d-flex flex-wrap justify-content-between mb-sm-20'>
                              <label>Pan Card Number</label>
                              <h5>{mainData?.counsellorDetail?.pan_number || '-'}</h5>
                            </div>
                          </div>
                          <div className='col-xl-4 '>
                            <div className=''>
                              <label>Pan Card</label>
                              <div
                                className={
                                  mainData?.counsellorDetail?.pan_file !== null ? 'aadhar-box d-flex flex-wrap' : 'd-flex flex-wrap'
                                }
                              >
                                {mainData?.counsellorDetail?.pan_file !== null
                                  ? (
                                  <img
                                    className='m-0'
                                    src={panCard}
                                    alt='ollato-img'
                                    onClick={() => openImageViewer(0, 'pan')}
                                  />
                                    )
                                  : (
                                  <h5>-</h5>
                                    )}
                              </div>
                            </div>
                            {isViewerOpen && (
                              <ImageViewer
                                src={type === 'pan' ? panCard : type === 'front' ? aFront : type === 'sign' ? sign : aBack}
                                currentIndex={currentImage}
                                onClose={closeImageViewer}
                                disableScroll={false}
                                backgroundStyle={{
                                  backgroundColor: 'rgba(0,0,0,0.9)',
                                  zIndex: 99999
                                }}
                                closeOnClickOutside={true}
                                style={{
                                  width: '10% !important',
                                  height: '10% !important'
                                }}
                              />
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className='col-xl-12 rowspacer'>
                      <div className=''>
                        <div className='row'>
                          <div className='col-xl-4'>
                            <div className='d-xl-block d-flex flex-wrap justify-content-between  mb-sm-20'>
                              <label>Aadhar Card Number</label>
                              <h5>{mainData?.counsellorDetail?.adhar_card_number || '-'}</h5>
                            </div>
                          </div>
                          <div className='col-xl-4 '>
                            <div className=''>
                              <label>Aadhar Card</label>
                              <div
                                className={
                                  mainData?.counsellorDetail?.adhar_card_number_front !== null
                                    ? 'aadhar-box d-flex flex-wrap'
                                    : 'd-flex flex-wrap'
                                }
                              >
                                {mainData?.counsellorDetail?.adhar_card_number_front !== null
                                  ? (
                                  <img
                                    src={aFront}
                                    onClick={() => openImageViewer(0, 'front')}
                                    alt='ollato-img'
                                  />
                                    )
                                  : (
                                  <h5>-</h5>
                                    )}
                              </div>
                            </div>
                          </div>
                          <div className='col-xl-4 '>
                            <div className=''>
                              <label>Aadhar Card</label>
                              <div
                                className={
                                  mainData?.counsellorDetail?.adhar_card_number_back !== null
                                    ? 'aadhar-box d-flex flex-wrap'
                                    : 'd-flex flex-wrap'
                                }
                              >
                                {mainData?.counsellorDetail?.adhar_card_number_back !== null
                                  ? (
                                  <img
                                    src={aBack}
                                    onClick={() => openImageViewer(0, 'back')}
                                    alt='ollato-img'
                                  />
                                    )
                                  : (
                                  <h5>-</h5>
                                    )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className='col-xl-12 rowspacer'>
                      <div className=''>
                        <div className='row'>
                          <div className='col-xl-4'>
                            <div className='d-xl-block d-flex flex-wrap justify-content-between mb-sm-20'>
                              <label>GST No</label>
                              <h5>{mainData?.counsellorDetail?.gst_no || '-'}</h5>
                            </div>
                          </div>
                          <div className='col-xl-4 '>
                            <div className=''>
                              <label>Signature</label>
                              <div
                                className={
                                  mainData?.counsellorDetail?.signature !== null ? 'aadhar-box d-flex flex-wrap' : 'd-flex flex-wrap'
                                }
                              >
                                {mainData?.counsellorDetail?.signature !== null
                                  ? (
                                  <img
                                    src={sign}
                                    onClick={() => openImageViewer(0, 'sign')}
                                    alt='ollato-img'
                                  />
                                    )
                                  : (
                                  <h5>-</h5>
                                    )}
                              </div>
                            </div>
                          </div>
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

export default ViewCounsellor
