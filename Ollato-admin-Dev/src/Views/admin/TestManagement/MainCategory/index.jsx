import React, { useState, useEffect, useRef } from 'react'
import Select from 'react-select'

/* React Packages */
import BootstrapTable from 'react-bootstrap-table-next'
import paginationFactory from 'react-bootstrap-table2-paginator'
import { useLocation } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Spinner } from 'react-bootstrap'
import { useSnackbar } from 'react-notistack'

/* Components */
import Header from '../../../../Components/Header'
import TitleHeader from '../../../../Components/TitleHeader'
import orderdefault from '../../../../assets/images/order-default.svg'
import orderup from '../../../../assets/images/order-up.svg'
import orderdown from '../../../../assets/images/order-down.svg'

/* Action File */
import {
  getAllTestListAction,
  deleteTestCategoryAction,
  editTestCategoryAction
} from '../../../../Actions/Admin/test'
import DeleteModal from '../../../../Components/DeleteModal/DeleteModal'
import ActiveButton from '../../../../Shared/Component/ActiveButton'

function MainCategory () {
  // Constant
  const dispatch = useDispatch()
  const { enqueueSnackbar } = useSnackbar()
  const location = useLocation()
  const sortOrder = 'asc'
  const token = localStorage.getItem('token')
  const pagePerLimitArray = [
    { value: 10, label: '10' },
    { value: 20, label: '20' },
    { value: 30, label: '30' }
  ]

  // useState
  const [pageNo, setPageNo] = useState(1)
  const [rowArray, setRowArray] = useState([])
  const [limit, setLimit] = useState(10)
  const [sort] = useState('title')
  const [order] = useState('asc')
  const [start, setStart] = useState(0)
  const [search, setSearch] = useState('')
  const [testArray, setTestArray] = useState([])
  const [id, setId] = useState('')
  const [show, setShow] = useState(false)
  const [allRowSelect, setAllRowSelect] = useState(false)

  // useSelector
  const testCategoryArrayListData = useSelector((state) => state.test.testList)
  const testResMessage = useSelector((state) => state.test.resMessage)
  const isTestDeleted = useSelector((state) => state.test.isTestCategoryDeleted)
  const isTestUpdated = useSelector((state) => state.test.isTestCategoryUpdated)
  const count = useSelector((state) => state.test.testCount)
  const isLoading = useSelector((state) => state.test.isLoading)

  // previousProps
  const previousProps = useRef({ testCategoryArrayListData, isTestUpdated, testResMessage }).current

  // useEffect for listing Data
  useEffect(() => {
    dispatch(getAllTestListAction(start, limit, sort, sortOrder, search, token))
  }, [])
  useEffect(() => {
    if (
      previousProps?.testCategoryArrayListData !== testCategoryArrayListData
    ) {
      if (testCategoryArrayListData) {
        setTestArray(testCategoryArrayListData)
      }
    }
    return () => {
      previousProps.testCategoryArrayListData = testCategoryArrayListData
    }
  }, [testCategoryArrayListData])

  // Table Button : View, Edit, Delete
  const actionbutton = (row, cell) => {
    return <ActiveButton id={cell?.id} handleShow={handleShow} slug='test-management/main-category' viewlink='/admin/test-management/main-category/view-maincategory' editlink='/admin/test-management/main-category/edit-maincategory' />
  }

  // Function to delete Row in table
  const handleClose = () => setShow(false)
  const handleShow = (id) => {
    setId(id)
    setShow(true)
  }
  const handleDelete = () => {
    if (id) {
      dispatch(deleteTestCategoryAction({ id: [id] }, token))
    }
  }
  const selectRow = (row, isSelect, rowIndex) => {
    setRowArray((oldArray) => [...oldArray, row.id])
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
    dispatch(editTestCategoryAction(data, token))
    setTestArray(
      testArray.map((item) => {
        if (item.id === id) {
          item.is_active = e.target.checked ? 'y' : 'n'
          return item
        } else return item
      })
    )
  }

  // Search
  const handleCallback = (childData) => {
    if (childData) {
      dispatch(getAllTestListAction(0, limit, sort, sortOrder, childData, token))
    } else {
      dispatch(getAllTestListAction(0, limit, sort, sortOrder, '', token))
    }
    setSearch(childData)
  }

  const products = testArray
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
      text: 'Main Category',
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

  // Pagination
  const onPageChange = (page, sizePerPage) => {
    setPageNo(page)
    setStart(limit * (page - 1) - 1 < 0 ? 0 : limit * (page - 1))
    if (page === 1) {
      dispatch(getAllTestListAction(0, limit, sort, sortOrder, search, token))
    } else {
      dispatch(
        getAllTestListAction(
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
    dispatch(getAllTestListAction(0, e.value, sort, order, search, token))
  }

  // Sorting
  const defaultSortedBy = [
    {
      dataField: 'name',
      order: 'asc' // or desc
    }
  ]

  const handleTablechange = (type, { page, sortField, sortOrder }) => {
    if (type === 'sort') {
      if (sortOrder) {
        dispatch(
          getAllTestListAction(start, limit, sort, sortOrder, search, token)
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

  // Notification for Status
  useEffect(() => {
    if (previousProps?.isTestUpdated !== isTestUpdated) {
      if (isTestUpdated) {
        setShow(false)
        enqueueSnackbar(`${testResMessage}`, {
          variant: 'success',
          hide: 2000,
          autoHide: true
        })
        dispatch(getAllTestListAction(0, limit, sort, order, '', token))
      } else if (isTestUpdated === false) {
        setShow(false)
        enqueueSnackbar(`${testResMessage}`, {
          variant: 'error',
          hide: 2000,
          autoHide: true,
          TransitionComponent: 'Fade'
        })
      }
    }
    return () => {
      previousProps.isTestUpdated = isTestUpdated
    }
  }, [isTestUpdated])

  // Notification for Delete
  useEffect(() => {
    if (previousProps?.isTestDeleted !== isTestDeleted) {
      if (isTestDeleted) {
        setShow(false)
        enqueueSnackbar(`${testResMessage}`, {
          variant: 'success',
          hide: 2000,
          autoHide: true
        })
        dispatch(getAllTestListAction(0, limit, sort, sortOrder, '', token))
      } else if (isTestDeleted === false) {
        setShow(false)
        enqueueSnackbar(`${testResMessage}`, {
          variant: 'error',
          hide: 2000,
          autoHide: true,
          TransitionComponent: 'Fade'
        })
      }
    }
    return () => {
      previousProps.isTestDeleted = isTestDeleted
    }
  }, [isTestDeleted])

  return (
    <>
          <Header parentCallback={handleCallback} searchbar={true}/>
          <TitleHeader
            name='Main Category'
            title='Test management'
            url='add-new-maincategory'
            rowArray={rowArray}
            location={location}
            slug='test-management/main-category'
            showbuttons={true}
            setRowArray={setRowArray}
            allRowSelect={allRowSelect}
            setPageNo={setPageNo}
            pageNo={pageNo}
          />
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
              <div className='col-md-12'>
                <BootstrapTable
                  keyField='id'
                  data={products}
                  columns={columns}
                  remote={true}
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
                  defaultSorted={defaultSortedBy}
                  onTableChange={handleTablechange}
                  noDataIndication={ () => isLoading ? <Spinner className='text-center' animation="border" /> : 'No data'}
                />
              </div>
            </div>
      <DeleteModal show={show} id={id} handleClose={handleClose} handleDelete={handleDelete} />
    </>
  )
}

export default MainCategory
