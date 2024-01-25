import React, { useEffect, useState } from 'react'
import { Button, Form } from 'react-bootstrap'
import { Controller, useForm } from 'react-hook-form'
import Select from 'react-select'
import PropTypes from 'prop-types'
import { useSearchParams } from 'react-router-dom'
import { paymentModeOptions, placedOrderDropDown, orderTypeOptions } from 'shared/constants'
import { getQueryVariable } from 'shared/utils'
import { orderStatus } from 'admin/modules/orders/constants'

const OrderFilter = ({ filterChange, setRequestParams }) => {
  const { control, handleSubmit, reset, register, setValue } = useForm({ mode: 'onChange' })

  // eslint-disable-next-line no-unused-vars
  const [searchParams, setSearchParams] = useSearchParams()
  const [radioCheckedVal, setRadioCheckedVal] = useState('false')
  const paymentOptions = paymentModeOptions.map(opt => {
    return { label: opt.name, value: opt.value }
  })
  const orderStatusOptions = Object.keys(orderStatus).map(key => {
    return { label: key, value: orderStatus[key] + '' }
  })
  const paymentMode = getQueryVariable('paymentMode')
  const statusId = getQueryVariable('statusId')
  const pendingOrder = getQueryVariable('pendingOrder')
  const timeFilter = getQueryVariable('timeFilter')
  const orderType = getQueryVariable('orderType')

  useEffect(() => {
    if (paymentMode) {
      setValue(
        'paymentMode',
        paymentOptions.find((option) => option.value === paymentMode.replace('+', ' '))
      )
    }

    if (statusId) {
      setValue(
        'statusId',
        orderStatusOptions.find((option) => option.value === statusId)
      )
    }

    if (timeFilter) {
      setValue(
        'timeFilter',
        placedOrderDropDown.find((option) => option.value === timeFilter)
      )
    }

    if (orderType) {
      setValue(
        'orderType',
        orderTypeOptions.find((option) => option.value === orderType)
      )
    }

    if (pendingOrder) {
      setRadioCheckedVal(pendingOrder)
    }
  }, [])

  const onSubmit = (data) => {
    if (data.pendingOrder) {
      const pendingOrderBoolean = data.pendingOrder === 'true'
      data = { ...data, pendingOrder: pendingOrderBoolean }
    }
    filterChange(data)
  }

  const onReset = () => {
    reset({
      paymentMode: '',
      statusId: '',
      timeFilter: '',
      orderType: '',
      pendingOrder: false
    })
    setSearchParams('')
    setRequestParams({ page: 1, perPage: 10 })
    setRadioCheckedVal('false')
  }

  const radioChangehandler = (e) => {
    setRadioCheckedVal(e.target.value)
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
      <Form.Group className="form-group mb-4">
        <Form.Label>Payment Mode</Form.Label>
        <Controller
          name="paymentMode"
          control={control}
          render={({ field: { onChange, value = [], ref } }) => (
            <Select
              ref={ref}
              value={value}
              className="react-select"
              classNamePrefix="select"
              options={paymentOptions}
              onChange={(e) => {
                onChange(e)
              }}
            />
          )}
        />
      </Form.Group>

      <Form.Group className="form-group mb-4">
        <Form.Label>Status</Form.Label>
        <Controller
          name="statusId"
          control={control}
          render={({ field: { onChange, value = [], ref } }) => (
            <Select
              ref={ref}
              value={value}
              className="react-select"
              classNamePrefix="select"
              options={orderStatusOptions}
              onChange={(e) => {
                onChange(e)
              }}
            />
          )}
        />
      </Form.Group>
      <Form.Group className="form-group mb-4">
        <Form.Label>Placed in</Form.Label>
        <Controller
          name="timeFilter"
          control={control}
          render={({ field: { onChange, value = [] } }) => (
            <Select
              value={value}
              className="react-select"
              classNamePrefix="select"
              placeholder="Time filter"
              isClearable
              options={placedOrderDropDown}
              onChange={(e) => {
                onChange(e)
              }}
            />
          )}
        />
      </Form.Group>
      <Form.Group className="form-group mb-4">
        <Form.Label>Order Type</Form.Label>
        <Controller
          name="orderType"
          control={control}
          render={({ field: { onChange, value = [], ref } }) => (
            <Select
              ref={ref}
              value={value}
              className="react-select"
              classNamePrefix="select"
              options={orderTypeOptions}
              onChange={(e) => {
                onChange(e)
              }}
            />
          )}
        />
      </Form.Group>
      <Form.Group className="form-group mb-4 admin-customers-radio">
        <Form.Label>Pending Orders</Form.Label>
        <div className="d-flex gap-2 mb-1">
          <input
            type="radio"
            id="pending"
            name="pendingOrder"
            className="customer-filter-radio"
            value={true}
            {...register('pendingOrder', {
              required: false
            })}
            onChange={radioChangehandler}
            checked={radioCheckedVal === 'true'}
          />
          <label htmlFor="pending">Show Pending Orders</label>
        </div>
        <div className="d-flex gap-2">
          <input
            type="radio"
            id="all"
            name="pendingOrder"
            className="customer-filter-radio"
            value={false}
            {...register('pendingOrder', {
              required: false
            })}
            onChange={radioChangehandler}
            checked={radioCheckedVal === 'false'}
          />
          <label htmlFor="all">Show All Orders</label>
        </div>
      </Form.Group>
    </Form>
  )
}
OrderFilter.propTypes = {
  filterChange: PropTypes.func,
  setRequestParams: PropTypes.func
}

export default OrderFilter
