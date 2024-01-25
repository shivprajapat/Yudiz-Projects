import React, { useState, useRef, useEffect } from 'react'
/* react packages */
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

/* compoenent */
import Header from '../../../Components/Header'
import TitleHeader from '../../../Components/TitleHeader'
/* Action File */
import { getAllBoardListAction, deleteBoard, editSpecificBoard } from '../../../Actions/Admin/board'
import DeleteModal from '../../../Components/DeleteModal/DeleteModal'
import ActiveButton from '../../../Shared/Component/ActiveButton'

function BoardManagement () {
  // Constant
  const dispatch = useDispatch()
  const { enqueueSnackbar } = useSnackbar()
  const location = useLocation()
  const token = localStorage.getItem('token')
  const pagePerLimitArray = [
    { value: 10, label: '10' },
    { value: 20, label: '20' },
    { value: 30, label: '30' }
  ]

  // useState
  const [pageNo, setPageNo] = useState(1)
  const [start, setStart] = useState(0)
  const [show, setShow] = useState(false)
  const [order] = useState('asc')
  const [rowArray, setRowArray] = useState([])
  const [limit, setLimit] = useState(10)
  const [sort] = useState('title')
  const [search, setSearch] = useState('')
  const [id, setId] = useState('')
  const [boardArray, setBoardArray] = useState([])
  const [allRowSelect, setAllRowSelect] = useState(false)

  // useSelector
  const boardResMessage = useSelector(state => state.board.resMessage)
  const isBoardDeleted = useSelector(state => state.board.isDeleted)
  const isBoardUpdated = useSelector(state => state.board.isBoardEdited)
  const boardListData = useSelector(state => state.board.boardList)
  const count = useSelector(state => state.board.boardCount)
  const isLoading = useSelector(state => state.board.isLoading)

  // previousProps
  const previousProps = useRef({
    boardListData,
    boardResMessage,
    isBoardDeleted,
    isBoardUpdated
  }).current

  // useEffect for listing Data
  useEffect(() => {
    dispatch(getAllBoardListAction(start, limit, sort, order, search, token))
  }, [])
  useEffect(() => {
    if (previousProps?.boardListData !== boardListData) {
      if (boardListData) {
        setBoardArray(boardListData)
      }
    }
    return () => {
      previousProps.boardListData = boardListData
    }
  }, [boardListData])

  // Table Button : View, Edit, Delete
  const actionbutton = (row, cell) => {
    return <ActiveButton id={cell?.id} handleShow={handleShow} slug='board-management' viewlink='/admin/board-management/view-board' editlink='/admin/board-management/edit-board' />
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
      dispatch(deleteBoard(data, token))
    }
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
    dispatch(editSpecificBoard(data, token))
    setBoardArray(
      boardArray.map(item => {
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
      dispatch(getAllBoardListAction(0, limit, sort, order, childData, token))
    } else {
      dispatch(getAllBoardListAction(0, limit, sort, order, '', token))
    }
    setSearch(childData)
  }

  const products = boardArray
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
      text: 'Board Name',
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
      dispatch(getAllBoardListAction(0, limit, sort, order, search, token))
    } else {
      dispatch(getAllBoardListAction(limit * (page - 1) - 1 < 0 ? 0 : limit * (page - 1), limit, sort, order, search, token))
    }
  }

  // pagePerLimit
  const handlePagePerLimit = e => {
    setLimit(e.value)
    setPageNo(1)
    dispatch(getAllBoardListAction(0, e.value, sort, order, search, token))
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
        dispatch(getAllBoardListAction(start, limit, sort, sortOrder, search, token))
      }
    }
  }

  const selectRow = (row, isSelect) => {
    let updatedList = [...rowArray]

    if (isSelect) {
      updatedList = [...rowArray, row.id]
    } else {
      updatedList.splice(rowArray.indexOf(row.id), 1)
    }
    setRowArray(updatedList)
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
    if (previousProps?.isBoardDeleted !== isBoardDeleted) {
      if (isBoardDeleted) {
        setShow(false)
        enqueueSnackbar(`${boardResMessage}`, {
          variant: 'success',
          hide: 2000,
          autoHide: true
        })
        dispatch(getAllBoardListAction(0, limit, sort, order, '', token))
      } else if (isBoardDeleted === false) {
        setShow(false)
        enqueueSnackbar(`${boardResMessage}`, {
          variant: 'error',
          hide: 2000,
          autoHide: true,
          TransitionComponent: 'Fade'
        })
      }
    }
    return () => {
      previousProps.isBoardDeleted = isBoardDeleted
    }
  }, [isBoardDeleted])

  // Notification for status
  useEffect(() => {
    if (previousProps?.isBoardUpdated !== isBoardUpdated) {
      if (isBoardUpdated) {
        setShow(false)
        enqueueSnackbar(`${boardResMessage}`, {
          variant: 'success',
          hide: 2000,
          autoHide: true
        })
        dispatch(getAllBoardListAction(0, limit, sort, order, '', token))
      } else if (isBoardUpdated === false) {
        setShow(false)
        enqueueSnackbar(`${boardResMessage}`, {
          variant: 'error',
          hide: 2000,
          autoHide: true,
          TransitionComponent: 'Fade'
        })
      }
    }
    return () => {
      previousProps.isBoardUpdated = isBoardUpdated
    }
  }, [isBoardUpdated])

  return (
    <>
          <Header name="Board List" parentCallback={handleCallback} searchbar={true}/>
          <TitleHeader
            name="Board"
            title="Board Management"
            url="add-new-board"
            location={location}
            rowArray={rowArray}
            setRowArray={setRowArray}
            pageNo={pageNo}
            setPageNo={setPageNo}
            allRowSelect={allRowSelect}
            slug='board-management'
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
                  defaultSorted={defaultSortedBy}
                  onTableChange={handleTablechange}
                  selectRow={{
                    mode: 'checkbox',
                    clickToSelect: true,
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
                  options={options}
                  responsive="md"
                  noDataIndication={() => isLoading ? <Spinner className='text-center' animation="border" /> : 'No data'}
                />
              </div>
            </div>
      <DeleteModal show={show} id={id} handleClose={handleClose} handleDelete={handleDelete} />
    </>
  )
}

export default BoardManagement
