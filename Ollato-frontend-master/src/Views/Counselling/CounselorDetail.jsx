import React, { useState, useEffect, useRef } from 'react'
/* React Packages */
import { Form } from 'react-bootstrap'
import DatePicker from 'react-datepicker'
import { useNavigate, useParams, useLocation } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import moment from 'moment'
import { useSnackbar } from 'react-notistack'

/* Components */
import TitleHeader from '../../Components/TitleHeader'

/* images */
import rating from '../../assets/images/rating.png'
import defaultImage from '../../assets/default_profile copy.jpg'
// import background from '../../assets/images/brooklyn-simmons.png'
import timeslotmorning from '.././../assets/images/timeslotmorning.svg'
// import timeslotnoon from '.././../assets/images/timeslotnoon.svg'
// import timeslotnight from '.././../assets/images/timeslotnight.svg'

// Action Files
import {
  getCounsellorDetails,
  getCounsellorAvailableSlots,
  bookSession
} from '../../Actions/counsellor'

const CounselorDetail = () => {
  const params = useParams()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const { enqueueSnackbar } = useSnackbar()

  // Token
  const token = localStorage.getItem('token')

  // useState
  const [startDate, setStartDate] = useState(new Date())
  const [selectedButton1, setSelectedButton1] = useState(false)
  const [selectedButton2, setSelectedButton2] = useState(false)
  const [availableSlotId, setAvailableSlotId] = useState()
  const [cData, setCData] = useState([])
  const [cType, setCType] = useState('')
  const [counsellorType, setCounsellorType] = useState('')

  // Toggle-Selected Button
  const toggleActive = (e, type, cType) => {
    if (type === 'btn1') {
      setSelectedButton1(!selectedButton1)
      setSelectedButton2(false)
      setCType(cType)
    } else {
      setSelectedButton2(!selectedButton2)
      setSelectedButton1(false)
      setCType(cType)
    }
  }

  // useSelector
  const counsellorDetails = useSelector(
    (state) => state.counsellor.counsellorDetails
  )
  const availableSlotsArray = useSelector(
    (state) => state.counsellor.counsellorAvailableSlots
  )
  const ressMessage = useSelector((state) => state.counsellor.resMessage)
  const isSessionBookFlag = useSelector(
    (state) => state.counsellor.isSessionBooked
  )
  const resStatus = useSelector((state) => state.counsellor.resStatus)

  const previousProps = useRef({ ressMessage, isSessionBookFlag }).current
  useEffect(() => {
    if (token) {
      const data = {
        id: Number(params?.id)
      }
      dispatch(getCounsellorDetails(data, token))
    }
  }, [token])

  useEffect(() => {
    if (resStatus === 400) {
      enqueueSnackbar(`${ressMessage}`, {
        variant: 'error',
        autoHide: true,
        hide: 3000
      })
      navigate('/package')
    }
  }, [resStatus])
  useEffect(() => {
    if (previousProps?.counsellorDetails !== counsellorDetails) {
      if (counsellorDetails) {
        setCData(cData)
        if (counsellorDetails?.existPackage?.videoCall === Number(1)) {
          setCType('VIDEO')
          setSelectedButton1(true)
        } else {
          setCType('F2F')
          setSelectedButton2(true)
        }
        setCounsellorType(location?.state?.key)
        // if (counsellorDetails?.counsellor?.career_counsellor === '1') {
        //   setCounsellorType('career_counsellor')
        // } else if (counsellorDetails?.counsellor?.psychologist === '1') {
        //   setCounsellorType('psychologist')
        // } else if (counsellorDetails?.counsellor?.overseas_counsellor === '1') {
        //   setCounsellorType('overseas_counsellor')
        // }
      }
    }
    return () => {
      previousProps.counsellorDetails = counsellorDetails
    }
  }, [counsellorDetails])

  useEffect(() => {
    if (startDate) {
      const data = {
        date: moment(startDate).format('YYYY-MM-DD'),
        id: Number(params?.id)
      }
      dispatch(getCounsellorAvailableSlots(data, token))
    }
  }, [startDate])

  // Available Slot Booking
  const handleSlotBooking = (data) => {
    setAvailableSlotId(data)
  }

  const handlebookSession = () => {
    if (availableSlotId === null || availableSlotId === undefined) {
      enqueueSnackbar('Please select atlest one slot', {
        variant: 'error',
        autoHide: true,
        hide: 3000
      })
    } else if (cType === '') {
      enqueueSnackbar('Please select atlest one counselling type', {
        variant: 'error',
        autoHide: true,
        hide: 3000
      })
    } else {
      const bookSessionData = {
        id: counsellorDetails?.counsellor?.id,
        counselorAvalId: availableSlotId,
        type: cType,
        counsellorType
      }
      dispatch(bookSession(bookSessionData, token))
    }
  }

  useEffect(() => {
    if (previousProps?.isSessionBookFlag !== isSessionBookFlag) {
      if (isSessionBookFlag) {
        enqueueSnackbar(`${ressMessage}`, {
          variant: 'success',
          autoHide: true,
          hide: 3000
        })
        navigate('/counselling/session-history/all')
      } else if (isSessionBookFlag === false) {
        enqueueSnackbar(`${ressMessage}`, {
          variant: 'error',
          autoHide: true,
          hide: 3000
        })
      }
    }
    return () => {
      previousProps.isSessionBookFlag = isSessionBookFlag
    }
  }, [isSessionBookFlag])

  return (
    <div>
      <TitleHeader title='Counselling' />
      <div className='main-layout whitebox-layout no-padding reschedule-page'>
        <div className='heading-box counselling-page'>
          <h5 className='mr-1'>Book Session</h5>
          <div className='btn-box'>
            <button
              className='theme-btn text-none'
              type='button'
              onClick={() => handlebookSession()}
            >
              Book Now
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
                    backgroundImage:
                      counsellorDetails?.counsellor?.profile_picture === null ||
                      counsellorDetails?.counsellor?.profile_picture ===
                        'undefined'
                        ? `url('${defaultImage}')`
                        : `url('${process.env.REACT_APP_AXIOS_BASE_URL}${counsellorDetails?.counsellor?.profile_picture}')`
                  }}
                ></div>
                <div className='counsellor-info'>
                  <h6 className='counsellor-name'>
                    {counsellorDetails?.counsellor?.first_name}{' '}
                    {counsellorDetails?.counsellor?.last_name}
                  </h6>
                  {counsellorDetails?.counsellor?.avg_ratings !== null && counsellorDetails?.counsellor?.avg_ratings !== 0
                    ? <div className='rating'>
                    <img src={rating} alt='rating' />
                     <p>
                      {counsellorDetails && counsellorDetails?.counsellor?.avg_ratings?.toFixed(1) + '/5'}
                    </p>
                  </div>
                    : null}
                </div>
              </div>
            </div>
            <div className='col-xxl-9 col-xl-8 '>
              {/* <div className='infobasic'>
                <h4>Basic Information</h4>
                <p>
                  UX writing is an important skill for UX designers and other
                  design pros. Test your knowledge of key UX Writing principles
                  and best practices. Skill tests are essential for benchmarking
                  your current design knowledge. When you take a skill test,
                  you’ll see how you compare with other designers from around
                  the world.
                </p>
              </div> */}
              <div className='date-time-box light-blue-bgbox'>
                <h4 className='box-title'>Counselling Type</h4>
                <div className='time-date counselling-btnbox'>
                  {counsellorDetails?.existPackage?.videoCall === 1
                    ? (
                    <div className='itemee'>
                      <button
                        className={`theme-btn text-none whitebtn ${
                          selectedButton1 ? 'active' : ''
                        }`}
                        onClick={(e) => toggleActive(e, 'btn1', 'VIDEO')}
                      >
                        Online Video Counseling
                      </button>
                    </div>
                      )
                    : (
                        ''
                      )}
                  {counsellorDetails?.existPackage?.f2fCall === 1
                    ? (
                    <div className='itemee'>
                      <button
                        className={`theme-btn text-none whitebtn ${
                          selectedButton2 ? 'active' : ''
                        }`}
                        onClick={(e) => toggleActive(e, 'btn2', 'F2F')}
                      >
                        Face to Face Counselling
                      </button>
                    </div>
                      )
                    : (
                        ''
                      )}
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
                          minDate={new Date()}
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
                    <ul className='slot-availablity row'>
                      {availableSlotsArray && availableSlotsArray.length > 0
                        ? availableSlotsArray &&
                          availableSlotsArray.map((availTime) => {
                            return (
                              <>
                                <li>
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
                                    <img
                                      src={timeslotmorning}
                                      alt='timeslotmorning'
                                    />
                                    {availTime?.from_time}
                                  </button>
                                </li>
                              </>
                            )
                          })
                        : 'No Data'}
                    </ul>
                  </>
                    )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CounselorDetail
