import React, { useState, useEffect, useRef } from 'react'
/* React Packages */
import { Form } from 'react-bootstrap'
import DatePicker from 'react-datepicker'
import { useDispatch, useSelector } from 'react-redux'
import moment from 'moment'

/* React Packages */
import { useForm } from 'react-hook-form'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { useSnackbar } from 'react-notistack'
/* Components */
// import MobileHeader from '../../Components/MobileHeader'
import TitleHeader from '../../Components/TitleHeader'

/* images */
import rating from '../../assets/images/rating.png'
import calendericon from '.././../assets/images/calendaricon.svg'
import clockicon from '.././../assets/images/timeicon.svg'
import timeslotmorning from '.././../assets/images/timeslotmorning.svg'
import defaultImage from '.././../assets/default_profile copy.jpg'
// import timeslotnoon from '.././../assets/images/timeslotnoon.svg'
// import timeslotnight from '.././../assets/images/timeslotnight.svg'

// Action File
import {
  getSessionDetails,
  getCounsellorAvailableSlots,
  sessionReschedule
} from '../../Actions/counsellor'
import { useNavigate, useLocation } from 'react-router-dom'

const validationSchema = yup.object().shape({
  reason: yup
    .string()
    .required('Reason is required')
})

const Reschedule = () => {
  const dispatch = useDispatch()
  const location = useLocation()
  const navigate = useNavigate()
  const { enqueueSnackbar } = useSnackbar()
  // useState
  const [startDate, setStartDate] = useState(new Date())
  const [availableSlotId, setAvailableSlotId] = useState()

  // Function for handle toggle

  // useSelector
  const availableSlotsArray = useSelector(
    (state) => state.counsellor.counsellorAvailableSlots
  )
  const ressMessage = useSelector((state) => state.counsellor.resMessage)
  const counsellorDetails = useSelector(
    (state) => state.counsellor.sessionDetails
  )
  const isSessionReschdule = useSelector((state) => state.counsellor.isReschedule)

  // previousProps
  const previousProps = useRef({
    isSessionReschdule
  }).current

  // Token
  const token = localStorage.getItem('token')

  // useForm
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(validationSchema)
  })

  useEffect(() => {
    if (token) {
      const data = {
        id: location?.state?.id?.id
      }
      dispatch(getSessionDetails(data, token))
    }
  }, [token])

  useEffect(() => {
    if (startDate && counsellorDetails) {
      const data = {
        date: moment(startDate).format('YYYY-MM-DD'),
        id: counsellorDetails?.counsellor_id,
        availabilityStatus: 'reschedule'
      }
      dispatch(getCounsellorAvailableSlots(data, token))
    }
  }, [startDate, counsellorDetails])

  console.log('counsellorDetails', counsellorDetails)

  // Available Slot Booking
  const handleSlotBooking = (data) => {
    setAvailableSlotId(data)
  }

  const onSubmit = (data) => {
    const dataObject = {
      sessionId: counsellorDetails?.id,
      reason: data?.reason,
      counsellorAvalId: availableSlotId
    }
    dispatch(sessionReschedule(dataObject, token))
  }

  // Notification for status
  useEffect(() => {
    if (previousProps?.isSessionReschdule !== isSessionReschdule) {
      if (isSessionReschdule) {
        enqueueSnackbar(`${ressMessage}`, {
          variant: 'success',
          hide: 2000,
          autoHide: true
        })
        navigate('/counselling/session-history/:type')
      } else if (isSessionReschdule === false) {
        enqueueSnackbar(`${ressMessage}`, {
          variant: 'error',
          hide: 2000,
          autoHide: true,
          TransitionComponent: 'Fade'
        })
      }
    }
    return () => {
      previousProps.isSessionReschdule = isSessionReschdule
    }
  }, [isSessionReschdule])

  return (
    <>
        <div className=''>
          <TitleHeader title='Counselling' />
          <Form onSubmit={handleSubmit(onSubmit)}>
          <div className='main-layout whitebox-layout no-padding reschedule-page'>
            <div className='heading-box counselling-page'>
              <h5 className='mr-1'>Book Session</h5>
              <div className='btn-box'>
                <button className={`theme-btn text-none ${errors.gradeNo?.message ? 'error-occured' : ''}`} type='submit'>
                  Reschedule
                </button>
              </div>
            </div>
            <div className='counsellor-box'>
              <div className='row'>
                <div className='col-xxl-3 col-xl-4 col-lg-5 col-md-6 col-sm-7'>
                  <div className='counsellor-item'>
                    <div
                      className='counsellor-img'
                      style={{
                        backgroundImage: (counsellorDetails?.counsellors_profile === null || counsellorDetails?.counsellors_profile === 'undefined')
                          ? `url('${defaultImage}')`
                          : `url('${process.env.REACT_APP_AXIOS_BASE_URL}${counsellorDetails?.counsellors_profile}')`
                      }}
                    ></div>
                    <div className='counsellor-info'>
                      <h6 className='counsellor-name'>
                        {counsellorDetails &&
                          counsellorDetails?.counsellors_first_name}{' '}
                        {counsellorDetails &&
                          counsellorDetails?.counsellors_last_name}
                      </h6>
                      <div className='rating'>
                        <img src={rating} alt='rating' />
                        <p>3.5/5</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className='col-xxl-9 col-xl-8 '>
                  <div className='date-time-box light-blue-bgbox'>
                    <h4 className='box-title'>Date & Time</h4>
                    <div className='time-date'>
                      <div className='itemee'>
                        <div className='img-box'>
                          <img src={calendericon} alt='calendericon' />
                        </div>
                        <h4>{location?.state?.id?.date}</h4>
                      </div>
                      <div className='itemee'>
                        <div className='img-box'>
                          <img src={clockicon} alt='clockicon' />
                        </div>
                        <h4>{location?.state?.id?.from_time}</h4>
                      </div>
                    </div>
                  </div>
                  <div className=' light-blue-bgbox'>
                    <div className='date-time-box'>
                      <h4 className='box-title'>Select Availability Slot</h4>
                      <Form>
                        <div className='btn-box filter-box light-bg'>
                          <div className='filter-date-btn filter-btn'>
                            <DatePicker
                              className='form-control'
                              selected={startDate}
                              onChange={(date) => setStartDate(date)}
                            />
                          </div>
                        </div>
                      </Form>
                    </div>
                    {!availableSlotsArray
                      ? (
                      <button className='slot-booking whitebtn mt-2'>
                        {' '}
                        <img src={timeslotmorning} alt='timeslotmorning' />
                        {ressMessage}
                      </button>
                        )
                      : (
                      <>
                        {availableSlotsArray && availableSlotsArray.length > 0
                          ? availableSlotsArray &&
                            availableSlotsArray.map(
                              (availTime) => {
                                return (
                                  <>
                                    <ul className='slot-availablity'>
                                      <li>
                                        {' '}
                                        <button
                                          className={`slot-booking whitebtn ${
                                            availableSlotId === availTime?.id
                                              ? 'active'
                                              : ''
                                          }`}
                                          onClick={() =>
                                            handleSlotBooking(availTime?.id)
                                          }
                                        >
                                          {' '}
                                          <img
                                            src={timeslotmorning}
                                            alt='timeslotmorning'
                                          />
                                          {availTime?.from_time}
                                        </button>{' '}
                                      </li>
                                    </ul>
                                  </>
                                )
                              }
                            )
                          : 'No Data'}
                      </>
                        )}
                  </div>

                    <Form.Group
                      className='form-group border-line-dark mb-0'
                      controlId='reason'
                    >
                      <Form.Control
                        as='textarea'
                        className='big-textarea'
                        placeholder='Enter Reason for Reschedule....'
                        name={name}
                        {...register('reason', { required: true })}
                      />
                      {errors.reason?.message && (
                        <Form.Text className='error-msg'>
                          {errors.reason?.message}
                        </Form.Text>
                      )}
                    </Form.Group>
                </div>
              </div>
            </div>
          </div>
          </Form>
        </div>
    </>
  )
}

export default Reschedule
