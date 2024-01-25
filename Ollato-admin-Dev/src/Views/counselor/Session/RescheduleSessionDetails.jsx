import React, { useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Form } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { useSnackbar } from 'react-notistack'
import moment from 'moment'
import { useForm } from 'react-hook-form'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import Select from 'react-select'

// Components
import Header from '../../../Components/Header'
import TitleHeader from '../../../Components/TitleHeader'

// Images
/* import timeslotmorning from '../../../assets/images/timeslotmorning.svg'
import timeslotnoon from '../../../assets/images/timeslotnoon.svg'
import timeslotnight from '../../../assets/images/timeslotnight.svg' */
// import accepttick from '../../../assets/images/accept-tick.svg'
import repeat from '../../../assets/images/reschedule-blue.svg'
// import cancel from '../../../assets/images/cancel.svg'
import lightlogomark from '../../../assets/images/lightlogomark.svg'
import userimg from '../../../assets/images/userimg.svg'
import calendaricon from '../../../assets/images/calendaricon.svg'
import timeicon from '../../../assets/images/timeicon.svg'
import reports from '../../../assets/images/reports.svg'
import ls from 'localstorage-slim'

// Actions
import { viewDetailsAction, rescheduleSessionAction } from '../../../Actions/Counsellor/session'
import { viewAvailability } from '../.../../../../Actions/Counsellor/counsellor-availability'
// import localStorage from 'react-secure-storage'

// validation schema
const validationSchema = yup.object().shape({
  reason: yup
    .string()
    .required('Reason is required')
})

