import React, { useState, useEffect, useRef } from 'react'
import { Form, Nav, Tab } from 'react-bootstrap'
import BootstrapTable from 'react-bootstrap-table-next'
import paginationFactory from 'react-bootstrap-table2-paginator'
import DatePicker from 'react-datepicker'
import Select from 'react-select'
import { useDispatch, useSelector } from 'react-redux'
import moment from 'moment'
import { useSnackbar } from 'react-notistack'
import { Link } from 'react-router-dom'

// Components
import ReportModal from '../../Components/ReportModal'
import RatingsModal from '../../Components/RatingsModal/index'

// images
import repeat from '../../assets/images/repeat.svg'
import cancel from '../../assets/images/cancel.svg'
// import counsimg from '../../assets/images/couns.png'8
import review from '../../assets/images/review.svg'
import { AiFillStar } from 'react-icons/ai'
import defaultPic from '../../assets/default_profile copy.jpg'

// Action File
import {
  getAllAvailableSlots,
  getSessionsHistory
} from '../../Actions/counsellor'

// Counsellor Info Data
const counsellorinfo = (row, cell) => {
  return (
    <div className='counsellor-infobox'>
      <img
        src={
          cell?.counsellors_profile === null ||
          cell?.counsellors_profile === 'undefined'
            ? defaultPic
            : `${process.env.REACT_APP_AXIOS_BASE_URL}${cell?.counsellors_profile}`
        }
        alt=''
      />
      {/* <img src={counsimg} alt='' /> */}
      <div className='counsinfo'>
        <p>
          {cell?.counsellor_first_name} {cell?.counsellor_middle_name}{' '}
          {cell?.counsellor_last_name}
        </p>
        <a className='email-text' href={`mailto: ${cell?.counsellor_email}`}>
          {cell?.counsellor_email}
        </a>
      </div>
    </div>
  )
}

// Counsellor Info Data
const datetimeInfo = (row, cell) => {
  return (
    <div className='counsellor-infobox'>
      {/* <img src={counsimg} alt='' /> */}
      <div className='counsinfo'>
        <p>{cell?.date}</p>
        <a className='email-text' href={`mailto: ${cell?.counsellor_email}`}>
          {cell?.from_time}
        </a>
      </div>
    </div>
  )
}

