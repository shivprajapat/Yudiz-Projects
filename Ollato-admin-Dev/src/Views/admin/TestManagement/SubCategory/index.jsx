import React, { useState, useEffect, useRef } from 'react'
import Select from 'react-select'

/* React Packages */
import { useDispatch, useSelector } from 'react-redux'
import { Spinner } from 'react-bootstrap'
import { useSnackbar } from 'react-notistack'

/* Components */
import Header from '../../../../Components/Header'
import TitleHeader from '../../../../Components/TitleHeader'
import BootstrapTable from 'react-bootstrap-table-next'
import paginationFactory from 'react-bootstrap-table2-paginator'

/* Images */
import orderup from '../../../../assets/images/order-up.svg'
import orderdown from '../../../../assets/images/order-down.svg'
import orderdefault from '../../../../assets/images/order-default.svg'

/* Action File */
import {
  getAllTestSubCategoryAction,
  deleteTestSubCategoryAction,
  updateSubCategoryTestAction
} from '../../../../Actions/Admin/test'
import DeleteModal from '../../../../Components/DeleteModal/DeleteModal'
import ActiveButton from '../../../../Shared/Component/ActiveButton'

function SubCategory () {
  // Constant
  const dispatch = useDispatch()
  const { enqueueSnackbar } = useSnackbar()
  const token = localStorage.getItem('token')
  const pagePerLimitArray = [
    { value: 10, label: '10' },
    { value: 20, label: '20' },
    { value: 30, label: '30' }
  ]

  // useState
  const [limit, setLimit] = useState(10)
  const [sort] = useState('test_id')
  const [start, setStart] = useState(0)
  const [order] = useState('asc')
  const [sortOrder, setSortOrder] = useState('asc')
  const [search, setSearch] = useState('')
  const [rowArray, setRowArray] = useState([])
  const [pageNo, setPageNo] = useState(1)
  const [allRowSelect, setAllRowSelect] = useState(false)
  const [testArray, setTestArray] = useState([])
  const [id, setId] = useState('')
  const [show, setShow] = useState(false)

  // useSelector
  const count = useSelector((state) => state.test.total)
  const isLoading = useSelector((state) => state.test.isLoading)
  const testSubCategoryArrayListData = useSelector(
    (state) => state.test.subCategoryData
  )
  const isDeleeted = useSelector((state) => state.test.isCategoryDeleted)
  const ressMessage = useSelector((state) => state.test.resMessage)
  const isTestSubCategoryUpdated = useSelector(
    (state) => state.test.isSubCategoryEdited
  )

  // previousProps
  const previousProps = useRef({
    testSubCategoryArrayListData,
    isDeleeted,
    ressMessage,
    isTestSubCategoryUpdated
  }).current

  // useEffect for listing Data
  useEffect(() => {
    dispatch(
      getAllTestSubCategoryAction(start, limit, sort, sortOrder, search, token)
    )
  }, [])
  useEffect(() => {
    if (
      previousProps?.testSubCategoryArrayListData !==
      testSubCategoryArrayListData
    ) {
      if (testSubCategoryArrayListData) {
        setTestArray(testSubCategoryArrayListData)
      }
    }
    return () => {
      previousProps.testSubCategoryArrayListData = testSubCategoryArrayListData
    }
  }, [testSubCategoryArrayListData])

  // Table Button : View, Edit, Delete
  const actionbutton = (row, cell) => {
    return <ActiveButton id={cell?.id} handleShow={handleShow} slug='test-management/sub-category' viewlink='/admin/test-management/sub-category/view-subcategory' editlink='/admin/test-management/sub-category/edit-subcategory' />
  }

  // Function to delete Row in table
  const handleShow = (id) => {
    setId(id)
    setShow(true)
  }
  const handleClose = () => setShow(false)
  const handleDelete = () => {
    if (id) {
      dispatch(deleteTestSubCategoryAction({ id: [id] }, token))
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
    dispatch(updateSubCategoryTestAction(data, token))
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
      dispatch(
        getAllTestSubCategoryAction(0, limit, sort, sortOrder, childData, token)
      )
    } else {
      dispatch(
        getAllTestSubCategoryAction(0, limit, sort, sortOrder, '', token)
      )
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
      text: 'Sub Category',
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
      dataField: 'test_category',
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
      dispatch(
        getAllTestSubCategoryAction(0, limit, sort, sortOrder, search, token)
      )
    } else {
      dispatch(
        getAllTestSubCategoryAction(
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
    dispatch(
      getAllTestSubCategoryAction(0, e.value, sort, order, search, token)
    )
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
      setSortOrder(sortOrder)
      if (sortOrder) {
        dispatch(
          getAllTestSubCategoryAction(0, limit, sort, sortOrder, search, token)
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

  // Toastify Notification
  useEffect(() => {
    if (previousProps?.isDeleeted !== isDeleeted) {
      if (isDeleeted) {
        setShow(false)
        enqueueSnackbar(`${ressMessage}`, {
          variant: 'success',
          hide: 2000,
          autoHide: true
        })
        dispatch(
          getAllTestSubCategoryAction(0, limit, sort, sortOrder, '', token)
        )
      } else if (isDeleeted === false) {
        setShow(false)
        enqueueSnackbar(`${ressMessage}`, {
          variant: 'error',
          hide: 2000,
          autoHide: true,
          TransitionComponent: 'Fade'
        })
      }
    }
    return () => {
      previousProps.isDeleeted = isDeleeted
    }
  }, [isDeleeted])

  // Notification for Status
  useEffect(() => {
    if (previousProps?.isTestSubCategoryUpdated !== isTestSubCategoryUpdated) {
      if (isTestSubCategoryUpdated) {
        setShow(false)
        enqueueSnackbar(`${ressMessage}`, {
          variant: 'success',
          hide: 2000,
          autoHide: true
        })
        dispatch(getAllTestSubCategoryAction(0, limit, sort, order, '', token))
      } else if (isTestSubCategoryUpdated === false) {
        setShow(false)
        enqueueSnackbar(`${ressMessage}`, {
          variant: 'error',
          hide: 2000,
          autoHide: true,
          TransitionComponent: 'Fade'
        })
      }
    }
    return () => {
      previousProps.isTestSubCategoryUpdated = isTestSubCategoryUpdated
    }
  }, [isTestSubCategoryUpdated])
  return (
    <>
      <Header parentCallback={handleCallback} searchbar={true}/>
      <TitleHeader
        name='Sub Category'
        title='Test management'
        url='add-new-subcategory'
        rowArray={rowArray}
        location={location}
        slug='test-management/sub-category'
        showbuttons={true}
        setPageNo={setPageNo}
        setRowArray={setRowArray}
        allRowSelect={allRowSelect}
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
              noDataIndication={() => isLoading
                ? <Spinner className='text-center' animation='border' />
                : 'No data'
              }
            />
          </div>
        </div>
      <DeleteModal
        show={show}
        id={id}
        handleClose={handleClose}
        handleDelete={handleDelete}
      />
    </>
  )
}

export default SubCategory
