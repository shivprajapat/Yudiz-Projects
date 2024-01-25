import React, { useEffect, useRef, useState } from 'react'
import { Form } from 'react-bootstrap'
import { useLocation, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
// import ReactStars from 'react-rating-stars-component'
// Components
import SpinnerLoader from '../../Components/Spinner'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { } from '@fortawesome/fontawesome-free-solid'
// Images
/* import timeslotmorning from '../../../assets/images/timeslotmorning.svg'
import timeslotnoon from '../../../assets/images/timeslotnoon.svg'
import timeslotnight from '../../../assets/images/timeslotnight.svg' */
// import accepttick from '../../../assets/images/accept-tick.svg'
// import repeat from '../../../assets/images/reschedule-blue.svg'
// import cancel from '../../../assets/images/cancel.svg'
import lightlogomark from '../../assets/images/lightlogomark.svg'
import calendaricon from '../../assets/images/calendaricon.svg'
import timeicon from '../../assets/images/timeicon.svg'
import reports from '../../assets/images/report.svg'
// import { Link } from 'react-router-dom'

// Action
import { getSessionDetails } from '../../Actions/counsellor'
import { downloadReport } from '../../Actions/assessment'

function CancelSessionDetails () {
  const location = useLocation()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const token = localStorage.getItem('token')
  const [starsValue, setStarsValue] = useState()

  // useSelector
  const sessionDetailArray = useSelector(
    (state) => state.counsellor.sessionDetails
  )

  const downloadReportLinkData = useSelector(
    (state) => state.assessment.downloadReportLink
  )
  const reportDownloadedFlag = useSelector(
    (state) => state.assessment.isReportDownloaded
  )
  const previousProps = useRef({
    downloadReportLinkData,
    reportDownloadedFlag
  }).current

  useEffect(() => {
    if (sessionDetailArray) {
      if (sessionDetailArray?.ratingSession === null) {
        setStarsValue(0)
      } else {
        setStarsValue(sessionDetailArray?.ratingSession?.ratings)
      }
    }
  }, [sessionDetailArray])
  useEffect(() => {

  }, [starsValue])

  // const rt = sessionDetailArray?.ratingSession?.ratings
  // Properties
  // const ratingValue = starsValue.toString()
  //
  //
  const properties = {
    size: 28,
    count: 5,
    isHalf: false,
    value: 2,
    color: 'grey',
    activeColor: '#2170ac',
    edit: false
  }
  properties.value = starsValue
  useEffect(() => {
    if (location?.state?.id?.id) {
      const data = {
        id: location?.state?.id?.id
      }
      dispatch(getSessionDetails(data, token))
    }
  }, [location?.state?.id?.id])

  const handleReport = () => {
    dispatch(downloadReport(sessionDetailArray?.report?.custom_id, token))
  }

  useEffect(() => {
    if (previousProps?.downloadReportLinkData !== downloadReportLinkData) {
      if (downloadReportLinkData) {
        window.open(`${process.env.REACT_APP_AXIOS_BASE_URL}${downloadReportLinkData}`, '_blank')
      }
    }
    return () => {
      previousProps.downloadReportLinkData = downloadReportLinkData
    }
  }, [downloadReportLinkData])
  return (
    <>
        <div >
          <div className='main-layout'>
            {reportDownloadedFlag === true
              ? (
              <>
                <SpinnerLoader />
              </>
                )
              : (
              <>
                <div className='heading-box'>
                  <h5>Session Details</h5>
                  <div className='btn-box'>
                    {/*      <Link to='/'><button className='action-btns green-bg' type='button'> <img src={accepttick} alt='' /> Accept</button></Link>
                          <Link to='/'><button className='action-btns light-blue-bg' type='button'> <img src={repeat} alt='' /> Reschedule</button></Link>
                          <Link to='/'><button className='action-btns light-red-bg' type='button'> <img src={cancel} alt='' /> Reject</button></Link> */}
                    <button className='theme-btn lightgray-btn text-none' onClick={() => navigate('/counselling/session-history/:type')}>
                      Go Back
                    </button>
                  </div>
                </div>
                <div className='session-det-content'>
                  <div className='row'>
                    <div className='col-xxl-6 mb-4'>
                      <div className='logo-border-box text-center  position-relative overflow-hidden'>
                        <div className='user-info-content-box'>
                          <div className='userimg-box'>
                            <img className='coun-img' src={`${process.env.REACT_APP_AXIOS_BASE_URL}${sessionDetailArray?.counsellors_profile}`} alt='userimg' />
                          </div>
                          <div className='user-infobox'>
                            <h4>
                              {sessionDetailArray?.counsellors_first_name}{' '}
                              {sessionDetailArray?.counsellors_middle_name}{' '}
                              {sessionDetailArray?.counsellors_last_name}
                            </h4>
                            <h6>{sessionDetailArray?.counsellors_email}</h6>
                            {
                              sessionDetailArray?.ratingSession === null
                                ? ''
                                : <div className='col-lg-12 p-3'>
                             </div>
                            }
                      {/* <ReactStars {...properties}/> */}
                       <div className="rating">
                          {

                           sessionDetailArray?.ratingSession && sessionDetailArray?.ratingSession && <>
                                {[1, 2, 3, 4, 5].map((index) => {
                                  return (
                                    <>
                                        {/* className='blur-star' */}
                                        <FontAwesomeIcon className={`${index <= sessionDetailArray?.ratingSession?.ratings ? 'blur-star' : ''} `} icon="fa-solid fa-star" />
                                    </>
                                  )
                                })}
                              </>
                          }
                       </div>
                        </div>
                        <img
                          src={lightlogomark}
                          className='lightlogomark'
                          alt='ollato-img'
                        />
                          </div>
                      </div>
                    </div>
                    <div className='col-xxl-3 col-sm-6 mb-4'>
                      <div className='logo-border-box text-center  position-relative overflow-hidden'>
                        <div className='user-info-content-box'>
                          <div className='userimg-box big-cal'>
                            <img src={calendaricon} alt='calendaricon' />
                          </div>
                          <div className='user-infobox'>
                            <h6>Date</h6>
                            <h4>{sessionDetailArray?.date}</h4>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className='col-xxl-3 col-sm-6 mb-4'>
                      <div className='logo-border-box text-center  position-relative overflow-hidden'>
                        <div className='user-info-content-box'>
                          <div className='userimg-box big-cal'>
                            <img src={timeicon} alt='timeicon' />
                          </div>
                          <div className='user-infobox'>
                            <h6>Time</h6>
                            <h4>{sessionDetailArray?.from_time}</h4>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className='view-stu-report secondary-bg m-2'>
                    <a href='#' onClick={() => handleReport()}>
                      {' '}
                      <img src={reports} alt='' /> View Student Report
                    </a>
                  </div>
                  {(sessionDetailArray?.status === 'reschedule' ||
                    sessionDetailArray?.status === 'cancel') && (
                    <>
                      <div className='reason-box text-start'>
                        <h4 className='black-font'>
                          {sessionDetailArray?.status} Session
                        </h4>
                        <Form>
                          <Form.Group
                            className='form-group border-line-dark'
                            controlId='reason'
                          >
                            <Form.Label>
                              Reason for {sessionDetailArray?.status} Session
                            </Form.Label>
                            {sessionDetailArray?.status === 'reschedule' && (
                              <>
                                <p>{sessionDetailArray?.rescheduleSession?.reason}</p>
                              </>
                            )}
                            {sessionDetailArray?.status === 'cancel' && (
                              <>
                                <p>{sessionDetailArray?.cancelSession?.reason}</p>
                              </>
                            )}
                          </Form.Group>
                          <Form.Label className='mb-0'>
                            Session {sessionDetailArray?.status} By
                          </Form.Label>
                          <h4 className='black-font'>
                            {sessionDetailArray?.rescheduleSession?.rescheduled_by ===
                              'student' && (
                              <>
                                {sessionDetailArray?.student_first_name}{' '}
                                {sessionDetailArray?.student_last_name}
                                <a href='#'>
                                  (
                                  {
                                    sessionDetailArray?.rescheduleSession
                                      ?.rescheduled_by
                                  }
                                  )
                                </a>
                              </>
                            )}
                            {sessionDetailArray?.rescheduleSession?.rescheduled_by ===
                              'counsellor' && (
                              <>
                                {sessionDetailArray?.counsellors_first_name}{' '}
                                {sessionDetailArray?.counsellors_last_name}
                                <a href='#'>
                                  (
                                  {
                                    sessionDetailArray?.rescheduleSession
                                      ?.rescheduled_by
                                  }
                                  )
                                </a>
                              </>
                            )}
                            {sessionDetailArray?.cancelSession?.canceled_by ===
                              'student' && (
                              <>
                                {sessionDetailArray?.student_first_name}{' '}
                                {sessionDetailArray?.student_last_name}
                                <a href='#'>
                                  ({sessionDetailArray?.cancelSession?.canceled_by})
                                </a>
                              </>
                            )}
                            {sessionDetailArray?.cancelSession?.canceled_by ===
                              'counsellor' && (
                              <>
                                {sessionDetailArray?.counsellors_first_name}{' '}
                                {sessionDetailArray?.counsellors_last_name}
                                <a href='#'>
                                  ({sessionDetailArray?.cancelSession?.canceled_by})
                                </a>
                              </>
                            )}
                          </h4>
                        </Form>
                      </div>
                    </>
                  )}
                </div>
              </>
                )}
          </div>
        </div>
    </>
  )
}

export default CancelSessionDetails
