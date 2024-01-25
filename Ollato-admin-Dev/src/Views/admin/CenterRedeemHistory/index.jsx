import React, { useEffect, useState } from 'react'
import BootstrapTable from 'react-bootstrap-table-next'
import orderdefault from '../../../assets/images/order-default.svg'
import orderup from '../../../assets/images/order-up.svg'
import orderdown from '../../../assets/images/order-down.svg'
import edit from '../../../assets/images/pencil-line.svg'
import { Link, useLocation } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { getRedeemHistoryCenter } from '../../../Actions/Admin/center'
import paginationFactory from 'react-bootstrap-table2-paginator'
import Select from 'react-select'
import Header from '../../../Components/Header'
import TitleHeader from '../../../Components/TitleHeader'
import { Badge, Spinner } from 'react-bootstrap'
import ls from 'localstorage-slim'

function RedeemHistory () {
  const dispatch = useDispatch()
  const location = useLocation()
  const token = localStorage.getItem('token')
  const roles = JSON.parse(localStorage.getItem('roles'))
  const profile = JSON.parse(localStorage.getItem('profile'))
  const adminType = ls.get('admin-type', { decrypt: true, secret: profile?.id })
  const pagePerLimitArray = [
    { value: 10, label: '10' },
    { value: 20, label: '20' },
    { value: 30, label: '30' }
  ]

  // usestate
  const [limit, setLimit] = useState(10)
  const [pageNo, setPageNo] = useState(1)
  const [start, setStart] = useState(0)
  const [order, setOrder] = useState('asc')
  const [search, setSearch] = useState('')

  // useselector
  const redeemHistoryCenterData = useSelector(
    (state) => state.centerManAdmin.redeemHistoryCenterData
  )
  const redeemHistoryCenterCount = useSelector(
    (state) => state.centerManAdmin.redeemHistoryCenterCount
  )
  const isLoading = useSelector((state) => state.centerManAdmin.isLoading)

  useEffect(() => {
    setPageNo(1)
    setSearch('')
    if (location.pathname === '/admin/center-redeem-history') {
      dispatch(
        getRedeemHistoryCenter(0, limit, 'status', order, '', token, 'center')
      )
    } else {
      dispatch(
        getRedeemHistoryCenter(
          0,
          limit,
          'status',
          order,
          '',
          token,
          'counsellor'
        )
      )
    }
  }, [location.pathname])

  // page change
  const handlePagePerLimit = (e) => {
    setLimit(e.value)
    setPageNo(1)
    setStart(0)
    if (location.pathname === '/admin/center-redeem-history') {
      dispatch(
        getRedeemHistoryCenter(
          0,
          e.value,
          'status',
          order,
          search,
          token,
          'center'
        )
      )
    } else {
      dispatch(
        getRedeemHistoryCenter(
          0,
          e.value,
          'status',
          order,
          search,
          token,
          'counsellor'
        )
      )
    }
  }

  const products = redeemHistoryCenterData || []
  const actionbutton = (row, cell) => {
    return (
      <div className='button-box'>
        {adminType === 'super' && (
          <Link
            to={
              location.pathname === '/admin/center-redeem-history'
                ? `/admin/center-redeem-history/edit-request/${cell?.id}`
                : `/admin/counsellor-redeem-history/edit-request/${cell?.id}`
            }
          >
            <button className='action-btns  light-blue-bg' type='button'>
              <img src={edit} alt='' /> Edit
            </button>
          </Link>
        )}
        {roles?.find(
          (i) => i.module_permissions.slug === 'center-redeem-history'
        )?.update === '1' &&
          location.pathname === '/admin/center-redeem-history' && (
            <Link to={`/admin/center-redeem-history/edit-request/${cell?.id}`}>
              <button className='action-btns  light-blue-bg' type='button'>
                <img src={edit} alt='' /> Edit
              </button>
            </Link>
        )}
        {roles?.find(
          (i) => i.module_permissions.slug === 'counsellor-redeem-history'
        )?.update === '1' &&
          location.pathname === '/admin/counsellor-redeem-history' && (
            <Link
              to={`/admin/counsellor-redeem-history/edit-request/${cell?.id}`}
            >
              <button className='action-btns  light-blue-bg' type='button'>
                <img src={edit} alt='' /> Edit
              </button>
            </Link>
        )}
      </div>
    )
  }

  const statusbadge = (row, cell, key) => {
    return (
      <Badge
        bg={
          cell?.status === 'pending'
            ? 'warning'
            : cell?.status === 'paid'
              ? 'success'
              : 'danger'
        }
      >
        {cell?.status}
      </Badge>
    )
  }

  const handleTablechange = (type, { page, sortField, sortOrder }) => {
    if (type === 'sort') {
      if (sortOrder) {
        setOrder(sortOrder)

        // dispatch(getRedeemHistory(0, limit, sortField, sortOrder, token))
        if (location?.pathname === '/admin/center-redeem-history') {
          dispatch(
            getRedeemHistoryCenter(
              start,
              limit,
              sortField,
              sortOrder,
              search,
              token,
              'center'
            )
          )
        } else {
          dispatch(
            getRedeemHistoryCenter(
              start,
              limit,
              sortField,
              search,
              sortOrder,
              token,
              'counsellor'
            )
          )
        }
      }
    }
  }

  const counsellorinfo = (row, cell) => {
    return (
      <div className='counsellor-infobox'>
        <div className='counsinfo'>
          {cell?.counsellors
            ? (
            <p>
              {' '}
              {cell?.counsellors?.first_name} {cell?.counsellors?.last_name}{' '}
            </p>
              )
            : (
            <p>{cell?.centers?.title}</p>
              )}
        </div>
      </div>
    )
  }
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
      text: 'name',
      formatter: counsellorinfo
    },
    {
      dataField: 'date',
      text: 'Date',
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
      dataField: 'amount',
      text: 'Amount'
    },
    {
      dataField: 'status',
      text: 'Status',
      formatter: statusbadge,
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
      dataField: 'body',
      text: 'Action',
      formatter: actionbutton
    }
  ]
  // Pagination
  const onPageChange = (page) => {
    setPageNo(page)
    if (page === 1) {
      setStart(0)
      if (location?.pathname === '/admin/center-redeem-history') {
        dispatch(
          getRedeemHistoryCenter(
            0,
            limit,
            'status',
            order,
            search,
            token,
            'center'
          )
        )
      } else {
        dispatch(
          getRedeemHistoryCenter(
            0,
            limit,
            'status',
            order,
            search,
            token,
            'counsellor'
          )
        )
      }
    } else {
      if (location?.pathname === '/admin/center-redeem-history') {
        setStart(limit * (page - 1) - 1 < 0 ? 0 : limit * (page - 1))
        dispatch(
          getRedeemHistoryCenter(
            limit * (page - 1) - 1 < 0 ? 0 : limit * (page - 1),
            limit,
            'status',
            order,
            search,
            token,
            'center'
          )
        )
      } else {
        dispatch(
          getRedeemHistoryCenter(
            limit * (page - 1) - 1 < 0 ? 0 : limit * (page - 1),
            limit,
            'status',
            order,
            search,
            token,
            'counsellor'
          )
        )
      }
    }
  }

  const options = {
    sizePerPage: limit,
    hideSizePerPage: true,
    hidePageListOnlyOnePage: false,
    alwaysShowAllBtns: true,
    totalSize: redeemHistoryCenterCount,
    remote: { pagination: true },
    onPageChange,
    page: +pageNo
  }

  const handleCallback = (childData) => {
    setSearch(childData)
    if (childData) {
      if (location?.pathname === '/admin/center-redeem-history') {
        dispatch(
          getRedeemHistoryCenter(
            0,
            limit,
            'created_at',
            order,
            childData,
            token,
            'center'
          )
        )
      } else {
        dispatch(
          getRedeemHistoryCenter(
            0,
            limit,
            'created_at',
            order,
            childData,
            token,
            'counsellor'
          )
        )
      }
    } else {
      if (location?.pathname === '/admin/center-redeem-history') {
        dispatch(
          getRedeemHistoryCenter(0, limit, 'status', order, '', token, 'center')
        )
      } else {
        dispatch(
          getRedeemHistoryCenter(
            0,
            limit,
            'status',
            order,
            '',
            token,
            'counsellor'
          )
        )
      }
    }
  }

  return (
    <>
      <Header
        name='Request List'
        parentCallback={handleCallback}
        setSearch={setSearch}
        search={search}
        searchbar={true}
      />
      <TitleHeader title='Redeem History' location={location} name='Requests' />
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
          defaultsorted={true}
          onTableChange={handleTablechange}
          pagination={paginationFactory(options)}
          options={options}
          responsive='md'
          noDataIndication={() =>
            isLoading
              ? (
              <Spinner className='text-center' animation='border' />
                )
              : (
                  'No data'
                )
          }
        />
      </div>
    </>
  )
}

export default RedeemHistory
