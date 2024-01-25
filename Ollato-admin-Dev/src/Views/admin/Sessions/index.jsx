import React, { useState, useEffect } from 'react'
/* React Packages */
import { Nav, Tab, Form, Spinner } from 'react-bootstrap'
import BootstrapTable from 'react-bootstrap-table-next'
import paginationFactory from 'react-bootstrap-table2-paginator'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'

/* Components */
import AcceptModal from '../../../Components/AcceptModal'
import RejectModal from '../../../Components/RejectModal'
import view from '../../../assets/images/view-eye.svg'
import { acceptRejectAction } from '../../../Actions/Counsellor/session'
import { getAllSession } from '../../../Actions/Admin/session'
import moment from 'moment'
import ls from 'localstorage-slim'
import defaultimage from '../../../assets/images/default.jpeg'
import Header from '../../../Components/Header'
// import localStorage from 'react-secure-storage'

const studentinfo = (row, cell) => {
  return (
    <div className='counsellor-infobox'>
      <img src={ cell?.student?.profile !== null ? `${process.env.REACT_APP_AXIOS_BASE_URL}${cell?.student?.profile}` : defaultimage} alt='' />
      <div className='counsinfo'>
        <p>
          {cell?.student?.first_name} {cell?.student?.last_name}
        </p>
        <a className='email-text' href=''>
          {cell?.student?.email}
        </a>
      </div>
    </div>
  )
}

const counsellorinfo = (row, cell) => {
  return (
    <div className='counsellor-infobox'>
      <div className='counsinfo'>
        <p>
          {cell?.counsellors?.first_name} {cell?.counsellors?.last_name}
        </p>
        <a className='email-text' href=''>
          {cell?.counsellors?.email}
        </a>
      </div>
    </div>
  )
}
const dateTimeInfo = (row, cell) => {
  return (
    <div className='counsellor-infobox'>
      {/* <img src={counsimg} alt='' /> */}
      <div className='counsinfo'>
        <p>{cell?.date}</p>
        <a className='email-text' href=''>
          {cell?.from_time}
        </a>
      </div>
    </div>
  )
}

