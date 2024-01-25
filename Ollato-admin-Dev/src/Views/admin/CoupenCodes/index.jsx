import React, { useState, useRef, useEffect } from 'react'

/* React Packages */
import BootstrapTable from 'react-bootstrap-table-next'
import paginationFactory from 'react-bootstrap-table2-paginator'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation } from 'react-router-dom'
import { Spinner } from 'react-bootstrap'
import { useSnackbar } from 'react-notistack'
import Select from 'react-select'
import orderup from '../../../assets/images/order-up.svg'
import orderdown from '../../../assets/images/order-down.svg'
import orderdefault from '../../../assets/images/order-default.svg'

/* Components */
import Header from '../../../Components/Header'
import TitleHeader from '../../../Components/TitleHeader'
// import DeleteModal from '../../../Components/DeleteModal'

/* Action File */
import DeleteModal from '../../../Components/DeleteModal/DeleteModal'
import ActiveButton from '../../../Shared/Component/ActiveButton'
import { deleteCoupon, editSpecificCoupon, getAllCouponCodes } from '../../../Actions/Admin/coupenCode'

function Coupons () {
  // Constant
  const dispatch = useDispatch()
  const location = useLocation()
  const { enqueueSnackbar } = useSnackbar()
  const token = localStorage.getItem('token')

  const pagePerLimitArray = [
    { value: 10, label: '10' },
    { value: 20, label: '20' },
    { value: 30, label: '30' }
  ]

  // useState
  const [pageNo, setPageNo] = useState(1)
  const [show, setShow] = useState(false)
  const [rowArray, setRowArray] = useState([])
  const [limit, setLimit] = useState(10)
  const [sort] = useState('title')
  const [start, setStart] = useState(0)
  const [order] = useState('asc')
  const [search, setSearch] = useState('')
  const [id, setId] = useState('')
  const [couponArray, setCouponArray] = useState([])

  // useSelector
  const resMessage = useSelector(state => state.CoupenCodesAdmin.resMessage)
  const isCouponDeleted = useSelector(state => state.CoupenCodesAdmin.isCouponDeleted)
  const isCouponCodeEdited = useSelector(state => state.CoupenCodesAdmin.isCouponCodeEdited)
  const coupenCodeList = useSelector(state => state.CoupenCodesAdmin.coupenCodeList)
  const isLoading = useSelector(state => state.CoupenCodesAdmin.isLoading)
  const count = useSelector(state => state.CoupenCodesAdmin.coupenCodeCount)

  // previousProps
  const previousProps = useRef({
    coupenCodeList,
    resMessage,
    isCouponDeleted,
    isCouponCodeEdited
  }).current

  // useEffect for listing Data
  useEffect(() => {
    dispatch(getAllCouponCodes(start, limit, sort, order, search, token))
  }, [])

  useEffect(() => {
    if (previousProps?.coupenCodeList !== coupenCodeList) {
      if (coupenCodeList) {
        setCouponArray(coupenCodeList)
      }
    }
    return () => {
      previousProps.coupenCodeList = coupenCodeList
    }
  }, [coupenCodeList])

  const actionbutton = (row, cell) => {
    return <ActiveButton id={cell?.id} handleShow={handleShow} slug='coupon-codes' viewlink='/admin/coupon-codes/view-coupon-code' editlink='/admin/coupon-codes/edit-coupon-code' />
  }

  // Function to delete Row in table
  const handleShow = id => {
    setId(id)
    setShow(true)
  }
  const handleClose = () => setShow(false)
  const handleDelete = () => {
    const data = {
      id: [id]
    }
    if (id) {
      dispatch(deleteCoupon(data, token))
    }
  }
  // Multiple row delete
  const selectRow = (row, isSelect) => {
    let updatedList = [...rowArray]

    if (isSelect) {
      updatedList = [...rowArray, row.id]
    } else {
      updatedList.splice(rowArray.indexOf(row.id), 1)
    }
    setRowArray(updatedList)
  }

  // Table Switch : Status on/off
  const switchAction = (row, cell, rowIndex) => {
    return (
      <label className="switch">
        <input type="checkbox" checked={row === 'y'} onChange={e => handleChange(e, cell.id)} />
        <span className="slider blue" id="round"></span>
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
    dispatch(editSpecificCoupon(data, token))
    setCouponArray(
      couponArray?.map(item => {
        if (item.id === id) {
          item.is_active = e.target.checked ? 'y' : 'n'
          return item
        } else return item
      })
    )
  }

  // Search
  const handleCallback = (childData) => {
    setSearch(childData)
    if (childData) {
      dispatch(getAllCouponCodes(0, limit, sort, order, childData, token))
    } else {
      dispatch(getAllCouponCodes(0, limit, sort, order, '', token))
    }
  }

  const products = couponArray || []
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
      text: 'Title',
      sort: true,
      sortCaret: (order, column) => {
        if (!order) {
          return (
            <span className="sort-box">
              <img src={orderdefault} alt="order-up" />
            </span>
          )
        } else if (order === 'asc') {
          return (
            <span className="sort-box">
              <img src={orderup} alt="order-up" />
            </span>
          )
        } else if (order === 'desc') {
          return (
            <span className="sort-box">
              <img src={orderdown} alt="order-down" />
            </span>
          )
        }
        return null
      }
    },
    {
      dataField: 'code',
      text: 'Code'
    },
    {
      dataField: 'from_date',
      text: 'From Date  '
    },
    {
      dataField: 'to_date',
      text: 'To Date  '
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
      dispatch(getAllCouponCodes(0, limit, sort, order, search, token))
    } else {
      dispatch(
        getAllCouponCodes(
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
    dispatch(getAllCouponCodes(start, e.value, sort, order, search, token))
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
          getAllCouponCodes(start, limit, sort, sortOrder, search, token)
        )
      }
    }
  }

  // Notification for Delete
  useEffect(() => {
    if (previousProps?.isCouponDeleted !== isCouponDeleted) {
      if (isCouponDeleted) {
        setShow(false)
        enqueueSnackbar(`${resMessage}`, {
          variant: 'success',
          hide: 2000,
          autoHide: true
        })
        dispatch(getAllCouponCodes(0, limit, sort, order, '', token))
      } else if (isCouponDeleted === false) {
        setShow(false)
        enqueueSnackbar(`${resMessage}`, {
          variant: 'error',
          hide: 2000,
          autoHide: true,
          TransitionComponent: 'Fade'
        })
      }
    }
    return () => {
      previousProps.isCouponDeleted = isCouponDeleted
    }
  }, [isCouponDeleted])

  // Notification for status
  useEffect(() => {
    if (previousProps?.isCouponCodeEdited !== isCouponCodeEdited) {
      if (isCouponCodeEdited) {
        setShow(false)
        enqueueSnackbar(`${resMessage}`, {
          variant: 'success',
          hide: 2000,
          autoHide: true
        })
        dispatch(getAllCouponCodes(0, limit, sort, order, '', token))
      } else if (isCouponCodeEdited === false) {
        setShow(false)
        enqueueSnackbar(`${resMessage}`, {
          variant: 'error',
          hide: 2000,
          autoHide: true,
          TransitionComponent: 'Fade'
        })
      }
    }
    return () => {
      previousProps.isCouponCodeEdited = isCouponCodeEdited
    }
  }, [isCouponCodeEdited])

  return (
    <>
          <Header name="Coupen Code List" parentCallback={handleCallback} searchbar={true}/>
          <TitleHeader
            name="Coupen Code"
            title="Coupen Code Management"
            url="add-coupon-code"
            setRowArray={setRowArray}
            rowArray={rowArray}
            location={location}
            slug='qualification-management'
            showbuttons={true}
          />
          <div className="row">
            <div className="col-md-12 text-end filterboxcontent">
              <div className="categoryfilterbtn text-center sizeperpagebtn">
                <Select
                  classNamePrefix="filter-custom"
                  className="filter-time-btn withrightimg"
                  isSearchable={false}
                  options={pagePerLimitArray}
                  defaultValue={{ value: 10, label: 10 }}
                  onChange={e => handlePagePerLimit(e)}
                />
              </div>
            </div>
            <div className="col-md-12">
              <BootstrapTable
                keyField="id"
                data={products}
                columns={columns}
                remote={true}
                selectRow={{
                  mode: 'checkbox',
                  clickToSelect: false,
                  classes: 'custom-class',
                  onSelect: selectRow
                }}
                pagination={paginationFactory(options)}
                responsive="md"
                options={options}
                defaultSorted={defaultSortedBy}
                onTableChange={handleTablechange}
                noDataIndication={() => isLoading ? <Spinner className='text-center' animation="border" /> : 'No data'}
              />
            </div>
          </div>
      <DeleteModal show={show} id={id} handleClose={handleClose} handleDelete={handleDelete} />
    </>
  )
}

export default Coupons
