import React, { useEffect, useRef, useState } from 'react'
import Header from '../../../Components/Header'
import TitleHeader from '../../../Components/TitleHeader'
import BootstrapTable from 'react-bootstrap-table-next'
import paginationFactory from 'react-bootstrap-table2-paginator'
import orderdefault from '../../../assets/images/order-default.svg'
import orderup from '../../../assets/images/order-up.svg'
import orderdown from '../../../assets/images/order-down.svg'
import { useSelector, useDispatch } from 'react-redux'
import {
  deleteStudent,
  downloadReport,
  editSpecificStudent,
  exportStudents,
  getAllStudentListAction,
  uploadCsvfile
} from '../../../Actions/Admin/student'
import { Spinner, Form, Alert } from 'react-bootstrap'
import { useSnackbar } from 'react-notistack'
import DeleteModal from '../../../Components/DeleteModal/DeleteModal'
import Select from 'react-select'
import ActiveButton from '../../../Shared/Component/ActiveButton'
import { useForm } from 'react-hook-form'
import moment from 'moment'
import { validationExportdata } from '../../../Shared/Utills/validationschema'
import { yupResolver } from '@hookform/resolvers/yup'
import { useLocation } from 'react-router-dom'

function StudentManagement () {
  // constants
  // const location = useLocation()
  const dispatch = useDispatch()
  const { enqueueSnackbar } = useSnackbar()
  const [file, setFile] = useState()
  const csvInputRef = useRef()
  const location = useLocation()

  // const fileReader = new FileReader()

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
  const [testStatus, setTestStatus] = useState()

  // useSelector
  const isStudentDeleted = useSelector((state) => state.student.isDeleted)
  const isStudentUpdated = useSelector((state) => state.student.isStudentEdited)
  const studentResMessage = useSelector((state) => state.student.resMessage)
  const studentList = useSelector((state) => state.student.studentList)
  const count = useSelector((state) => state.student.studentCount)
  const isLoading = useSelector((state) => state.student.isLoading)
  const isFileAdded = useSelector((state) => state.student.isFileAdded)
  const exportedData = useSelector((state) => state.student.exportedData)
  const downloadReportLinkData = useSelector((state) => state.student.downloadReportLink)
  const isReportDownloaded = useSelector((state) => state.student.downloadReportLink)

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(validationExportdata)
  })

  // previousProps
  const previousProps = useRef({
    studentList,
    isStudentUpdated,
    isStudentDeleted,
    studentResMessage,
    isFileAdded,
    exportedData,
    downloadReportLinkData,
    isReportDownloaded
  }).current

  // useEffect for listing Data
  useEffect(() => {
    if (!location?.state?.test_completed) {
      dispatch(
        getAllStudentListAction(start, limit, sort, sortOrder, search, token, 'all')
      )
      setTestStatus('all')
    } else {
      dispatch(
        getAllStudentListAction(start, limit, sort, sortOrder, search, token, 'completed')
      )
      setTestStatus('completed')
    }
  }, [location])

  useEffect(() => {
    if (location?.state?.test_completed) {
      setTestStatus('completed')
    }
  }, [location])

  const handleReport = (customId) => {
    dispatch(downloadReport(customId, token))
  }

  useEffect(() => {
    /* eslint-disable */
    if (previousProps?.exportedData !== exportedData) {
    if (exportedData?.rows?.length > 0) {
      exportToCsv(exportedData.rows)
    }
    else if (exportedData?.rows?.length === 0) {
      enqueueSnackbar('No data found', {
        variant: 'error',
        hide: 2000,
        autoHide: true,
        TransitionComponent: 'Fade'
      })
    }
  }
  return () => {
    previousProps.exportedData = exportedData
  }
  }, [exportedData])

  useEffect(() => {
    if (previousProps?.studentList !== studentList) {
      if (studentList) {
        setStudentArray(studentList)
      }
    }
    return () => {
      previousProps.studentList = studentList
    }
  }, [studentList])

  // Downloaded Report Link
  useEffect(() => {
    if (previousProps?.downloadReportLinkData !== downloadReportLinkData) {
      if (downloadReportLinkData) {
        window.open(downloadReportLinkData, '_blank')
      }
    }
    return () => {
      previousProps.downloadReportLinkData = downloadReportLinkData
    }
  }, [downloadReportLinkData])

  const actionbutton = (row, cell) => {
    return <ActiveButton id={cell?.id} handleShow={handleShow} slug='students-management' viewlink='/admin/students-management/view-students' editlink='/admin/students-management/edit-students' />
  }

  const reportbutton = (row, cell) => {
    return <>
    {cell?.test_status === 'completed' ?
    <button className='outline-btn wi thicon' onClick={() => handleReport(cell?.test_custom_id)}>Download</button> : "-"} 
    </>
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

  const teststatusaction = (row, cell) => {
    return (
      <div className='counsellor-infobox'>
        <div className='counsinfo'>
          <p>
            {cell?.test_status  || 'not started'}
          </p>
        </div>
      </div>
    )
  }

  // Function to handle switch of table
  const handleChange = (e, id) => {
    const data = {
      id,
      isActive: e.target.checked ? 'y' : 'n',
      updateType: 'status'
    }
    dispatch(editSpecificStudent(data, token))
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
      dataField: 'test-status',
      text: 'Test Status',
      formatter: teststatusaction
    },
    {
      dataField: 'email',
      text: 'Email',
      formatter: emailAction
    },
    {
      dataField: 'Report',
      text: 'Report',
      formatter: reportbutton
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
        getAllStudentListAction(0, limit, sort, sortOrder, search, token, testStatus)
      )
    } else {
      dispatch(
        getAllStudentListAction(
          limit * (page - 1) - 1 < 0 ? 0 : limit * (page - 1),
          limit,
          sort,
          sortOrder,
          search,
          token,
          testStatus
        )
      )
    }
  }
  // page change
  const handlePagePerLimit = (e) => {
    setLimit(e.value)
    setPageNo(1)
    dispatch(getAllStudentListAction(0, e.value, sort, sortOrder, search, token,testStatus))
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
          getAllStudentListAction(start, limit, sort, sortOrder, search, token,testStatus)
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
        getAllStudentListAction(0, limit, sort, sortOrder, childData, token,testStatus)
      )
    } else {
      dispatch(getAllStudentListAction(0, limit, sort, sortOrder, '', token,testStatus))
    }
  }

  // Notification for Status
  useEffect(() => {
    if (previousProps?.isStudentUpdated !== isStudentUpdated) {
      if (isStudentUpdated) {
        setShow(false)
        enqueueSnackbar(`${studentResMessage}`, {
          variant: 'success',
          hide: 2000,
          autoHide: true
        })
        dispatch(getAllStudentListAction(0, limit, sort, order, '', token,testStatus))
      } else if (isStudentUpdated === false) {
        setShow(false)
        enqueueSnackbar(`${studentResMessage}`, {
          variant: 'error',
          hide: 2000,
          autoHide: true,
          TransitionComponent: 'Fade'
        })
      }
    }
    return () => {
      previousProps.isStudentUpdated = isStudentUpdated
    }
  }, [isStudentUpdated])

  useEffect(() => {
    if (previousProps?.isReportDownloaded !== isReportDownloaded) {
      if (isReportDownloaded) {
        // setShow(false)
        // enqueueSnackbar(`${studentResMessage}`, {
        //   variant: 'success',
        //   hide: 2000,
        //   autoHide: true
        // })
        // dispatch(getAllStudentListAction(0, limit, sort, order, '', token,testStatus))
      } else if (isReportDownloaded === false) {
        setShow(false)
        enqueueSnackbar(`${studentResMessage}`, {
          variant: 'error',
          hide: 2000,
          autoHide: true,
          TransitionComponent: 'Fade'
        })
      }
    }
    return () => {
      previousProps.isReportDownloaded = isReportDownloaded
    }
  }, [isReportDownloaded])

  // Notification for Delete
  useEffect(() => {
    if (previousProps?.isStudentDeleted !== isStudentDeleted) {
      if (isStudentDeleted) {
        setShow(false)
        enqueueSnackbar(`${studentResMessage}`, {
          variant: 'success',
          hide: 2000,
          autoHide: true
        })
        dispatch(getAllStudentListAction(0, limit, sort, order, '', token,testStatus))
      } else if (isStudentDeleted === false) {
        setShow(false)
        enqueueSnackbar(`${studentResMessage}`, {
          variant: 'error',
          hide: 2000,
          autoHide: true,
          TransitionComponent: 'Fade'
        })
      }
    }
    return () => {
      previousProps.isStudentDeleted = isStudentDeleted
    }
  }, [isStudentDeleted])

  // Notification for Csv file
  useEffect(() => {
    if (previousProps?.isFileAdded !== isFileAdded) {
      csvInputRef.current.value = ''
      if (isFileAdded) {
        enqueueSnackbar(`${studentResMessage}`, {
          variant: 'success',
          hide: 2000,
          autoHide: true
        })
      } else if (isFileAdded === false) {
        enqueueSnackbar(`${studentResMessage}`, {
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
      dispatch(deleteStudent({ id: [id] }, token))
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
        dispatch(uploadCsvfile(formData, token))
      }
    }
  }

  const downloadFile = ({ data, fileName, fileType }) => {
    const blob = new Blob([data], { type: fileType })
    const a = document.createElement('a')
    a.download = fileName
    a.href = window.URL.createObjectURL(blob)
    const clickEvt = new MouseEvent('click', {
      view: window,
      bubbles: true,
      cancelable: true
    })
    a.dispatchEvent(clickEvt)
    a.remove()
  }

  const exportToCsv = (data) => {
    // Headers for each column
    const headers = ['Ollato Code,First name,Middle name,Last name,Email,Mobile no.,DOB,Gender,Father name,Mother name, Math dropped,Science dropped,Country,State,City,Pincode,School name,School Address']
    /* eslint-disable */
    const usersCsv = data?.reduce((acc, user) => {
      const {ollato_code, first_name, middle_name, last_name, email, mobile, dob, gender, father_name, mother_name, math_dropped, science_dropped, countries_title, states_title, cities_title, pin_code, school_name, school_address_1,school_address_2} = user
      const school_add =  school_address_1 + " " + school_address_2 
      acc.push([ollato_code, first_name, middle_name || "-", last_name, email, mobile, dob, gender || "-", father_name || 
      "-", mother_name || "-", math_dropped ? 'Yes' : 'No', science_dropped ? 'Yes' : 'No', countries_title, states_title, cities_title, pin_code || '-', school_name ? school_name : "-" ,school_address_1 && school_address_2 ? school_add.replace(/,/g, " ") : "-"].join(','))
      return acc
    }, [])
    downloadFile({
      data: [...headers, ...usersCsv].join('\n'),
      fileName: 'students.csv',
      fileType: 'text/csv'
    })
  }

  const onSubmit = (data) => {
    const studentdate = {
      startDate: moment(data.start_date).format('YYYY-MM-DD'),
      endDate: moment(data.end_date).format('YYYY-MM-DD')
    }
    if (studentdate) {
      dispatch(exportStudents(studentdate, token))
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
            name='Students'
            slug='student-management'
            showbuttons={true}
          />
          {isFileAdded === false
            ? <Alert variant='danger' className='error-alert'>
          {studentResMessage}
        </Alert>
            : null}
             <Form className='light-bg' onSubmit={handleSubmit(onSubmit)}>
            <div className="row align-items-center mb-0 mb-md-4">
            <div className='col-md-4 mb-4 mb-md-0'>
                <Form.Group
                  className={`form-group csv_input mb-0 ${
                    errors.start_date?.message ? 'error-occured' : ''
                  }`}
                  controlId='formstartdate'
                >
                  <Form.Label>Start Date</Form.Label>
                  <Form.Control
                    type='date'
                    name={name}
                    max={moment(new Date()).format('YYYY-MM-DD')}
                    {...register('start_date', { required: true })}
                  />
                  {errors.start_date?.message && (
                    <Form.Text className='error-msg'>
                      {errors.start_date?.message}{' '}
                    </Form.Text>
                  )}
                </Form.Group>
              </div>
              <div className='col-md-4 mb-4 mb-md-0'>
                <Form.Group
                  className={`form-group csv_input mb-0 ${
                    errors.end_date?.message ? 'error-occured' : ''
                  }`}
                  controlId='formstartdate'
                >
                  <Form.Label>End Date</Form.Label>
                  <Form.Control
                    type='date'
                    name={name}
                    max={moment(new Date()).format('YYYY-MM-DD')}
                    {...register('end_date', { required: true })}
                    // onChange={(e) => {
                    //   onChange(e)
                    //   handleChange(e, 'startdate')
                    // }}
                  />
                  {errors.end_date?.message && (
                    <Form.Text className='error-msg'>
                      {errors.end_date?.message}{' '}
                    </Form.Text>
                  )}
                </Form.Group>
              </div>
              <div className="col-md-4 text-left mb-3 mb-md-0 mt-3 mt-md-0">
             <div className='d-none d-md-block'> <Form.Label>&nbsp;</Form.Label></div>

              <button type='submit' className='theme-btn mb-0'>
              Export
              </button>
             </div>
            </div>
             </Form> 
          <div className='col-md-12 text-end filterboxcontent'>
             <div className="csv-container">
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
              noDataIndication={() => isLoading
                ? <Spinner className='text-center' animation='border' />
                : 'No data'
              }
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

export default StudentManagement
