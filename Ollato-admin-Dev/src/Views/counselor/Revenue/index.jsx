import React, { useState, useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import BootstrapTable from 'react-bootstrap-table-next'
import { useForm } from 'react-hook-form'
import { useSnackbar } from 'react-notistack'
import paginationFactory from 'react-bootstrap-table2-paginator'
import Select from 'react-select'
import { yupResolver } from '@hookform/resolvers/yup'
import { Link } from 'react-router-dom'
import * as yup from 'yup'
// Images
import ollatoicon from '../../../assets/images/ollatoicon.svg'
import orderdefault from '../../../assets/images/order-default.svg'
import orderup from '../../../assets/images/order-up.svg'
import orderdown from '../../../assets/images/order-down.svg'
import view from '../../../assets/images/view-eye.svg'

// Components
import TitleHeader from '../../../Components/TitleHeader'
import { Form, Spinner } from 'react-bootstrap'

// Action-File
import { getRevenue, getRedeemHistory, RedeemAmountReq } from '../../../Actions/Center/purchaseLicense'

function index () {
  const token = localStorage.getItem('token')
  const dispatch = useDispatch()
  const { enqueueSnackbar } = useSnackbar()
  const [start, setStart] = useState(0)
  const [limit, setLimit] = useState(10)
  const [pageNo, setPageNo] = useState(1)
  const [selected, setSelected] = useState('current_month')

  const revenueData = useSelector((state) => state.centerPackages.revenueData)
  const isRevenueFlag = useSelector((state) => state.centerPackages.isRevenue)
  const redeemHistoryData = useSelector(
    (state) => state.centerPackages.redeemHistoryData
  )
  const redeemHistoryCount = useSelector(
    (state) => state.centerPackages.redeemHistoryCount
  )
  const isLoading = useSelector((state) => state.centerPackages.isLoading)
  const isRedeemSuccessFlag = useSelector((state) => state.centerPackages.isRedeemSuccess)
  const resMessage = useSelector((state) => state.centerPackages.ressMessage)
  // previousProps
  const previousProps = useRef({
    isRedeemSuccessFlag,
    resMessage
  }).current

  useEffect(() => {
    dispatch(getRevenue(selected, token, 'counsellor'))
  }, [selected])

  const handlechange = (event) => {
    setSelected(event.target.value)
  }

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
    // control,
    register,
    handleSubmit,
    reset,
    formState: { errors }
    // setValue
  } = useForm({
    resolver: yupResolver(validationSchema)
  })

  const products = redeemHistoryData || []
  const actionbutton = (row, cell, key) => {
    return <div className="button-box">
  <Link to={`/counsellor/view-redeem-req-detail/${cell?.id}`}>
      <button className="action-btns green-bg" type="button">
        <img src={view} alt="" /> View
      </button>
    </Link>
</div>
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
        dispatch(getRedeemHistory(start, limit, sortField, sortOrder, token, 'counsellor'))
      }
    }
  }
  const pagePerLimitArray = [
    { value: 10, label: '10' },
    { value: 20, label: '20' },
    { value: 30, label: '30' }
  ]
  // Pagination
  const onPageChange = (page, sizePerPage) => {
    setPageNo(page)
    setStart(limit * (page - 1) - 1 < 0 ? 0 : limit * (page - 1))
    if (page === 1) {
      dispatch(
        getRedeemHistory(0, limit, 'status', 'asc', token, 'counsellor')
      )
    } else {
      dispatch(
        getRedeemHistory(limit * (page - 1) - 1 < 0 ? 0 : limit * (page - 1), limit, 'status', 'asc', token, 'counsellor')
      )
    }
  }
  // page change
  const handlePagePerLimit = (e) => {
    setLimit(e.value)
    dispatch(getRedeemHistory(start, e.value, 'status', 'asc', token, 'counsellor'))
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
    dispatch(RedeemAmountReq(Amount, token, 'counsellor'))
  }
  // Toastify Notification
  useEffect(() => {
    if (previousProps?.isRedeemSuccessFlag !== isRedeemSuccessFlag) {
      if (isRedeemSuccessFlag) {
        enqueueSnackbar(`${resMessage}`, {
          variant: 'success',
          hide: 2000,
          autoHide: true
        })
        reset()
        dispatch(getRedeemHistory(start, limit, 'status', 'asc', token, 'counsellor'))
        dispatch(getRevenue(selected, token, 'counsellor'))
      } else if (isRedeemSuccessFlag === false) {
        // dispatch(getRedeemHistory(start, limit, 'status', 'asc', token, 'counsellor'))
        enqueueSnackbar(`${resMessage}`, {
          variant: 'error',
          hide: 2000,
          autoHide: true,
          TransitionComponent: 'Fade'
        })
      }
    }
    return () => {
      previousProps.isRedeemSuccessFlag = isRedeemSuccessFlag
    }
  }, [isRedeemSuccessFlag])
  return (
    <><TitleHeader dropdown={true} title='Revenue' selected={selected} handlechange={handlechange} name='Revenue' showbuttons={false} />
 <div className="revenue">
 <div className="row">
          {
            isRevenueFlag === true
              ? <div className="Spinner">
                 <Spinner className='text-center' animation='border' />
              </div>
              : <>
              <div className="col-sm-6 mb-3">
                  <div className='common-white-box withrightlogo profile-item' >
                      <div className='left-box text-start'>
                          <h5>
                             Total Revenue
                          </h5>
                          <h2>
                          {revenueData && revenueData?.totalRevenueAmount === null
                            ? 0
                            : revenueData && revenueData?.totalRevenueAmount
}
                          </h2>
                      </div>
                      <div className='right-box'>
                          <img src={ollatoicon} alt='ollatoicon' />
                      </div>
                  </div>
              </div>
              <div className="col-sm-6 mb-3">
                  <div className='common-white-box withrightlogo profile-item' >
                      <div className='left-box text-start'>
                          <h5>
                            Remaining Revenue
                          </h5>
                          <h2>
                          {revenueData && revenueData?.remainingAmount === null ? 0 : revenueData && revenueData?.remainingAmount}
                          </h2>
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
              //   selectRow={{
              //     mode: 'checkbox',
              //     clickToSelect: true,
              //     classes: 'custom-class'
              // onSelect: selectRow,
              // onSelectAll: (isSelect, rows, e) => {
              //   setAllRowSelect(isSelect)
              //   if (isSelect) {
              //     setRowArray(rows.map(i => i.id))
              //   } else {
              //     setRowArray([])
              //   }
              // }
              //   }}
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
          }
      </div>
 </div>
      </>
  )
}

export default index
