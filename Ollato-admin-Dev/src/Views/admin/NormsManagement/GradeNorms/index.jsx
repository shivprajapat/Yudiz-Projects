import React, { useEffect, useState, useRef } from 'react'
import Header from '../../../../Components/Header'
import TitleHeader from '../../../../Components/TitleHeader'
import BootstrapTable from 'react-bootstrap-table-next'
import paginationFactory from 'react-bootstrap-table2-paginator'
import { useLocation } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import {
  deleteGradeNorms,
  editSpecificGradeNorms,
  getAllGradeNorms
} from '../../../../Actions/Admin/Norms/GradeNorms/GradeNorms'
import { Spinner } from 'react-bootstrap'
import { useSnackbar } from 'react-notistack'
import Select from 'react-select'
import orderdefault from '../../../../assets/images/order-default.svg'
import orderup from '../../../../assets/images/order-up.svg'
import orderdown from '../../../../assets/images/order-down.svg'
import DeleteModal from '../../../../Components/DeleteModal/DeleteModal'
import ActiveButton from '../../../../Shared/Component/ActiveButton'

function GradeNorms () {
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
  const [sort] = useState('norm_id')
  const [order] = useState('asc')
  const [, setSortOrder] = useState('asc')
  const [search, setSearch] = useState('')
  const [show, setShow] = useState(false)
  const [id, setId] = useState('')
  const [, setSortField] = useState('')
  const [gradeNormsArray, setGradeNormsArray] = useState([])
  const [rowArray, setRowArray] = useState([])

  // useSelector
  const gradeNormsListData = useSelector((state) => state.gradeNorms.gradeNormsList)
  const isGradeNormsDeleted = useSelector((state) => state.gradeNorms.isDeleted)
  const gradeNormsResMessage = useSelector((state) => state.gradeNorms.resMessage)
  const isGradeNormsUpdated = useSelector((state) => state.gradeNorms.isGradeNormsEdited)
  const count = useSelector((state) => state.gradeNorms.gradeNormsCount)
  const isLoading = useSelector((state) => state.gradeNorms.isLoading)

  // PreviousProps
  const previousProps = useRef({
    gradeNormsListData,
    isGradeNormsDeleted,
    gradeNormsResMessage,
    isGradeNormsUpdated
  }).current

  // useEffect for listing Data
  useEffect(() => {
    dispatch(getAllGradeNorms(start, limit, sort, order, search, token))
  }, [])

  useEffect(() => {
    if (previousProps?.stateListData !== gradeNormsListData) {
      if (gradeNormsListData) {
        setGradeNormsArray(gradeNormsListData)
      }
    }
    return () => {
      previousProps.gradeNormsListData = gradeNormsListData
    }
  }, [gradeNormsListData])

  // Table Button : View, Edit, Delete
  const actionbutton = (row, cell) => {
    return <ActiveButton id={cell?.id} handleShow={handleShow} slug='orms-management/gradenorms' viewlink='/admin/norms/gradenorms/view-gradenorms' editlink='/admin/norms/gradenorms/edit-gradenorms' />
    // return (
    //   <div className='button-box'>
    //      {adminType === 'super' || roles?.find(i => i.module_permissions.slug === 'norms-management/gradenorms')?.view === '1'
    //        ? <Link to={`/admin/norms/gradenorms/view-gradenorms/${cell?.id}`}>
    //       <button className='action-btns green-bg' type='button'>
    //         <img src={view} alt='' /> View
    //       </button>
    //     </Link>
    //        : null}
    //     {adminType === 'super' || roles?.find(i => i.module_permissions.slug === 'norms-management/gradenorms')?.update === '1'
    //       ? <Link to={`/admin/norms/gradenorms/edit-gradenorms/${cell?.id}`}>
    //       <button className='action-btns light-blue-bg' type='button'>
    //         <img src={edit} alt='' /> Edit
    //       </button>
    //     </Link>
    //       : null}
    //       {adminType === 'super' || roles?.find(i => i.module_permissions.slug === 'norms-management/gradenorms')?.delete === '1'
    //         ? <button
    //         className='action-btns light-red-bg'
    //         onClick={() => handleShow(cell?.id)}
    //         type='button'
    //       >
    //         <img src={deletes} alt='' /> Delete
    //       </button>
    //         : null}
    //   </div>
    // )
  }

  // Function to delete Row in table
  const handleShow = (id) => {
    setId(id)
    setShow(true)
  }
  const handleClose = () => setShow(false)
  const handleDelete = (id) => {
    if (id) {
      dispatch(deleteGradeNorms({ id: [id] }, token))
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
    dispatch(editSpecificGradeNorms(data, token))
    setGradeNormsArray(
      gradeNormsArray.map((item) => {
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
      dispatch(getAllGradeNorms(0, limit, sort, order, childData, token))
    } else {
      dispatch(getAllGradeNorms(0, limit, sort, order, '', token))
    }
  }

  const products = gradeNormsArray
  const columns = [
    {
      dataField: 'id',
      text: 'Grade ID',
      formatter: (cell, row, rowIndex) => {
        const rowNumber = rowIndex + 1
        return <span>{rowNumber}</span>
      }
    },
    {
      dataField: 'grade_title',
      text: 'Grade'
    },
    {
      dataField: 'test_details_title',
      text: 'Sub Test'
    },
    {
      dataField: 'norms_title',
      text: 'Norms',
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
      dataField: 'min_marks',
      text: 'Min Marks'
    },
    {
      dataField: 'max_marks',
      text: 'Max Marks'
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
      dispatch(getAllGradeNorms(0, limit, sort, order, search, token))
    } else {
      dispatch(
        getAllGradeNorms(
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
    dispatch(getAllGradeNorms(start, e.value, sort, order, search, token))
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
        dispatch(
          getAllGradeNorms(start, limit, sort, sortOrder, search, token)
        )
      }
    }
  }

  // Notification for status
  useEffect(() => {
    if (previousProps?.isGradeNormsUpdated !== isGradeNormsUpdated) {
      if (isGradeNormsUpdated) {
        setShow(false)
        enqueueSnackbar(`${gradeNormsResMessage}`, {
          variant: 'success',
          hide: 2000,
          autoHide: true
        })
        dispatch(getAllGradeNorms(0, limit, sort, order, '', token))
      } else if (isGradeNormsUpdated === false) {
        setShow(false)
        enqueueSnackbar(`${gradeNormsResMessage}`, {
          variant: 'error',
          hide: 2000,
          autoHide: true,
          TransitionComponent: 'Fade'
        })
      }
    }
    return () => {
      previousProps.isGradeNormsUpdated = isGradeNormsUpdated
    }
  }, [isGradeNormsUpdated])

  // Notification for Delete
  useEffect(() => {
    if (previousProps?.isGradeNormsDeleted !== isGradeNormsDeleted) {
      if (isGradeNormsDeleted) {
        setShow(false)
        enqueueSnackbar(`${gradeNormsResMessage}`, {
          variant: 'success',
          hide: 2000,
          autoHide: true
        })
        dispatch(getAllGradeNorms(0, limit, sort, order, '', token))
      } else if (isGradeNormsDeleted === false) {
        setShow(false)
        enqueueSnackbar(`${gradeNormsResMessage}`, {
          variant: 'error',
          hide: 2000,
          autoHide: true,
          TransitionComponent: 'Fade'
        })
      }
    }
    return () => {
      previousProps.isGradeNormsDeleted = isGradeNormsDeleted
    }
  }, [isGradeNormsDeleted])
  return (
    <>
          <Header parentCallback={handleCallback} searchbar={true}/>
          <TitleHeader
            name='Grade Norms'
            title='Norms Management'
            rowArray={rowArray}
            location={location}
            url='add-new-gradenorms'
            slug='norms-management/gradenorms'
            showbuttons={true}
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
                    onSelect: selectRow
                  }}
                  pagination={paginationFactory(options)}
                  defaultSorted={defaultSortedBy}
                  onTableChange={handleTablechange}
                  responsive='md'
                  options={options}
                  noDataIndication={ () => isLoading ? <Spinner className='text-center' animation="border" /> : 'No data'}
                />
              </div>
            </div>
      <DeleteModal show={show} id={id} handleClose={handleClose} handleDelete={handleDelete} />
    </>
  )
}

export default GradeNorms
