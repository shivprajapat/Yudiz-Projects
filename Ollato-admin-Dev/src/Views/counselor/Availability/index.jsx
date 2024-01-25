import React, { useState, useEffect, useRef } from 'react'
import BootstrapTable from 'react-bootstrap-table-next'
import paginationFactory from 'react-bootstrap-table2-paginator'
import Select from 'react-select'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import moment from 'moment'
import { useSnackbar } from 'react-notistack'

// images
import view from '../../../assets/images/view-eye.svg'
import edit from '../../../assets/images/pencil-line.svg'
import deletes from '../../../assets/images/delete-bin-line.svg'
import timeslotmorning from '../../../assets/images/timeslotmorning.svg'
// import timeslotnoon from '../../../assets/images/timeslotnoon.svg'
// import timeslotnight from '../../../assets/images/timeslotnight.svg'
import orderup from '../../../assets/images/order-up.svg'
import orderdown from '../../../assets/images/order-down.svg'
import orderdefault from '../../../assets/images/order-default.svg'

// Components
// import Header from '../../../Components/Header'
import DeleteModal from '../../../Components/DeleteModal/DeleteModal'

// Action File
import { getAllCounsellorList, deleteAvailability } from '../../../Actions/Counsellor/counsellor-availability'

function Availability () {
  const dispatch = useDispatch()
  const { enqueueSnackbar } = useSnackbar()
  const token = localStorage.getItem('token')
  const pagePerLimitArray = [
    { value: 10, label: '10' },
    { value: 20, label: '20' },
    { value: 30, label: '30' }
  ]

  // useState
  const [start, setStart] = useState(0)
  const [limit, setLimit] = useState(10)
  const [sort] = useState('id')
  const [order] = useState('asc')
  const [counselorArray, setCounselorArray] = useState([])
  const [pageNo, setPageNo] = useState(1)
  const [show, setShow] = useState(false)
  const [dataObject, setDataObject] = useState({})
  const [search] = useState('')

  // useSelector
  const counsellorAvailabilityData = useSelector((state) => state.counsellor.counsellorList)
  const count = useSelector((state) => state.counsellor.count)
  const isDeletedFlag = useSelector((state) => state.counsellor.isAvailableDeleted)
  const isDeletedMessageFlag = useSelector((state) => state.counsellor.resMessage)
  // previousProps
  const previousProps = useRef({ counsellorAvailabilityData, isDeletedFlag, isDeletedMessageFlag }).current

  // useEffect to listing Data
  useEffect(() => {
    dispatch(getAllCounsellorList(start, limit, sort, order, search, token))
  }, [])

  useEffect(() => {
    if (previousProps?.counsellorAvailabilityData !== counsellorAvailabilityData) {
      if (counsellorAvailabilityData) {
        setCounselorArray(counsellorAvailabilityData)
      }
    }
    return () => {
      previousProps.counsellorAvailabilityData = counsellorAvailabilityData
    }
  }, [counsellorAvailabilityData])

  const products = counselorArray
  // Function to delete Row in table
  const handleShow = (date, id) => {
    setDataObject({ date })
    // setId(id)
    setShow(true)
  }
  // Action-Button
  const actionbutton = (row, cell) => {
    return (
      <div className='button-box'>
        <Link to='/cousellor/view-availability' state={{ id: cell }} >
          <button className='action-btns green-bg' type='button'>
            <img src={view} alt='' /> View
          </button>
        </Link>
        <Link to='/cousellor/edit-availability' state={{ id: cell }} >
          <button className='action-btns light-blue-bg' type='button'>
            <img src={edit} alt='' /> Edit
          </button>
        </Link>
        <Link to=''>
          <button className='action-btns light-red-bg' type='button' onClick={() => handleShow(cell?.date, cell?.id)} >
            <img src={deletes} alt='' /> Delete
          </button>
        </Link>
      </div>
    )
  }

  const handleClose = () => setShow(false)
  const handleDelete = (date) => {
    const data = {
      date
    }

    if (data) {
      dispatch(deleteAvailability(data, token))
    }
  }

  // Slot-Box
  const slotsbox = (row, cell) => {
    return (
      <ul className='slot-availablity four-col bg-white small-space mt-0'>
        {
          cell?.from_time.map((fromTime, index) => {
            return (
                <li key={index}>
                  <button className='slot-booking whitebtn lightbg'>
                    <img src={timeslotmorning} alt='timeslotmorning' />
                    {fromTime}
                  </button>
                </li>
            )
          })
        }
      </ul>
    )
  }

  // Slot-Box
  const dayDate = (row, cell) => {
    const day = moment(cell?.date).format('dddd')
    return <p style={{ textAlign: 'center' }}>{day}</p>
  }

  // Columns
  const columns = [
    {
      dataField: 'id',
      text: 'ID',
      formatter: (cell, row, rowIndex) => {
        const rowNumber = rowIndex + 1
        return <span>{rowNumber}</span>
      }
    },
    {
      dataField: 'date',
      text: 'Date',
      sort: true,
      sortCaret: (order, column) => {
        if (!order) {
          return (
            <span className='sort-box'>
              <img src={orderdefault} alt='order-up' />
            </span>
          )
        } else if (order === 'asc') {
          return (
            <span className='sort-box'>
              <img src={orderup} alt='order-up' />
            </span>
          )
        } else if (order === 'desc') {
          return (
            <span className='sort-box'>
              <img src={orderdown} alt='order-down' />
            </span>
          )
        }
        return null
      }
    },
    {
      dataField: 'day',
      text: 'Day',
      formatter: dayDate
    },
    {
      dataField: 'from_time',
      text: 'Time Slots',
      formatter: slotsbox
    },
    {
      dataField: 'body',
      text: 'Action',
      formatter: actionbutton
    }
  ]

  // Pagination
  const onPageChange = (page, sizePerPage) => {
    setPageNo(page)
    setStart(limit * (page - 1) - 1 < 0 ? 0 : limit * (page - 1))
    if (page === 1) {
      dispatch(getAllCounsellorList(0, limit, sort, order, search, token))
    } else {
      dispatch(
        getAllCounsellorList(
          limit * (page - 1) - 1 < 0 ? 0 : limit * (page - 1),
          limit,
          sort,
          order,
          search,
          token
        )
      )
    }
  }

  // pagePerLimit
  const handlePagePerLimit = (e) => {
    setLimit(e.value)
    dispatch(getAllCounsellorList(start, e.value, sort, order, search, token))
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
        dispatch(
          getAllCounsellorList(start, limit, sort, sortOrder, search, token)
        )
      }
    }
  }

  // Toastify Notification
  useEffect(() => {
    if (previousProps?.isDeletedFlag !== isDeletedFlag) {
      if (isDeletedFlag) {
        setShow(false)
        enqueueSnackbar(`${isDeletedMessageFlag}`, {
          variant: 'success',
          hide: 2000,
          autoHide: true
        })
        dispatch(getAllCounsellorList(0, limit, sort, order, '', token))
      } else if (isDeletedFlag === false) {
        setShow(false)
        enqueueSnackbar(`${isDeletedMessageFlag}`, {
          variant: 'error',
          hide: 2000,
          autoHide: true,
          TransitionComponent: 'Fade'
        })
      }
    }
    return () => {
      previousProps.isDeletedFlag = isDeletedFlag
    }
  }, [isDeletedFlag])

  // Search
  // const handleCallback = childData => {
  //   setSearch(childData)
  //   // if (childData) {
  //   //   dispatch(getAllCounsellorList(0, limit, sort, order, search, token))
  //   // } else if (search === null) {
  //   //   dispatch(getAllCounsellorList(0, limit, sort, order, '', token))
  //   // } else {
  //   //   dispatch(getAllCounsellorList(0, limit, sort, order, '', token))
  //   // }
  // }

  const emptyDataMessage = () => { return 'No Data Found' }

  useEffect(() => {
    dispatch(getAllCounsellorList(0, limit, sort, order, search, token))
  }, [search])

  return (
    <>
          <div className='title-header no-breadcrumbs d-flex flex-row align-items-center'>
            <ul className='breadcrumbs'>
              <li className='breadcrumbs-item'>
                <h3>Availability Management</h3>
              </li>
            </ul>
            <Link to='/cousellor/set-availability'>
              <button className='theme-btn text-none'>Set Availability</button>
            </Link>
          </div>
          <div>
            <div className='row'>
              <div className='col-md-12 text-end filterboxcontent'>
                <div className='categoryfilterbtn text-center sizeperpagebtn'>
                <Select
                    classNamePrefix='filter-custom'
                    className='filter-time-btn withrightimg'
                    isSearchable={false}
                    options={pagePerLimitArray}
                    defaultValue={{ value: 10, label: 10 }}
                    onChange={(e) => handlePagePerLimit(e)}
                  />
                </div>
              </div>
            </div>
            <div className='col-md-12'>
            <BootstrapTable
                  keyField='date'
                  data={products}
                  columns={columns}
                  remote={true}
                  pagination={paginationFactory(options)}
                  defaultSorted={defaultSortedBy}
                  onTableChange={handleTablechange}
                  responsive='md'
                  options={options}
                  noDataIndication={() => emptyDataMessage()}
                />
            </div>
          </div>
      <DeleteModal show={show} date={dataObject.date} handleClose={handleClose} handleDelete={handleDelete} />
    </>
  )
}

export default Availability
