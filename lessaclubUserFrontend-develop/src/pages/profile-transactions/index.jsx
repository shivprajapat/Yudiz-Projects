import DataTable from 'admin/shared/components/data-table'
import React, { useEffect, useState } from 'react'
import { appendParams, getParams, resetParams } from 'shared/utils'
import { listTransactionsData } from 'admin/modules/transaction/redux/service'
import Row from './Row'
import { useSelector } from 'react-redux'
import { Controller, useForm } from 'react-hook-form'
import { Button, Form } from 'react-bootstrap'
import Select from 'react-select'
import DatePicker from 'react-datepicker'
import { orderTypes, paymentMethods } from 'admin/modules/orders/constants'
import { transactionStatus } from 'shared/constants'
import './index.scss'

const ProfileTransactions = () => {
  const userId = useSelector((state) => state.auth.userId) || localStorage.getItem('userId')

  const { control, handleSubmit, register, reset } = useForm({ mode: 'onChange' })

  const [requestParams, setRequestParams] = useState({ page: 1, perPage: 10 })
  const [totalRecord, setTotalRecord] = useState(0)
  const [transactions, setTransactions] = useState([])
  const [formattedTransactionStatus, setFormattedTransactionStatus] = useState([])
  const [formattedTransactionTypes, setFormattedTransactionTypes] = useState([])
  const [formattedPaymentMethods, setFormattedPaymentMethods] = useState([])

  const columns = [
    { name: 'ID', internalName: 'ID', type: 0 },
    { name: 'Date', internalName: 'Date', type: 0 },
    { name: 'Amount (GBP)', internalName: 'Amount', type: 0 },
    { name: 'Payment Method', internalName: 'PaymentMethod', type: 0 },
    { name: 'Type', internalName: 'type', type: 0 },
    { name: 'From', internalName: 'From', type: 0 },
    { name: 'To', internalName: 'To', type: 0 },
    { name: 'Status', internalName: 'Status', type: 0 }
  ]

  useEffect(() => {
    getTransactions()
    formatTransactionStatus()
    formatTransactionTypes()
    formatPaymentMethods()
  }, [requestParams])

  const formatTransactionStatus = () => {
    const temp = []
    Object.keys(transactionStatus)
      .forEach(key => {
        temp.push({
          label: key, value: transactionStatus[key]
        })
      })
    setFormattedTransactionStatus(temp)
  }

  const formatTransactionTypes = () => {
    const temp = []
    Object.keys(orderTypes)
      .forEach(key => {
        temp.push({
          label: key, value: orderTypes[key]
        })
      })
    setFormattedTransactionTypes(temp)
  }

  const formatPaymentMethods = () => {
    const temp = []
    Object.keys(paymentMethods)
      .forEach(key => {
        temp.push({
          label: key, value: paymentMethods[key]
        })
      })
    setFormattedPaymentMethods(temp)
  }

  const getTransactions = async () => {
    const params = getParams(window.location.search)
    try {
      const response = await listTransactionsData({ ...requestParams, ...params, fromUserId: userId })
      if (response.status === 200) {
        setTransactions(response.data.result.userTransactions)
        setTotalRecord(response.data.result.metaData?.totalItems || 0)
      }
    } catch (error) {
      console.log('error', error)
    }
  }

  const handleHeaderEvent = (name, value) => {
    switch (name) {
      case 'rows':
        setRequestParams({ ...requestParams, perPage: Number(value) })
        break
      case 'search':
        setRequestParams({ ...requestParams, id: value })
        break
      case 'filter':
        break
      default:
        break
    }
  }

  const handlePageEvent = (page) => {
    setRequestParams({ ...requestParams, page: page })
  }

  const onSubmit = (data) => {
    handleFilterChange(data)
  }

  const handleFilterChange = (data) => {
    let reqParams = { ...requestParams }

    if (data?.fromDate) {
      reqParams = { ...reqParams, fromDate: data.fromDate }
      appendParams({ fromDate: data.fromDate })
    }
    if (data?.toDate) {
      reqParams = { ...reqParams, toDate: data.toDate }
      appendParams({ toDate: data.toDate })
    }
    if (data?.status) {
      reqParams = { ...reqParams, status: data.status.value }
      appendParams({ status: data.status.value })
    }
    if (data?.paymentMode) {
      reqParams = { ...reqParams, paymentMode: data.paymentMode.value }
      appendParams({ paymentMode: data.paymentMode.value })
    }
    if (data?.orderType) {
      reqParams = { ...reqParams, type: data.orderType.value }
      appendParams({ type: data.orderType.value })
    }
    if (data?.orderId) {
      reqParams = { ...reqParams, orderId: data.orderId }
      appendParams({ orderId: data.orderId })
    }
    if (data?.assetId) {
      reqParams = { ...reqParams, assetId: data.assetId }
      appendParams({ assetId: data.assetId })
    }
    if (data?.transactionId) {
      reqParams = { ...reqParams, transactionId: data.transactionId }
      appendParams({ transactionId: data.transactionId })
    }
    if (data?.minPrice) {
      reqParams = { ...reqParams, minPrice: data.minPrice }
      appendParams({ minPrice: data.minPrice })
    }
    if (data?.maxPrice) {
      reqParams = { ...reqParams, maxPrice: data.maxPrice }
      appendParams({ maxPrice: data.maxPrice })
    }
    setRequestParams(reqParams)
  }

  const onReset = () => {
    reset({
      fromDate: '',
      toDate: '',
      status: '',
      orderType: '',
      orderId: '',
      assetId: '',
      transactionId: '',
      minPrice: '',
      maxPrice: ''
    })
    setRequestParams({ page: 1, perPage: 10 })
    resetParams()
  }

  return (
    <div className="assets-section">
      <h4 className='px-2 py-4'>Transactions</h4>
      <Form className="filter px-4 py-3" onSubmit={handleSubmit(onSubmit)} autoComplete="off">
        <h6>Filters</h6>
        <div className="transaction-filters">
          <Form.Group className="form-group">
            <Controller
              name="status"
              control={control}
              render={({ field: { onChange, value = [], ref } }) => (
                <Select
                  ref={ref}
                  value={value}
                  className="react-select"
                  placeholder='Status'
                  classNamePrefix="select"
                  options={formattedTransactionStatus}
                  onChange={(e) => {
                    onChange(e)
                  }}
                />
              )}
            />
          </Form.Group>
          <Form.Group className="form-group">
            <Controller
              name="orderType"
              control={control}
              render={({ field: { onChange, value = [], ref } }) => (
                <Select
                  ref={ref}
                  value={value}
                  placeholder='order type'
                  className="react-select"
                  classNamePrefix="select"
                  options={formattedTransactionTypes}
                  onChange={(e) => {
                    onChange(e)
                  }}
                />
              )}
            />
          </Form.Group>
          <Form.Group className="form-group">
            <Controller
              name="paymentMode"
              control={control}
              render={({ field: { onChange, value = [], ref } }) => (
                <Select
                  ref={ref}
                  value={value}
                  placeholder='Payment Method'
                  className="react-select"
                  classNamePrefix="select"
                  options={formattedPaymentMethods}
                  onChange={(e) => {
                    onChange(e)
                  }}
                />
              )}
            />
          </Form.Group>
          <Form.Group className="form-group">
            <Form.Control
              type="text"
              name="orderId"
              placeholder="Enter order Id"
              {...register('orderId', {
                required: false
              })}
            />
          </Form.Group>
          <Form.Group className="form-group">
            <Form.Control
              type="text"
              name="assetId"
              placeholder="Enter asset Id"
              {...register('assetId', {
                required: false
              })}
            />
          </Form.Group>
          <Form.Group className="form-group">
            <Form.Control
              type="text"
              name="transactionId"
              placeholder="Enter transaction Id"
              {...register('transactionId', {
                required: false
              })}
            />
          </Form.Group>
          <Form.Group className="form-group">
            <Form.Control
              type="text"
              name="minPrice"
              placeholder="Enter Minimum Price"
              {...register('minPrice', {
                required: false
              })}
            />
          </Form.Group>
          <Form.Group className="form-group">
            <Form.Control
              type="text"
              name="maxPrice"
              placeholder="Enter Maximum price"
              {...register('maxPrice', {
                required: false
              })}
            />
          </Form.Group>
          <Form.Group className="form-group">
            <Controller
              name="fromDate"
              control={control}
              rules={{
                required: false
              }}
              render={({ field: { onChange, value = '' } }) => (
                <DatePicker
                  placeholderText="Select from date"
                  selected={value}
                  onChange={(update) => {
                    onChange(update)
                  }}
                  className="form-control"
                  popperPlacement="bottom"
                  dateFormat="MMMM d, yyyy"
                  showMonthDropdown
                  showYearDropdown
                  dropdownMode="select"
                  floatLabelType="Auto"
                />
              )}
            />
          </Form.Group>
          <Form.Group className="form-group">
            <Controller
              name="toDate"
              control={control}
              rules={{
                required: false
              }}
              render={({ field: { onChange, value = '' } }) => (
                <DatePicker
                  placeholderText="Select to date"
                  selected={value}
                  onChange={(update) => {
                    onChange(update)
                  }}
                  className="form-control"
                  popperPlacement="bottom"
                  dateFormat="MMMM d, yyyy"
                  showMonthDropdown
                  showYearDropdown
                  dropdownMode="select"
                  floatLabelType="Auto"
                />
              )}
            />
          </Form.Group>
          <div className="top-d-button">
            <Button className="white-btn me-2" type="reset" onClick={onReset}>
              Reset
            </Button>
            <Button className="white-btn" type="submit">
              Apply
            </Button>
          </div>
        </div>
      </Form>
      <DataTable
        className="user-transactions"
        columns={columns}
        totalRecord={totalRecord}
        header={{
          left: {
            rows: true
          },
          right: {
            search: true,
            filter: true
          }
        }}
        headerEvent={(name, value) => handleHeaderEvent(name, value)}
        pageChangeEvent={handlePageEvent}
        pagination={{ currentPage: requestParams.page, pageSize: requestParams.perPage }}
        actionColumn={true}
      >
        {
          transactions && transactions.length > 0 ? (
            transactions?.map((transaction, index) => {
              return <Row key={transaction.id} index={index} transaction={transaction} />
            })
          ) : null
        }
      </DataTable>
    </div>
  )
}

export default ProfileTransactions
