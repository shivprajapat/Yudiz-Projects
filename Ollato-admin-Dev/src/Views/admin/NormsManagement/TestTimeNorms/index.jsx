import React, { useEffect, useState, useRef } from 'react'
import Header from '../../../../Components/Header'
import TitleHeader from '../../../../Components/TitleHeader'
import BootstrapTable from 'react-bootstrap-table-next'
import paginationFactory from 'react-bootstrap-table2-paginator'
import orderdefault from '../../../../assets/images/order-default.svg'
import orderup from '../../../../assets/images/order-up.svg'
import orderdown from '../../../../assets/images/order-down.svg'
import { useLocation } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { deleteTestTimeNorms, editSpecificTestTimeNorms, getAllTestTimeNorms } from '../../../../Actions/Admin/Norms/TestTimeNorms/TestTimeNorms'
import { Spinner } from 'react-bootstrap'
import { useSnackbar } from 'react-notistack'
import Select from 'react-select'
import DeleteModal from '../../../../Components/DeleteModal/DeleteModal'
import ActiveButton from '../../../../Shared/Component/ActiveButton'

function TestTimeNorms () {
  // Constanst
  const dispatch = useDispatch()
  const token = localStorage.getItem('token')
  const location = useLocation()
  const { enqueueSnackbar } = useSnackbar()
  const pagePerLimitArray = [
    { value: 10, label: '10' },
    { value: 20, label: '20' },
    { value: 30, label: '30' }
  ]

  // useState
  const [, setPage] = useState(1)
  const [start, setStart] = useState(0)
  const [limit, setLimit] = useState(10)
  const [sorting] = useState('time_Sec')
  const [order] = useState('asc')
  const [, setSortOrder] = useState('asc')
  const [search, setSearch] = useState('')
  const [show, setShow] = useState(false)
  const [id, setId] = useState('')
  const [, setSortField] = useState('')
  const [testTimeNormsArray, setTestTimeNormsArray] = useState([])
  const [rowArray, setRowArray] = useState([])

  // useSelector
  const testTimeNormsListData = useSelector(state => state.testTimeNorms.testTimeNormsList)
  const isTestTimeNormsDeleted = useSelector(state => state.testTimeNorms.isDeleted)
  const count = useSelector(state => state.testTimeNorms.testTimeNormsCount)
  const testTimeNormsResMessage = useSelector(state => state.testTimeNorms.resMessage)
  const isTestTimeNormsUpdated = useSelector(state => state.testTimeNorms.isTestTimeNormsEdited)
  const isLoading = useSelector(state => state.testTimeNorms.isLoading)

  // PreviousProps
  const previousProps = useRef({
    testTimeNormsListData,
    isTestTimeNormsDeleted,
    testTimeNormsResMessage,
    isTestTimeNormsUpdated
  }).current

  // useEffect for listing Data
  useEffect(() => {
    dispatch(getAllTestTimeNorms(start, limit, sorting, order, search, token))
  }, [])

  useEffect(() => {
    if (previousProps?.testTimeNormsListData !== testTimeNormsListData) {
      if (testTimeNormsListData) {
        setTestTimeNormsArray(testTimeNormsListData)
      }
    }
    return () => {
      previousProps.testTimeNormsListData = testTimeNormsListData
    }
  }, [testTimeNormsListData])

  // Table Button : View, Edit, Delete
  const actionbutton = (row, cell) => {
    return <ActiveButton id={cell?.id} handleShow={handleShow} slug='norms-management/test-time-norms' viewlink='/admin/norms/test-time-norms/view-test-time-norms' editlink='/admin/norms/test-time-norms/edit-test-time-norms' />
    // return (
    //   <div className="button-box">
    //     {adminType === 'super' || roles?.find(i => i.module_permissions.slug === 'qualification-management')?.view === '1'
    //       ? (
    //       <Link to={`/admin/norms/test-time-normss/view-test-time-norms/${cell?.id}`}>
    //         <button className="action-btns green-bg" type="button">
    //           <img src={view} alt="" /> View
    //         </button>
    //       </Link>
    //         )
    //       : null}
    //     <Link to={`/admin/norms/test-time-normss/edit-test-time-norms/${cell?.id}`}>
    //       <button className="action-btns light-blue-bg" type="button">
    //         <img src={edit} alt="" /> Edit
    //       </button>
    //     </Link>
    //     <Link to="">
    //       <button className="action-btns light-red-bg" onClick={() => handleShow(cell?.id)} type="button">
    //         <img src={deletes} alt="" /> Delete
    //       </button>
    //     </Link>
    //   </div>
    // )
  }

  // Function to delete Row in table
  const handleShow = id => {
    setId(id)
    setShow(true)
  }
  const handleClose = () => setShow(false)
  const handleDelete = id => {
    if (id) {
      dispatch(deleteTestTimeNorms({ id: [id] }, token))
    }
  }
  // Delete Row
  const selectRow = (row, isSelect, rowIndex) => {
    setRowArray(oldArray => [...oldArray, row.id])
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
    dispatch(editSpecificTestTimeNorms(data, token))
    setTestTimeNormsArray(
      testTimeNormsArray.map(item => {
        if (item.id === id) {
          item.is_active = e.target.checked ? 'y' : 'n'
          return item
        } else return item
      })
    )
  }

  // Search
  const handleCallback = childData => {
    if (childData) {
      dispatch(getAllTestTimeNorms(0, limit, sorting, order, childData, token))
    } else {
      dispatch(getAllTestTimeNorms(0, limit, sorting, order, '', token))
    }
    setSearch(childData)
  }

  const products = testTimeNormsArray
  const columns = [
    {
      dataField: 'id',
      text: 'Grade Time ID',
      formatter: (cell, row, rowIndex) => {
        const rowNumber = rowIndex + 1
        return <span>{rowNumber}</span>
      }
    },
    {
      dataField: 'grade',
      text: 'Grade'
    },
    {
      dataField: 'sub-test-name',
      text: 'Sub Test'
    },
    {
      dataField: 'time_Sec',
      text: 'Time in sec',
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
    setPage(page)
    setStart(limit * (page - 1) - 1 < 0 ? 0 : limit * (page - 1))
    if (page === 1) {
      dispatch(getAllTestTimeNorms(0, limit, sorting, order, search, token))
    } else {
      dispatch(getAllTestTimeNorms(limit * (page - 1) - 1 < 0 ? 0 : limit * (page - 1), limit, sorting, order, search, token))
    }
  }

  // pagePerLimit
  const handlePagePerLimit = e => {
    setLimit(e.value)
    dispatch(getAllTestTimeNorms(start, e.value, sorting, order, search, token))
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
      setSortField(sortField)
      setSortOrder(sortOrder)
      if (sortOrder) {
        dispatch(getAllTestTimeNorms(start, limit, sorting, sortOrder, search, token))
      }
    }
  }

  // Notification for status
  useEffect(() => {
    if (previousProps?.isTestTimeNormsUpdated !== isTestTimeNormsUpdated) {
      if (isTestTimeNormsUpdated) {
        setShow(false)
        enqueueSnackbar(`${testTimeNormsResMessage}`, {
          variant: 'success',
          hide: 2000,
          autoHide: true
        })
        dispatch(getAllTestTimeNorms(0, limit, sorting, order, '', token))
      } else if (isTestTimeNormsUpdated === false) {
        setShow(false)
        enqueueSnackbar(`${testTimeNormsResMessage}`, {
          variant: 'error',
          hide: 2000,
          autoHide: true,
          TransitionComponent: 'Fade'
        })
      }
    }
    return () => {
      previousProps.isTestTimeNormsUpdated = isTestTimeNormsUpdated
    }
  }, [isTestTimeNormsUpdated])

  // Notification for Delete
  useEffect(() => {
    if (previousProps?.isTestTimeNormsDeleted !== isTestTimeNormsDeleted) {
      if (isTestTimeNormsDeleted) {
        setShow(false)
        enqueueSnackbar(`${testTimeNormsResMessage}`, {
          variant: 'success',
          hide: 2000,
          autoHide: true
        })
        dispatch(getAllTestTimeNorms(0, limit, sorting, order, '', token))
      } else if (isTestTimeNormsDeleted === false) {
        setShow(false)
        enqueueSnackbar(`${testTimeNormsResMessage}`, {
          variant: 'error',
          hide: 2000,
          autoHide: true,
          TransitionComponent: 'Fade'
        })
      }
    }
    return () => {
      previousProps.isTestTimeNormsDeleted = isTestTimeNormsDeleted
    }
  }, [isTestTimeNormsDeleted])
  return (
    <>
          <Header parentCallback={handleCallback} searchbar={true}/>
          <TitleHeader name="Test Time Norms" title="Norms Management" rowArray={rowArray} location={location} url="add-new-test-time-norms" showbuttons={true} />
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
                  defaultSorted={defaultSortedBy}
                  onTableChange={handleTablechange}
                  responsive="md"
                  options={options}
                  noDataIndication={() => isLoading ? <Spinner className="text-center" animation="border" /> : 'No data'}
                />
              </div>
            </div>
      <DeleteModal show={show} id={id} handleClose={handleClose} handleDelete={handleDelete} />
    </>
  )
}

export default TestTimeNorms
