import React, { useEffect, useRef, useState } from 'react'
import Header from '../../../../Components/Header'
import TitleHeader from '../../../../Components/TitleHeader'
import BootstrapTable from 'react-bootstrap-table-next'
import paginationFactory from 'react-bootstrap-table2-paginator'
import orderup from '../../../../assets/images/order-up.svg'
import orderdown from '../../../../assets/images/order-down.svg'
import orderdefault from '../../../../assets/images/order-default.svg'
import { Spinner } from 'react-bootstrap'
import { useLocation } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { useSnackbar } from 'react-notistack'
import Select from 'react-select'
import {
  deleteQuestion,
  editSpecificQuestion,
  getAllQuestionListAction,
  getAllSubCategoryFrontend
} from '../../../../Actions/Admin/Test/Question'
import DeleteModal from '../../../../Components/DeleteModal/DeleteModal'
import ActiveButton from '../../../../Shared/Component/ActiveButton'

function Questions () {
  // Constanst
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
  const [testDetailsId, setTestDetailsId] = useState()
  const [rowArray, setRowArray] = useState([])
  const [order] = useState('asc')
  const [search, setSearch] = useState('')
  const [sort] = useState('test_detail_id')
  const [show, setShow] = useState(false)
  const [id, setId] = useState('')
  const [pageNo, setPageNo] = useState(1)
  const [questionArray, setQuestionArray] = useState([])
  const [allRowSelect, setAllRowSelect] = useState(false)

  // useSelector
  const isQuestionDeleted = useSelector((state) => state.question.isDeleted)
  const count = useSelector((state) => state.question.questionCount)

  const isQuestionUpdated = useSelector(
    (state) => state.question.isQuestionEdited
  )
  const questionResMessage = useSelector((state) => state.question.resMessage)
  const questionListData = useSelector((state) => state.question.questionList)
  const subtestArray = useSelector((state) => state.question.testSubCategoryList)
  const isLoading = useSelector((state) => state.question.isLoading)

  // PreviousProps
  const previousProps = useRef({
    questionListData,
    isQuestionDeleted,
    questionResMessage,
    isQuestionUpdated
  }).current

  const handleIdChange = (e) => {
    const setCategoryId = e?.id
    setTestDetailsId(setCategoryId)
    if (setCategoryId) {
      dispatch(
        getAllQuestionListAction(
          0,
          limit,
          sort,
          order,
          '',
          setCategoryId,
          token
        )
      )
    }
  }

  // useEffect for listing Data
  useEffect(() => {
    dispatch(
      getAllQuestionListAction(
        start,
        limit,
        sort,
        order,
        '',
        testDetailsId,
        token
      )
    )
    dispatch(getAllSubCategoryFrontend(token))
  }, [])

  useEffect(() => {
    if (previousProps?.questionListData !== questionListData) {
      if (questionListData) {
        setQuestionArray(questionListData)
      }
    }
    return () => {
      previousProps.questionListData = questionListData
    }
  }, [questionListData])

  // Table Button : View, Edit, Delete
  const actionbutton = (row, cell) => {
    return <ActiveButton id={cell?.id} handleShow={handleShow} slug='test-management/questions' viewlink='/admin/test-management/question/view-questions' editlink='/admin/test-management/question/edit-questions' />
  }

  // Function to delete Row in table
  const handleShow = (id) => {
    setId(id)
    setShow(true)
  }
  const handleClose = () => setShow(false)
  const handleDelete = (id) => {
    if (id) {
      dispatch(deleteQuestion({ id: [id] }, token))
    }
  }

  // Table Switch : Status on/off
  const switchAction = (row, cell) => {
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
    dispatch(editSpecificQuestion(data, token))
    setQuestionArray(
      questionArray.map((item) => {
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
        getAllQuestionListAction(
          0,
          limit,
          sort,
          order,
          childData,
          testDetailsId,
          token
        )
      )
    } else if (childData === null) {
      dispatch(
        getAllQuestionListAction(
          0,
          limit,
          sort,
          order,
          '',
          testDetailsId,
          token
        )
      )
    } else {
      dispatch(
        getAllQuestionListAction(
          0,
          limit,
          sort,
          order,
          '',
          testDetailsId,
          token
        )
      )
    }
    setSearch(childData)
  }

  const products = questionArray
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
      dataField: 'question',
      text: 'Question'
    },
    {
      dataField: 'testDetails.title',
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
    setStart(limit * (page - 1) - 1 < 0 ? 0 : limit * (page - 1))
    setPageNo(page)
    if (page === 1) {
      dispatch(
        getAllQuestionListAction(
          0,
          limit,
          sort,
          order,
          '',
          testDetailsId,
          token
        )
      )
    } else {
      dispatch(
        getAllQuestionListAction(
          limit * (page - 1) - 1 < 0 ? 0 : limit * (page - 1),
          limit,
          sort,
          order,
          '',
          testDetailsId,
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
      getAllQuestionListAction(
        0,
        e.value,
        sort,
        order,
        '',
        testDetailsId,
        token
      )
    )
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
          getAllQuestionListAction(
            start,
            limit,
            sort,
            sortOrder,
            search,
            testDetailsId,
            token
          )
        )
      }
    }
  }
  // Notification for Delete
  useEffect(() => {
    if (previousProps?.isQuestionDeleted !== isQuestionDeleted) {
      if (isQuestionDeleted) {
        setRowArray([])
        setShow(false)
        enqueueSnackbar(`${questionResMessage}`, {
          variant: 'success',
          hide: 2000,
          autoHide: true
        })
        dispatch(
          getAllQuestionListAction(
            start,
            limit,
            sort,
            order,
            '',
            testDetailsId,
            token
          )
        )
      } else if (isQuestionDeleted === false) {
        setShow(false)
        enqueueSnackbar(`${questionResMessage}`, {
          variant: 'error',
          hide: 2000,
          autoHide: true,
          TransitionComponent: 'Fade'
        })
      }
    }
    return () => {
      previousProps.isQuestionDeleted = isQuestionDeleted
    }
  }, [isQuestionDeleted])

  // Notification for Status
  useEffect(() => {
    if (previousProps?.isQuestionUpdated !== isQuestionUpdated) {
      if (isQuestionUpdated) {
        setShow(false)
        enqueueSnackbar(`${questionResMessage}`, {
          variant: 'success',
          hide: 2000,
          autoHide: true
        })
        dispatch(
          getAllQuestionListAction(
            start,
            limit,
            sort,
            order,
            '',
            testDetailsId,
            token
          )
        )
      } else if (isQuestionUpdated === false) {
        setShow(false)
        enqueueSnackbar(`${questionResMessage}`, {
          variant: 'error',
          hide: 2000,
          autoHide: true,
          TransitionComponent: 'Fade'
        })
      }
    }
    return () => {
      previousProps.isQuestionUpdated = isQuestionUpdated
    }
  }, [isQuestionUpdated])

  // Delete multiple questions
  const selectRow = (row, isSelect) => {
    let updatedList = [...rowArray]

    if (isSelect) {
      updatedList = [...rowArray, row.id]
    } else {
      updatedList.splice(rowArray.indexOf(row.id), 1)
    }
    setRowArray(updatedList)
  }
  return (
    <>
          <Header parentCallback={handleCallback} searchbar={true}/>
          <TitleHeader
            name='Question'
            title='Test Management'
            url='add-new-questions'
            location={location}
            rowArray={rowArray}
            slug='test-management/questions'
            showbuttons={true}
            setRowArray={setRowArray}
            allRowSelect={allRowSelect}
            pageNo={pageNo}
            setPageNo={setPageNo}
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
                <div className='categoryfilterbtn text-center'>
                  <Select
                    classNamePrefix='filter-custom'
                    className='filter-time-btn withrightimg'
                    getOptionLabel={(option) => option.title}
                    getOptionValue={(option) => option.id}
                    options={subtestArray}
                    placeholder={'Select Category'}
                    onChange={(e) => handleIdChange(e)}
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
                  defaultSorted={defaultSortedBy}
                  pagination={paginationFactory(options)}
                  onTableChange={handleTablechange}
                  responsive='md'
                  options={options}
                  noDataIndication={ () => isLoading ? <Spinner className='text-center' animation="border" /> : 'No data' }
                />
              </div>
            </div>
      <DeleteModal show={show} id={id} handleClose={handleClose} handleDelete={handleDelete} />
    </>
  )
}

export default Questions
