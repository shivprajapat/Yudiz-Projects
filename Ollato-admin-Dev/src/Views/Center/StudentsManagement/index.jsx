import React, { useEffect, useRef, useState } from 'react'
import Header from '../../../Components/Header'
import TitleHeader from '../../../Components/TitleHeader'
import BootstrapTable from 'react-bootstrap-table-next'
import paginationFactory from 'react-bootstrap-table2-paginator'
import { Link } from 'react-router-dom'
import edit from '../../../assets/images/pencil-line.svg'
import deletes from '../../../assets/images/delete-bin-line.svg'
import orderdefault from '../../../assets/images/order-default.svg'
import orderup from '../../../assets/images/order-up.svg'
import orderdown from '../../../assets/images/order-down.svg'
import view from '../../../assets/images/view-eye.svg'
import { useSelector, useDispatch } from 'react-redux'
import { Form, Spinner } from 'react-bootstrap'
import { useSnackbar } from 'react-notistack'
import DeleteModal from '../../../Components/DeleteModal/DeleteModal'
import Select from 'react-select'
import { deleteStudentCen, editSpecificStudentCen, getAllStudentCenListAction, uploadCsvfileCenter } from '../../../Actions/Center/student'

function StudentCenterManagement () {
  // constants
  // const location = useLocation()
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
  const [sort] = useState('first_name')
  const [order] = useState('asc')
  const [search, setSearch] = useState('')
  const [show, setShow] = useState(false)
  const [id, setId] = useState([])
  const [rowArray, setRowArray] = useState([])
  const [sortOrder] = useState('asc')
  const [studentArray, setStudentArray] = useState([])
  const [allRowSelect, setAllRowSelect] = useState(false)
  const [pageNo, setPageNo] = useState(1)
  const [file, setFile] = useState()
  const csvInputRef = useRef()

  // useSelector
  const isStudentCenterDeleted = useSelector((state) => state.studentCenter.isDeleted)
  const isStudentCenterUpdated = useSelector((state) => state.studentCenter.isStudentEdited)
  const studentCenterResMessage = useSelector((state) => state.studentCenter.resMessage)
  const studentCenterList = useSelector((state) => state.studentCenter.studentList)
  const count = useSelector((state) => state.studentCenter.studentCount)
  const isLoading = useSelector((state) => state.studentCenter.isLoading)
  const isFileAdded = useSelector((state) => state.studentCenter.isFileAdded)

  // previousProps
  const previousProps = useRef({
    studentCenterList,
    isStudentCenterUpdated,
    isStudentCenterDeleted,
    studentCenterResMessage,
    isFileAdded
  }).current

  // useEffect for listing Data
  useEffect(() => {
    dispatch(
      getAllStudentCenListAction(start, limit, sort, sortOrder, search, token)
    )
  }, [])

  useEffect(() => {
    if (previousProps?.studentCenterList !== studentCenterList) {
      if (studentCenterList) {
        setStudentArray(studentCenterList)
      }
    }
    return () => {
      previousProps.studentCenterList = studentCenterList
    }
  }, [studentCenterList])

  const actionbutton = (row, cell) => {
    return (
      <>
        <div className='button-box'>

            <Link to={`/center/students-management/view-students/${cell?.id}`}>
              <button className='action-btns green-bg' type='button'>
                <img src={view} alt='' /> View
              </button>
            </Link>

            <Link to={`/center/students-management/edit-students/${cell?.id}`}>
              <button className='action-btns light-blue-bg' type='button'>
                <img src={edit} alt='' /> Edit
              </button>
            </Link>

            <button className='action-btns light-red-bg' type='button' onClick={() => handleShow(cell?.id)}>
              <img src={deletes} alt='' /> Delete
            </button>

        </div>
      </>
    )
  }

  const counsellorinfo = (row, cell) => {
    return (
      <div className='counsellor-infobox'>
        <div className='counsinfo'>
          <p>
            {cell?.first_name} {cell?.last_name}
          </p>
        </div>
      </div>
    )
  }

  const emailAction = (row, cell) => {
    return (
      <div className='counsellor-infobox'>
        <div className='counsinfo'>
          <p>
            {cell?.email || '-'}
          </p>
        </div>
      </div>
    )
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
    dispatch(editSpecificStudentCen(data, token))
    setStudentArray(
      studentArray.map((item) => {
        if (item.id === id) {
          item.is_active = e.target.checked ? 'y' : 'n'
          return item
        } else return item
      })
    )
  }

  const columns = [
    {
      dataField: 'id',
      text: 'Sr. No',
      formatter: (cell, row, rowIndex) => {
        const rowNumber = rowIndex + 1
        return <span>{rowNumber}</span>
      }
    },
    {
      dataField: 'student',
      text: 'Student Name',
      formatter: counsellorinfo,
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
      dataField: 'email',
      text: 'Email',
      formatter: emailAction
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
  const onPageChange = (page) => {
    setPageNo(page)
    setStart(limit * (page - 1) - 1 < 0 ? 0 : limit * (page - 1))
    if (page === 1) {
      dispatch(
        getAllStudentCenListAction(0, limit, sort, sortOrder, search, token)
      )
    } else {
      dispatch(
        getAllStudentCenListAction(
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
  // page change
  const handlePagePerLimit = (e) => {
    setLimit(e.value)
    setPageNo(1)
    dispatch(getAllStudentCenListAction(0, e.value, sort, sortOrder, search, token))
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

  const handleTablechange = (type, { page, sortField, sortOrder }) => {
    if (type === 'sort') {
      if (sortOrder) {
        dispatch(
          getAllStudentCenListAction(start, limit, sort, sortOrder, search, token)
        )
      }
    }
  }

  // Sorting
  const defaultSortedBy = [
    {
      dataField: 'studentdetails',
      order: 'asc'
    }
  ]

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

  const handleCallback = (childData) => {
    setSearch(childData)
    if (childData) {
      dispatch(
        getAllStudentCenListAction(0, limit, sort, sortOrder, childData, token)
      )
    } else {
      dispatch(getAllStudentCenListAction(0, limit, sort, sortOrder, '', token))
    }
  }

  // Notification for Status
  useEffect(() => {
    if (previousProps?.isStudentCenterUpdated !== isStudentCenterUpdated) {
      if (isStudentCenterUpdated) {
        setShow(false)
        enqueueSnackbar(`${studentCenterResMessage}`, {
          variant: 'success',
          hide: 2000,
          autoHide: true
        })
        dispatch(getAllStudentCenListAction(0, limit, sort, order, '', token))
      } else if (isStudentCenterUpdated === false) {
        setShow(false)
        enqueueSnackbar(`${studentCenterResMessage}`, {
          variant: 'error',
          hide: 2000,
          autoHide: true,
          TransitionComponent: 'Fade'
        })
      }
    }
    return () => {
      previousProps.isStudentCenterUpdated = isStudentCenterUpdated
    }
  }, [isStudentCenterUpdated])

  // Notification for Delete
  useEffect(() => {
    if (previousProps?.isStudentCenterDeleted !== isStudentCenterDeleted) {
      if (isStudentCenterDeleted) {
        setShow(false)
        enqueueSnackbar(`${studentCenterResMessage}`, {
          variant: 'success',
          hide: 2000,
          autoHide: true
        })
        dispatch(getAllStudentCenListAction(0, limit, sort, order, '', token))
      } else if (isStudentCenterDeleted === false) {
        setShow(false)
        enqueueSnackbar(`${studentCenterResMessage}`, {
          variant: 'error',
          hide: 2000,
          autoHide: true,
          TransitionComponent: 'Fade'
        })
      }
    }
    return () => {
      previousProps.isSubAdminDeleted = isStudentCenterDeleted
    }
  }, [isStudentCenterDeleted])

  // Notification for Csv file
  useEffect(() => {
    if (previousProps?.isFileAdded !== isFileAdded) {
      csvInputRef.current.value = ''
      if (isFileAdded) {
        enqueueSnackbar(`${studentCenterResMessage}`, {
          variant: 'success',
          hide: 2000,
          autoHide: true
        })
      } else if (isFileAdded === false) {
        enqueueSnackbar(`${studentCenterResMessage}`, {
          variant: 'error',
          hide: 2000,
          autoHide: true,
          TransitionComponent: 'Fade'
        })
      }
    }
    return () => {
      previousProps.isFileAdded = isFileAdded
    }
  }, [isFileAdded])

  const handleClose = () => setShow(false)
  const handleDelete = (id) => {
    if (id) {
      dispatch(deleteStudentCen({ id: [id] }, token))
    }
  }
  // Function to delete Row in table
  const handleShow = (id) => {
    setId(id)

    setShow(true)
  }

  const handleOnChange = (e) => {
    setFile(e.target.files[0])
  }

  const handleOnSubmit = (e) => {
    e.preventDefault()

    if (file) {
      const formData = new FormData()
      formData.append('student_import_file', file)
      if (formData) {
        dispatch(uploadCsvfileCenter(formData, token))
      }
    }
  }

  return (
    <>
          <Header name='Student List' parentCallback={handleCallback} searchbar={true}/>
          <TitleHeader
            url='add-new-students'
            title='Students Management'
            location={location}
            rowArray={rowArray}
            setRowArray={setRowArray}
            allRowSelect={allRowSelect}
            pageNo={pageNo}
            setPageNo={setPageNo}
            showbuttons={true}
            name='Students'
            slug='student-management'
          />
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
                <div className='csv-files'>
          <div className='download'>
        <a className='nav-link' href={`${process.env.REACT_APP_AXIOS_BASE_URL}uploads/import-sample/sample.csv`}>Download CSV</a>
          </div>
            <div className="csv-group">
            <Form.Group
                      controlId='formFile'
                      className='form-group'
                    >
                      <Form.Control
                        className='hidden-file'
                        type={'file'}
                        accept={'.csv'}
                        onChange={handleOnChange}
                        ref={csvInputRef}
                      />
                      <div className='form-control d-flex justify-content-between align-items-center'>
                          <p className='m-0'>{file ? file?.name : 'Select File'}</p>
                          <p className='m-0 file-name-resume'>
                          </p>
                      </div>
                    </Form.Group >
                    <button
                    onClick={(e) => {
                      handleOnSubmit(e)
                    }}
                >
                    Submit CSV
                </button>
            </div>
             </div>
            </div>
          <div>
            <BootstrapTable
              keyField='id'
              data={studentArray}
              columns={columns}
              responsive='md'
              remote={true}
              pagination={paginationFactory(options)}
              selectRow={{
                mode: 'checkbox',
                clickToSelect: false,
                classes: 'custom-class',
                onSelect: selectRow,
                onSelectAll: (isSelect, rows, e) => {
                  setAllRowSelect(isSelect)
                  if (isSelect) {
                    setRowArray(rows.map((i) => i.id))
                  } else {
                    setRowArray([])
                  }
                }
              }}
              options={options}
              defaultSorted={defaultSortedBy}
              onTableChange={handleTablechange}
              noDataIndication={() => (
                isLoading
                  ? <Spinner className='text-center' animation='border' />
                  : 'No data'
              )}
            />
          </div>
      <DeleteModal
        show={show}
        handleClose={handleClose}
        handleDelete={handleDelete}
        id={id}
      />
    </>
  )
}

export default StudentCenterManagement