const Sessions = () => {
  const token = localStorage.getItem('token')
  const dispatch = useDispatch()
  const [startDate, setStartDate] = useState()
  const [search, setSearch] = useState('')
  const profile = JSON.parse(localStorage.getItem('profile'))
  const adminType = ls.get('admin-type', { decrypt: true, secret: profile?.id })

  // useSelector
  const sessionData = useSelector(
    (state) => state.sessionsAdmin.sessionDataArray
  )
  const count = useSelector((state) => state.sessionsAdmin.sessionCount)

  const isLoading = useSelector((state) => state.sessionsAdmin.isLoading)

  // useState
  const [key, setKey] = useState('all')
  const [start, setStart] = useState(0)
  const [limit] = useState(10)
  const [sort] = useState('date')
  const [pageNo, setPageNo] = useState(1)
  const [show, setShow] = useState(false)
  const [showReject, setShowReject] = useState(false)
  const [id] = useState('')

  const handleClose = () => setShow(false)

  const handleRejectClose = () => setShowReject(false)

  const actionbutton = (row, cell) => {
    return (
      <>
        <Link to={adminType === 'center' ? '/center/session-details' : '/admin/session-details'} state={{ id: cell }}>
          <button
            className='action-btns green-bg img-btn'
            type='button'
            // onClick={() => handleShow(cell?.id)}
          >
            {' '}
            <img className='mr-0' src={view} alt='' />
          </button>
        </Link>
      </>
    )
  }

  const columns = [
    {
      dataField: 'id',
      text: 'Sr. no.'
    },
    {
      dataField: 'studentdetails',
      text: 'Student Details',
      formatter: studentinfo
    },
    {
      dataField: 'counsellordetails',
      text: 'Counsellor Details',
      formatter: counsellorinfo
    },
    {
      dataField: 'date',
      text: 'Date & Time',
      formatter: dateTimeInfo
    },
    {
      dataField: 'body',
      text: 'Action',
      formatter: actionbutton
    }
  ]
  const products = sessionData || []

  useEffect(() => {
    if (key) {
      if (adminType === 'center') {
        dispatch(getAllSession(start, limit, sort, key, startDate, token, 'center'))
      } else {
        dispatch(getAllSession(start, limit, sort, key, startDate, token, 'admin'))
      }
    }
  }, [key])

  // Pagination
  const onPageChange = (page, sizePerPage) => {
    setPageNo(page)

    setStart(limit * (page - 1) - 1 < 0 ? 0 : limit * (page - 1))
    if (page === 1) {
      if (adminType === 'center') {
        dispatch(getAllSession(0, limit, sort, key, startDate || search, token, 'center'))
      } else {
        dispatch(getAllSession(0, limit, sort, key, startDate || search, token, 'admin'))
      }
    } else {
      if (adminType === 'center') {
        dispatch(
          getAllSession(
            limit * (page - 1) - 1 < 0 ? 0 : limit * (page - 1),
            limit,
            sort,
            key,
            startDate || search,
            token,
            'center'
          )
        )
      } else {
        dispatch(
          getAllSession(
            limit * (page - 1) - 1 < 0 ? 0 : limit * (page - 1),
            limit,
            sort,
            key,
            startDate || search,
            token,
            'admin'
          )
        )
      }
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
    page: +pageNo
  }

  // Sorting
  const defaultSortedBy = [
    {
      dataField: 'name',
      order: 'asc'
    }
  ]

  const handleTablechange = (type, { page, sortField, sortOrder }) => {
    if (type === 'sort') {
      if (sortOrder) {
        if (adminType === 'center') {
          dispatch(getAllSession(start, limit, sort, key, startDate, token, 'center'))
        } else {
          dispatch(getAllSession(start, limit, sort, key, startDate, token, 'admin'))
        }
      }
    }
  }

  const handleAcceptReject = (id) => {
    const dataObject = {
      isAccept: true,
      sessionId: id
    }
    if (dataObject) {
      dispatch(acceptRejectAction(dataObject, token))
    }
  }

  const handleReject = (id) => {
    const dataObject = {
      isAccept: false,
      sessionId: id
    }
    if (dataObject) {
      dispatch(acceptRejectAction(dataObject, token))
    }
  }

  useEffect(() => {
    if (startDate) {
      if (adminType === 'center') {
        dispatch(getAllSession(0, limit, sort, key, moment(startDate).format('YYYY-MM-DD'), token, 'center'))
      } else {
        dispatch(getAllSession(0, limit, sort, key, moment(startDate).format('YYYY-MM-DD'), token, 'admin'))
      }
    } else {
      if (adminType === 'center') {
        dispatch(getAllSession(0, limit, sort, key, '', token, 'center'))
      } else {
        dispatch(getAllSession(0, limit, sort, key, '', token, 'admin'))
      }
    }
  }, [startDate])

  // Search
  const handleCallback = (childData) => {
    setSearch(childData)
    if (childData) {
      if (adminType === 'center') {
        dispatch(getAllSession(0, limit, sort, key, childData, token, 'center'))
      } else {
        dispatch(getAllSession(0, limit, sort, key, childData, token, 'admin'))
      }
    } else {
      if (adminType === 'center') {
        dispatch(getAllSession(0, limit, sort, key, '', token, 'center'))
      } else {
        dispatch(getAllSession(0, limit, sort, key, '', token, 'admin'))
      }
    }
  }
  return (
    <>
      <Header searchbar={true} parentCallback={handleCallback}/>
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
            <div className='d-flex justify-content-between align-items-center heading-box '>
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
              <Form>
              <div className=''>
                    <div className='row'>
                      <div className='col-lg-12'>
                        <Form.Group
                          className="form-group mb-0"
                          controlId='formdate'
                        >
                            <Form.Label>Select Date</Form.Label>
                          <Form.Control
                            type='date'
                            className='mb-0'
                            onChange={(e) => setStartDate(e.target.value)}
                            name={name}
                          />
                            <Form.Text className='error-msg'>
                            </Form.Text>
                        </Form.Group>
                      </div>
                    </div>
              </div>
            </Form>
              {/* <DatePicker selected={startDate} onChange={(date) => setStartDate(date)} format='yyyy-MM-dd' placeholderText='Select date' className='p-1'/> */}
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
                  noDataIndication={() =>
                    isLoading ? <Spinner className='text-center' animation='border' /> : 'No data'
                  }
                />
                {/* <h6 className='pending-sessions text-start'>Showing 7 from {count}</h6> */}
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
                  noDataIndication={() =>
                    isLoading ? <Spinner className='text-center' animation='border' /> : 'No data'
                  }
                />
                {/* <h6 className='pending-sessions text-start'>Showing 7 from {count}</h6> */}
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
                  noDataIndication={() =>
                    isLoading ? <Spinner className='text-center' animation='border' /> : 'No data'
                  }
                />
                {/* <h6 className='pending-sessions text-start'>Showing 7 from {count}</h6> */}
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
                  noDataIndication={() =>
                    isLoading ? <Spinner className='text-center' animation='border' /> : 'No data'
                  }
                />
                {/* <h6 className='pending-sessions text-start'>Showing 7 from {count}</h6> */}
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
                  noDataIndication={() =>
                    isLoading ? <Spinner className='text-center' animation='border' /> : 'No data'
                  }
                />
                {/* <h6 className='pending-sessions text-start'>Showing 7 from {count}</h6> */}
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
                  noDataIndication={() =>
                    isLoading ? <Spinner className='text-center' animation='border' /> : 'No data'
                  }
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
    </>
  )
}

export default Sessions
