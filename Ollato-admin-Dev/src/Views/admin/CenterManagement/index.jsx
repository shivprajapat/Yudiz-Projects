import React, { useEffect, useRef, useState } from 'react'
import Header from '../../../Components/Header'
import TitleHeader from '../../../Components/TitleHeader'
import BootstrapTable from 'react-bootstrap-table-next'
import paginationFactory from 'react-bootstrap-table2-paginator'
import orderdefault from '../../../assets/images/order-default.svg'
import orderup from '../../../assets/images/order-up.svg'
import orderdown from '../../../assets/images/order-down.svg'
import { useSelector, useDispatch } from 'react-redux'
import { Form, Spinner } from 'react-bootstrap'
import { useSnackbar } from 'react-notistack'
import DeleteModal from '../../../Components/DeleteModal/DeleteModal'
import Select from 'react-select'
import { deleteCenter, editSpecificCenter, exportCenter, getAllCenterListAction } from '../../../Actions/Admin/center'
import ActiveButton from '../../../Shared/Component/ActiveButton'
import moment from 'moment'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { validationExportdata } from '../../../Shared/Utills/validationschema'
// import edit from '../../../assets/images/pencil-line.svg'
// import deletes from '../../../assets/images/delete-bin-line.svg'

function CenterManagement () {
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
  const [sort] = useState('title')
  const [order] = useState('asc')
  const [search, setSearch] = useState('')
  const [show, setShow] = useState(false)
  const [id, setId] = useState([])
  const [rowArray, setRowArray] = useState([])
  const [sortOrder] = useState('asc')
  const [centerArray, setCenterArray] = useState([])
  const [allRowSelect, setAllRowSelect] = useState(false)
  const [pageNo, setPageNo] = useState(1)

  // useSelector
  const isCenterDeleted = useSelector((state) => state.centerManAdmin.isDeleted)
  const isCenterUpdated = useSelector((state) => state.centerManAdmin.isCenterEdited)
  const CenterResMessage = useSelector((state) => state.centerManAdmin.resMessage)
  const centerList = useSelector((state) => state.centerManAdmin.centerList)
  const count = useSelector((state) => state.centerManAdmin.centerCount)
  const isLoading = useSelector((state) => state.centerManAdmin.isLoading)
  const exportedData = useSelector((state) => state.centerManAdmin.exportedData)

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(validationExportdata)
  })

  // previousProps
  const previousProps = useRef({
    centerList,
    isCenterUpdated,
    isCenterDeleted,
    CenterResMessage,
    exportedData
  }).current

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

  // useEffect for listing Data
  useEffect(() => {
    dispatch(
      getAllCenterListAction(start, limit, sort, sortOrder, search, token)
    )
  }, [])

  useEffect(() => {
    if (previousProps?.centerList !== centerList) {
      if (centerList) {
        setCenterArray(centerList)
      }
    }
    return () => {
      previousProps.centerList = centerList
    }
  }, [centerList])

  const actionbutton = (row, cell) => {
    return <ActiveButton id={cell?.id} handleShow={handleShow} slug='center-management' viewlink='/admin/center-management/view-center' editlink='/admin/center-management/edit-center' />
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
    dispatch(editSpecificCenter(data, token))
    setCenterArray(
      centerArray.map((item) => {
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
      dataField: 'title',
      text: 'title',
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
      text: 'Email'
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
        getAllCenterListAction(0, limit, sort, sortOrder, search, token)
      )
    } else {
      dispatch(
        getAllCenterListAction(
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
    dispatch(getAllCenterListAction(start, e.value, sort, sortOrder, search, token))
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
          getAllCenterListAction(start, limit, sort, sortOrder, search, token)
        )
      }
    }
  }

  // sorting
  const defaultsortedBy = [
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
        getAllCenterListAction(0, limit, sort, sortOrder, childData, token)
      )
    } else {
      dispatch(getAllCenterListAction(0, limit, sort, sortOrder, '', token))
    }
  }

  // Notification for Status
  useEffect(() => {
    if (previousProps?.isCenterUpdated !== isCenterUpdated) {
      if (isCenterUpdated) {
        setShow(false)
        enqueueSnackbar(`${CenterResMessage}`, {
          variant: 'success',
          hide: 2000,
          autoHide: true
        })
        dispatch(getAllCenterListAction(0, limit, sort, order, '', token))
      } else if (isCenterUpdated === false) {
        setShow(false)
        enqueueSnackbar(`${CenterResMessage}`, {
          variant: 'error',
          hide: 2000,
          autoHide: true,
          TransitionComponent: 'Fade'
        })
      }
    }
    return () => {
      previousProps.isCenterUpdated = isCenterUpdated
    }
  }, [isCenterUpdated])

  // Notification for Delete
  useEffect(() => {
    if (previousProps?.isCenterDeleted !== isCenterDeleted) {
      if (isCenterDeleted) {
        setShow(false)
        enqueueSnackbar(`${CenterResMessage}`, {
          variant: 'success',
          hide: 2000,
          autoHide: true
        })
        dispatch(getAllCenterListAction(0, limit, sort, order, '', token))
      } else if (isCenterDeleted === false) {
        setShow(false)
        enqueueSnackbar(`${CenterResMessage}`, {
          variant: 'error',
          hide: 2000,
          autoHide: true,
          TransitionComponent: 'Fade'
        })
      }
    }
    return () => {
      previousProps.isCenterDeleted = isCenterDeleted
    }
  }, [isCenterDeleted])

  const handleClose = () => setShow(false)
  const handleDelete = (id) => {
    if (id) {
      dispatch(deleteCenter({ id: [id] }, token))
    }
  }
  // Function to delete Row in table
  const handleShow = (id) => {
    setId(id)

    setShow(true)
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
    const headers = ['Ollato Code,Name,Email,Mobile,Total Amount,Redeem Amount,Remaining Amount,Commission']
    /* eslint-disable */
    const usersCsv = data?.reduce((acc, user) => {
      const {ollato_code, title, email, mobile, total_amount, redeem_amount, remaining_amount, commission } = user
      acc.push([ollato_code, title, email, mobile, total_amount, redeem_amount, remaining_amount, commission].join(','))
      return acc
    }, [])
    downloadFile({
      data: [...headers, ...usersCsv].join('\n'),
      fileName: 'centers.csv',
      fileType: 'text/csv'
    })
  }

  const onSubmit = (data) => {
    const centerdata = {
      startDate: moment(data.start_date).format('YYYY-MM-DD'),
      endDate: moment(data.end_date).format('YYYY-MM-DD'),
    }
    if (centerdata) {
      dispatch(exportCenter(centerdata, token))
    }
  }

  return (
    <>
          <Header name='Center List' parentCallback={handleCallback} searchbar={true}/>
          <TitleHeader
            url='add-new-center'
            title='Center Management'
            location={location}
            rowArray={rowArray}
            setRowArray={setRowArray}
            allRowSelect={allRowSelect}
            pageNo={pageNo}
            setPageNo={setPageNo}
            name='Center'
            slug='center-management'
            showbuttons={true}
          />
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
                    // onChange={(e) => {
                    //   onChange(e)
                    //   handleChange(e, 'startdate')
                    // }}
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
          
           
            <BootstrapTable
              keyField='id'
              data={centerArray}
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
              defaultsorted={defaultsortedBy}
              onTableChange={handleTablechange}
              noDataIndication={() => isLoading
                ? <Spinner className='text-center' animation='border' />
                : 'No data' }
            />
      <DeleteModal
        show={show}
        handleClose={handleClose}
        handleDelete={handleDelete}
        id={id}
      />
    </>
  )
}

export default CenterManagement
