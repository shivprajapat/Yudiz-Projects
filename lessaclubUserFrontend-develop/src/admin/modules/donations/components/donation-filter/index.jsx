import React, { useEffect } from 'react'
import { Button, Form } from 'react-bootstrap'
import { Controller, useForm } from 'react-hook-form'
import Select from 'react-select'
import PropTypes from 'prop-types'
import { useSearchParams } from 'react-router-dom'
import { getQueryVariable } from 'shared/utils'

const DonationFilter = ({ filterChange, setRequestParams }) => {
  const { control, handleSubmit, reset, setValue } = useForm({ mode: 'onChange' })

  // eslint-disable-next-line no-unused-vars
  const [searchParams, setSearchParams] = useSearchParams()
  const payoutStatus = getQueryVariable('payoutStatus')
  const payoutOptions = [
    { label: 'Pending', value: 'PENDING' },
    { label: 'Success', value: 'PAYMENT_SUCCESS' }
  ]

  useEffect(() => {
    if (payoutStatus) {
      setValue(
        'payoutStatus',
        payoutOptions.find((option) => option.value === payoutStatus)
      )
    }
  }, [])

  const onSubmit = (data) => {
    filterChange(data)
  }

  const onReset = () => {
    reset({
      payoutStatus: ''
    })
    setSearchParams('')
    setRequestParams({ page: 1, perPage: 10 })
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
        <Form.Label>Payout Status</Form.Label>
        <Controller
          name="payoutStatus"
          control={control}
          render={({ field: { onChange, value = [], ref } }) => (
            <Select
              ref={ref}
              value={value}
              className="react-select"
              classNamePrefix="select"
              options={payoutOptions}
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
DonationFilter.propTypes = {
  filterChange: PropTypes.func,
  setRequestParams: PropTypes.func
}

export default DonationFilter