const SessionHistory = () => {
  const dispatch = useDispatch()
  const { enqueueSnackbar } = useSnackbar()

  // const navigate = useNavigate()

  // Token
  const token = localStorage.getItem('token')

  // useState
  const [key, setKey] = useState('all')
  const [id, setId] = useState('')

  const [startDate, setStartDate] = useState()
  const [availableTimeSlots, setAvailableTimeSlots] = useState([])
  const [selectedTimeFilter, setSelectedTimeFilter] = useState()
  const [show, setShow] = useState(false)
  const [ratingsShow, setRatingsShow] = useState(false)
  const [cId, setCounsellorId] = useState()

  // useSelector
  const timeSlots = useSelector((state) => state.counsellor.availableSlots)
  const sessionHistoryDataArray = useSelector(
    (state) => state.counsellor.sessionHistoryData
  )
  const isReportedFlag = useSelector((state) => state.counsellor.isReported)
  const isRatedFlag = useSelector((state) => state.counsellor.isRated)
  const resMessageFlag = useSelector((state) => state.counsellor.resMessage)

  // PreviousProps
  const previousProps = useRef({
    timeSlots,
    isRatedFlag,
    isReportedFlag,
    resMessageFlag
  }).current

  // Function to delete Row in table
  const handleShow = (id) => {
    setId(id)
    setShow(true)
  }
  const handleRatingsShow = (id, cId) => {
    setId(id)
    setRatingsShow(true)
    setCounsellorId(cId)
  }
  const handleClose = () => setShow(false)
  const handleRatingsClose = () => setRatingsShow(false)

  // Notification for Report
  useEffect(() => {
    if (previousProps?.isReportedFlag !== isReportedFlag) {
      if (isReportedFlag) {
        setShow(false)
        enqueueSnackbar(`${resMessageFlag}`, {
          variant: 'success',
          hide: 2000,
          autoHide: true
        })
      } else if (isReportedFlag === false) {
        setShow(false)
        enqueueSnackbar(`${resMessageFlag}`, {
          variant: 'error',
          hide: 2000,
          autoHide: true,
          TransitionComponent: 'Fade'
        })
      }
    }
    return () => {
      previousProps.isReportedFlag = isReportedFlag
    }
  }, [isReportedFlag])

  // Notification for Ratings
  useEffect(() => {
    if (previousProps?.isRatedFlag !== isRatedFlag) {
      if (isRatedFlag) {
        setRatingsShow(false)
        enqueueSnackbar(`${resMessageFlag}`, {
          variant: 'success',
          hide: 2000,
          autoHide: true
        })
      } else if (isRatedFlag === false) {
        setRatingsShow(false)
        enqueueSnackbar(`${resMessageFlag}`, {
          variant: 'error',
          hide: 2000,
          autoHide: true,
          TransitionComponent: 'Fade'
        })
      }
    }
    return () => {
      previousProps.isRatedFlag = isRatedFlag
    }
  }, [isRatedFlag])

  // Action-Button
  const actionbutton = (row, cell) => {
    return (
      <div className='button-box'>
        {((cell.status === 'reschedule' || cell.status === 'cancel' || cell.status === 'reject') &&
          key === 'all') ||
        key === 'cancel' ||
        key === 'reschedule'
          ? (
          <>
            <Link
              to={`/counselling/session-detail/${cell?.id}`}
              state={{ id: cell }}
            >
              <button className='action-btns light-blue-bg' type='button'>
                {' '}
                <img src={review} alt='' />
                View
              </button>
            </Link>
          </>
            )
          : ((cell.status === 'panding' || cell.status === 'upcoming') &&
            key === 'all') ||
          key === 'panding' ||
          key === 'upcoming'
              ? (
          <>
            <Link
              to={`/counselling/session-detail/${cell?.id}`}
              state={{ id: cell }}
            >
              <button className='action-btns light-blue-bg' type='button'>
                {' '}
                <img src={review} alt='' />
                View
              </button>
            </Link>
            <Link to='/counselling/reschedule' state={{ id: cell }}>
              <button className='action-btns green-bg' type='button'>
                <img src={repeat} alt='' /> Reschedule
              </button>
            </Link>
            <Link to='/counselling/cancel-session' state={{ id: cell }}>
              <button className='action-btns light-red-bg' type='button'>
                <img src={cancel} alt='' /> Cancel
              </button>
            </Link>
          </>
                )
              : key === 'completed' ||
          (key === 'all' && cell.status === 'completed')
                ? (
          <>
            <Link to=''>
              <button
                className='action-btns light-blue-bg'
                type='button'
                onClick={() => handleShow(cell?.id)}
              >
                {' '}
                <img src={review} alt='' /> Report
              </button>
            </Link>
            <Link
              to={`/counselling/session-detail/${cell?.id}`}
              state={{ id: cell }}
            >
              <button className='action-btns light-blue-bg' type='button'>
                {' '}
                <img src={review} alt='' />
                View
              </button>
            </Link>
            <Link to=''>
              <button
                className='action-btns green-bg'
                type='button'
                onClick={() => handleRatingsShow(cell?.id, cell?.counsellor_id)}
              >
                {' '}
                <AiFillStar />
                Review
              </button>
            </Link>
          </>
                  )
                : null}
      </div>
    )
  }

  /* for TimeFilter */
  // const timeFilter = [{ value: '10:00 AM', label: '10:00 AM' }, { value: '12:00 AM', label: '12:00 AM' }, { value: '01:00 AM', label: '01:00 AM' }, { value: '03:00 AM', label: '03:00 AM' }]
  // const [selectedTimeFilter, setSelectedTimeFilter] = useState([{ value: '10:00 AM', label: '10:00 AM' }])
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
  useEffect(() => {
    if (startDate) {
      const data = {
        sessionStatus: key,
        date: moment(startDate).format('YYYY-MM-DD'),
        time: selectedTimeFilter
      }
      dispatch(getSessionsHistory(data, token))
    } else {
      const data = {
        sessionStatus: key
      }
      dispatch(getSessionsHistory(data, token))
    }
  }, [key])

  // useEffect(() => {
  //   if (selectedTimeFilter[0]?.value) {

  //   }
  // }, [selectedTimeFilter[0]?.value])

  useEffect(() => {
    if (startDate || selectedTimeFilter) {
      const data = {
        sessionStatus: key,
        date: moment(startDate).format('YYYY-MM-DD'),
        time: selectedTimeFilter?.value
      }
      dispatch(getSessionsHistory(data, token))
    }
  }, [startDate || selectedTimeFilter])

  const columns = [
    {
      dataField: 'id',
      text: 'Sr. no.',
      formatter: (cell, row, rowIndex) => {
        const rowNumber = rowIndex + 1
        return <span>{rowNumber}</span>
      }
    },
    {
      dataField: '',
      text: 'Counsellor',
      formatter: counsellorinfo
    },
    {
      dataField: 'from_time',
      text: 'Date & Time',
      formatter: datetimeInfo
    },
    {
      dataField: 'body',
      text: 'Action',
      formatter: actionbutton
    }
  ]
  const products =
    sessionHistoryDataArray?.length > 0 ? sessionHistoryDataArray : ''

  const emptyDataMessage = () => {
    return 'No Data to Display'
  }

  const handleTimeFilterMethod = (e) => {
    setSelectedTimeFilter(e?.value)
    const data = {
      sessionStatus: key,
      date: moment(startDate).format('YYYY-MM-DD'),
      time: e?.value
    }
    dispatch(getSessionsHistory(data, token))
  }

  // const handleKeyChange = () => {
  //   const data = {
  //     sessionStatus: key,
  //     date: moment(startDate).format('YYYY-MM-DD'),
  //     time: selectedTimeFilter?.value
  //   }
  //   dispatch(getSessionsHistory(data, token))
  // }

  // const handlePathChange = () => {
  //   navigate(`/counselling/session-history/${key}`)
  // }

  return (
    <>
        <div className='main-layout whitebox-layout'>
          <div className='session-history-box'>
            <Tab.Container
              id='left-tabs-example'
              defaultActiveKey='all'
              activeKey={key}
              onSelect={(k) => {
                setKey(k)
              }}
            >
              <div className='d-flex justify-content-between align-items-center heading-box'>
                <Nav variant='pills'>
                  <Nav.Item>
                    <Nav.Link eventKey='all'>All</Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey='panding'>Pending</Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey='upcoming'>Upcoming</Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey='completed'>Completed</Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey='cancel'>Canceled</Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey='reschedule'>Rescheduled</Nav.Link>
                  </Nav.Item>
                </Nav>
                <div className='counselling-page'>
                  <Form>
                    <div className='btn-box filter-box light-bg'>
                      <div className='filter-date-btn filter-btn'>
                        <DatePicker
                          placeholderText='Select Date'
                          className='form-control'
                          selected={startDate}
                          onChange={(date) => setStartDate(date)}
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
                            onChange={(e) => handleTimeFilterMethod(e)}
                            options={availableTimeSlots}
                          />
                        </Form.Group>
                      </div>
                    </div>
                  </Form>
                </div>
              </div>
              <Tab.Content>
                <Tab.Pane eventKey='all'>
                  <BootstrapTable
                    keyField='id'
                    noDataIndication={emptyDataMessage}
                    data={products}
                    columns={columns}
                    pagination={paginationFactory({ sizePerPage: 6 })}
                    responsive='md'
                  />
                  <h6 className='pending-sessions'>
                    {sessionHistoryDataArray && sessionHistoryDataArray?.length}{' '}
                    Sessions
                  </h6>
                </Tab.Pane>
                <Tab.Pane eventKey='panding'>
                  <BootstrapTable
                    keyField='id'
                    noDataIndication={emptyDataMessage}
                    data={products}
                    columns={columns}
                    pagination={paginationFactory({ sizePerPage: 6 })}
                    responsive='md'
                  />
                  <h6 className='pending-sessions'>
                    {sessionHistoryDataArray && sessionHistoryDataArray?.length}{' '}
                    Sessions Pending
                  </h6>
                </Tab.Pane>
                <Tab.Pane eventKey='upcoming'>
                  <BootstrapTable
                    keyField='id'
                    noDataIndication={emptyDataMessage}
                    data={products}
                    columns={columns}
                    pagination={paginationFactory({ sizePerPage: 6 })}
                    responsive='md'
                  />
                  <h6 className='pending-sessions'>
                    {sessionHistoryDataArray && sessionHistoryDataArray?.length}{' '}
                    Sessions Upcoming
                  </h6>
                </Tab.Pane>
                <Tab.Pane eventKey='completed'>
                  <BootstrapTable
                    keyField='id'
                    noDataIndication={emptyDataMessage}
                    data={products}
                    columns={columns}
                    pagination={paginationFactory({ sizePerPage: 6 })}
                    responsive='md'
                  />
                  <h6 className='pending-sessions'>
                    {sessionHistoryDataArray && sessionHistoryDataArray?.length}{' '}
                    Sessions Completed
                  </h6>
                </Tab.Pane>
                <Tab.Pane eventKey='cancel'>
                  <BootstrapTable
                    keyField='id'
                    noDataIndication={emptyDataMessage}
                    data={products}
                    columns={columns}
                    pagination={paginationFactory({ sizePerPage: 6 })}
                    responsive='md'
                  />
                  <h6 className='pending-sessions'>
                    {sessionHistoryDataArray && sessionHistoryDataArray?.length}{' '}
                    Sessions Canceled
                  </h6>
                </Tab.Pane>
                <Tab.Pane eventKey='reschedule'>
                  <BootstrapTable
                    keyField='id'
                    noDataIndication={emptyDataMessage}
                    data={products}
                    columns={columns}
                    pagination={paginationFactory({ sizePerPage: 6 })}
                    responsive='md'
                  />
                  <h6 className='pending-sessions'>
                    {sessionHistoryDataArray && sessionHistoryDataArray?.length}{' '}
                    Sessions Reschedule
                  </h6>
                </Tab.Pane>
              </Tab.Content>
            </Tab.Container>
          </div>
        </div>
      {/* </div> */}
      <ReportModal show={show} handleClose={handleClose} id={id} />
      <RatingsModal
        show={ratingsShow}
        handleClose={handleRatingsClose}
        id={id}
        cId={cId}
      />
    </>
  )
}

export default SessionHistory
