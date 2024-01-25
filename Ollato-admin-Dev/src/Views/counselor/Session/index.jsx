/* eslint-disable */
import React, { useState, useEffect, useRef } from 'react'
/* React Packages */
import { Nav, Tab } from 'react-bootstrap'
import BootstrapTable from 'react-bootstrap-table-next'
import paginationFactory from 'react-bootstrap-table2-paginator'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { useSnackbar } from 'react-notistack'

/* Components */
// import Header from '../../../Components/Header'
// import TitleHeader from '../../../Components/TitleHeader'
import AcceptModal from '../../../Components/AcceptModal'
import RejectModal from '../../../Components/RejectModal'
import ReportModal from '../../../Components/ReportModal'

/* images */
import repeat from '../../../assets/images/reschedule-blue.svg'
import cancel from '../../../assets/images/cancel.svg'
import counsimg from '../../../assets/images/couns.png'
import defaultPic from '../../../assets/images/default_profile.jpg'
import starticon from '../../../assets/images/starticon.svg'
import accepttick from '../../../assets/images/accept-tick.svg'

import view from '../../../assets/images/view-eye.svg'
import reports from '../../../assets/images/reports.svg'

import {
  getAllSessionList,
  acceptRejectAction,
  sessionCompleted,
} from '../../../Actions/Counsellor/session'
import Header from '../../../Components/Header'

const counsellorinfo = (row, cell) => {
  return (
    <div className='counsellor-infobox'>
      <img
        src={
          cell?.student?.profile === null ||
          cell?.student?.profile === 'undefined'
            ? defaultPic
            : `${process.env.REACT_APP_AXIOS_BASE_URL}${cell?.student?.profile}`
        }
        alt=''
      />
      <div className='counsinfo'>
        <p>
          {cell?.student?.first_name} {cell?.student?.last_name}
        </p>
        <a className='email-text' href='#'>
          {cell?.student?.email}
        </a>
      </div>
    </div>
  )
}
const dateTimeInfo = (row, cell) => {
  return (
    <div className='counsellor-infobox'>
      <div className='counsinfo'>
        <p>{cell?.date}</p>
        <a className='email-text' href=''>
          {cell?.from_time}
        </a>
      </div>
    </div>
  )
}

