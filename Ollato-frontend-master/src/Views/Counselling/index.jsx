import React, { useState, useEffect, useRef } from 'react'
import { Form, Tab, Nav } from 'react-bootstrap'
import DatePicker from 'react-datepicker'
import Select from 'react-select'
import moment from 'moment'
import { Link, useLocation } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'

// Components
// import TitleHeader from '../../Components/TitleHeader'
import Alreadypurchased from '../../Views/TestProcess/NeedPurchasePackage'
// images
import rating from '../../assets/images/rating.png'
import defaultImage from '../../assets/default_profile copy.jpg'
// import background from '../../assets/images/brooklyn-simmons.png'
import timeslotmorning from '.././../assets/images/timeslotmorning.svg'

// Action Files
import {
  getAllAvailableSlots,
  getAllCounsellorData
} from '../../Actions/counsellor'

const Counselling = () => {
  const dispatch = useDispatch()
  const location = useLocation()
  // useState
  const [startDate, setStartDate] = useState()
  const [availableTimeSlots, setAvailableTimeSlots] = useState([])
  const [selectedTimeFilter, setSelectedTimeFilter] = useState()
  // const [counsellorType, setCounsellorType] = useState('career_counsellor')
  const [key, setKey] = useState('career_counsellor')
  const [cArray, setCArray] = useState([])

  // Token
  const token = localStorage.getItem('token')

  // useSelector
  const timeSlots = useSelector((state) => state.counsellor.availableSlots)
  const resStatusFlag = useSelector((state) => state.counsellor.resStatus)

  const filteredCounsellorData = useSelector(
    (state) => state.counsellor.counsellorData
  )
  // for TimeFilter
  // const timeFilter = [{ value: '10:00', label: '10:00' }, { value: '12:00', label: '12:00' }, { value: '01:00', label: '01:00' }, { value: '03:00', label: '03:00' }]

  // PreviousProps
  const previousProps = useRef({
    timeSlots,
    filteredCounsellorData
  }).current

  useEffect(() => {
    if (previousProps?.filteredCounsellorData !== filteredCounsellorData) {
      if (filteredCounsellorData) {
        setCArray(filteredCounsellorData)
      }
    }
    return () => {
      previousProps.filteredCounsellorData = filteredCounsellorData
    }
  }, [filteredCounsellorData])

  useEffect(() => {
    if (location?.state?.data) {
      setKey(location?.state?.data)
    } else if (location?.state === null) {
      setKey('career_counsellor')
    }
  }, [location])

  // useEffect
  useEffect(() => {
    if (token) {
      dispatch(getAllAvailableSlots(token))
    }
  }, [token])

  /* For Time Slots */
  useEffect(() => {
    if (previousProps?.timeSlots !== timeSlots) {
      const array = []
      // const array2 = []
      if (timeSlots) {
        // array2.push({
        //   value: timeSlots[0]?.from_time,
        //   label: timeSlots[0]?.from_time
        // })
        // setSelectedTimeFilter(array2)
        // eslint-disable-next-line array-callback-return
        timeSlots.map((data) => {
          // setSelectedTimeFilter([{
          //   value: data[0].from_time,
          //   label: data[0].from_time
          // }])
          array.push({
            value: data.from_time,
            label: data.from_time
          })
        })
        setAvailableTimeSlots(array)
      }
    }
    return () => {
      previousProps.timeSlots = timeSlots
    }
  }, [timeSlots])

  const handleTimeDateFilter = (e) => {
    setSelectedTimeFilter(e?.value)
    const data = {
      date: moment(startDate).format('YYYY-MM-DD'),
      time: e?.value,
      type: key
    }
    dispatch(getAllCounsellorData(data, token))
  }

  useEffect(() => {
    if (selectedTimeFilter) {
      const data = {
        date: moment(startDate).format('YYYY-MM-DD'),
        time: selectedTimeFilter
      }
      dispatch(getAllCounsellorData(data, token))
    }
  }, [selectedTimeFilter])

  useEffect(() => {
    const data = {
      type: key
    }
    if (token) {
      dispatch(getAllCounsellorData(data, token))
    }
  }, [token])

  useEffect(() => {
    if (startDate) {
      const data = {
        date: moment(startDate).format('YYYY-MM-DD'),
        time: selectedTimeFilter,
        type: key
      }
      dispatch(getAllCounsellorData(data, token))
    }
  }, [startDate || selectedTimeFilter])

  useEffect(() => {
    if (startDate) {
      const data = {
        type: key,
        date: moment(startDate).format('YYYY-MM-DD'),
        time: selectedTimeFilter
      }
      dispatch(getAllCounsellorData(data, token))
    } else {
      const data = {
        type: key
      }
      dispatch(getAllCounsellorData(data, token))
    }
  }, [key])
  // useEffect(() => {
  //   const dataObject = {
  //     type: key
  //   }
  //   dispatch(getAllCounsellorData(dataObject, token))
  // }, [key])

  return (
    <>
        <div className=''>
          {/* <TitleHeader title='Counselling' /> */}
          {
            resStatusFlag === 400
              ? <>
                <Alreadypurchased />
             </>
              : <>
               <div className='main-layout whitebox-layout no-padding '>
                  <div className='heading-box counselling-page'>
                    <h5 className='mr-1'>Book Session</h5>
                    <Form>
                      <div className='btn-box filter-box light-bg'>
                        <div className='filter-date-btn filter-btn'>
                          <DatePicker
                            placeholderText='Select Date'
                            className='form-control'
                            selected={startDate}
                            onChange={(date) => setStartDate(date)}
                            minDate={new Date()}
                          />
                        </div>
                        <div>
                          <span className='seperator'>-</span>
                        </div>
                        <div className='filter-time-btn filter-btn'>
                          <Form.Group
                            className='form-group common-select-style mb-0'
                            controlId='formfullname'
                          >
                            <Select
                              classNamePrefix='filter-custom'
                              isSearchable={false}
                              defaultValue={selectedTimeFilter}
                              onChange={(e) => handleTimeDateFilter(e)}
                              options={availableTimeSlots}
                            />
                          </Form.Group>
                        </div>
                      </div>
                    </Form>
                  </div>
                  <div className='counsellor-box test-process-tab'>
                    <Tab.Container
                      id='left-tabs-example'
                      defaultActiveKey={key}
                      activeKey={key}
                      onSelect={(k) => {
                        setKey(k)
                      }}
                    >
                      <Nav variant='pills'>
                        <>
                          <Nav.Item>
                              <Nav.Link
                                eventKey={'career_counsellor'}
                                // href='/counselling/career'
                              >
                                Career
                              </Nav.Link>
                          </Nav.Item>
                          <Nav.Item>
                            <Nav.Link
                              eventKey={'psychologist'}
                              // href='/counselling/psy'
                            >
                              Psychologist
                            </Nav.Link>
                          </Nav.Item>
                          <Nav.Item>
                            <Nav.Link
                              eventKey={'overseas_counsellor'}
                            >
                              Overseas
                            </Nav.Link>
                          </Nav.Item>
                          <Nav.Item>
                            <Nav.Link
                              eventKey={'subject_expert'}
                            >
                              Subject Expert
                            </Nav.Link>
                          </Nav.Item>
                        </>
                      </Nav>
                      <Tab.Content>
                        <Tab.Pane eventKey={key}>
                        <div className='row'>
                          {
                            cArray &&
                            cArray.length > 0
                              ? (
                                  cArray.map((data) => {
                                    return (
                                      <React.Fragment key={data?.id}>
                                        <div
                                          className='col-xxl-3 col-xl-4 col-sm-6'
                                        >
                                          <Link
                                            to={`/counselling/counselor-detail/${data?.id}`}
                                            state={{ key }}
                                            className='d-block'
                                          >
                                            <div className='counsellor-item'>
                                              <div
                                                className='counsellor-img'
                                                style={{
                                                  backgroundImage: (data?.profile === null || data?.profile === 'undefined')
                                                    ? `url('${defaultImage}')`
                                                    : `url('${process.env.REACT_APP_AXIOS_BASE_URL}${data?.profile}')`
                                                }}
                                              ></div>
                                              <div className='counsellor-info'>
                                                <h6 className='counsellor-name'>
                                                  {data?.first_name} {data?.last_name}
                                                </h6>
                                                {data?.avg_ratings > 0 &&
                                                <div className='rating'>
                                                  <img src={rating} alt='rating' />
                                                  <p>{data?.avg_ratings === null || data?.avg_ratings === 'undefined' ? 0 : parseFloat(data?.avg_ratings).toFixed(1)}/5</p>
                                                </div>}
                                                <div className='btn-box'>
                                                  <button
                                                    type='button'
                                                    className='white-btn book-now'
                                                  >
                                                    Book Now
                                                  </button>
                                                </div>
                                              </div>
                                            </div>
                                          </Link>
                                        </div>
                                      </React.Fragment>
                                    )
                                  })
                                )
                              : (
                            <button className='slot-booking whitebtn mt-2'>
                              {' '}
                              <img src={timeslotmorning} alt='timeslotmorning' />
                              No Data Found
                            </button>
                                )}
                        </div>
                                                  </Tab.Pane>
                              </Tab.Content>
                    </Tab.Container>
                  </div>
                </div>
             </>
          }
        </div>
    </>
  )
}

export default Counselling
