import React, { useEffect, useRef, useState } from 'react'
import Header from '../../../Components/Header'
import TitleHeader from '../../../Components/TitleHeader'
import BootstrapTable from 'react-bootstrap-table-next'
import paginationFactory from 'react-bootstrap-table2-paginator'
import orderdefault from '../../../assets/images/order-default.svg'
import orderup from '../../../assets/images/order-up.svg'
import orderdown from '../../../assets/images/order-down.svg'
import { useLocation } from 'react-router-dom'
import { useSnackbar } from 'react-notistack'
import { deleteCareerProfile, editSpecificCareerProfile, getAllCareerProfile } from '../../../Actions/Admin/careerProfile'
import { Spinner } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import Select from 'react-select'
import DeleteModal from '../../../Components/DeleteModal/DeleteModal'
import ActiveButton from '../../../Shared/Component/ActiveButton'

function CareerProfile () {
  // Constant
  const dispatch = useDispatch()
  const location = useLocation()
  const { enqueueSnackbar } = useSnackbar()
  const token = localStorage.getItem('token')

  // useState
  const [start, setStart] = useState(0)
  const [limit, setLimit] = useState(10)
  const [sort] = useState('profile_type')
  const [search, setSearch] = useState('')
  const [id, setId] = useState([])
  const [show, setShow] = useState(false)
  const [rowArray, setRowArray] = useState([])
  const [careerProfileArray, setCareerProfileArray] = useState([])
  const [sortOrder, setSortOrder] = useState('asc')
  const pagePerLimitArray = [
    { value: 10, label: '10' },
    { value: 20, label: '20' },
    { value: 30, label: '30' }
  ]

  // useSelector
  const careerProfileListData = useSelector(state => state.careerProfile.careerProfileList)
  const count = useSelector(state => state.careerProfile.careerProfileCount)
  const isCareerProfileDeleted = useSelector(state => state.careerProfile.isDeleted)
  const careerProfileResMessage = useSelector(state => state.careerProfile.resMessage)
  const isCareerProfileUpdated = useSelector(state => state.careerProfile.isCareerProfileEdited)
  const isLoading = useSelector(state => state.careerProfile.isLoading)

  // previousProps
  const previousProps = useRef({ careerProfileListData, isCareerProfileDeleted, careerProfileResMessage, isCareerProfileUpdated }).current

  // useEffect for listing Data
  useEffect(() => {
    dispatch(getAllCareerProfile(start, limit, sort, sortOrder, search, token))
  }, [])
  useEffect(() => {
    if (previousProps?.careerProfileListData !== careerProfileListData) {
      if (careerProfileListData) {
        setCareerProfileArray(careerProfileListData)
      }
    }
    return () => {
      previousProps.careerProfileListData = careerProfileListData
    }
  }, [careerProfileListData])

  // Table Button : View, Edit, Delete
  const actionbutton = (row, cell) => {
    return <ActiveButton id={cell?.id} handleShow={handleShow} slug='career-profile' viewlink='/admin/career-profile/view-career-profile' editlink='/admin/career-profile/edit-career-profile' />
  }

  // Function to delete Row in table
  const handleShow = (id) => {
    setId(id)
    setShow(true)
  }
  const handleClose = () => setShow(false)
  const handleDelete = (id) => {
    if (id) {
      dispatch(deleteCareerProfile({ id: [id] }, token))
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
    dispatch(editSpecificCareerProfile(data, token))
    setCareerProfileArray(
      careerProfileArray.map((item) => {
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
      dispatch(getAllCareerProfile(0, limit, sort, 'asc', childData, token))
    } else {
      dispatch(getAllCareerProfile(0, limit, sort, 'asc', '', token))
    }
  }
  const products = careerProfileArray
  const columns = [
    {
      dataField: 'id',
      text: 'Profile Rec ID',
      formatter: (cell, row, rowIndex) => {
        const rowNumber = rowIndex + 1
        return <span>{rowNumber}</span>
      }
    },
    {
      dataField: 'profile_type',
      text: 'Profile Type',
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
  const onPageChange = (page, sizePerPage) => {
    setStart(limit * (page - 1) - 1 < 0 ? 0 : limit * (page - 1))
    if (page === 1) {
      dispatch(getAllCareerProfile(0, limit, sort, sortOrder, search, token))
    } else {
      dispatch(
        getAllCareerProfile(
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

  // pagePerLimit
  const handlePagePerLimit = (e) => {
    setLimit(e.value)
    dispatch(getAllCareerProfile(start, e.value, sort, sortOrder, search, token))
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
          getAllCareerProfile(start, limit, sort, sortOrder, search, token)
        )
      }
    }
  }

  // Notification for Delete
  useEffect(() => {
    if (previousProps?.isCareerProfileDeleted !== isCareerProfileDeleted) {
      if (isCareerProfileDeleted) {
        setShow(false)
        enqueueSnackbar(`${careerProfileResMessage}`, {
          variant: 'success',
          hide: 2000,
          autoHide: true
        })
        dispatch(getAllCareerProfile(0, limit, sort, 'asc', '', token))
      } else if (isCareerProfileDeleted === false) {
        setShow(false)
        enqueueSnackbar(`${careerProfileResMessage}`, {
          variant: 'error',
          hide: 2000,
          autoHide: true,
          TransitionComponent: 'Fade'
        })
      }
    }
    return () => {
      previousProps.isCareerProfileDeleted = isCareerProfileDeleted
    }
  }, [isCareerProfileDeleted])

  // Notification for Status
  useEffect(() => {
    if (previousProps?.isCareerProfileUpdated !== isCareerProfileUpdated) {
      if (isCareerProfileUpdated) {
        setShow(false)
        enqueueSnackbar(`${careerProfileResMessage}`, {
          variant: 'success',
          hide: 2000,
          autoHide: true
        })
        dispatch(getAllCareerProfile(0, limit, sort, 'asc', '', token))
      } else if (isCareerProfileUpdated === false) {
        setShow(false)
        enqueueSnackbar(`${careerProfileResMessage}`, {
          variant: 'error',
          hide: 2000,
          autoHide: true,
          TransitionComponent: 'Fade'
        })
      }
    }
    return () => {
      previousProps.isCareerProfileUpdated = isCareerProfileUpdated
    }
  }, [isCareerProfileUpdated])

  return (
    <>
          <Header parentCallback={handleCallback} searchbar={true}/>
          <TitleHeader
            name='Career Profile'
            title='Career Profile'
            url='add-new-career-profile'
            location={location}
            rowArray={rowArray}
            slug='career-profile'
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
              noDataIndication={ () => isLoading ? <Spinner className='text-center' animation="border" /> : 'No data' }
              />
              </div>
            </div>
      <DeleteModal show={show} id={id} handleClose={handleClose} handleDelete={handleDelete} />
    </>
  )
}

export default CareerProfile