const Session = () => {
  const token = localStorage.getItem('token')
  const dispatch = useDispatch()
  const { enqueueSnackbar } = useSnackbar()

  // useSelector
  const sessionData = useSelector((state) => state.session.sessionList)
  const count = useSelector((state) => state.session.count)
  const isAcceptRejectFlag = useSelector(
    (state) => state.session.isAcceptReject
  )
  const resMessageFlag = useSelector((state) => state.session.resMessage)
  const isReportedFlag = useSelector((state) => state.session.isReported)
  const isCompletedFlag = useSelector((state) => state.session.isCompleted)

  // previousProps
  const previousProps = useRef({
    isAcceptRejectFlag,
    resMessageFlag,
    isReportedFlag,
    isCompletedFlag,
  }).current

  // useState
  const [key, setKey] = useState('all')
  const [start, setStart] = useState(0)
  const [limit] = useState(10)
  const [sort] = useState('id')
  const [search,setSearch] = useState('')
  // const [sessionArray, setSessionArray] = useState([])
  const [pageNo, setPageNo] = useState(1)
  const [show, setShow] = useState(false)
  const [showReject, setShowReject] = useState(false)
  const [id, setId] = useState('')
  const [showReportModal, setReportModal] = useState(false)

  // useSelcteor

  // useEffect to listing Data
  useEffect(() => {
    dispatch(
      getAllSessionList(start, limit, sort, key, search, token, 'counsellor')
    )
  }, [])

  const handleClose = () => setShow(false)

  const handleRejectClose = () => setShowReject(false)

  const handleCompleteSession = (id) => {
    const data = {
      sessionId: id?.id,
    }
    if (data) {
      dispatch(sessionCompleted(data, token))
    }
  }

  // Notification for status
  useEffect(() => {
    if (previousProps?.isCompletedFlag !== isCompletedFlag) {
      if (isCompletedFlag) {
        enqueueSnackbar(`${resMessageFlag}`, {
          variant: 'success',
          hide: 2000,
          autoHide: true,
        })
        dispatch(
          getAllSessionList(
            start,
            limit,
            sort,
            key,
            search,
            token,
            'counsellor'
          )
        )
      } else if (isCompletedFlag === false) {
        enqueueSnackbar(`${resMessageFlag}`, {
          variant: 'error',
          hide: 2000,
          autoHide: true,
          TransitionComponent: 'Fade',
        })
      }
    }
    return () => {
      previousProps.isCompletedFlag = isCompletedFlag
    }
  }, [isCompletedFlag])

  const actionbutton = (row, cell) => {
    return (
      <>
        <div className='btn-common-box d-flex align-items-center justify-content-between'>
          <div className='button-box'>
            {/* eslint-disable-next-line multiline-ternary */}
            {cell?.status === 'reschedule' && key === 'all' ? (
              <>
                <Link to='/cousellor/session-details' state={{ id: cell }}>
                  <button
                    className='action-btns green-bg img-btn'
                    type='button'
                  >
                    {' '}
                    <img className='mr-0' src={view} alt='' />
                  </button>
                </Link>
              </>
            ) : cell?.status === 'reschedule' && key === 'all' ? (
              <>
                <Link to='/cousellor/session-details' state={{ id: cell }}>
                  <button
                    className='action-btns green-bg img-btn'
                    type='button'
                  >
                    {' '}
                    <img className='mr-0' src={view} alt='' />
                  </button>
                </Link>
              </>
            ) : key === 'panding' ? (
              <>
                <Link to=''>
                  <button
                    className='action-btns green-bg'
                    type='button'
                    onClick={() => handleShow(cell?.id)}
                  >
                    {' '}
                    <img src={accepttick} alt='' /> Accept
                  </button>
                </Link>
                <Link
                  to='/cousellor/reschedule-session-details'
                  state={{ id: cell }}
                >
                  <button className='action-btns light-blue-bg' type='button'>
                    {' '}
                    <img src={repeat} alt='' /> Reschedule
                  </button>
                </Link>
                <Link to=''>
                  <button
                    className='action-btns light-red-bg'
                    type='button'
                    onClick={() => handleRejectShow(cell?.id)}
                  >
                    {' '}
                    <img src={cancel} alt='' />
                    Reject
                  </button>
                </Link>
                <Link to='/cousellor/session-details' state={{ id: cell }}>
                  <button
                    className='action-btns green-bg img-btn'
                    type='button'
                  >
                    {' '}
                    <img className='mr-0' src={view} alt='' />
                  </button>
                </Link>
              </>
            ) : key === 'upcoming' ||
              (cell?.status === 'accepted' && key === 'all') ||
              (cell?.status === 'accepted' && key === 'upcoming') ? (
              <>
                <a>
                  <button
                    className='action-btns green-bg'
                    type='button'
                    onClick={() => handleCompleteSession(cell)}
                  >
                    {' '}
                    <img src={starticon} alt='' /> Completed
                  </button>
                </a>
                <Link
                  to='/cousellor/reschedule-session-details'
                  state={{ id: cell }}
                >
                  <button className='action-btns light-blue-bg' type='button'>
                    {' '}
                    <img src={repeat} alt='' /> Reschedule
                  </button>
                </Link>
                <Link
                  to='/cousellor/cancel-session-details'
                  state={{ id: cell }}
                >
                  <button className='action-btns light-red-bg' type='button'>
                    {' '}
                    <img src={cancel} alt='' /> Cancel
                  </button>
                </Link>
                <Link to='/cousellor/session-details' state={{ id: cell }}>
                  <button
                    className='action-btns green-bg img-btn'
                    type='button'
                  >
                    {' '}
                    <img className='mr-0' src={view} alt='' />
                  </button>
                </Link>
              </>
            ) : key === 'completed' ? (
              <>
                <button
                  className='action-btns light-blue-bg'
                  type='button'
                  onClick={() => handleShowReportModal(cell?.id)}
                >
                  {' '}
                  <img src={reports} alt='' /> Reports
                </button>
              </>
            ) : key === 'cancel' ||
              cell?.status === 'reschedule' ||
              (cell?.status === 'reject') | (cell?.status === 'cancel') ? (
              <>
                <Link to='/cousellor/session-details' state={{ id: cell }}>
                  <button
                    className='action-btns green-bg img-btn'
                    type='button'
                  >
                    {' '}
                    <img className='mr-0' src={view} alt='' />
                  </button>
                </Link>
              </>
            ) : cell?.status === 'panding' && key === 'all' ? (
              <>
                <Link to=''>
                  <button
                    className='action-btns green-bg'
                    type='button'
                    onClick={() => handleShow(cell?.id)}
                  >
                    {' '}
                    <img src={accepttick} alt='' /> Accept
                  </button>
                </Link>
                <Link
                  to='/cousellor/reschedule-session-details'
                  state={{ id: cell }}
                >
                  <button className='action-btns light-blue-bg' type='button'>
                    {' '}
                    <img src={repeat} alt='' /> Reschedule
                  </button>
                </Link>
                <Link to=''>
                  <button
                    className='action-btns light-red-bg'
                    type='button'
                    onClick={() => handleRejectShow(cell?.id)}
                  >
                    {' '}
                    <img src={cancel} alt='' />
                    Reject
                  </button>
                </Link>
                <Link to='/cousellor/session-details' state={{ id: cell }}>
                  <button
                    className='action-btns green-bg img-btn'
                    type='button'
                  >
                    {' '}
                    <img className='mr-0' src={view} alt='' />
                  </button>
                </Link>
              </>
            ) : cell?.status === 'completed' && key === 'all' ? (
              <>
                <Link to=''>
                  <button
                    className='action-btns light-blue-bg'
                    type='button'
                    onClick={() => handleShowReportModal(cell?.id)}
                  >
                    {' '}
                    <img src={reports} alt='' /> Reports
                  </button>
                </Link>
              </>
            ) : (
              <></>
            )}
          </div>
        </div>
      </>
    )
  }

  const handleShowReportModal = (id) => {
    setId(id)
    setReportModal(true)
  }
  const handleReportModalClose = () => setReportModal(false)

  const handleShow = (id) => {
    setId(id)
    setShow(true)
  }

  // Notification for Delete
  useEffect(() => {
    if (previousProps?.isReportedFlag !== isReportedFlag) {
      if (isReportedFlag) {
        setReportModal(false)
        enqueueSnackbar(`${resMessageFlag}`, {
          variant: 'success',
          hide: 2000,
          autoHide: true,
        })
      } else if (isReportedFlag === false) {
        setReportModal(false)
        enqueueSnackbar(`${resMessageFlag}`, {
          variant: 'error',
          hide: 2000,
          autoHide: true,
          TransitionComponent: 'Fade',
        })
      }
    }
    return () => {
      previousProps.isReportedFlag = isReportedFlag
    }
  }, [isReportedFlag])

  const columns = [
    {
      dataField: 'id',
      text: 'Sr. no.',
    },
    {
      dataField: 'studentdetails',
      text: 'Student Details',
      formatter: counsellorinfo,
    },
    {
      dataField: 'date',
      text: 'Date & Time',
      formatter: dateTimeInfo,
    },
    {
      dataField: 'body',
      text: 'Action',
      formatter: actionbutton,
    },
  ]
  const products = sessionData || []

  useEffect(() => {
    if (key) {
      dispatch(getAllSessionList(0, limit, sort, key, search, token))
    }
  }, [key])

  // Pagination
  const onPageChange = (page, sizePerPage) => {
    setPageNo(page)

    setStart(limit * (page - 1) - 1 < 0 ? 0 : limit * (page - 1))
    if (page === 1) {
      // dispatch(getAllSessionList(0, limit, sort, key, search, token))
      dispatch(getAllSessionList(0, limit, sort, key, search, token))
    } else {
      dispatch(
        getAllSessionList(
          limit * (page - 1) - 1 < 0 ? 0 : limit * (page - 1),
          limit,
          sort,
          key,
          search,
          token,
          'counsellor'
        )
      )
    }
  }

  const options = {
    sizePerPage: limit,
    hideSizePerPage: true,
    hidePageListOnlyOnePage: false,
    alwaysShowAllBtns: true,
    totalSize: count,
    remote: { pagination: true },
    onPageChange,
    page: +pageNo,
  }

  // Sorting
  const defaultSortedBy = [
    {
      dataField: 'name',
      order: 'asc',
    },
  ]

  const handleTablechange = (type, { page, sortField, sortOrder }) => {
    if (type === 'sort') {
      if (sortOrder) {
        dispatch(
          getAllSessionList(
            start,
            limit,
            sort,
            key,
            search,
            token,
            'counsellor'
          )
        )
      }
    }
  }

  

  const handleRejectShow = (id) => {
    setId(id)
    setShowReject(true)
  }

  const handleAcceptReject = (id) => {
    const dataObject = {
      isAccept: true,
      sessionId: id,
    }
    if (dataObject) {
      dispatch(acceptRejectAction(dataObject, token))
    }
  }

  const handleReject = (id) => {
    const dataObject = {
      isAccept: false,
      sessionId: id,
    }
    if (dataObject) {
      dispatch(acceptRejectAction(dataObject, token))
    }
  }

  // Toastify Notification
  useEffect(() => {
    if (previousProps?.isAcceptRejectFlag !== isAcceptRejectFlag) {
      if (isAcceptRejectFlag) {
        setShow(false)
        setShowReject(false)
        enqueueSnackbar(`${resMessageFlag}`, {
          variant: 'success',
          hide: 2000,
          autoHide: true,
        })
        dispatch(
          getAllSessionList(0, limit, sort, key, '', token, 'counsellor')
        )
      } else if (isAcceptRejectFlag === false) {
        setShow(false)
        setShowReject(false)
        enqueueSnackbar(`${resMessageFlag}`, {
          variant: 'error',
          hide: 2000,
          autoHide: true,
          TransitionComponent: 'Fade',
        })
      }
    }
    return () => {
      previousProps.isAcceptRejectFlag = isAcceptRejectFlag
    }
  }, [isAcceptRejectFlag])

  // Searching in Tabel
  const handleCallback = (childData) => {
    setSearch(childData)
    if (childData) {
      dispatch(
        getAllSessionList(start, limit, sort, key, childData, token, 'counsellor')
      )
    } 
    else {
      dispatch(getAllSessionList(start, limit, sort, key, "", token, 'counsellor'))
    }
  }

  return (
    <>
    <Header searchbar={true}  parentCallback={handleCallback}/>
      <div>
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
                  <Nav.Link eventKey='upcoming'>Ongoing</Nav.Link>
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
            </div>
            <Tab.Content className='overflow-auto'>
              <Tab.Pane eventKey='all'>
                <BootstrapTable
                  keyField='id'
                  data={products}
                  columns={columns}
                  remote={true}
                  pagination={paginationFactory(options)}
                  defaultSorted={defaultSortedBy}
                  onTableChange={handleTablechange}
                  responsive='md'
                  options={options}
                  noDataIndication={() => "No data"}
                />
              </Tab.Pane>
              <Tab.Pane eventKey='panding'>
                <BootstrapTable
                  keyField='id'
                  data={products}
                  columns={columns}
                  remote={true}
                  pagination={paginationFactory(options)}
                  defaultSorted={defaultSortedBy}
                  onTableChange={handleTablechange}
                  responsive='md'
                  options={options}
                  noDataIndication={() =>"No data" }
                />
              </Tab.Pane>
              <Tab.Pane eventKey='upcoming'>
                <BootstrapTable
                  keyField='id'
                  data={products}
                  columns={columns}
                  remote={true}
                  pagination={paginationFactory(options)}
                  defaultSorted={defaultSortedBy}
                  onTableChange={handleTablechange}
                  responsive='md'
                  options={options}
                  noDataIndication={() => "No data"}
                />
              </Tab.Pane>
              <Tab.Pane eventKey='completed'>
                <BootstrapTable
                  keyField='id'
                  data={products}
                  columns={columns}
                  remote={true}
                  pagination={paginationFactory(options)}
                  defaultSorted={defaultSortedBy}
                  onTableChange={handleTablechange}
                  responsive='md'
                  options={options}
                  noDataIndication={() => "No data"}
                />
              </Tab.Pane>
              <Tab.Pane eventKey='cancel'>
                <BootstrapTable
                  keyField='id'
                  data={products}
                  columns={columns}
                  remote={true}
                  pagination={paginationFactory(options)}
                  defaultSorted={defaultSortedBy}
                  onTableChange={handleTablechange}
                  responsive='md'
                  options={options}
                  noDataIndication={() =>"No data" }
                />
              </Tab.Pane>
              <Tab.Pane eventKey='reschedule'>
                <BootstrapTable
                  keyField='id'
                  data={products}
                  columns={columns}
                  remote={true}
                  pagination={paginationFactory(options)}
                  defaultSorted={defaultSortedBy}
                  onTableChange={handleTablechange}
                  responsive='md'
                  options={options}
                  noDataIndication={() => "No data"}
                />
              </Tab.Pane>
            </Tab.Content>
          </Tab.Container>
        </div>
      </div>
      <AcceptModal
        id={id}
        show={show}
        handleClose={handleClose}
        handleAcceptReject={handleAcceptReject}
      />
      <RejectModal
        id={id}
        show={showReject}
        handleClose={handleRejectClose}
        handleAcceptReject={handleReject}
      />
      <ReportModal
        show={showReportModal}
        handleClose={handleReportModalClose}
        id={id}
      />
    </>
  )
}

export default Session
