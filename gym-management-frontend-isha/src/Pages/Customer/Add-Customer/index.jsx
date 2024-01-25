import React, { useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { useNavigate, useParams } from 'react-router-dom'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import { Row, Col } from 'react-bootstrap'
import Input from 'Components/Input'
import Wrapper from 'Components/wrapper'
import PageTitle from 'Components/Page-Title'
import { Gender, calculateAge, formatDate, rules, toaster } from 'helpers'
import './_addCustomer.scss'
import { route } from 'Routes/route'
import DescriptionInput from 'Components/DescriptionInput'
import Select from 'Components/Select'
import usePageType from 'Hooks/usePageType'
import { addCustomer, updateCustomer } from 'Query/Customer/customer.mutation'
import { getSpecificCustomer } from 'Query/Customer/customer.query'
import CalendarInput from 'Components/Calendar-Input'
import { getOrganizationList } from 'Query/Organization/organization.query'
import { getBatchScheduleList } from 'Query/BatchSchedule/batchschedule.query'
import Information from 'Assets/Icons/infoIcon'
import useInfiniteScroll from 'Hooks/useInfiniteScroll'
// import Button from 'Components/Button'
// import InterviewEditor from 'Components/Editor'

function AddCustomer() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const params = useParams()

  const { isAdd, isEdit, id } = usePageType()
  const { control, reset, handleSubmit, watch, resetField, setValue } = useForm()

  const [organizationParams, setOrganizationParams] = useState({
    limit: 15,
    page: 0,
    next: false,
  })

  const [batchScheduleParams, setBatchScheduleParams] = useState({
    limit: 15,
    page: 0,
    next: false,
  })

  const { isLoading } = useQuery(['customersDetails', id], () => getSpecificCustomer(id), {
    enabled: !!params?.id,
    select: (data) => data.data.data,
    onSuccess: (data) => {
      reset({
        sName: data?.sName,
        sEmail: data?.sEmail,
        iBranchId: data?.oBranch,
        iBatchScheduleId: data?.oBranch ? data?.oBatchSchedule : undefined,
        sMobile: data?.sMobile,
        sAddress: data?.sAddress,
        sFitnessGoal: data?.sFitnessGoal,
        eGender: Gender?.find((g) => g?.value === data?.eGender),
        dBirthDate: formatDate(data.dBirthDate, '-', true),
        dAnniversaryDate: data.dAnniversaryDate ? formatDate(data.dAnniversaryDate, '-', true) : undefined,
        bIsLifeCycleAdded: data.bIsLifeCycleAdded
      })
    },
  })

  const {
    data: organizationList = [],
    handleScroll: handleOrganizationScroll,
    handleSearch: handleOrganizationSearch,
  } = useInfiniteScroll(['organizationList', id, isAdd, isEdit], () => getOrganizationList(organizationParams), {
    select: (data) => data.data.data.aOrganizationList,
    requestParams: organizationParams,
    updater: setOrganizationParams,
    onSuccess: (data) => {
      setValue('iBranchId', data?.find((item) => !item?.isBranch))
    }
  })

  const {
    data: batchList = [],
    handleScroll: handleScroll,
    handleSearch: handleSearch,
  } = useInfiniteScroll(['batchList', id, isAdd, isEdit, watch('iBranchId')], () => getBatchScheduleList(batchScheduleParams), {
    select: (data) => data.data.data.aBatchSchedule?.filter(item => item?.oBranch?._id === watch('iBranchId')?._id),
    requestParams: batchScheduleParams,
    updater: setBatchScheduleParams,
  })

  const mutation = useMutation((data) => addCustomer(data), {
    onSuccess: (data) => {
      queryClient.invalidateQueries('customers')
      toaster(data.data.message)
      navigate(route.customers)
    },
  })

  const updateMutation = useMutation((data) => updateCustomer(data), {
    onSuccess: (res) => {
      queryClient.invalidateQueries('customers')
      toaster(res.data.message)
      navigate(route.customers)
    },
  })

  const onSubmit = (data) => {
    if (data?.dAnniversaryDate === "") {
      data.dAnniversaryDate = undefined
    }
    const addData = {
      ...data,
      sName: data.sName,
      sEmail: data.sEmail,
      sMobile: data.sMobile,
      eGender: data.eGender.value,
      sAddress: data.sAddress,
      dBirthDate: data.dBirthDate,
      dAnniversaryDate: data.dAnniversaryDate,
      iBranchId: data.iBranchId._id,
      iBatchScheduleId: data?.iBatchScheduleId?._id,
      oBranch: data?.oBranch,
      oBatchSchedule: data?.oBatchSchedule,
      nAge: calculateAge(new Date(watch('dBirthDate')))
    }

    if (id) {
      updateMutation.mutate({ id, addData })
    } else {
      mutation.mutate({
        ...data,
        eGender: data.eGender.value,
        iBranchId: data?.iBranchId?._id,
        oBranch: {
          _id: data?.iBranchId?._id,
          sName: data?.iBranchId?.sName
        },
        nAge: calculateAge(new Date(watch('dBirthDate'))),
        iBatchScheduleId: data?.iBatchScheduleId?._id
      })
    }
  }

  // function addLifeCycle () {
  //   if (specificCustomer?.bIsLifeCycleAdded === true) {
  //     navigate(`${route.lifeCyclesAddViewEdit('edit', id)}`, { state: id })
  //   } else {
  //     navigate(`${route.lifeCyclesAddViewEdit('add')}?iCustomerId=${id}`, { state: id })
  //   }
  // }

  // function addMealPlan() {
  //   navigate(`${route.mealPlansAddViewEdit('add')}?iCustomerId=${id}`, { state: id })
  // }

  return (
    <Wrapper isLoading={isLoading || mutation.isLoading || updateMutation.isLoading}>
      <div className="pageTitle-head">
        <PageTitle
          title="Customer Details"
          cancelText="Cancel"
          BtnText={id ? 'Update' : 'Save'}
          handleButtonEvent={handleSubmit(onSubmit)}
          cancelButtonEvent={() => navigate(route.customers)}
        />
      </div>

      <Row className="mt-3">
        <Col lg={6} md={6} sm={6} xs={12}>
          <Controller
            name="sName"
            control={control}
            rules={rules?.global('Customer Name')}
            render={({ field, fieldState: { error } }) => (
              <Input
                {...field}
                labelText='Name'
                isImportant='true'
                placeholder="Enter Name"
                id="sName"
                errorMessage={error?.message}
              />
            )}
          />
        </Col>
        <Col lg={6} md={6} sm={6} xs={12}>
          <Controller
            name="sEmail"
            control={control}
            rules={rules?.global('Email')}
            render={({ field, fieldState: { error } }) => (
              <Input
                {...field}
                labelText='Email'
                isImportant='true'
                placeholder="eg.: example@gmail.com"
                id="sEmail"
                errorMessage={error?.message}
              />
            )}
          />
        </Col>
      </Row>

      <Row className="mt-xs-3">
        <Col lg={6} md={6} xs={12}>
          <Row>
            <Col lg={12} md={12} sm={6} xs={12}>
              <Controller
                name="iBranchId"
                control={control}
                rules={rules?.select('Branch')}
                render={({ field: { onChange, value, ref }, fieldState: { error } }) => (
                  <>
                    <Select
                      labelText='Branch'
                      isImportant='true'
                      id="iBranchId"
                      placeholder="Select Branch"
                      onChange={(e) => {
                        resetField('iBatchScheduleId', { defaultValue: '' })
                        onChange(e)
                      }}
                      value={value}
                      getOptionLabel={(option) => option?.sName}
                      getOptionValue={(option) => option?._id}
                      ref={ref}
                      onInputChange={handleOrganizationScroll}
                      fetchMoreData={handleOrganizationSearch}
                      errorMessage={error?.message}
                      options={organizationList}
                    />
                  </>
                )}
              />
            </Col>
            <Col lg={12} md={12} sm={6} xs={12} className='mt-2 mt-lg-3 mt-md-3 mt-sm-0'>
              <Controller
                name="eGender"
                control={control}
                rules={rules?.global('Gender')}
                render={({ field: { onChange, value, ref }, fieldState: { error } }) => (
                  <Select
                    labelText='Gender'
                    isImportant='true'
                    id="eGender"
                    placeholder="Select Gender"
                    onChange={onChange}
                    value={value}
                    ref={ref}
                    errorMessage={error?.message}
                    options={Gender}
                  />
                )}
              />
            </Col>
          </Row>
        </Col>
        <Col lg={6} md={6} xs={12} className='mt-2 mt-lg-0 mt-md-0'>
          <Controller
            name="sAddress"
            control={control}
            rules={rules?.global('Address')}
            render={({ field, fieldState: { error } }) => (
              <>
                <DescriptionInput
                  className="p-2 text-dark"
                  label='Address'
                  isImportant='true'
                  errorMessage={error?.message}
                  placeholder="Enter Address"
                  {...field}
                />
              </>
            )}
          />
        </Col>
      </Row>

      <Row className="mt-lg-2 mt-2">
        <Col lg={6} md={6} sm={6} xs={12} className="mt-md-0">
          <Controller
            name="sMobile"
            control={control}
            rules={rules?.contact('Contact number')}
            render={({ field: { value, onChange, ref }, fieldState: { error } }) => {
              return (
                <Input
                  ref={ref}
                  info={<Information />}
                  tooltipContent='Please make sure to enter your phone number without any country code, spaces or special characters like brackets or dashes. Keeping the number in a continuous sequence will help us reach you more effectively.'
                  onChange={onChange}
                  value={value}
                  labelText='Contact Number'
                  isImportant='true'
                  type="number"
                  placeholder="eg.: 9876543210"
                  id="sMobile"
                  errorMessage={error?.message}
                />
              )
            }
            }
          />
        </Col>
        <Col lg={6} md={6} sm={6} xs={12}>
          <Controller
            name="iBatchScheduleId"
            control={control}
            rules={rules?.select('Batch schedule')}
            render={({ field: { onChange, value, ref }, fieldState: { error } }) => (
              <>
                <Select
                  labelText='Batch'
                  info='(Please select the Branch First)'
                  isImportant='true'
                  id="iBatchScheduleId"
                  placeholder="Select Batch Schedule"
                  onChange={onChange}
                  value={value || (value === undefined && '')}
                  isDisabled={!watch('iBranchId')}
                  getOptionLabel={(option) => <>
                    {option?.sTitle} <span className="ms-4 text-success">{option?.sStartTime}</span> to <span className="text-danger">{option?.sEndTime}</span>
                  </>}
                  getOptionValue={(option) => option?._id}
                  ref={ref}
                  onInputChange={handleSearch}
                  fetchMoreData={handleScroll}
                  errorMessage={error?.message}
                  options={batchList}
                />
              </>
            )}
          />
        </Col>
      </Row>

      <Row className="mt-2 mt-lg-0 mt-xs-3">
        <Col lg={6} md={6} sm={6} xs={12}>
          <Controller
            name="dBirthDate"
            control={control}
            rules={{            
              validate: () => {
                if (calculateAge(new Date(watch('dBirthDate'))) < 18) {
                  return 'Minimum Age Requirement Not Met.'
                }
              }
            }}
            render={({ field: { ref, onChange, value }, fieldState: { error } }) => {
              const dateDiff = new Date().getFullYear() - 17
              const date = new Date(dateDiff, 0, 1)
              return (
                <>
                  <CalendarInput
                    onChange={onChange}
                    value={value}
                    ref={ref}
                    max={date.toISOString().split('T')[0]}
                    errorMessage={error?.message}
                    title='Date Of Birth'
                    // isImportant='true'
                  />
                </>
              )
            }}
          />
        </Col>
        <Col lg={6} md={6} sm={6} xs={12}>
          <Controller
            name="dAnniversaryDate"
            control={control}
            rules={{
              validate: (value) => {
                if (new Date(value) < new Date(new Date(watch('dBirthDate')).getFullYear() + 17, new Date(watch('dBirthDate')).getMonth(), new Date(watch('dBirthDate')).getDate())) {
                  return 'The Anniversary date must be 18 years after the Date of Birth.'
                }
                return true
              }
            }}
            render={({ field: { ref, onChange, value }, fieldState: { error } }) => (
              <CalendarInput
                onChange={onChange}
                min={watch('dBirthDate')}
                value={value}
                ref={ref}
                errorMessage={error?.message}
                title="Anniversary Date"
              />
            )}
          />
        </Col>
      </Row>

      <Row className='mb-3 mt-3'>
        <Col lg={12} md={12} sm={12}>
          <Controller
            name="sFitnessGoal"
            control={control}
            rules={rules?.global('fitness goal')}
            render={({ field, fieldState: { error } }) => (
              <>
                <DescriptionInput
                  className="p-2 text-dark"
                  label='Fitness Goal'
                  isImportant='true'
                  errorMessage={error?.message}
                  placeholder="Enter Fitness Goal"
                  {...field}
                />
              </>
            )}
          />
        </Col>
      </Row>

      {/* {id &&
        <>
          <Row className='mt-3'>
            <Col lg={12} md={12} xs={12}>
              <div className="pageTitle-head">
                <PageTitle
                  title="Functionality"
                />
              </div>
              <div className='d-flex flex-nowrap flex-row gap-2'>
                {specificCustomer?.bIsLifeCycleAdded === true ?
                  <Button className='mt-3 bg-warning' onClick={addLifeCycle}>Edit Life Cycle</Button>
                  : <Button className='mt-3 bg-success' onClick={addLifeCycle}>Add Life Cycle</Button>
                }
                <Button className='mt-3' onClick={addMealPlan}>Add Meal Plan</Button>
              </div>
            </Col>
          </Row>
        </>
      } */}
    </Wrapper>
  )
}

export default AddCustomer
