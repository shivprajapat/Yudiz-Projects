import React, { useState } from 'react'

// component
import DescriptionInput from 'Components/DescriptionInput'
import CalendarInput from 'Components/Calendar-Input'
import PageTitle from 'Components/Page-Title'
import Wrapper from 'Components/wrapper'
import Select from 'Components/Select'
import Input from 'Components/Input'

// query
import { getSpecificSubscription, getSubscriptionList } from 'Query/Subscription/subscription.query'
import { getSpecificTransaction } from 'Query/Transaction/transaction.query'
import { addTransaction } from 'Query/Transaction/transaction.mutation'
import { useMutation, useQuery, useQueryClient } from 'react-query'

// icons
import { PiCurrencyInrBold } from 'react-icons/pi'

// hook
import useInfiniteScroll from 'Hooks/useInfiniteScroll'
import { useForm, Controller } from 'react-hook-form'
import usePageType from 'Hooks/usePageType'

// helper
import { formatDate, rules, toaster } from 'helpers'

import { useNavigate } from 'react-router-dom'
import { Row, Col } from 'react-bootstrap'
import { route } from 'Routes/route'
import './_addTransaction.scss'

function AddTransaction() {

  const { id, isAdd, isViewOnly } = usePageType()
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  const { control, reset, handleSubmit, watch, setError, clearErrors } = useForm()


  const [subscriptionParams, setSubscriptionParams] = useState({
    limit: 15,
    page: 0,
    next: false,
    ePaymentStatus: 'P'
  })

  // get transaction By ID
  const { isLoading, data: specificTransaction } = useQuery(['transactionDetails', id], () => getSpecificTransaction(id), {
    enabled: !!id,
    select: (data) => data?.data?.data,
    onSuccess: (data) => {
      data.dTransactionDate = formatDate(data.dTransactionDate, '-', true)
      data.iSubscriptionId = data.oSubscription
      reset(data)
    },
  })

  // get subscription by ID
  const { data: specificSubscription } = useQuery(['subscriptionDetails', specificTransaction?.oSubscription?._id, watch('iSubscriptionId')?._id], () => getSpecificSubscription(specificTransaction?.oSubscription?._id || watch('iSubscriptionId')?._id), {
    enabled: !!specificTransaction?.oSubscription?._id || !!watch('iSubscriptionId')?._id,
    select: (data) => data.data.subscription,
  })

  // get subscription
  const {
    data: subscriptionList = [],
    handleScroll: handleScroll,
    handleSearch: handleSearch,
  } = useInfiniteScroll(['subscription', id, isAdd], () => getSubscriptionList(subscriptionParams), {
    select: (data) => data.data.data.aSubscriptionList,
    requestParams: subscriptionParams,
    updater: setSubscriptionParams,
  })

  // post subscription
  const mutation = useMutation((data) => addTransaction(data), {
    onSuccess: (res) => {
      queryClient.invalidateQueries('transaction')
      queryClient.invalidateQueries('subscription')
      toaster(res.data.message)
      navigate(route.transactions)
    },
  })

  const onSubmit = (data) => {
    data.iSubscriptionId = data.iSubscriptionId?._id || data?.oSubscription?._id
    data.iTrainerId = data.iTrainerId?._id
    data.nPrice = parseInt(data.nPrice)
    // data.iCustomerId = data?.iCustomerId
    mutation.mutate(data)
  }

  return (
    <Wrapper isLoading={isLoading || mutation.isLoading}>
      <div className='pageTitle-head'>
        <PageTitle
          title="Transaction Details"
          cancelText="Cancel"
          BtnText={isViewOnly ? '' : specificSubscription?.nPrice === specificSubscription?.nPaidAmount ? '' : 'Save'}
          handleButtonEvent={handleSubmit(onSubmit)}
          cancelButtonEvent={() => navigate(route.transactions)}
        />
      </div>
      {
        watch('iSubscriptionId') &&
        <div className='payment-detail'>
          <button className='btn btn-sm btn-secondary'>Total: {specificSubscription ? specificSubscription?.nPrice : '0'}</button>
          <button className='btn btn-sm btn-success'>Paid: {specificSubscription ? specificSubscription?.nPaidAmount : '0'}</button>
          <button className='btn btn-sm btn-danger'>Remain: {specificSubscription ? (specificSubscription?.nPrice - specificSubscription?.nPaidAmount) : '0'}</button>
        </div>
      }


      <Row className="">
        <Col lg={12} md={12} xs={12}>
          <Controller
            name="iSubscriptionId"
            control={control}
            rules={rules?.select('Subscription')}
            render={({ field: { onChange, value, ref }, fieldState: { error } }) => (
              <>
                <Select
                  labelText={'Subscription'}
                  isImportant={isViewOnly ? false : true}
                  id="iSubscriptionId"
                  placeholder="Select Subscription"
                  isDisabled={isViewOnly}
                  onChange={onChange}
                  getOptionLabel={(option) => (
                    <>
                      {option?.oCustomer?.sName} <span className="ms-4 text-success">{formatDate(option?.dStartDate)}</span> to{' '}
                      <span className="text-danger"> {formatDate(option?.dEndDate)}</span>
                    </>
                  )}
                  getOptionValue={(option) => option._id}
                  value={value}
                  ref={ref}
                  onInputChange={handleSearch}
                  fetchMoreData={handleScroll}
                  errorMessage={error?.message}
                  options={subscriptionList}
                />
              </>
            )}
          />
        </Col>
      </Row>
      <Row className="mt-3">
        <Col lg={6} md={6} sm={6} xs={12}>
          <Controller
            name="dTransactionDate"
            control={control}
            rules={rules?.global('Transaction Date')}
            render={({ field: { ref, onChange, value }, fieldState: { error } }) => (
              <CalendarInput
                onChange={onChange}
                value={value}
                ref={ref}
                disabled={isViewOnly || (specificSubscription?.nPrice === specificSubscription?.nPaidAmount)}
                min={formatDate(watch('iSubscriptionId')?.dStartDate, '-', true)}
                max={formatDate(watch('iSubscriptionId')?.dEndDate, '-', true)}
                errorMessage={error?.message}
                title='Transaction Date'
                isImportant={isViewOnly ? false : true}
              />
            )}
          />
        </Col>

        <Col lg={6} md={6} sm={6} xs={12}>
          <Controller
            name="nPrice"
            control={control}
            rules={{
              required: 'Transaction amount is required',
            }}
            render={({ field: { onChange, value, ref }, fieldState: { error } }) => {
              const regex = /^([0-9]*)$/
              return (
                <Input
                  startIcon={<PiCurrencyInrBold />}
                  labelText='Transaction Amount'
                  isImportant={isViewOnly ? false : true}
                  id="nPrice"
                  disabled={isViewOnly || (specificSubscription?.nPrice === specificSubscription?.nPaidAmount)}
                  placeholder="Add Transaction Amount"
                  type="text"
                  onChange={(e) => {
                    const inputValue = Number(e.target.value)

                    if (specificSubscription?.nPrice === specificSubscription?.nPaidAmount) {
                      setError('nPrice', {
                        type: 'manual',
                        message: 'Subscription Payment already completed.'
                      })
                    } else {
                      clearErrors('nPrice')
                      onChange(e)
                    }

                    const remain = specificSubscription?.nPrice - specificSubscription?.nPaidAmount

                    if (inputValue === '' || regex.test(inputValue)) {
                      clearErrors('nPrice')
                      if (inputValue > remain) {
                        setError('nPrice', {
                          type: 'manual',
                          message: `Remain to pay transaction amount ${remain}/-`
                        })
                      }
                    } else {
                      setError('nPrice', {
                        type: 'manual',
                        message: 'Invalid Transaction Amount.'
                      })
                    }
                    onChange(e)
                  }}
                  value={value}
                  ref={ref}
                  errorMessage={error?.message}
                />
              )
            }}
          />
        </Col>
      </Row>

      <Row>
        <Col lg={12} md={12} xs={12}>
          <Controller
            name="sDescription"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <>
                <DescriptionInput
                  className="p-2 text-dark"
                  label="Description"
                  disabled={isViewOnly || (specificSubscription?.nPrice === specificSubscription?.nPaidAmount)}
                  errorMessage={error?.message}
                  placeholder="Enter Description"
                  {...field}
                />
              </>
            )}
          />
        </Col>
      </Row>
    </Wrapper>
  )
}

export default AddTransaction
