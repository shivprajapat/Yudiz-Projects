import React, { useEffect, useState, useRef } from 'react'
import Header from '../../../Components/Header'
import TitleHeader from '../../../Components/TitleHeader'
import BootstrapTable from 'react-bootstrap-table-next'
import { Spinner } from 'react-bootstrap'
import paginationFactory from 'react-bootstrap-table2-paginator'
import orderdefault from '../../../assets/images/order-default.svg'
import orderup from '../../../assets/images/order-up.svg'
import orderdown from '../../../assets/images/order-down.svg'
import { useLocation } from 'react-router-dom'
import { useSnackbar } from 'react-notistack'
import { useDispatch, useSelector } from 'react-redux'
import { deleteSoftwareMetrics, editSpecificSoftwareMetrics, getAllSoftwareMetricsListAction } from '../../../Actions/Admin/softwareMetrix'
import Select from 'react-select'
import DeleteModal from '../../../Components/DeleteModal/DeleteModal'
import ActiveButton from '../../../Shared/Component/ActiveButton'

function SoftwareMatrix () {
  // Constant
  const dispatch = useDispatch()
  const location = useLocation()
  const token = localStorage.getItem('token')
  const { enqueueSnackbar } = useSnackbar()
  const pagePerLimitArray = [
    { value: 10, label: '10' },
    { value: 20, label: '20' },
    { value: 30, label: '30' }
  ]

  // useState
  const [start, setStart] = useState(0)
  const [limit, setLimit] = useState(10)
  // const [order] = useState('asc')
  const [search, setSearch] = useState('')
  const [sorting] = useState('id')
  const [softwereMetricsArray, setSoftwareMetricsArray] = useState([])
  const [id, setId] = useState([])
  const [show, setShow] = useState(false)
  const [rowArray, setRowArray] = useState([])
  const [sortOrder, setSortOrder] = useState('asc')

  // useSelector
  const softwareMetricsList = useSelector(state => state.softwareMetrics.softwareMetricsList)
  const isSoftwareMetricsDeleted = useSelector(state => state.softwareMetrics.isDeleted)
  const softwareMetricsResMessage = useSelector(state => state.softwareMetrics.resMessage)
  const isSoftwareMetricsUpdated = useSelector(state => state.softwareMetrics.isSoftwareMetricsEdited)
  const count = useSelector(state => state.softwareMetrics.softwareMetricsCount)
  const isLoading = useSelector(state => state.softwareMetrics.isLoading)

  // previousProps
  const previousProps = useRef({ softwareMetricsList, isSoftwareMetricsDeleted, softwareMetricsResMessage, isSoftwareMetricsUpdated }).current

  // useEffect for listing Data
  useEffect(() => {
    dispatch(getAllSoftwareMetricsListAction(start, limit, sorting, sortOrder, search, token))
  }, [])
  useEffect(() => {
    if (previousProps?.softwareMetricsList !== softwareMetricsList) {
      if (softwareMetricsList) {
        setSoftwareMetricsArray(softwareMetricsList)
      }
    }
    return () => {
      previousProps.softwareMetricsList = softwareMetricsList
    }
  }, [softwareMetricsList])

  const actionbutton = (row, cell) => {
    return <ActiveButton id={cell?.id} handleShow={handleShow} slug='software-matrix' viewlink='/admin/software-matrix/view-softwarematrix' editlink='/admin/software-matrix/edit-softwarematrix' />
  }

  // Function to delete Row in table
  const handleShow = (id) => {
    setId(id)
    setShow(true)
  }
  const handleClose = () => setShow(false)
  const handleDelete = (id) => {
    if (id) {
      dispatch(deleteSoftwareMetrics({ id: [id] }, token))
    }
  }
  // Delete Row
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
    dispatch(editSpecificSoftwareMetrics(data, token))
    setSoftwareMetricsArray(
      softwereMetricsArray.map((item) => {
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
      dispatch(getAllSoftwareMetricsListAction(0, limit, sorting, 'asc', childData, token))
    } else {
      dispatch(getAllSoftwareMetricsListAction(0, limit, sorting, sortOrder, '', token))
    }
  }

  const products = softwereMetricsArray || []
  const columns = [
    {
      dataField: 'id',
      text: 'Software Matrix ID',
      formatter: (cell, row, rowIndex) => {
        const rowNumber = rowIndex + 1
        return <span>{rowNumber}</span>
      }
    },
    {
      dataField: 'test_abb_1',
      text: 'Test Abbrevation 1'
    },
    {
      dataField: 'test_abb_2',
      text: 'Test Abbrevation 2'
    },
    {
      dataField: 'test_abb_3',
      text: 'Test Abbrevation 3'
    },
    {
      dataField: 'careerProfiles.profile_type_det',
      text: 'Profile',
      sort: 'true',
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
    setStart(limit * (page - 1) - 1 < 0 ? 0 : limit * (page - 1))
    if (page === 1) {
      dispatch(getAllSoftwareMetricsListAction(0, limit, sorting, sortOrder, search, token))
    } else {
      dispatch(
        getAllSoftwareMetricsListAction(
          limit * (page - 1) - 1 < 0 ? 0 : limit * (page - 1),
          limit,
          sorting,
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
    dispatch(getAllSoftwareMetricsListAction(start, e.value, sorting, sortOrder, search, token))
  }

  const options = {
    sizePerPage: limit,
    hideSizePerPage: true,
    hidePageListOnlyOnePage: false,
    alwaysShowAllBtns: true,
    totalSize: count,
    remote: { pagination: true },
    onPageChange
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
      setSortOrder(sortOrder)
      if (sortOrder) {
        dispatch(
          getAllSoftwareMetricsListAction(start, limit, sorting, sortOrder, search, token)
        )
      }
    }
  }

  // Notification for Delete
  useEffect(() => {
    if (previousProps?.isSoftwareMetricsDeleted !== isSoftwareMetricsDeleted) {
      if (isSoftwareMetricsDeleted) {
        setShow(false)
        enqueueSnackbar(`${softwareMetricsResMessage}`, {
          variant: 'success',
          hide: 2000,
          autoHide: true
        })
        dispatch(getAllSoftwareMetricsListAction(start, limit, sorting, 'asc', search, token))
      } else if (isSoftwareMetricsDeleted === false) {
        setShow(false)
        enqueueSnackbar(`${softwareMetricsResMessage}`, {
          variant: 'error',
          hide: 2000,
          autoHide: true,
          TransitionComponent: 'Fade'
        })
      }
    }
    return () => {
      previousProps.isSoftwareMetricsDeleted = isSoftwareMetricsDeleted
    }
  }, [isSoftwareMetricsDeleted])

  // Notification for Status
  useEffect(() => {
    if (previousProps?.isSoftwareMetricsUpdated !== isSoftwareMetricsUpdated) {
      if (isSoftwareMetricsUpdated) {
        setShow(false)
        enqueueSnackbar(`${softwareMetricsResMessage}`, {
          variant: 'success',
          hide: 2000,
          autoHide: true
        })
        dispatch(getAllSoftwareMetricsListAction(start, limit, sorting, 'asc', search, token))
      } else if (isSoftwareMetricsUpdated === false) {
        setShow(false)
        enqueueSnackbar(`${softwareMetricsResMessage}`, {
          variant: 'error',
          hide: 2000,
          autoHide: true,
          TransitionComponent: 'Fade'
        })
      }
    }
    return () => {
      previousProps.isSoftwareMetricsUpdated = isSoftwareMetricsUpdated
    }
  }, [isSoftwareMetricsUpdated])

  return (
    <>
          <Header parentCallback={handleCallback} searchbar={true}/>
          <TitleHeader
            name='Software Matrix'
            title='Software Matrix'
            url='add-new-softwarematrix'
            rowArray={rowArray}
            location={location}
            slug='software-matrix'
            showbuttons={true}
            setRowArray={setRowArray}
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
              remote={true}
              data={products}
              columns={columns}
              selectRow={{
                mode: 'checkbox',
                clickToSelect: true,
                classes: 'custom-class',
                onSelect: selectRow,
                onSelectAll: (isSelect, rows, e) => {
                  setRowArray(
                    ...rowArray,
                    rows?.map((i) => i.id)
                  )
                }
              }}
              pagination={paginationFactory(options)}
              responsive='md'
              options={options}
              defaultSorted={defaultSortedBy}
              onTableChange={handleTablechange}
              noDataIndication={() =>
                isLoading ? <Spinner className='text-center' animation='border' /> : 'No data'
              }
              formatter
            />
          </div>
      </div>
      <DeleteModal show={show} id={id} handleClose={handleClose} handleDelete={handleDelete} />
    </>
  )
}

export default SoftwareMatrix
