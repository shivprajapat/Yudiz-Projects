import React, { useEffect, useState } from 'react'
import { Button, Form } from 'react-bootstrap'
import { Controller, useForm } from 'react-hook-form'
import Select from 'react-select'
import DatePicker from 'react-datepicker'
import PropTypes from 'prop-types'
import { getQueryVariable, resetParams } from 'shared/utils'
import { transactionStatus } from 'shared/constants'
import { orderTypes, paymentMethods } from '../orders/constants'

const TransactionFilter = (props) => {
  const { filterChange, setRequestParams } = props
  const [formattedTransactionStatus, setFormattedTransactionStatus] = useState([])
  const [formattedTransactionTypes, setFormattedTransactionTypes] = useState([])
  const [formattedPaymentMethods, setFormattedPaymentMethods] = useState([])
  const { control, handleSubmit, reset, setValue, register } = useForm({ mode: 'onChange' })

  const onSubmit = (data) => {
    filterChange(data)
  }

  useEffect(() => {
    const defaultFromDate = getQueryVariable('fromDate')
    const defaultToDate = getQueryVariable('toDate')
    const defaultStatus = getQueryVariable('status')
    const defaultPaymentMethod = getQueryVariable('paymentMode')
    const defaultOrderId = getQueryVariable('orderId')
    const defaultAssetId = getQueryVariable('assetId')
    const defaultOrderType = getQueryVariable('type')
    const defaultTransactionId = getQueryVariable('transactionId')
    const defaultMinPrice = getQueryVariable('minPrice')
    const defaultMaxPrice = getQueryVariable('maxPrice')
    if (defaultFromDate) {
      const dateStrArr = defaultFromDate.split('+')
      const dateFormat = `${dateStrArr.at(2)}-${dateStrArr.at(1)}-${dateStrArr.at(3)}`
      const jsDate = new Date(dateFormat)
      setValue('fromDate', jsDate)
    }
    if (defaultToDate) {
      const dateStrArr = defaultToDate.split('+')
      const dateFormat = `${dateStrArr.at(2)}-${dateStrArr.at(1)}-${dateStrArr.at(3)}`
      const jsDate = new Date(dateFormat)
      setValue('toDate', jsDate)
    }
    if (defaultStatus) {
      const filteredStatus = {}
      for (const [key, value] of Object.entries(transactionStatus)) {
        if (value === Number(defaultStatus)) {
          filteredStatus.value = `${value}`
          filteredStatus.label = `${key}`
        }
      }
      setValue('status', filteredStatus || {})
    }
    if (defaultPaymentMethod) {
      const filteredStatus = {}
      for (const [key, value] of Object.entries(paymentMethods)) {
        if (value === defaultPaymentMethod.replace('+', ' ')) {
          filteredStatus.value = `${value.replace('+', ' ')}`
          filteredStatus.label = `${key}`
        }
      }
      setValue('paymentMode', filteredStatus || {})
    }
    if (defaultOrderType) {
      const filteredStatus = {}
      for (const [key, value] of Object.entries(orderTypes)) {
        if (value === Number(defaultOrderType)) {
          filteredStatus.value = `${value}`
          filteredStatus.label = `${key}`
        }
      }
      setValue('orderType', filteredStatus || {})
    }
    if (defaultAssetId) {
      setValue('assetId', defaultAssetId)
    }
    if (defaultTransactionId) {
      setValue('transactionId', defaultTransactionId)
    }
    if (defaultOrderId) {
      setValue('orderId', defaultOrderId)
    }
    if (defaultMinPrice) {
      setValue('minPrice', defaultMinPrice)
    }
    if (defaultMaxPrice) {
      setValue('maxPrice', defaultMaxPrice)
    }
    formatTransactionStatus()
    formatTransactionTypes()
    formatPaymentMethods()
  }, [])

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

  const onReset = () => {
    reset({
      status: '',
      orderType: '',
      paymentMode: '',
      orderId: '',
      assetId: '',
      transactionId: '',
      minPrice: '',
      maxPrice: '',
      fromDate: '',
      toDate: ''
    })
    setRequestParams({ page: 1, perPage: 10 })
    resetParams()
  }

  return (
    <Form className="customer-filter" onSubmit={handleSubmit(onSubmit)} autoComplete="off">
      <div className="top-d-button">
        <Button className="white-btn me-2" type="reset" onClick={onReset}>
          Reset
        </Button>
        <Button className="white-btn" type="submit">
          Apply
        </Button>
      </div>
      <Form.Group className="form-group">
        <Form.Label>Status</Form.Label>
        <Controller
          name="status"
          control={control}
          render={({ field: { onChange, value = [], ref } }) => (
            <Select
              ref={ref}
              value={value}
              className="react-select"
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
        <Form.Label>Type</Form.Label>
        <Controller
          name="orderType"
          control={control}
          render={({ field: { onChange, value = [], ref } }) => (
            <Select
              ref={ref}
              value={value}
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
        <Form.Label>Payment Method</Form.Label>
        <Controller
          name="paymentMode"
          control={control}
          render={({ field: { onChange, value = [], ref } }) => (
            <Select
              ref={ref}
              value={value}
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
        <Form.Label>Order Id</Form.Label>
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
        <Form.Label>Asset Id</Form.Label>
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
        <Form.Label>Transaction Id</Form.Label>
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
        <Form.Label>Minimum Price</Form.Label>
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
        <Form.Label>Maximum price</Form.Label>
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
        <Form.Label className="d-block">From Date</Form.Label>
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
        <Form.Label className="d-block">To Date</Form.Label>
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
    </Form>
  )
}

export default TransactionFilter

TransactionFilter.propTypes = {
  filterChange: PropTypes.func,
  requestParams: PropTypes.object,
  setRequestParams: PropTypes.func
}
