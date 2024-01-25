import React, { useEffect, useCallback, useState, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import ImageViewer from 'react-simple-image-viewer'
import { Form } from 'react-bootstrap'
import cake from '../../../assets/images/cake.svg'
import mail from '../../../assets/images/mail.svg'
import phone from '../../../assets/images/phone.svg'
import studenticon from '../../../assets/images/student-icon.svg'
import pdficon from '../../../assets/images/pdf-icon.svg'
import lightlogomark from '../../../assets/images/lightlogomark.svg'
import defaultPic from '../../../assets/images/default_profile.jpg'

// Action Files
import { getCounsellorDataAction } from '../../../Actions/Counsellor/dashboard'
import moment from 'moment'
import { useS3Upload } from '../../../Shared/Hooks/UseS3UPload'

function MyProfile () {
  const dispatch = useDispatch()
  const token = localStorage.getItem('token')

  // useState
  const [currentImage, setCurrentImage] = useState(0)
  const [isViewerOpen, setIsViewerOpen] = useState(false)
  const [backimage, setBackImage] = useState([])
  const [aFront, setAFront] = useState([])
  const [aBack, setABack] = useState([])
  const [sign, setSign] = useState([])
  const [type, setType] = useState('')
  const { getImage } = useS3Upload()
  const [profilePic, setProfilePic] = useState('')

  // useSelector
  const profileData = useSelector((state) => state.dashboard.counsellorData)

  const previousProps = useRef({ profileData }).current

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
    if (token) {
      dispatch(getCounsellorDataAction(token))
    }
  }, [token])

  useEffect(() => {
    if (previousProps?.profileData !== profileData) {
      if (profileData) {
        async function getImageUrl () {
          const data = [
            {
              path: profileData?.details?.pan_file,
              flag: 'pancard'
            },
            {
              path: profileData?.details?.adhar_card_number_front,
              flag: 'adharFront'
            },
            {
              path: profileData?.details?.adhar_card_number_back,
              flag: 'adharBack'
            },
            {
              path: profileData?.details?.signature,
              flag: 'signature'
            },
            {
              path: profileData?.details?.profile_picture,
              flag: 'profile_picture'
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
          setProfilePic(result?.url?.profile_picture)
          setBackImage(array)
          setAFront(array2)
          setABack(array3)
          setSign(array4)
        }
        getImageUrl()
      }
    }
    return () => {
      previousProps.profileData = profileData
    }
  }, [profileData])

  return (
    <>
      {/* <Header />
          <TitleHeader name='My Profile' /> */}
      <div className="main-layout whitebox-layout my-profile-page">
        <div className="profilebutton-box text-end">
          <Link
            to="/counsellor/editprofile"
            state={{ id: profileData }}
            className="theme-btn text-none d-inline-block"
          >
            Edit My Profile
          </Link>
        </div>
        <div className="my-profile-box">
          <div className="row ">
            <div className="col-xl-9 mb-4">
              <div className="profile-item">
                <div className="row align-items-center">
                  <div className="col-xl-8">
                    <div className="profileinfo profile-updated">
                      <div className="profile-img ">
                        <img
                          src={
                            profileData?.details?.profile_picture === null ||
                            profileData?.details?.profile_picture ===
                              'undefined'
                              ? defaultPic
                              : profilePic
                          }
                          alt=""
                        />
                      </div>
                      <div className="profiledesc">
                        <h4>
                          {profileData?.first_name} {profileData?.middle_name}{' '}
                          {profileData?.last_name}
                        </h4>
                        <ul className="iconbox">
                          <li>
                            <img src={cake} alt="ollato-img" />
                            <p>
                              {moment(profileData?.dob).format('YYYY-MM-DD')}
                            </p>
                          </li>
                          <li>
                            <img src={mail} alt="ollato-img" />
                            <p>{profileData?.email}</p>
                          </li>
                          <li>
                            <img src={phone} alt="ollato-img" />
                            <p>{profileData?.mobile}</p>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-xl-3 mb-4">
              <div className="profile-item h-100 text-center d-flex align-items-center justify-content-center position-relative overflow-hidden">
                <div className="student-code">
                  <img src={studenticon} alt="studenticon" />
                  <p>Ollato Expert Code </p>
                  <h4>{profileData?.ollato_code}</h4>
                </div>
                <img
                  src={lightlogomark}
                  className="lightlogomark"
                  alt="ollato-img"
                />
              </div>
            </div>
            {/* <div className="col-xl-6">
                  <div className="profile-item">
                    <label>Home Address</label>
                    <h4>India, Gujarat, Ahmedabad,  380054</h4>
                  </div>
                </div> */}
            <div className="col mb-4">
              <div className="profile-item no-border">
                <h3>Education and Experience Details</h3>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-xl-6 mb-4">
              <div className="profile-item h-100">
                <label>Professional Expertness</label>
                <h4>
                  {profileData?.details?.professional_expertness === null
                    ? '-'
                    : profileData?.details?.professional_expertness}{' '}
                </h4>
              </div>
            </div>
            <div className="col-xl-6 mb-4">
              <div className="profile-item">
                <label>Resume</label>
                <div className="d-flex flex-wrap align-items-center pdf-box">
                  <a
                    className="d-flex align-items-center"
                    href={`${process.env.REACT_APP_AXIOS_BASE_URL}${profileData?.details?.resume}`}
                    target="__blank"
                  >
                    <img src={pdficon} alt="ollato-img" />
                    <h4>Resume</h4>
                  </a>
                </div>
              </div>
            </div>
            {/* <div className='row'>  */}
            <div className="col-xl-6 mb-4">
              <div className="profile-item ">
                <label>Experience</label>
                <h4>{profileData?.details?.total_experience || '-'} </h4>
              </div>
            </div>
            {/* </div> */}
            <div className="col-xl-6 mb-4">
              <div className="profile-item">
                <label>High Qualification</label>
                <h4>{profileData?.details?.high_qualification?.title}</h4>
              </div>
            </div>
            <div className="col-xl-6 mb-4">
              <div className="profile-item">
                <label>Last Qualification</label>
                <h4>{profileData?.details?.last_qualification?.title}</h4>
              </div>
            </div>
            <div className="col-xl-6 mb-4">
              <div className="profile-item">
                <label>Certification</label>
                <h4>
                  {profileData?.details?.certificate_qualification?.title},{' '}
                  {profileData?.details?.certificate_university?.title}
                </h4>
              </div>
            </div>
            <div className="col-xl-12 mb-4">
              <div className="profile-item no-border">
                <h3>KYC Details</h3>
              </div>
            </div>
            <div className="row">
              <div className="col-xl-12 rowspacer">
                <div className="profile-item ">
                  <div className="row">
                    <div className="col-xl-4">
                      <div className="d-xl-block d-flex flex-wrap justify-content-between mb-sm-20">
                        <label>Pan Card Number</label>
                        <h5>{profileData?.details?.pan_number}</h5>
                      </div>
                    </div>
                    <div className="col-xl-4 ">
                      <div className="">
                        <label>Pan Card</label>
                        <div className="aadhar-box d-flex flex-wrap">
                          <img
                            className="m-0"
                            src={backimage}
                            alt="ollato-img"
                            onClick={() => openImageViewer(0, 'pan')}
                          />
                        </div>
                      </div>
                      {isViewerOpen && (
                        <ImageViewer
                          src={
                            type === 'pan'
                              ? backimage
                              : type === 'front'
                                ? aFront
                                : type === 'sign'
                                  ? sign
                                  : aBack
                          }
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
              <div className="col-xl-12 rowspacer">
                <div className="profile-item ">
                  <div className="row">
                    <div className="col-xl-4">
                      <div className="d-xl-block d-flex flex-wrap justify-content-between  mb-sm-20">
                        <label>Aadhar Card Number</label>
                        <h5>{profileData?.details?.adhar_card_number}</h5>
                      </div>
                    </div>
                    <div className="col-xl-4 ">
                      <div className="">
                        <label>Aadhar Card</label>
                        <div className="aadhar-box d-flex flex-wrap">
                          <img
                            src={aFront}
                            onClick={() => openImageViewer(0, 'front')}
                            alt="ollato-img"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="col-xl-4 ">
                      <div className="">
                        <label>Aadhar Card</label>
                        <div className="aadhar-box d-flex flex-wrap">
                          <img
                            src={aBack}
                            onClick={() => openImageViewer(0, 'back')}
                            alt="ollato-img"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-xl-12 rowspacer">
                <div className="profile-item ">
                  <div className="row">
                    <div className="col-xl-4">
                      <div className="d-xl-block d-flex flex-wrap justify-content-between mb-sm-20">
                        <label>GST No</label>
                        <h5>{profileData?.details?.gst_no || '-'}</h5>
                      </div>
                    </div>
                    <div className="col-xl-4 ">
                      <div className="">
                        <label>Signature</label>
                        <div className="aadhar-box d-flex flex-wrap">
                          <img
                            src={sign}
                            onClick={() => openImageViewer(0, 'sign')}
                            alt="ollato-img"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-xl-12 rowspacer">
                <div className="profile-item ">
                  <div className="row">
                    <div className="col-xl-12">
                      <div className="d-xl-block d-flex flex-wrap justify-content-between mb-sm-20">
                        {/* <label>types</label> */}
                        <Form.Group
                          controlId="formgstnumber"
                          className="form-group document-file-input common-input-file  uploaded-doc"
                        >
                          <Form.Label>Types</Form.Label>
                          <Form.Check type="checkbox">
                            <Form.Check.Input
                              name="is_image"
                              checked={profileData?.career_counsellor === '1'}
                              onChange={(e) => {}}
                            />
                            <Form.Check.Label>
                              Career Counsellor
                            </Form.Check.Label>
                          </Form.Check>
                          <Form.Check type="checkbox">
                            <Form.Check.Input
                              name="is_math"
                              type="checkbox"
                              checked={profileData?.psychologist === '1'}
                              onChange={(e) => {}}
                            />
                            <Form.Check.Label>Psychologist</Form.Check.Label>
                          </Form.Check>
                          <Form.Check type="checkbox">
                            <Form.Check.Input
                              type="checkbox"
                              name="is_correct_ans"
                              checked={profileData?.overseas_counsellor === '1'}
                              onChange={(e) => {}}
                            />
                            <Form.Check.Label>
                              Overseas Counsellor
                            </Form.Check.Label>
                          </Form.Check>
                          <Form.Check type="checkbox">
                            <Form.Check.Input
                              type="checkbox"
                              name="is_correct_ans"
                              checked={profileData?.subject_expert === '1'}
                              onChange={(e) => {}}
                            />
                            <Form.Check.Label>
                              Student Expert Counsellor
                            </Form.Check.Label>
                          </Form.Check>
                        </Form.Group>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default MyProfile
