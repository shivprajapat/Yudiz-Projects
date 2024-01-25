import React, { useEffect, useRef } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Form } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { useSnackbar } from 'react-notistack'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm } from 'react-hook-form'

// Components
import Header from '../../../Components/Header'
import TitleHeader from '../../../Components/TitleHeader'

// Images
/* import timeslotmorning from '../../../assets/images/timeslotmorning.svg'
import timeslotnoon from '../../../assets/images/timeslotnoon.svg'
import timeslotnight from '../../../assets/images/timeslotnight.svg' */
// import accepttick from '../../../assets/images/accept-tick.svg'
// import repeat from '../../../assets/images/reschedule-blue.svg'
// import cancel from '../../../assets/images/cancel.svg'
import lightlogomark from '../../../assets/images/lightlogomark.svg'
import userimg from '../../../assets/images/userimg.svg'
import calendaricon from '../../../assets/images/calendaricon.svg'
import timeicon from '../../../assets/images/timeicon.svg'
import reports from '../../../assets/images/reports.svg'

// Actions
import { viewDetailsAction, cancelSessionAction } from '../../../Actions/Counsellor/session'

// validation schema
const validationSchema = yup.object().shape({
  reason: yup
    .string()
    .required('Reason is required')
})

function CancelSessionDetails () {
  const location = useLocation()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { enqueueSnackbar } = useSnackbar()
  const token = localStorage.getItem('token')

  // useForm
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(validationSchema)
  })

  // useSelector
  const sessionDetailsData = useSelector(state => state.session.sessionDetails)
  const isSessionCancelFlag = useSelector(state => state.session.isSessionCancel)
  const isSessionResMessage = useSelector(state => state.session.resMessage)
  const previousProps = useRef({ isSessionCancelFlag, isSessionResMessage }).current

  const onSubmit = (data) => {
    const dataObject = {
      sessionId: sessionDetailsData?.id,
      reason: data?.reason
    }
    dispatch(cancelSessionAction(dataObject, token))
  }

  // useEffect
  useEffect(() => {
    if (location?.state?.id?.id) {
      const data = {
        sessionId: location?.state?.id?.id
      }
      dispatch(viewDetailsAction(data, token))
    }
  }, [location?.state?.id?.id])

  // Toastify Notification
  useEffect(() => {
    if (previousProps?.isSessionCancelFlag !== isSessionCancelFlag) {
      if (isSessionCancelFlag) {
        enqueueSnackbar(`${isSessionResMessage}`, {
          variant: 'success',
          hide: 2000,
          autoHide: true
        })
        navigate('/counsellor/session')
      } else if (isSessionCancelFlag === false) {
        enqueueSnackbar(`${isSessionResMessage}`, {
          variant: 'error',
          hide: 2000,
          autoHide: true,
          TransitionComponent: 'Fade'
        })
      }
    }
    return () => {
      previousProps.isSessionCancelFlag = isSessionCancelFlag
    }
  }, [isSessionCancelFlag])
  return (
    <>
              <Header />
              <TitleHeader name='Pending Session Details' title='Sessions'/>
              <Form onSubmit={handleSubmit(onSubmit)}>
                <div className='main-layout'>
                    <div className="heading-box">
                        <h5>Session Details</h5>
                        <div className="btn-box">
                      {/*      <Link to='/'><button className='action-btns green-bg' type='button'> <img src={accepttick} alt='' /> Accept</button></Link>
                            <Link to='/'><button className='action-btns light-blue-bg' type='button'> <img src={repeat} alt='' /> Reschedule</button></Link>
                            <Link to='/'><button className='action-btns light-red-bg' type='button'> <img src={cancel} alt='' /> Reject</button></Link> */}
                            <button className="theme-btn lightgray-btn text-none">Go Back</button>
                            <button className="theme-btn red-btn text-none">Cancel Session</button>
                        </div>
                    </div>
                    <div className="session-det-content">
                      <div className="row">
                        <div className="col-xxl-6">
                          <div className="logo-border-box text-center  position-relative overflow-hidden">
                            <div className="user-info-content-box">
                              <div className="userimg-box">
                                <img src={userimg} alt="userimg" />
                              </div>
                              <div className="user-infobox">
                                <h4>Roy Harvey Spector</h4>
                                <h6>brooklynroy_s@mail.com</h6>
                              </div>
                            </div>
                              <img src={lightlogomark} className='lightlogomark' alt="ollato-img" />
                            </div>
                        </div>
                        <div className="col-xxl-3 col-sm-6">
                          <div className="logo-border-box text-center  position-relative overflow-hidden">
                              <div className="user-info-content-box">
                                <div className="userimg-box big-cal">
                                  <img src={calendaricon} alt="calendaricon" />
                                </div>
                                <div className="user-infobox">
                                  <h6>Date</h6>
                                  <h4>29-06-2020</h4>
                                </div>
                              </div>
                              </div>
                        </div>
                        <div className="col-xxl-3 col-sm-6">
                          <div className="logo-border-box text-center  position-relative overflow-hidden">
                              <div className="user-info-content-box">
                                <div className="userimg-box big-cal">
                                  <img src={timeicon} alt="timeicon" />
                                </div>
                                <div className="user-infobox">
                                  <h6>Time</h6>
                                  <h4>12:45 PM</h4>
                                </div>
                              </div>
                              </div>
                        </div>
                      </div>
                      <div className="view-stu-report secondary-bg">
                        <a href="#"> <img src={reports} alt="" />  View Student Report</a>
                      </div>
                      <div className="reason-box text-start">
                          <h4 className='black-font'>Cancel Session</h4>
                        <Form>
                          <Form.Group className="form-group border-line-dark mb-0" controlId="reason">
                          <Form.Label>Reason for Cancel Session</Form.Label>
                            <Form.Control
                              as="textarea"
                              className='big-textarea'
                              placeholder="Enter Reason for Reschedule...."
                              name={name}
                              {...register('reason', { required: true })}
                            />
                            {errors.reason?.message && (
                                    <Form.Text className='error-msg'>
                                      {errors.reason?.message}
                                    </Form.Text>
                            )}
                          </Form.Group>
                        </Form>
                      </div>
                    </div>
                </div>
              </Form>
    </>
  )
}

export default CancelSessionDetails
