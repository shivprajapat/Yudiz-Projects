import React, { useEffect, useRef, useState } from 'react'
import BootstrapTable from 'react-bootstrap-table-next'
import orderdefault from '../../../assets/images/order-default.svg'
import orderup from '../../../assets/images/order-up.svg'
import orderdown from '../../../assets/images/order-down.svg'
import { useDispatch, useSelector } from 'react-redux'
import {
  getRedeemHistory,
  getRevenue,
  RedeemAmountReq
} from '../../../Actions/Center/purchaseLicense'
import ollatoicon from '../../../assets/images/ollatoicon.svg'
import TitleHeader from '../../../Components/TitleHeader'
import { Badge, Form, Spinner } from 'react-bootstrap'
import { useForm } from 'react-hook-form'
import { useSnackbar } from 'react-notistack'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import Select from 'react-select'
import paginationFactory from 'react-bootstrap-table2-paginator'
import { Link } from 'react-router-dom'
import view from '../../../assets/images/view-eye.svg'

function RevenueCenter () {
  const token = localStorage.getItem('token')
  const { enqueueSnackbar } = useSnackbar()
  const dispatch = useDispatch()
  const pagePerLimitArray = [
    { value: 10, label: '10' },
    { value: 20, label: '20' },
    { value: 30, label: '30' }
  ]

  // usestate
  const [start] = useState(0)
  const [limit, setLimit] = useState(10)
  const [pageNo, setPageNo] = useState(1)

  // page change
  const handlePagePerLimit = (e) => {
    setLimit(e.value)
    setPageNo(1)
    dispatch(getRedeemHistory(start, e.value, 'status', 'asc', token, 'center'))
  }

  const revenueData = useSelector((state) => state.centerPackages.revenueData)
  const redeemHistoryData = useSelector(
    (state) => state.centerPackages.redeemHistoryData
  )
  const redeemHistoryCount = useSelector(
    (state) => state.centerPackages.redeemHistoryCount
  )
  const isLoading = useSelector((state) => state.centerPackages.isLoading)
  const ressMessage = useSelector((state) => state.centerPackages.ressMessage)
  const isRedeemSuccess = useSelector(
    (state) => state.centerPackages.isRedeemSuccess
  )
  const previousProps = useRef({
    isRedeemSuccess
  }).current

  useEffect(() => {
    if (previousProps?.isRedeemSuccess !== isRedeemSuccess) {
      if (isRedeemSuccess) {
        enqueueSnackbar(`${ressMessage}`, {
          variant: 'success',
          hide: 2000,
          autoHide: true
        })
        reset()
        dispatch(getRedeemHistory(start, limit, 'status', 'asc', token, 'center'))
        dispatch(getRevenue('current_month', token, 'center'))
      } else if (isRedeemSuccess === false) {
        enqueueSnackbar(`${ressMessage}`, {
          variant: 'error',
          hide: 2000,
          autoHide: true,
          TransitionComponent: 'Fade'
        })
      }
    }
    return () => {
      previousProps.isRedeemSuccess = isRedeemSuccess
    }
  }, [isRedeemSuccess])

  const validationSchema = yup.object().shape({
    amount: yup
      .number('number only')
      .positive('Amount must be a positive number')
      .required()
      .typeError('Amount can only be a number')
      .max(
        revenueData?.remainingAmount,
        'Amount should be less than remaining amount'
      )
  })

  // useForm
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm({
    resolver: yupResolver(validationSchema)
  })

  const products = redeemHistoryData || []

  const actionbutton = (row, cell, key) => {
    return <div className="button-box">
  <Link to={`/center/view-redeem-req-detail/${cell?.id}`}>
      <button className="action-btns green-bg" type="button">
        <img src={view} alt="" /> View
      </button>
    </Link>
</div>
  }
  const statusbadge = (row, cell, key) => {
    return <Badge bg={cell?.status === 'pending' ? 'warning' : cell?.status === 'paid' ? 'success' : 'danger' }>{cell?.status}</Badge>
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

  const handleTablechange = (type, { page, sortField, sortOrder }) => {
    if (type === 'sort') {
      if (sortOrder) {
        dispatch(getRedeemHistory(start, limit, sortField, sortOrder, token, 'center'))
      }
    }
  }

  // Pagination
  const onPageChange = (page) => {
    setPageNo(page)
    if (page === 1) {
      dispatch(getRedeemHistory(start, limit, 'status', 'asc', token, 'center'))
    } else {
      dispatch(
        getRedeemHistory(
          limit * (page - 1) - 1 < 0 ? 0 : limit * (page - 1),
          limit,
          'status',
          'asc',
          token,
          'center'
        )
      )
    }
  }
  const options = {
    sizePerPage: limit,
    hideSizePerPage: true,
    hidePageListOnlyOnePage: false,
    alwaysShowAllBtns: true,
    totalSize: redeemHistoryCount,
    remote: { pagination: true },
    onPageChange,
    page: +pageNo
  }

  const onSubmit = (data) => {
    const Amount = {
      amount: data?.amount
    }
    dispatch(RedeemAmountReq(Amount, token))
  }

  return (
    <>
      {/* <Header name='Revenue' /> */}
      <TitleHeader title='Revenue' name='Revenue' showbuttons={false} dropdown={true}/>
      <div className='revenue'>
        <div className='row '>
          <div className='col-lg-6 mb-3'>
            <div className='common-white-box withrightlogo profile-item'>
              <div className='left-box text-start'>
                <h5>Monthly Revenue</h5>
                <h2>
                  {revenueData?.totalRevenueAmount === null
                    ? 0
                    : revenueData?.totalRevenueAmount.toFixed(2)}
                </h2>
              </div>
              <div className='right-box'>
                <img src={ollatoicon} alt='ollatoicon' />
              </div>
            </div>
          </div>
          <div className='col-lg-6 mb-3'>
            <div className='common-white-box withrightlogo profile-item'>
              <div className='left-box text-start'>
                <h5>Remaining Amount</h5>
                <h2>{revenueData?.remainingAmount.toFixed(2)}</h2>
              </div>
              <div className='right-box'>
                <img src={ollatoicon} alt='ollatoicon' />
              </div>
            </div>
          </div>
          <div className='col-sm-6 mb-3'>
                   <div className="revenue-input">
                   <Form className='light-bg' onSubmit={handleSubmit(onSubmit)}>
                        <Form.Group
                        className={`form-group ${
                          errors.amount?.message ? 'error-occured' : ''
                        }`}
                        controlId='firstname'
                      >
                        <Form.Label>Amount</Form.Label>
                      <div className="input-btn">
                      <Form.Control
                          placeholder='Enter Amount'
                          type='text'
                          {...register('amount', { required: true })}
                        />

                        <div className='text-left'><button className='theme-btn'>Submit</button></div>
                        </div>
                      </Form.Group>
                      {errors?.amount?.message && (
                                  <Form.Text className='error-msg'>
                                    {errors?.amount?.message}
                                  </Form.Text>
                      )}
                      </Form>
                   </div>
                  </div>
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
              defaultSorted={[
                {
                  dataField: 'status',
                  order: 'asc'
                }
              ]}
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
        </div>
      </div>
    </>
  )
}

export default RevenueCenter
