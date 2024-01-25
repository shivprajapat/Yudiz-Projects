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
import {
  deleteQualification,
  editSpecificQualification,
  getAllQualificationAction
  // deleteGrade,
  // editSpecificGrade
} from '../../../Actions/Admin/qualification'

import DeleteModal from '../../../Components/DeleteModal/DeleteModal'
import ActiveButton from '../../../Shared/Component/ActiveButton'

function QualificationManagement () {
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
  const [gradeArray, setGradeArray] = useState([])

  // useSelector
  const qualificationResMessage = useSelector(state => state.qualification.resMessage)
  const isQualificationDeleted = useSelector(state => state.qualification.isQualificationDeleted)
  const isQualificationEdited = useSelector(state => state.qualification.isQulificationEdited)
  const qualificationData = useSelector(state => state.qualification.qualificationList)
  const isLoading = useSelector(state => state.qualification.isLoading)
  const count = useSelector(state => state.qualification.qualificationCount)

  // previousProps
  const previousProps = useRef({
    qualificationData,
    qualificationResMessage,
    isQualificationDeleted,
    isQualificationEdited
  }).current

  // useEffect for listing Data
  useEffect(() => {
    dispatch(getAllQualificationAction(start, limit, sort, order, search, token))
  }, [])

  useEffect(() => {
    if (previousProps?.qualificationData !== qualificationData) {
      if (qualificationData) {
        setGradeArray(qualificationData)
      }
    }
    return () => {
      previousProps.qualificationData = qualificationData
    }
  }, [qualificationData])

  const actionbutton = (row, cell) => {
    return <ActiveButton id={cell?.id} handleShow={handleShow} slug='qualification-management' viewlink='/admin/qualification-management/view-qualification' editlink='/admin/qualification-management/edit-qualification' />
  }

  // Function to delete Row in table
  const handleShow = id => {
    setId(id)
    setShow(true)
  }
  const handleClose = () => setShow(false)
  const handleDelete = () => {
    const data = {
      id
    }
    if (id) {
      dispatch(deleteQualification(data, token))
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
    dispatch(editSpecificQualification(data, token))
    setGradeArray(
      gradeArray.map(item => {
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
      dispatch(getAllQualificationAction(0, limit, sort, order, childData, token))
    } else {
      dispatch(getAllQualificationAction(0, limit, sort, order, '', token))
    }
  }
  const products = gradeArray
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
      text: 'Qualification',
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
      dispatch(getAllQualificationAction(0, limit, sort, order, search, token))
    } else {
      dispatch(
        getAllQualificationAction(
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
    dispatch(getAllQualificationAction(start, e.value, sort, order, search, token))
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
          getAllQualificationAction(start, limit, sort, sortOrder, search, token)
        )
      }
    }
  }

  // Notification for Delete
  useEffect(() => {
    if (previousProps?.isQualificationDeleted !== isQualificationDeleted) {
      if (isQualificationDeleted) {
        setShow(false)
        enqueueSnackbar(`${qualificationResMessage}`, {
          variant: 'success',
          hide: 2000,
          autoHide: true
        })
        dispatch(getAllQualificationAction(0, limit, sort, order, '', token))
      } else if (isQualificationDeleted === false) {
        setShow(false)
        enqueueSnackbar(`${qualificationResMessage}`, {
          variant: 'error',
          hide: 2000,
          autoHide: true,
          TransitionComponent: 'Fade'
        })
      }
    }
    return () => {
      previousProps.isQualificationDeleted = isQualificationDeleted
    }
  }, [isQualificationDeleted])

  // Notification for status
  useEffect(() => {
    if (previousProps?.isQualificationEdited !== isQualificationEdited) {
      if (isQualificationEdited) {
        setShow(false)
        enqueueSnackbar(`${qualificationResMessage}`, {
          variant: 'success',
          hide: 2000,
          autoHide: true
        })
        dispatch(getAllQualificationAction(0, limit, sort, order, '', token))
      } else if (isQualificationEdited === false) {
        setShow(false)
        enqueueSnackbar(`${qualificationResMessage}`, {
          variant: 'error',
          hide: 2000,
          autoHide: true,
          TransitionComponent: 'Fade'
        })
      }
    }
    return () => {
      previousProps.isQualificationEdited = isQualificationEdited
    }
  }, [isQualificationEdited])

  return (
    <>
          <Header name="Qualification List" parentCallback={handleCallback} searchbar={true}/>
          <TitleHeader
            name="Qualification"
            title="Qualification Management"
            url="add-new-qualification"
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

export default QualificationManagement
