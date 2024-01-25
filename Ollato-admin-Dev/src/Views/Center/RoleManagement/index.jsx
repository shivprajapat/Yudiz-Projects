import React, { useEffect, useState, useRef } from 'react'
import Header from '../../../Components/Header'
import TitleHeader from '../../../Components/TitleHeader'
import BootstrapTable from 'react-bootstrap-table-next'
import paginationFactory from 'react-bootstrap-table2-paginator'
import { useLocation } from 'react-router-dom'
import orderdefault from '../../../assets/images/order-default.svg'
import orderup from '../../../assets/images/order-up.svg'
import orderdown from '../../../assets/images/order-down.svg'
import { useDispatch, useSelector } from 'react-redux'
import Select from 'react-select'
import { deleteRole, editSpecificRole, getAllRoleAction } from '../../../Actions/Admin/role'
import { Spinner } from 'react-bootstrap'
import DeleteModal from '../../../Components/DeleteModal/DeleteModal'
import { useSnackbar } from 'react-notistack'
import ActiveButton from '../../../Shared/Component/ActiveButton'

function RoleManagement () {
  // Constant
  const dispatch = useDispatch()
  const token = localStorage.getItem('token')
  const { enqueueSnackbar } = useSnackbar()
  const location = useLocation()
  const pagePerLimitArray = [
    { value: 10, label: '10' },
    { value: 20, label: '20' },
    { value: 30, label: '30' }
  ]

  // useStat
  const [start, setStart] = useState(0)
  const [limit, setLimit] = useState(10)
  const [sort] = useState('title')
  const [order] = useState('asc')
  const [search, setSearch] = useState('')
  const [roleArray, setRoleArray] = useState([])
  const [pageNo, setPageNo] = useState(1)
  const [id, setId] = useState([])
  const [show, setShow] = useState(false)
  const [rowArray, setRowArray] = useState([])
  const [allRowSelect, setAllRowSelect] = useState(false)

  // useSelector
  const roleListData = useSelector((state) => state.role.roleList)
  const isRoleUpdated = useSelector(state => state.role.isRoleEdited)
  const roleResMessage = useSelector(state => state.role.resMessage)
  const isRoleDeleted = useSelector(state => state.role.isDeleted)
  const count = useSelector(state => state.role.roleCount)
  const isLoading = useSelector(state => state.role.isLoading)

  // previousProps
  const previousProps = useRef({ roleListData, isRoleUpdated, roleResMessage, isRoleDeleted }).current

  // useEffect to get data
  useEffect(() => {
    dispatch(getAllRoleAction(start, limit, sort, order, search, token))
  }, [])

  useEffect(() => {
    if (previousProps?.roleListData !== roleListData) {
      if (roleListData) {
        setRoleArray(roleListData)
      }
    }
    return () => {
      previousProps.roleListData = roleListData
    }
  }, [roleListData])

  // Table Button : View, Edit, Delete
  const actionbutton = (row, cell) => {
    return <ActiveButton id={cell?.id} handleShow={handleShow} slug='role-management' viewlink='/admin/role-management/view-role' editlink='/admin/role-management/edit-role' />
  }

  // Search
  const handleCallback = (childData) => {
    setSearch(childData)
    if (childData) {
      dispatch(getAllRoleAction(0, limit, sort, order, childData, token))
    } else {
      dispatch(getAllRoleAction(0, limit, sort, order, '', token))
    }
  }

  // Function to delete Row in table
  const handleShow = (id) => {
    setId(id)
    setShow(true)
  }
  const handleClose = () => setShow(false)
  const handleDelete = (id) => {
    if (id) {
      dispatch(deleteRole({ id: [id] }, token))
    }
  }
  // Delete Row
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
    dispatch(editSpecificRole(data, token))
    setRoleArray(
      roleArray.map((item) => {
        if (item.id === id) {
          item.is_active = e.target.checked ? 'y' : 'n'
          return item
        } else return item
      })
    )
  }

  // Pagination
  const onPageChange = (page, sizePerPage) => {
    setPageNo(page)
    setStart(limit * (page - 1) - 1 < 0 ? 0 : limit * (page - 1))
    if (page === 1) {
      dispatch(getAllRoleAction(0, limit, sort, order, search, token))
    } else {
      dispatch(
        getAllRoleAction(
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
    setPageNo(1)
    dispatch(getAllRoleAction(0, e.value, sort, order, search, token))
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
          getAllRoleAction(start, limit, sort, sortOrder, search, token)
        )
      }
    }
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
      text: 'Role Name',
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
  // Notification for Status
  useEffect(() => {
    if (previousProps?.isRoleUpdated !== isRoleUpdated) {
      if (isRoleUpdated) {
        setShow(false)
        enqueueSnackbar(`${roleResMessage}`, {
          variant: 'success',
          hide: 2000,
          autoHide: true
        })
        dispatch(getAllRoleAction(0, limit, sort, order, '', token))
      } else if (isRoleUpdated === false) {
        setShow(false)
        enqueueSnackbar(`${roleResMessage}`, {
          variant: 'error',
          hide: 2000,
          autoHide: true,
          TransitionComponent: 'Fade'
        })
      }
    }
    return () => {
      previousProps.isRoleUpdated = isRoleUpdated
    }
  }, [isRoleUpdated])

  // Notification for Delete
  useEffect(() => {
    if (previousProps?.isRoleDeleted !== isRoleDeleted) {
      if (isRoleDeleted) {
        setShow(false)
        enqueueSnackbar(`${roleResMessage}`, {
          variant: 'success',
          hide: 2000,
          autoHide: true
        })
        dispatch(getAllRoleAction(0, limit, sort, order, '', token))
      } else if (isRoleDeleted === false) {
        setShow(false)
        enqueueSnackbar(`${roleResMessage}`, {
          variant: 'error',
          hide: 2000,
          autoHide: true,
          TransitionComponent: 'Fade'
        })
      }
    }
    return () => {
      previousProps.isRoleDeleted = isRoleDeleted
    }
  }, [isRoleDeleted])

  return (
    <>
          <Header parentCallback={handleCallback} searchbar={true}/>
          <TitleHeader
            location={location}
            url='add-new-role'
            rowArray={rowArray}
            setRowArray={setRowArray}
            title='Role Management'
            name='Role'
            allRowSelect={allRowSelect}
            slug='role-management'
            showbuttons={true}
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
              </div>
              <div className='col-md-12'>
                <BootstrapTable
                  keyField='id'
                  data={roleArray}
                  columns={columns}
                  remote={true}
                  selectRow={{
                    mode: 'checkbox',
                    clickToSelect: false,
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
                  defaultSorted={defaultSortedBy}
                  onTableChange={handleTablechange}
                  responsive='md'
                  options={options}
                  noDataIndication={() => isLoading
                    ? <Spinner className='text-center' animation='border' />
                    : 'No data'
                  }
                />
              </div>
            </div>
      <DeleteModal show={show} id={id} handleClose={handleClose} handleDelete={handleDelete} />
    </>
  )
}

export default RoleManagement