function RescheduleSessionDetails () {
  const location = useLocation()
  const dispatch = useDispatch()
  const { enqueueSnackbar } = useSnackbar()
  const navigate = useNavigate()
  const token = localStorage.getItem('token')
  const profile = JSON.parse(localStorage.getItem('profile'))
  const adminType = ls.get('admin-type', { decrypt: true, secret: profile?.id })

  // useState
  const [selectedTimeFilter, setSelectedTimeFilter] = useState()
  const [availableTimeSlots, setAvailableTimeSlots] = useState([])

  // useSelector
  const sessionDetailArray = useSelector(state => state?.session?.sessionDetails)
  const isCounsellorAvailableFlag = useSelector(state => state?.counsellor?.isCounsellorAvailable)
  const ressMessageFlag = useSelector(state => state?.counsellor?.resMessage)
  const ressMessageSessionFlag = useSelector(state => state?.session?.resMessage)
  const availableDataArray = useSelector(state => state?.counsellor?.availableData?.data)
  const isSessionReschduleFlag = useSelector(state => state?.session?.isSessionReschdule)

  const previousProps = useRef({ ressMessageSessionFlag, isCounsellorAvailableFlag, ressMessageFlag, availableDataArray, isSessionReschduleFlag }).current

  // useForm
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(validationSchema)
  })

  const onSubmit = (data) => {
    const dataObject = {
      sessionId: sessionDetailArray?.id,
      reason: data?.reason,
      newCounsellorAvailbleId: selectedTimeFilter
    }
    if (adminType === 'center') {
      dispatch(rescheduleSessionAction(dataObject, token, 'center'))
    } else {
      dispatch(rescheduleSessionAction(dataObject, token, 'counsellor'))
    }
  }

  // useEffect
  useEffect(() => {
    if (location?.state?.id?.id) {
      const data = {
        sessionId: location?.state?.id?.id
      }
      if (adminType === 'center') {
        dispatch(viewDetailsAction(data, token, 'center'))
      } else {
        dispatch(viewDetailsAction(data, token, 'counsellor'))
      }
    }
  }, [location?.state?.id?.id])

  // Toastify Notification
  useEffect(() => {
    if (previousProps?.isCounsellorAvailableFlag !== isCounsellorAvailableFlag) {
      if (isCounsellorAvailableFlag === false) {
        enqueueSnackbar(`${ressMessageFlag}`, {
          variant: 'error',
          hide: 2000,
          autoHide: true,
          TransitionComponent: 'Fade'
        })
      }
    }
    return () => {
      previousProps.isCounsellorAvailableFlag = isCounsellorAvailableFlag
    }
  }, [isCounsellorAvailableFlag])

  /* For Time Slots */
  useEffect(() => {
    if (previousProps?.availableDataArray !== availableDataArray) {
      const array = []
      if (availableDataArray) {
        // eslint-disable-next-line array-callback-return
        availableDataArray[0]?.availableTimes.map((data) => {
          array.push({
            value: data.id,
            label: data.from_time
          })
        })
        setAvailableTimeSlots(array)
      }
    }
    return () => {
      previousProps.availableDataArray = availableDataArray
    }
  }, [availableDataArray])

  // Function to Handle Date
  const handleOnChange = (date) => {
    const data = {
      date: moment(date).format('YYYY-MM-DD'),
      counsellor_id: sessionDetailArray?.counsellors_id

    }
    if (adminType === 'center') {
      dispatch(viewAvailability(data, token, 'center/counsellor'))
    } else {
      dispatch(viewAvailability(data, token, 'counsellor'))
    }
  }

  const handleTimeDateFilter = (e) => {
    setSelectedTimeFilter(e?.value)
  }

  // Notification for status
  useEffect(() => {
    if (previousProps?.isSessionReschduleFlag !== isSessionReschduleFlag) {
      if (isSessionReschduleFlag) {
        enqueueSnackbar(`${ressMessageSessionFlag}`, {
          variant: 'success',
          hide: 2000,
          autoHide: true
        })
        navigate('/counsellor/session')
      } else if (isSessionReschduleFlag === false) {
        enqueueSnackbar(`${ressMessageSessionFlag}`, {
          variant: 'error',
          hide: 2000,
          autoHide: true,
          TransitionComponent: 'Fade'
        })
      }
    }
    return () => {
      previousProps.isSessionReschduleFlag = isSessionReschduleFlag
    }
  }, [isSessionReschduleFlag])

  return (
    <>
              <Header />
              <TitleHeader name='Reschedule Session' title='Sessions'/>
              <Form onSubmit={handleSubmit(onSubmit)}>
                <div className='main-layout'>
                    <div className="heading-box">
                        <h5>Reschedule Session</h5>
                        <div className="btn-box">
                            <button className='action-btns light-blue-bg' type='submit'> <img src={repeat} alt='' /> Reschedule</button>
                            {/* <Link to='/'><button className='action-btns light-red-bg' type='button'> <img src={cancel} alt='' /> Reject</button></Link> */}
                        </div>
                    </div>
                    <div className="session-det-content">
                      <div className="row">
                        <div className="col-xxl-6 mb-3">
                          <div className="logo-border-box text-center  position-relative overflow-hidden">
                            <div className="user-info-content-box">
                              <div className="userimg-box">
                                <img src={userimg} alt="userimg" />
                              </div>
                              <div className="user-infobox">
                                <h4>{sessionDetailArray?.student_first_name} {sessionDetailArray?.student_middle_name}  {sessionDetailArray?.student_last_name}</h4>
                                <h6>{sessionDetailArray?.student_email}</h6>
                              </div>
                            </div>
                              <img src={lightlogomark} className='lightlogomark' alt="ollato-img" />
                            </div>

                        </div>
                        <div className="col-xxl-3 col-sm-6 mb-3">
                          <div className="logo-border-box text-center  position-relative overflow-hidden">
                              <div className="user-info-content-box">
                                <div className="userimg-box big-cal">
                                  <img src={calendaricon} alt="calendaricon" />
                                </div>
                                <div className="user-infobox">
                                  <h6>Date</h6>
                                  <h4>{sessionDetailArray?.date}</h4>
                                </div>
                              </div>
                              </div>
                        </div>
                        <div className="col-xxl-3 col-sm-6 mb-3">
                          <div className="logo-border-box text-center  position-relative overflow-hidden">
                              <div className="user-info-content-box">
                                <div className="userimg-box big-cal">
                                  <img src={timeicon} alt="timeicon" />
                                </div>
                                <div className="user-infobox">
                                  <h6>Time</h6>
                                  <h4>{sessionDetailArray?.from_time}</h4>
                                </div>
                              </div>
                              </div>
                        </div>
                      </div>
                      <div className="view-stu-report secondary-bg">
                        <a href="#"> <img src={reports} alt="" />  View Student Report</a>
                      </div>
                      <div className="reason-box text-start light-bg">
                          <h4 className='black-font'>Reschedule Session</h4>
                        <Form>
                          <div className="row">
                            <div className="col-xxl-4 col-md-6">
                            <Form.Group className="form-group" controlId="formdate">
                                <Form.Label>Date</Form.Label>
                                <Form.Control type="date" placeholder="DD/MM/YYYY" onChange={(e) => handleOnChange(e.target.value)} />
                              </Form.Group>
                            </div>
                            <div className="col-xxl-4 col-md-6">
                            <Form.Group className="form-group common-select-style mb-0" controlId="formfullname">
                              <Form.Label>Select Time</Form.Label>
                              <Select classNamePrefix="filter-custom" isSearchable={false} defaultValue={selectedTimeFilter} onChange={(e) => handleTimeDateFilter(e)} options={availableTimeSlots}/>
                              {/* <Select
                                isClearable
                                placeholder={'Select Time Slot'}
                                isSearchable={false}
                                classNamePrefix="filter-custom"
                                getOptionLabel={(option) => option?.label}
                                getOptionValue={(option) => option?.value}
                                options={availableTimeSlots}
                                onChange={setSelectedTimeFilter}
                              /> */}
                            </Form.Group>
                            </div>
                          </div>
                            <Form.Group className="form-group border-line-dark mb-0" controlId="reason">
                              <Form.Label>Reason for Reschedule Session</Form.Label>
                                <Form.Control
                                  as="textarea"
                                  className='big-textarea'
                                  placeholder="Reason for Reschedule Session...."
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

export default RescheduleSessionDetails
