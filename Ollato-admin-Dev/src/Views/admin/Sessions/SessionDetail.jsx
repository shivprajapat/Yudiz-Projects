import React, { useEffect, useRef } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Form } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
// import moment from 'moment's

// Components
import TitleHeader from '../../../Components/TitleHeader'
import ReportDownloadModal from '../../../Components/ReportDowanloadModal'
// Images
/* import timeslotmorning from '../../../assets/images/timeslotmorning.svg'
import timeslotnoon from '../../../assets/images/timeslotnoon.svg'
import timeslotnight from '../../../assets/images/timeslotnight.svg' */
import starticon from '../../../assets/images/starticon.svg'
// import accepttick from '../../../assets/images/accept-tick.svg'
import repeat from '../../../assets/images/reschedule-blue.svg'
import cancel from '../../../assets/images/cancel.svg'
import lightlogomark from '../../../assets/images/lightlogomark.svg'
import calendaricon from '../../../assets/images/calendaricon.svg'
import timeicon from '../../../assets/images/timeicon.svg'
import reports from '../../../assets/images/reports.svg'
import ls from 'localstorage-slim'
import defaultimage from '../../../assets/images/default.jpeg'

// Actions
import { reportDownloadStudentAction } from '../../../Actions/Counsellor/dashboard'
import { viewDetailsSession } from '../../../Actions/Admin/session'
// import localStorage from 'react-secure-storage'

