import React, { useEffect, useRef, useState } from 'react'
import Header from '../../../Components/Header'
import TitleHeader from '../../../Components/TitleHeader'
import BootstrapTable from 'react-bootstrap-table-next'
import paginationFactory from 'react-bootstrap-table2-paginator'
import { useLocation } from 'react-router-dom'
import Select from 'react-select'
import { Spinner } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { deleteSubAdmin, editSpecificSubAdmin, getAllSubAdminListAction } from '../../../Actions/Admin/subAdmin'
import orderdefault from '../../../assets/images/order-default.svg'
import orderup from '../../../assets/images/order-up.svg'
import orderdown from '../../../assets/images/order-down.svg'
import DeleteModal from '../../../Components/DeleteModal/DeleteModal'
import { useSnackbar } from 'react-notistack'
import ActiveButton from '../../../Shared/Component/ActiveButton'

function SubAdminManagement () {
  // constants
  const location = useLocation()
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
  const [subAdminArray, setSubAdminArray] = useState([])
  const [allRowSelect, setAllRowSelect] = useState(false)
  const [pageNo, setPageNo] = useState(1)

  // useSelector
  const isSubAdminDeleted = useSelector(state => state.subAdmin.isDeleted)
  const isSubAdminUpdated = useSelector(state => state.subAdmin.isSubAdminEdited)
  const subAdminResMessage = useSelector(state => state.subAdmin.resMessage)
  const subAdminList = useSelector((state) => state.subAdmin.subAdminList)
  const count = useSelector((state) => state.subAdmin.subAdminCount)
  const isLoading = useSelector((state) => state.subAdmin.isLoading)

  // previousProps
  const previousProps = useRef({
    subAdminList,
    isSubAdminUpdated,
    isSubAdminDeleted,
    subAdminResMessage
  }).current

  // useEffect for listing Data
  useEffect(() => {
    dispatch(
      getAllSubAdminListAction(start, limit, sort, sortOrder, search, token)
    )
  }, [])

  useEffect(() => {
    if (previousProps?.subAdminList !== subAdminList) {
      if (subAdminList) {
        setSubAdminArray(subAdminList)
      }
    }
    return () => {
      previousProps.subAdminList = subAdminList
    }
  }, [subAdminList])

  // Table Button : View, Edit, Delete
  const actionbutton = (row, cell) => {
    return <ActiveButton id={cell?.id} handleShow={handleShow} slug='sub-admin-management' viewlink='/admin/sub-admin-management/view-sub-admin' editlink='/admin/sub-admin-management/edit-sub-admin' />
    // return (
    //   <>
    //     <div className='button-box'>
    //     {adminType === 'super' || roles?.find(i => i.module_permissions.slug === 'sub-admin-management')?.view === '1'
    //       ? <Link to={`/admin/sub-admin-management/view-sub-admin/${cell?.id}`}>
    //         <button className='action-btns green-bg' type='button'>
    //           <img src={view} alt='' /> View
    //         </button>
    //       </Link>
    //       : null}
    //       {adminType === 'super' || roles?.find(i => i.module_permissions.slug === 'sub-admin-management')?.update === '1'
    //         ? <Link to={`/admin/sub-admin-management/edit-sub-admin/${cell?.id}`}>
    //         <button className='action-btns light-blue-bg' type='button'>
    //           <img src={edit} alt='' /> Edit
    //         </button>
    //       </Link>
    //         : null}
    //       {adminType === 'super' || roles?.find(i => i.module_permissions.slug === 'sub-admin-management')?.delete === '1'
    //         ? <button
    //         className='action-btns light-red-bg'
    //         type='button'
    //         onClick={() => handleShow(cell?.id)}
    //       >
    //         <img src={deletes} alt='' /> Delete
    //       </button>
    //         : null}
    //     </div>
    //   </>
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
      dispatch(deleteSubAdmin({ id: [id] }, token))
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
    dispatch(editSpecificSubAdmin(data, token))
    setSubAdminArray(
      subAdminArray.map((item) => {
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
      dataField: 'first_name',
      text: 'First Name',
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
      dataField: 'last_name',
      text: 'Last Name'
    },
    {
      dataField: 'email',
      text: 'Email'
    },
    {
      dataField: 'admin_role.title',
      text: 'Role'
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
    }]
  // Sorting
  const defaultSortedBy = [
    {
      dataField: 'studentdetails',
      order: 'asc'
    }
  ]

  const handleTablechange = (type, { page, sortField, sortOrder }) => {
    if (type === 'sort') {
      if (sortOrder) {
        dispatch(
          getAllSubAdminListAction(start, limit, sort, sortOrder, search, token)
        )
      }
    }
  }

  // Pagination
  const onPageChange = (page) => {
    setPageNo(page)
    setStart(limit * (page - 1) - 1 < 0 ? 0 : limit * (page - 1))
    if (page === 1) {
      dispatch(getAllSubAdminListAction(0, limit, sort, sortOrder, search, token))
    } else {
      dispatch(
        getAllSubAdminListAction(
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

  const handleCallback = (childData) => {
    setSearch(childData)
    if (childData) {
      dispatch(getAllSubAdminListAction(0, limit, sort, sortOrder, childData, token))
    } else {
      dispatch(getAllSubAdminListAction(0, limit, sort, sortOrder, '', token))
    }
  }
  // page change
  const handlePagePerLimit = (e) => {
    setLimit(e.value)
    setPageNo(1)
    dispatch(getAllSubAdminListAction(0, e.value, sort, sortOrder, search, token))
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

  // Notification for Delete
  useEffect(() => {
    if (previousProps?.isSubAdminDeleted !== isSubAdminDeleted) {
      if (isSubAdminDeleted) {
        setShow(false)
        enqueueSnackbar(`${subAdminResMessage}`, {
          variant: 'success',
          hide: 2000,
          autoHide: true
        })
        dispatch(getAllSubAdminListAction(0, limit, sort, order, '', token))
      } else if (isSubAdminDeleted === false) {
        setShow(false)
        enqueueSnackbar(`${subAdminResMessage}`, {
          variant: 'error',
          hide: 2000,
          autoHide: true,
          TransitionComponent: 'Fade'
        })
      }
    }
    return () => {
      previousProps.isSubAdminDeleted = isSubAdminDeleted
    }
  }, [isSubAdminDeleted])

  // Notification for Status
  useEffect(() => {
    if (previousProps?.isSubAdminUpdated !== isSubAdminUpdated) {
      if (isSubAdminUpdated) {
        setShow(false)
        enqueueSnackbar(`${subAdminResMessage}`, {
          variant: 'success',
          hide: 2000,
          autoHide: true
        })
        dispatch(getAllSubAdminListAction(0, limit, sort, order, '', token))
      } else if (isSubAdminUpdated === false) {
        setShow(false)
        enqueueSnackbar(`${subAdminResMessage}`, {
          variant: 'error',
          hide: 2000,
          autoHide: true,
          TransitionComponent: 'Fade'
        })
      }
    }
    return () => {
      previousProps.isSubAdminUpdated = isSubAdminUpdated
    }
  }, [isSubAdminUpdated])

  return (
    <>
        <Header name='Sub-Admin List' parentCallback={handleCallback} searchbar={true}/>
          <TitleHeader
            name='Sub Admin'
            title='Sub Admin Management'
            url='add-new-sub-admin'
            location={location}
            rowArray={rowArray}
            setRowArray={setRowArray}
            allRowSelect={allRowSelect}
            pageNo={pageNo}
            setPageNo={setPageNo}
            slug='sub-admin-management'
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
                data={subAdminArray}
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
                responsive='md'
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

export default SubAdminManagement
