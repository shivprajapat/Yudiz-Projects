import React from 'react'

import { useMutation, useQuery, useQueryClient } from 'react-query'
import { useNavigate, useParams } from 'react-router-dom'
import { Controller, useForm } from 'react-hook-form'
import { Col, Row } from 'react-bootstrap'
import { route } from 'Routes/route'

// component
import DescriptionInput from 'Components/DescriptionInput'
import PageTitle from 'Components/Page-Title'
import Wrapper from 'Components/wrapper'
import Select from 'Components/Select'
import Input from 'Components/Input'

// query
import { addBatchSchedule, updateBatchSchedule } from 'Query/BatchSchedule/batchschedule.mutation'
import { getSpecificBatchSchedule } from 'Query/BatchSchedule/batchschedule.query'
import { getOrganizationList } from 'Query/Organization/organization.query'

// icons
import Information from 'Assets/Icons/infoIcon'

// hook
import usePageType from 'Hooks/usePageType'

//helper
import { convertTo12HourFormat, convertTo24HourFormat, detectBrowser, rules, toaster } from 'helpers'

import './_addBatchSchedule.scss'

function AddBatchSchedule() {

  const queryClient = useQueryClient()
  const { isAdd, id } = usePageType()
  const navigate = useNavigate()
  const params = useParams()

  const { control, reset, handleSubmit, setValue } = useForm()

  // get Batch By Id 
  const { isLoading } = useQuery(['batchschedulesDetails', id], () => getSpecificBatchSchedule(id), {
    enabled: !!params?.id,
    select: (data) => data.data.data,
    onSuccess: (data) => {
      reset({
        sTitle: data?.sTitle,
        sDescription: data?.sDescription,
        sStartTime: convertTo24HourFormat(data?.sStartTime),
        sEndTime: convertTo24HourFormat(data?.sEndTime),
        iBranchId: data?.oBranch,
      })
    },
  })

  const { data: organizationList } = useQuery('organizations', () => getOrganizationList(), {
    enabled: isAdd || !!params?.id,
    select: (data) => data.data.data.aOrganizationList,
    staleTime: 240000,
    onSuccess: (data) => {
      setValue('iBranchId', data?.find((item) => !item?.isBranch))
    }
  })

  const mutation = useMutation((data) => addBatchSchedule(data), {
    onSuccess: (data) => {
      queryClient.invalidateQueries('batchschedules')
      toaster(data.data.message)
      navigate(route.batchSchedules)
    },
  })

  const updateMutation = useMutation((data) => updateBatchSchedule(data), {
    onSuccess: (res) => {
      queryClient.invalidateQueries('batchschedules')
      queryClient.invalidateQueries('customers')
      queryClient.invalidateQueries(['customersDetails'], res)
      toaster(res.data.message)
      navigate(route.batchSchedules)
    },
  })

  const onSubmit = (data) => {
    data.sTitle = data?.sTitle?.toUpperCase()
    data.sStartTime = convertTo12HourFormat(data?.sStartTime)
    data.sEndTime = convertTo12HourFormat(data?.sEndTime)

    const addData = {
      ...data,
      iBranchId: data.iBranchId?._id,
      oBranch: data?.oBranch,
    }

    if (id) {
      updateMutation.mutate({ id, addData })
    } else {
      mutation.mutate({
        ...data,
        iBranchId: data?.iBranchId?._id,
        oBranch: {
          _id: data?.iBranchId?._id,
          sName: data?.iBranchId?.sName
        },
      })
    }
  }

  return (
    <>
      <Wrapper isLoading={isLoading || mutation.isLoading || updateMutation.isLoading}>
        <div className="pageTitle-head">
          <PageTitle
            title="Batch Schedule Details"
            cancelText="Cancel"
            BtnText={id ? 'Update' : 'Save'}
            handleButtonEvent={handleSubmit(onSubmit)}
            cancelButtonEvent={() => navigate(route.batchSchedules)}
          />
        </div>

        <Row className="mt-3">
          <Col lg={6} md={6} xs={12}>
            <Controller
              name="sTitle"
              control={control}
              rules={rules?.global('Title')}
              render={({ field, fieldState: { error } }) => (
                <Input
                  {...field}
                  labelText='Title'
                  isImportant='true'
                  placeholder="Enter Title"
                  id="sTitle"
                  errorMessage={error?.message}
                />
              )}
            />
          </Col>
          <Col lg={6} md={6} xs={12}>
            <Controller
              name="iBranchId"
              control={control}
              rules={rules?.select('Branch')}
              render={({ field: { onChange, value, ref }, fieldState: { error } }) => (
                <>
                  <Select
                    isImportant='true'
                    labelText='Branch'
                    id="iBranchId"
                    placeholder="Select Branch"
                    onChange={onChange}
                    value={value}
                    getOptionLabel={(option) => option?.sName}
                    getOptionValue={(option) => option?._id}
                    ref={ref}
                    errorMessage={error?.message}
                    options={organizationList}
                  />
                </>
              )}
            />
          </Col>
        </Row>

        <Row className="mt-xs-3">
          <Col lg={6} md={6} xs={12}>
            <Controller
              name="sStartTime"
              control={control}
              rules={rules?.global('Start Time')}
              render={({ field: { ref, onChange, value }, fieldState: { error } }) => {
                return (
                  <>
                    <Input
                      type='time'
                      ref={ref}
                      onChange={onChange}
                      info={detectBrowser() === 'Safari' && <Information />}
                      tooltipContent={detectBrowser() === 'Safari' && 'Kindly provide the Start time using the 24 hours format. For eg.: 1:00 PM will be displayed as 13:00'}
                      labelText='Start Time'
                      isImportant='true'
                      value={value}
                      placeholder="Enter Start Time"
                      id="sStartTime"
                      errorMessage={error?.message}
                    />
                  </>
                )
              }}
            />
          </Col>
          <Col lg={6} md={6} xs={12}>
            <Controller
              name="sEndTime"
              control={control}
              rules={rules?.global('End Time')}
              render={({ field: { ref, onChange, value }, fieldState: { error } }) => (
                <Input
                  type='time'
                  ref={ref}
                  onChange={onChange}
                  info={detectBrowser() === 'Safari' && <Information />}
                  tooltipContent={detectBrowser() === 'Safari' && 'Kindly provide the End time using the 24 hours format. For eg.: 1:00 PM will be displayed as 13:00'}
                  value={value}
                  labelText='End Time'
                  isImportant='true'
                  placeholder="Enter End Time"
                  id="sEndTime"
                  errorMessage={error?.message}
                />
              )}
            />
          </Col>
        </Row>

        <Row className=''>
          <Col lg={6} md={6} xs={12}>
            <Controller
              name="sDescription"
              control={control}
              rules={rules?.global('Description')}
              render={({ field, fieldState: { error } }) => (
                <>
                  <DescriptionInput
                    className="p-2 text-dark"
                    label='Description'
                    isImportant='true'
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
    </>
  )
}

export default AddBatchSchedule 
