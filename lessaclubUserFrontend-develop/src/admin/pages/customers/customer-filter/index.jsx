import React, { useEffect, useState } from 'react'
import { Button, Form } from 'react-bootstrap'
import { Controller, useForm } from 'react-hook-form'
import Select from 'react-select'
import PropTypes from 'prop-types'
import { useSearchParams } from 'react-router-dom'

import { getQueryVariable } from 'shared/utils'

const CustomerFilter = ({ filterChange, requestParams, setRequestParams }) => {
  const { control, handleSubmit, reset, setValue, register } = useForm({ mode: 'onChange' })
  const [radioCheckedVal, setRadioCheckedVal] = useState('')
  // eslint-disable-next-line no-unused-vars
  const [searchParams, setSearchParams] = useSearchParams()

  const customerMarketingOptions = [
    { value: true, label: 'Marketing Customers' },
    { value: false, label: 'Non-marketing Customers' }
  ]

  const customerTypeOptions = [
    { value: 'unreg_customer', label: 'Un registered customers' },
    { value: 'reg_customer', label: 'Registered customers' },
    { value: 'admin', label: 'Admin' }
  ]

  const kycStatusOptions = [
    { value: 0, label: 'Not Started' },
    { value: 1, label: 'Pending' },
    { value: 2, label: 'Approved' },
    { value: 3, label: 'Rejected' },
    { value: 4, label: 'Failed' }
  ]

  const defaultRole = getQueryVariable('role')
  let defaultStatus = getQueryVariable('isMarketing')
  const defaultReferralCode = getQueryVariable('referralCode')
  const defaultKycStatus = getQueryVariable('kycStatus')
  const defaultIsBlockedUsers = getQueryVariable('isBlocked')

  useEffect(() => {
    if (defaultRole) {
      setValue(
        'role',
        customerTypeOptions.find((option) => option.value === defaultRole)
      )
    }

    if (defaultStatus) {
      defaultStatus = defaultStatus === 'true'
      setValue(
        'isMarketing',
        customerMarketingOptions.find((option) => option.value === defaultStatus)
      )
    }

    if (defaultIsBlockedUsers !== null) {
      setRadioCheckedVal(defaultIsBlockedUsers)
    }

    if (defaultReferralCode) {
      setValue('referralCode', defaultReferralCode)
    }

    if (defaultKycStatus !== null) {
      setValue(
        'kycStatus',
        kycStatusOptions.find((option) => option.value === Number(defaultKycStatus))
      )
    }
  }, [])

  const onSubmit = (data) => {
    if (data.isBlocked) {
      const blockedUsersBoolean = data.isBlocked === 'true'
      data = { ...data, isBlocked: blockedUsersBoolean }
    }

    if (data.isMarketing !== undefined) {
      data = { ...data, isMarketing: data.isMarketing.value }
    }

    filterChange(data)
  }

  const onReset = () => {
    reset({
      role: '',
      isMarketing: '',
      isBlocked: '',
      referralCode: '',
      kycStatus: ''
    })
    setSearchParams('')
    setRequestParams({ page: 1, perPage: 10 })
    setRadioCheckedVal(null)
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
      <Form.Group className="form-group mb-5">
        <Form.Label>Customer Role</Form.Label>
        <Controller
          name="role"
          control={control}
          render={({ field: { onChange, value = [], ref } }) => (
            <Select
              ref={ref}
              value={value}
              className="react-select"
              classNamePrefix="select"
              options={customerTypeOptions}
              onChange={(e) => {
                onChange(e)
              }}
            />
          )}
        />
      </Form.Group>
      <Form.Group className="form-group mb-5">
        <Form.Label>Customer Status</Form.Label>
        <Controller
          name="isMarketing"
          control={control}
          render={({ field: { onChange, value = [], ref } }) => (
            <Select
              ref={ref}
              value={value}
              className="react-select"
              classNamePrefix="select"
              options={customerMarketingOptions}
              onChange={(e) => {
                onChange(e)
              }}
            />
          )}
        />
      </Form.Group>

      <Form.Group className="form-group mb-5 admin-customers-radio">
        <Form.Label>Blocked Users</Form.Label>
        <div className="d-flex gap-2 mb-1">
          <input
            type="radio"
            id="blocked"
            name="isBlocked"
            className='customer-filter-radio'
            value={true}
            {...register('isBlocked', {
              required: false
            })}
            onChange={radioChangehandler}
            checked={radioCheckedVal === 'true'}
          />
          <label htmlFor="blocked">Show blocked users only</label>
        </div>
        <div className="d-flex gap-2">
          <input
            type="radio"
            id="nonBlocked"
            name="isBlocked"
            className='customer-filter-radio'
            value={false}
            {...register('isBlocked', {
              required: false
            })}
            onChange={radioChangehandler}
            checked={radioCheckedVal === 'false'}
          />
          <label htmlFor="nonBlocked">Show non-blocked users only</label>
        </div>
      </Form.Group>

      <Form.Group className="form-group mb-5">
        <Form.Label>Referral Code</Form.Label>
        <Form.Control
          type="text"
          name="referralCode"
          placeholder="Enter Referral Code"
          {...register('referralCode', {
            required: false
          })}
        />
      </Form.Group>

      <Form.Group className="form-group mb-5">
        <Form.Label>KYC Status</Form.Label>
        <Controller
          name="kycStatus"
          control={control}
          render={({ field: { onChange, value = [], ref } }) => (
            <Select
              ref={ref}
              value={value}
              className="react-select"
              classNamePrefix="select"
              options={kycStatusOptions}
              onChange={(e) => {
                onChange(e)
              }}
            />
          )}
        />
      </Form.Group>
    </Form>
  )
}
CustomerFilter.propTypes = {
  filterChange: PropTypes.func,
  requestParams: PropTypes.object,
  setRequestParams: PropTypes.func
}

export default CustomerFilter