function SessionDetail () {
  const location = useLocation()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const profile = JSON.parse(localStorage.getItem('profile'))
  const adminType = ls.get('admin-type', { decrypt: true, secret: profile?.id })

  // useSelector
  const sessionData = useSelector((state) => state.sessionsAdmin.sessionDetails)

  const downloadReportLinkData = useSelector(
    (state) => state.dashboard.downloadReportLink
  )
  const reportDownloadedFlag = useSelector(
    (state) => state.dashboard.isReportDownloaded
  )
  const previousProps = useRef({
    downloadReportLinkData,
    reportDownloadedFlag
  }).current

  const token = localStorage.getItem('token')

  useEffect(() => {
    if (location) {
      const dataObject = {
        sessionId: location?.state?.id?.id
      }
      if (adminType === 'center') {
        dispatch(viewDetailsSession(dataObject, token, 'center'))
      } else {
        dispatch(viewDetailsSession(dataObject, token, 'admin'))
      }
    }
  }, [])

  const handleReport = () => {
    dispatch(reportDownloadStudentAction(sessionData?.report?.custom_id, token))
  }

  useEffect(() => {
    if (previousProps?.downloadReportLinkData !== downloadReportLinkData) {
      if (downloadReportLinkData) {
        window.open(
          `${process.env.REACT_APP_AXIOS_BASE_URL}${downloadReportLinkData}`,
          '_blank'
        )
      }
    }
    return () => {
      previousProps.downloadReportLinkData = downloadReportLinkData
    }
  }, [downloadReportLinkData])

  return (
    <>
      <TitleHeader name='Session Details' title='Sessions' />
      <div className='main-layout'>
        {reportDownloadedFlag === true
          ? (
          <>
            <ReportDownloadModal />
          </>
            )
          : (
          <>
            <div className='heading-box'>
              <h5>Session Details - {sessionData?.status}</h5>
              <div className='btn-box'>
                <button className='theme-btn' onClick={() => {
                  if (adminType === 'center') {
                    navigate('/center/sessions')
                  } else {
                    navigate('/admin/sessions')
                  }
                }}>
                  Go back
                </button>
                {/* <Link to='/'><button className='action-btns green-bg' type='button'> <img src={accepttick} alt='' /> Accept</button></Link>
                          <Link to='/'><button className='action-btns light-blue-bg' type='button'> <img src={repeat} alt='' /> Reschedule</button></Link>
                          <Link to='/'><button className='action-btns light-red-bg' type='button'> <img src={cancel} alt='' /> Reject</button></Link> */}
                {sessionData?.status === 'accepted' && (
                  <>
                    <Link to=''>
                      <button className='action-btns green-bg' type='button'>
                        {' '}
                        <img src={starticon} alt='' /> Start Session
                      </button>
                    </Link>
                    <Link to='/counselling/reschedule'>
                      <button
                        className='action-btns light-blue-bg'
                        type='button'
                      >
                        {' '}
                        <img src={repeat} alt='' /> Reschedule
                      </button>
                    </Link>
                    <Link to=''>
                      <button
                        className='action-btns light-red-bg'
                        type='button'
                      >
                        {' '}
                        <img src={cancel} alt='' /> Cancel
                      </button>
                    </Link>
                  </>
                )}
              </div>
            </div>
            <div className='session-det-content'>
              <div className='row'>
                <h4>Student detail</h4>
                <div className='col-xxl-6'>
                  <div className='logo-border-box text-center  position-relative overflow-hidden'>
                    <div className='user-info-content-box'>
                      <div className='userimg-box'>
                        <img src={sessionData?.student_profile !== null ? `${process.env.REACT_APP_AXIOS_BASE_URL}${sessionData?.student_profile}` : defaultimage} alt='userimg' className='student-img' />
                      </div>
                      <div className='user-infobox'>
                        <h4>
                          {sessionData?.student_first_name}{' '}
                          {sessionData?.student_middle_name}{' '}
                          {sessionData?.student_last_name}
                        </h4>
                        <h6>{sessionData?.student_email}</h6>
                      </div>
                    </div>
                    <img
                      src={lightlogomark}
                      className='lightlogomark'
                      alt='ollato-img'
                    />
                  </div>
                </div>
                <div className='col-xxl-3 col-sm-6'>
                  <div className='logo-border-box text-center  position-relative overflow-hidden'>
                    <div className='user-info-content-box'>
                      <div className='userimg-box big-cal'>
                        <img src={calendaricon} alt='calendaricon' />
                      </div>
                      <div className='user-infobox'>
                        <h6>Date</h6>
                        <h4>{sessionData?.date}</h4>
                      </div>
                    </div>
                  </div>
                </div>
                <div className='col-xxl-3 col-sm-6'>
                  <div className='logo-border-box text-center  position-relative overflow-hidden'>
                    <div className='user-info-content-box'>
                      <div className='userimg-box big-cal'>
                        <img src={timeicon} alt='timeicon' />
                      </div>
                      <div className='user-infobox'>
                        <h6>Time</h6>
                        <h4>{sessionData?.from_time}</h4>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className='row mt-3'>
                <h4>Counsellor detail</h4>
                <div className='col-xxl-6'>
                  <div className='logo-border-box text-center  position-relative overflow-hidden'>
                    <div className='user-info-content-box'>
                      {/* <div className='userimg-box'>
                            <img src={userimg} alt='userimg' />
                          </div> */}
                      <div className='user-infobox'>
                        <h4>
                          {sessionData?.counsellors_first_name}{' '}
                          {sessionData?.counsellors_last_name}{' '}
                        </h4>
                        <h6>{sessionData?.counsellors_email}</h6>
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
              <div className='view-stu-report secondary-bg mt-3'>
                <a href='#' onClick={() => handleReport()}>
                  {' '}
                  <img src={reports} alt='' /> View Student Report
                </a>
              </div>
              {(sessionData?.status === 'reschedule' ||
                sessionData?.status === 'cancel') && (
                <>
                  <div className='reason-box text-start'>
                    <h4 className='black-font'>
                      {sessionData?.status} Session
                    </h4>
                    <Form>
                      <Form.Group
                        className='form-group border-line-dark'
                        controlId='reason'
                      >
                        <Form.Label>
                          Reason for {sessionData?.status} Session
                        </Form.Label>
                        {sessionData?.status === 'reschedule' && (
                          <>
                            <p>{sessionData?.rescheduleSession?.reason}</p>
                          </>
                        )}
                        {sessionData?.status === 'cancel' && (
                          <>
                            <p>{sessionData?.cancelSession?.reason}</p>
                          </>
                        )}
                      </Form.Group>
                      <Form.Label className='mb-0'>
                        Session {sessionData?.status} By
                      </Form.Label>
                      <h4 className='black-font'>
                        {sessionData?.rescheduleSession?.rescheduled_by ===
                          'student' && (
                          <>
                            {sessionData?.student_first_name}{' '}
                            {sessionData?.student_last_name}
                            <a href='#'>
                              ({sessionData?.rescheduleSession?.rescheduled_by})
                            </a>
                          </>
                        )}
                        {sessionData?.rescheduleSession?.rescheduled_by ===
                          'counsellor' && (
                          <>
                            {sessionData?.counsellors_first_name}{' '}
                            {sessionData?.counsellors_last_name}
                            <a href='#'>
                              ({sessionData?.rescheduleSession?.rescheduled_by})
                            </a>
                          </>
                        )}
                        {sessionData?.cancelSession?.canceled_by ===
                          'student' && (
                          <>
                            {sessionData?.student_first_name}{' '}
                            {sessionData?.student_last_name}
                            <a href='#'>
                              ({sessionData?.cancelSession?.canceled_by})
                            </a>
                          </>
                        )}
                        {sessionData?.cancelSession?.canceled_by ===
                          'counsellor' && (
                          <>
                            {sessionData?.counsellors_first_name}{' '}
                            {sessionData?.counsellors_last_name}
                            <a href='#'>
                              ({sessionData?.cancelSession?.canceled_by})
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
    </>
  )
}

export default SessionDetail
