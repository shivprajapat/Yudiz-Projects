import React, { useState } from 'react'

// component
import CalendarInput from 'Components/Calendar-Input'
import PageTitle from 'Components/Page-Title'
import CustomModal from 'Components/Modal'
import Wrapper from 'Components/wrapper'
import Divider from 'Components/Divider'
import Select from 'Components/Select'
import Button from 'Components/Button'
import Input from 'Components/Input'

// query
import { addSubscription, freezeSubscription, unfreezeSubscription } from 'Query/Subscription/subscription.mutation'
import { getSpecificSubscription } from 'Query/Subscription/subscription.query'
import { updateSubscription } from 'Query/Subscription/subscription.mutation'
import { getOrganizationList } from 'Query/Organization/organization.query'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import { getCustomerList } from 'Query/Customer/customer.query'
import { getEmployeeList } from 'Query/Employee/employee.query'

// icons
import { PiCurrencyInrBold } from 'react-icons/pi'
import Information from 'Assets/Icons/infoIcon'

// helper
import { formatDate, onlyDigits, rules, toaster } from 'helpers'

// hook
import useInfiniteScroll from 'Hooks/useInfiniteScroll'
import { useForm, Controller } from 'react-hook-form'
import usePageType from 'Hooks/usePageType'

import { useNavigate } from 'react-router-dom'
import { Row, Col } from 'react-bootstrap'
import { route } from 'Routes/route'
import './_addSubscription.scss'
import CustomToolTip from 'Components/TooltipInfo'

