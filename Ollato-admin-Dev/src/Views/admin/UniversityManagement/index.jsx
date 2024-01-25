import React, { useState, useRef, useEffect } from 'react'

/* React Packages */
import BootstrapTable from 'react-bootstrap-table-next'
import paginationFactory from 'react-bootstrap-table2-paginator'
import { useLocation, useNavigate } from 'react-router-dom'
import { Spinner } from 'react-bootstrap'
import { useSnackbar } from 'react-notistack'
import { useDispatch, useSelector } from 'react-redux'
import Select from 'react-select'
import orderdefault from '../../../assets/images/order-default.svg'
import orderup from '../../../assets/images/order-up.svg'
import orderdown from '../../../assets/images/order-down.svg'

/* Components */
import Header from '../../../Components/Header'
import TitleHeader from '../../../Components/TitleHeader'

/* Action File */
import {
  getAllUniversityListAction,
  deleteUniversity,
  updateUniversity
} from '../../../Actions/Admin/university'
import DeleteModal from '../../../Components/DeleteModal/DeleteModal'
import ActiveButton from '../../../Shared/Component/ActiveButton'

function UniversityManagement () {
  // Constanst
  const dispatch = useDispatch()
  const location = useLocation()
  const { enqueueSnackbar } = useSnackbar()
  const token = localStorage.getItem('token')
  const navigate = useNavigate()
  const pagePerLimitArray = [
    { value: 10, label: '10' },
    { value: 20, label: '20' },
    { value: 30, label: '30' }
  ]

  // const pageParams = location?.search.substring(
  //   location?.search.indexOf('=') + 1,
  //   location?.search.lastIndexOf('&')
  // )

  const pageParams = location?.search?.split('=')[1]?.split('&')[0]

  const limitParams = location?.search?.slice(-2)
  const startParams = pageParams * limitParams - limitParams
  // useState
  const [start, setStart] = useState(isNaN(startParams) ? 0 : startParams)
  const [pageNo, setPageNo] = useState(isNaN(pageParams) ? 1 : pageParams)
  const [show, setShow] = useState(false)
  const [rowArray, setRowArray] = useState([])
  const [allRowSelect, setAllRowSelect] = useState(false)
  const [limit, setLimit] = useState(+limitParams || 10)
  const [search, setSearch] = useState('')
  const [id, setId] = useState('')
  const [universityArray, setUniversityArray] = useState([])
  const [sort] = useState('title')
  const [sortOrder, setSortOrder] = useState('asc')

  // useSelector
  const universityResMessage = useSelector(state => state.university.resMessage)
  const isUniversityDeleted = useSelector(state => state.university.isDeleted)
  const isUniversityUpdated = useSelector(state => state.university.isUniversityEdited)
  const universityListData = useSelector(state => state.university.universityList)
  const count = useSelector(state => state.university.universityCount)
  const isLoading = useSelector(state => state.university.isLoading)

  // PreviousProps
  const previousProps = useRef({
    universityListData,
    universityResMessage,
    isUniversityDeleted,
    isUniversityUpdated
  }).current

  // useEffect for listing Data
  useEffect(() => {
    dispatch(
      getAllUniversityListAction(start, limit, sort, sortOrder, search, token)
    )
  }, [])

  useEffect(() => {
    if (previousProps?.universityListData !== universityListData) {
      if (universityListData) {
        setUniversityArray(universityListData)
      }
    }
    return () => {
      previousProps.universityListData = universityListData
    }
  }, [universityListData])

  // Table Button : View, Edit, Delete
  const actionbutton = (row, cell) => {
    return <ActiveButton id={cell?.id} handleShow={handleShow} slug='university-management' viewlink='/admin/university-management/view-university' editlink='/admin/university-management/edit-university' />
  }

  // Function to delete Row in table
  const handleShow = (id) => {
    setId(id)
    setShow(true)
  }
  const handleClose = () => setShow(false)
  const handleDelete = (id) => {
    if (id) {
      dispatch(deleteUniversity({ id }, token))
    }
  }

  // Table Switch : Status on/off
  const switchAction = (row, cell, rowIndex) => {
    return (
      <label className='switch'>
        <input
          type='checkbox'
          checked={row === 'y'}
          onChange={(e) => handleChange(e, cell.id)}
        />
        <span className='slider blue' id='round'></span>
      </label>
    )
  }

  // Function to handle switch of table
  const handleChange = (e, id) => {
    const data = {
      id,
      isActive: e.target.checked ? 'y' : 'n',
      updateType: 'status'
    }
    dispatch(updateUniversity(data, token))
    setUniversityArray(
      universityArray.map((item) => {
        if (item.id === id) {
          item.is_active = e.target.checked ? 'y' : 'n'
          return item
        } else return item
      })
    )
  }

  // Table Columns
  const columns = [
    {
      dataField: 'Sr.no',
      text: 'Sr. No',
      formatter: (cell, row, rowIndex) => {
        const rowNumber = rowIndex + 1
        return <span>{rowNumber}</span>
      }
    },
    {
      dataField: 'title',
      text: 'University Name',
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
      dataField: 'is_active',
      text: 'Status',
      formatter: switchAction
    },
    {
      dataField: 'body',
      text: 'Action',
      formatter: actionbutton
    }
  ]

  // Pagination in Table
  const onPageChange = (page, sizePerPage) => {
    setPageNo(page)
    navigate({
      // pathname: '/admin/university-management',
      search: `?page=${page}&limit=${limit}`
      // limit: `?limit=${limit}`

    })
    setStart(limit * (page - 1) - 1 < 0 ? 0 : limit * (page - 1))

    if (page === 1) {
      dispatch(
        getAllUniversityListAction(0, limit, sort, sortOrder, search, token)
      )
    } else {
      dispatch(
        getAllUniversityListAction(
          limit * (page - 1) - 1 < 0 ? 0 : limit * (page - 1),
          limit,
          sort,
          sortOrder,
          search,
          token
        )
      )
    }
  }

  // pagePerLimit
  const handlePagePerLimit = (e) => {
    setLimit(e.value)
    setPageNo(1)
    navigate({
      search: `?page=${1}&limit=${e.value}`
    })

    dispatch(getAllUniversityListAction(
      0,
      e.value,
      sort,
      sortOrder,
      search,
      token
    ))
  }
  const options = {
    sizePerPage: limit,
    hideSizePerPage: true,
    hidePageListOnlyOnePage: false,
    alwaysShowAllBtns: true,
    totalSize: count,
    remote: { pagination: true },
    page: +pageNo,
    onPageChange
  }
  const products = universityArray

  // Searching in Tabel
  const handleCallback = (childData) => {
    setSearch(childData)
    if (childData) {
      dispatch(
        getAllUniversityListAction(0, limit, sort, sortOrder, childData, token)
      )
    } else {
      dispatch(getAllUniversityListAction(0, limit, sort, sortOrder, '', token))
    }
  }

  // Table Sorting
  const defaultSortedBy = [
    {
      dataField: 'name',
      order: 'asc'
    }
  ]
  const handleTablechange = (type, { page, sortField, sortOrder }) => {
    if (type === 'sort') {
      setSortOrder(sortOrder)
      if (sortOrder) {
        dispatch(
          getAllUniversityListAction(
            start,
            limit,
            sort,
            sortOrder,
            search,
            token
          )
        )
      }
    }
  }

  // Delete University
  const selectRow = (row, isSelect) => {
    let updatedList = [...rowArray]

    if (isSelect) {
      updatedList = [...rowArray, row.id]
    } else {
      updatedList.splice(rowArray.indexOf(row.id), 1)
    }
    setRowArray(updatedList)
  }

  // Notification for Delete
  useEffect(() => {
    if (previousProps?.isUniversityDeleted !== isUniversityDeleted) {
      if (isUniversityDeleted) {
        setShow(false)
        enqueueSnackbar(`${universityResMessage}`, {
          variant: 'success',
          hide: 2000,
          autoHide: true
        })
        dispatch(
          getAllUniversityListAction(0, limit, sort, sortOrder, '', token)
        )
      } else if (isUniversityDeleted === false) {
        setShow(false)
        enqueueSnackbar(`${universityResMessage}`, {
          variant: 'error',
          hide: 2000,
          autoHide: true,
          TransitionComponent: 'Fade'
        })
      }
    }
    return () => {
      previousProps.isUniversityDeleted = isUniversityDeleted
    }
  }, [isUniversityDeleted])

  // Notification for status
  useEffect(() => {
    if (previousProps?.isUniversityUpdated !== isUniversityUpdated) {
      if (isUniversityUpdated) {
        setShow(false)
        enqueueSnackbar(`${universityResMessage}`, {
          variant: 'success',
          hide: 2000,
          autoHide: true
        })
        dispatch(
          getAllUniversityListAction(
            start,
            limit,
            sort,
            sortOrder,
            search,
            token
          )
        )
      } else if (isUniversityUpdated === false) {
        setShow(false)
        enqueueSnackbar(`${universityResMessage}`, {
          variant: 'error',
          hide: 2000,
          autoHide: true,
          TransitionComponent: 'Fade'
        })
      }
    }
    return () => {
      previousProps.isUniversityUpdated = isUniversityUpdated
    }
  }, [isUniversityUpdated])

  return (
    <>
          <Header name='University' parentCallback={handleCallback} searchbar={true}/>
          <TitleHeader
            title='University'
            name='University'
            url='add-new-university'
            location={location}
            rowArray={rowArray}
            setRowArray={setRowArray}
            pageNo={pageNo}
            setPageNo={setPageNo}
            allRowSelect={allRowSelect}
            slug='university-management'
            showbuttons={true}
          />
            <div className='row'>
              <div className='col-md-12 text-end filterboxcontent'>
                <div className='categoryfilterbtn text-center sizeperpagebtn'>
                  <Select
                    classNamePrefix='filter-custom'
                    className='filter-time-btn withrightimg'
                    isSearchable={false}
                    options={pagePerLimitArray}
                    defaultValue={{ value: limit, label: limit }}
                    onChange={(e) => handlePagePerLimit(e)}
                  />
                </div>
              </div>
              <div className='col-md-12'>
                <BootstrapTable
                  keyField='id'
                  data={products}
                  columns={columns}
                  remote={true}
                  defaultSorted={defaultSortedBy}
                  onTableChange={handleTablechange}
                  selectRow={{
                    mode: 'checkbox',
                    clickToSelect: false,
                    classes: 'custom-class',
                    onSelect: selectRow,
                    onSelectAll: (isSelect, rows, e) => {
                      setAllRowSelect(isSelect)
                      if (isSelect) {
                        setRowArray(rows.map(i => i.id))
                      } else {
                        setRowArray([])
                      }
                    }
                  }}
                  pagination={paginationFactory(options)}
                  responsive='md'
                  options={options}
                  noDataIndication={() => isLoading ? <Spinner className='text-center' animation="border" /> : 'No data'}
                />
              </div>
            </div>
      <DeleteModal show={show} id={id} handleClose={handleClose} handleDelete={handleDelete} />
    </>
  )
}

export default UniversityManagement