function AddSubscription() {

  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { isEdit, id } = usePageType()


  const { control, reset, handleSubmit, watch, setValue, setError, clearErrors } = useForm()
  const { control: controlStatus, handleSubmit: handleSubmitStatus, reset: resetStatus } = useForm()

  const [modal, setModal] = useState({ open: false, type: '' })
  // const [statusType, setStatusType] = useState()
  const [customerParams, setCustomerParams] = useState({
    limit: 15,
    page: 0,
    next: false,
  })
  const [trainerParams, setTrainerParams] = useState({
    limit: 15,
    page: 0,
    next: false,
    eUserType: 'T'
  })
  const [organizationParams, setOrganizationParams] = useState({
    limit: 15,
    page: 0,
    next: false,
  })

  // get Subscription by ID
  const { isLoading, data: specificSubscription } = useQuery(['subscriptionDetails', id], () => getSpecificSubscription(id), {
    enabled: !!id,
    select: (data) => data?.data?.subscription,
    onSuccess: (data) => {
      reset({
        iCustomerId: data?.oCustomer,
        iTrainerId: data?.oTrainer,
        iBranchId: data?.oBranch,
        nPaymentCycle: data?.nPaymentCycle,
        dStartDate: formatDate(data.dStartDate, '-', true),
        dEndDate: formatDate(data.dEndDate, '-', true),
        nCommission: data?.nCommission,
        nTrainerPrice: data?.nTrainerPrice,
        nSubscriptionPrice: data?.nSubscriptionPrice,
        nPrice: data?.nPrice,
      })
    },
  })

  // get Customer
  const {
    data: customerList = [],
    handleScroll: handleScroll,
    handleSearch: handleSearch,
  } = useInfiniteScroll(['customers', id], () => getCustomerList(customerParams), {
    select: (data) => data.data.data.aCustomerList,
    requestParams: customerParams,
    updater: setCustomerParams,
  })

  // get Trainer 
  const {
    data: TrainerList = [],
    handleScroll: handleScrollTrainer,
    handleSearch: handleSearchTrainer,
  } = useInfiniteScroll(['trainers', id], () => getEmployeeList(trainerParams), {
    select: (data) => data.data.data.aEmployeeList.filter(item => item?.eUserType === 'T'),
    requestParams: trainerParams,
    updater: setTrainerParams,
  })

  // get Branch
  const {
    data: OrganizationList = [],
    handleScroll: handleScrollOrganization,
    handleSearch: handleSearchOrganization,
  } = useInfiniteScroll(['organizations', id], () => getOrganizationList(organizationParams), {
    select: (data) => data.data.data.aOrganizationList,
    requestParams: organizationParams,
    updater: setOrganizationParams,
    onSuccess: (data) => {
      setValue('iBranchId', data?.find((item) => !item?.isBranch))
    }
  })

  // post subscription data
  const mutation = useMutation((data) => addSubscription(data), {
    onSuccess: (res) => {
      queryClient.invalidateQueries('subscription')
      toaster(res.data.message)
      navigate(route.subscriptions)
    },
  })

  // update subscription data
  const updateMutation = useMutation((data) => updateSubscription(data), {
    onSuccess: (res) => {
      queryClient.invalidateQueries('subscription')
      toaster(res.data.message)
      navigate(route.subscriptions)
    },
  })

  // freeze mutation
  const freeze = useMutation((data) => freezeSubscription(data), {
    onSuccess: (res) => {
      queryClient.invalidateQueries('subscriptionDetails')
      toaster(res.data.message)
      // navigate(route.subscriptions)
    },
  })

  // unFreeze mutation
  const unfreeze = useMutation((data) => unfreezeSubscription(data), {
    onSuccess: (res) => {
      queryClient.invalidateQueries('subscriptionDetails')
      toaster(res.data.message)
      // navigate(route.subscriptions)
    },
  })


  const onSubmit = (data) => {

    const { iCustomerId, iTrainerId, iBranchId, nPaymentCycle, dStartDate, dEndDate, nPrice, nTrainerPrice, nSubscriptionPrice, nCommission } = data

    const newData = {
      iCustomerId: iCustomerId?._id,
      iTrainerId: iTrainerId?._id,
      iBranchId: iBranchId?._id,
      nPaymentCycle,
      dStartDate,
      dEndDate,
      nCommission,
      nTrainerPrice,
      nSubscriptionPrice,
      nPrice
    }

    if (isEdit) {
      updateMutation.mutate({ id, newData })
    } else {
      mutation.mutate(newData)
    }
  }

  const handleStatus = (id, data) => {

    if (data === 'Y') {
      setModal({ open: true, type: 'Y' })
    }
    if (data === 'F') {
      setModal({ open: true, type: 'F' })
    }

  }

  const handleSave = (data) => {

    if (modal?.type === 'F') {
      const addData = {
        nDay: data?.nDay,
        iSubscriptionId: id
      }
      freeze.mutate(addData)
    }

    if (modal?.type === 'Y') {
      const addData = {
        dEndDate: data?.dEndDate,
        iSubscriptionId: id
      }
      unfreeze.mutate(addData)
    }
    // setStatusType(modal?.type)
    setModal({ open: false })
    resetStatus(data)
  }
  
  function dateDifference(date) {
    const date_data = new Date(date)
    const next_date = (date_data.setDate(date_data.getDate() + 15))
    return formatDate(next_date, '-', true)
  }

  return (
    <Wrapper isLoading={isLoading || mutation.isLoading || updateMutation.isLoading}>
      <div className="pageTitle-head">
        <PageTitle
          title={specificSubscription?.eStatus === 'E' ? <span>Subscription Details (<span className='expired'>Subscription has Expired</span>)</span> : 'Subscription Details'}
          cancelText="Cancel"
          BtnText={isEdit ? (specificSubscription?.eStatus !== 'E' ? 'Update' : '') : 'Save'}
          handleButtonEvent={handleSubmit(onSubmit)}
          cancelButtonEvent={() => navigate(route.subscriptions)}
        />
      </div>

      <Row className="mt-3">

        <Col lg={6} md={6} sm={6} xs={12}>
          <Controller
            name="iCustomerId"
            control={control}
            rules={{ required: 'Please select a Customer' }}
            render={({ field: { onChange, value, ref }, fieldState: { error } }) => (
              <Select
                labelText='Customer'
                isImportant={true}
                id="iCustomerId"
                placeholder="Select Customer"
                isDisabled={specificSubscription?.eStatus === 'E'}
                onChange={onChange}
                getOptionLabel={(option) => option.sName}
                getOptionValue={(option) => option._id}
                value={value}
                ref={ref}
                onInputChange={handleSearch}
                fetchMoreData={handleScroll}
                errorMessage={error?.message}
                options={customerList}
              />
            )}
          />
        </Col>

        <Col lg={6} md={6} sm={6} xs={12} className="mt-2 mt-lg-0 mt-sm-0 mt-md-0">
          <Controller
            name="iTrainerId"
            control={control}
            render={({ field: { onChange, value, ref }, fieldState: { error } }) => (
              <Select
                labelText='Trainer'
                isDisabled={specificSubscription?.eStatus === 'E'}
                id="iTrainerId"
                placeholder="Select Trainer"
                onChange={(e) => {
                  onChange(e)
                  setValue('nTrainerPrice', e?.nCharges)
                  setValue('nCommission', e?.nCommission)
                  setValue('nPrice', e?.nCharges + (+(watch('nSubscriptionPrice')) || 0))
                }}
                getOptionLabel={(option) => option.sName}
                getOptionValue={(option) => option._id}
                value={value}
                ref={ref}
                onInputChange={handleSearchTrainer}
                fetchMoreData={handleScrollTrainer}
                errorMessage={error?.message}
                options={TrainerList}
              />
            )}
          />
        </Col>

      </Row>

      <Row className='mt-2'>

        <Col lg={6} md={6} sm={6} xs={12}>
          <Controller
            name="dStartDate"
            control={control}
            rules={{ required: 'Start Date is required' }}
            render={({ field: { ref, onChange, value }, fieldState: { error } }) => (
              <CalendarInput
                onChange={onChange}
                value={value}
                ref={ref}
                max={watch('dEndDate')}
                disabled={specificSubscription?.eStatus === 'E'}
                errorMessage={error?.message}
                title='Start Date'
                isImportant={true}
              />
            )}
          />
        </Col>

        <Col lg={6} md={6} sm={6} xs={12}>
          <Controller
            name="dEndDate"
            control={control}
            rules={{ required: 'End Date is required' }}
            render={({ field: { ref, onChange, value }, fieldState: { error } }) => (
              <CalendarInput
                onChange={onChange}
                value={value}
                ref={ref}
                min={dateDifference(watch('dStartDate'))}
                disabled={specificSubscription?.eStatus === 'E'}
                errorMessage={error?.message}
                title='End Date'
                isImportant={true}
              />
            )}
          />
        </Col>

      </Row>

      <Row>

        <Col lg={6} md={6} sm={6} xs={12} className="mt-2 mt-lg-2 mt-md-2 mt-sm-2">
          <Controller
            name="iBranchId"
            control={control}
            rules={{ required: 'Please select a Branch' }}
            render={({ field: { onChange, value, ref }, fieldState: { error } }) => (
              <Select
                labelText='Branch'
                isImportant={true}
                id="iBranchId"
                isDisabled={specificSubscription?.eStatus === 'E'}
                placeholder="Select Branch"
                onChange={onChange}
                getOptionLabel={(option) => option.sName}
                getOptionValue={(option) => option._id}
                value={value}
                ref={ref}
                onInputChange={handleSearchOrganization}
                fetchMoreData={handleScrollOrganization}
                errorMessage={error?.message}
                options={OrganizationList}
              />
            )}
          />
        </Col>

        <Col lg={6} md={6} sm={6} xs={12} className="mt-2 mt-lg-2 mt-md-2 mt-sm-2">
          <Controller
            name="nPaymentCycle"
            control={control}
            rules={{ required: 'Payment cycle field is required' }}
            render={({ field: { ref, onChange, value }, fieldState: { error } }) => {
              return (
                <Input
                  ref={ref}
                  onChange={(e) => {
                    const inputValue = e.target.value

                    const startYear = new Date(watch('dStartDate')).getFullYear()
                    const endYear = new Date(watch('dEndDate')).getFullYear()
                    const startMonth = new Date(watch('dStartDate')).getMonth()
                    const endMonth = new Date(watch('dEndDate')).getMonth()

                    const MonthCycle = (endYear - startYear) * 12 + (endMonth - startMonth)

                    if (!inputValue || onlyDigits.test(inputValue) && !inputValue.startsWith('-') && !inputValue.startsWith('0') && !inputValue.startsWith('.') && !isNaN(MonthCycle)) {
                      if (Number(inputValue) <= MonthCycle) {
                        clearErrors('nPaymentCycle')
                        onChange(e)
                      }
                      else {
                        setError('nPaymentCycle', {
                          type: 'manual',
                          message: (isNaN(MonthCycle)) ? 'Please select the Start and End Dates.' : (MonthCycle === 1 && Number(inputValue) > MonthCycle || (inputValue > 1 && MonthCycle === 0)) ? 'You can only add 1 month.' : (MonthCycle > 1 && inputValue > MonthCycle) && `You can enter Payment cycle between 1 to ${MonthCycle} months.`
                        })
                      }
                      onChange(e)
                    } else {
                      setError('nPaymentCycle', {
                        type: 'manual',
                        message: (isNaN(MonthCycle)) ? 'Please select the Start and End Dates.' : 'Invalid Payment Cycle.'
                      })
                    }
                  }}
                  value={value}
                  labelText='Payment Cycle'
                  isImportant={true}
                  type="text"
                  info={<Information />}
                  tooltipContent={`"Please specify the number of months for your subscription plan. For instance, if you have a 1-year subscription, indicate the number of months for which you would like to make payments."`}
                  placeholder="eg: 2"
                  id="nPaymentCycle"
                  disabled={specificSubscription?.eStatus === 'E'}
                  errorMessage={error?.message}
                />
              )
            }}
          />
        </Col>

      </Row>
      {
        watch('iTrainerId') &&
        <Row>

          <Col lg={6} md={6} sm={6} xs={12}>
            <Controller
              name='nCommission'
              control={control}
              rules={{
                max: {
                  value: 100,
                  message: 'Commission must be from 0 - 100%'
                }
              }}
              render={({ field: { ref, onChange, value }, fieldState: { error } }) => {
                return (
                  <Input
                    value={value}
                    onChange={onChange}
                    ref={ref}
                    labelText='Commission'
                    placeholder="eg: 5"
                    info={<Information />}
                    tooltipContent={`Commission must be entered as a value between 0 and 100. For example, if you want to set a commission rate of 15%, simply enter '15' in the commission field. Please do not include the percent symbol (%).`}
                    id={'nCommission'}
                    disabled={watch('iTrainerId') ? false : true}
                    errorMessage={error?.message}
                    type={'number'}
                  />
                )
              }}
            />
          </Col>


          <Col lg={6} md={6} sm={6} xs={12}>
            <Controller
              name='nTrainerPrice'
              control={control}
              render={({ field: { ref, onChange, value } }) => {
                return (
                  <Input
                    type={'number '}
                    value={value}
                    onChange={(e) => {
                      onChange(e)
                      setValue('nPrice', +e.target.value + (+(watch('nSubscriptionPrice') || 0)))
                    }}
                    ref={ref}
                    labelText='Trainer Price'
                    placeholder="eg: 15000"
                    id={'nTrainerPrice'}
                    startIcon={<PiCurrencyInrBold />}
                    disabled={watch('iTrainerId') ? false : true}
                  />
                )
              }}
            />
          </Col>

        </Row>
      }


      <Row>

        <Col lg={6} md={6} sm={6} xs={12}>
          <Controller
            name="nSubscriptionPrice"
            control={control}
            rules={rules?.global('Subscription Price')}
            render={({ field: { value, onChange, ref }, fieldState: { error } }) => {
              return (
                <Input
                  ref={ref}
                  onChange={(e) => {
                    onChange(e)
                    setValue('nPrice', +(e.target.value) + (+watch('nTrainerPrice') || 0))
                  }}
                  value={value}
                  labelText={'Subscription Price'}
                  isImportant={true}
                  type="number"
                  onKeyDown={(e) => {
                    const exceptThisSymbols = ["e", "E", "+", "-", "."]
                    exceptThisSymbols.includes(e.key) && e.preventDefault()
                  }}
                  placeholder="eg: 15000"
                  id="nSubscriptionPrice"
                  info={<Information />}
                  disabled={specificSubscription?.eStatus === 'E'}
                  tooltipContent={`Please enter the Price without any space or any special character like ',' or '/', so that we can manage price properly.`}
                  errorMessage={error?.message}
                  startIcon={<PiCurrencyInrBold />}
                />
              )
            }
            }
          />
        </Col>
        {
          watch('iTrainerId') &&

          <Col lg={6} md={6} sm={6} xs={12}>
            <Controller
              name='nPrice'
              control={control}
              render={({ field: { ref, onChange, value } }) => {
                return (
                  <Input
                    value={value}
                    onChange={onChange}
                    ref={ref}
                    labelText='Price'
                    placeholder="eg: 15000"
                    id={'nPrice'}
                    startIcon={<PiCurrencyInrBold />}
                    info={<Information />}
                    tooltipContent={`Price = Trainer Price + Subscription Price`}
                    disabled
                  />
                )
              }}
            />
          </Col>
        }
      </Row>

      {id && specificSubscription?.eStatus !== 'E' &&
        <>
          <Divider width={'155%'} height="1px" />
          <Row className='mt-3'>
            <Col lg={12} md={12} xs={12}>
              <CustomToolTip tooltipContent={'you can freeze days from today to until unFreeze '} position='top'>
                {({ target }) => (
                  <span
                    className='info-icon'
                    ref={target}
                  >
                    <label className='freeze-label'> Freeze Status</label> <Information />
                  </span>
                )}
              </CustomToolTip>

              <div className='d-flex flex-nowrap flex-row gap-2'>
                {specificSubscription?.eStatus === 'F' ?
                  <Button className='mt-3 bg-warning' onClick={() => handleStatus(id, 'Y')}>Un-Freeze</Button>
                  : <Button className='mt-3 bg-danger' onClick={() => handleStatus(id, 'F')}>Freeze</Button>
                }
              </div>
            </Col>
          </Row>

          <CustomModal modalBodyClassName="p-0 py-2" open={modal.open} handleClose={() => setModal({ open: false, type: modal?.type })} title={modal?.type === 'Y' ? 'Un-Freeze Subscription' : 'Freeze Subscription'}>
            <div className='d-flex flex-column'>
              <Row>
                {modal?.type === 'Y' ?
                  <Col lg={6} md={6} sm={6} xs={12}>
                    <Controller
                      name="dEndDate"
                      control={controlStatus}
                      rules={{ required: 'End Date is required' }}
                      render={({ field: { ref, onChange, value }, fieldState: { error } }) => (
                        <CalendarInput
                          onChange={onChange}
                          value={value}
                          ref={ref}
                          min={watch('dEndDate')}
                          errorMessage={error?.message}
                          title='End Date'
                        />
                      )}
                    />
                  </Col> :
                  <Col lg={6} md={6} sm={6} xs={12}>
                    <Controller
                      name="nDay"
                      control={controlStatus}
                      rules={rules?.global('Subscription Freezing Day field')}
                      render={({ field: { ref, onChange, value }, fieldState: { error } }) => {
                        return (
                          <Input
                            ref={ref}
                            onChange={onChange}
                            value={value}
                            labelText='Day(s)'
                            type="number"
                            // info={<Information />}
                            // tooltipContent={`Please enter the number of Day(s) corresponding to your subscription plan. For example, if you want to freeze your Subscription for 30 days, enter '30' in this field.`}
                            placeholder="eg: 30"
                            id="nDay"
                            errorMessage={error?.message}
                          />
                        )
                      }}
                    />
                  </Col>}
                <Col lg={6} md={6} sm={6} xs={12} className='mt-4 text-end'>
                  <Button className="bg-secondary bg-lighten-xl me-2 text-muted" onClick={() => setModal({ open: false, type: modal?.type })}>
                    Cancel
                  </Button>
                  <Button type='submit' onClick={handleSubmitStatus(handleSave)}>
                    Save
                  </Button>
                </Col>
              </Row>
              <div className="mt-4 text-end">
              </div>
            </div>
          </CustomModal>
        </>
      }
    </Wrapper>
  )
}

export default AddSubscription
