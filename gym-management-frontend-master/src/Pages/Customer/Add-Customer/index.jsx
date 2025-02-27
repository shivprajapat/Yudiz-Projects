/* eslint-disable no-unused-vars */
import React, { useRef, useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import { Row, Col } from 'react-bootstrap'
import Input from 'Components/Input'
import Wrapper from 'Components/wrapper'
import PageTitle from 'Components/Page-Title'
import { formatDate, isGranted, toaster } from 'helpers'
import './_addCustomer.scss'
import { route } from 'Routes/route'
import DescriptionInput from 'Components/DescriptionInput'
import Select from 'Components/Select'
import usePageType from 'Hooks/usePageType'
import { addCustomer, updateCustomer } from 'Query/Customer/customer.mutation'
import { getSpecificCustomer } from 'Query/Customer/customer.query'
import CalendarInput from 'Components/Calendar-Input'
import { getOrganizationList } from 'Query/Organization/organization.query'

function AddCustomer () {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { isAdd, isEdit, isViewOnly, id } = usePageType()
  const Gender = [
    { label: 'Male', value: 'M' },
    { label: 'Female', value: 'F' },
    { label: 'Other', value: 'O' },
  ]

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

  const { control, reset, handleSubmit, watch } = useForm()

  const onSubmit = (data) => {
    const addData = {
      ...data,
      eGender: data.eGender.value,
      iBranchId: data.iBranchId._id
    }

    if (isEdit) {
      updateMutation.mutate({ id, addData })
    } else {
      mutation.mutate({
        ...data,
        eGender: data.eGender.value,
        iBranchId: data?.iBranchId?._id,
        oBranch: {
          _id: data?.iBranchId?._id,
          sName: data?.iBranchId?.sName
        }
      })
    }
  }

  const { isLoading } = useQuery(['customersDetails', id], () => getSpecificCustomer(id), {
    enabled: isEdit || isViewOnly,
    select: (data) => data?.data?.customer,
    onSuccess: (data) => {
      data.eGender = Gender?.find((g) => g.value === data?.eGender)
      data.dBirthDate = formatDate(data.dBirthDate, '-', true)
      data.dAnniversaryDate = formatDate(data.dAnniversaryDate, '-', true) || ''
      data.iBranchId
      reset(data)
    },
  })

  const { data: organizationList } = useQuery('organizationList', () => getOrganizationList(), {
    enabled: isAdd || isEdit || isViewOnly,
    select: (data) => data.data.data.aOrganizationList,
    staleTime: 240000,
  })

  return (
    <Wrapper isLoading={isLoading || mutation.isLoading || updateMutation.isLoading}>
      <div className="pageTitle-head">
        <PageTitle
          title="Customer Details"
          cancelText="Cancel"
          BtnText={!isViewOnly ? 'Save' : null}
          handleButtonEvent={handleSubmit(onSubmit)}
          cancelButtonEvent={() => navigate(route.customers)}
        />
      </div>

      <Row className="mt-3">
        <Col lg={6} md={6} xs={12}>
          <Controller
            name="sName"
            control={control}
            rules={{ required: 'Customer Name is required' }}
            render={({ field, fieldState: { error } }) => (
              <Input {...field} labelText="Name" placeholder="Enter Name" id="sName" disabled={isViewOnly} errorMessage={error?.message} />
            )}
          />
        </Col>
        <Col lg={6} md={6} xs={12}>
          <Controller
            name="sEmail"
            control={control}
            rules={{ required: 'Email Id is required' }}
            render={({ field, fieldState: { error } }) => (
              <Input
                {...field}
                labelText="Email ID"
                placeholder="Enter Email"
                id="sEmail"
                disabled={isViewOnly}
                errorMessage={error?.message}
              />
            )}
          />
        </Col>
      </Row>

      <Row className="mt-xs-3">
        <Col lg={6} md={6} xs={12}>
          <Controller
            name="eGender"
            control={control}
            rules={{ required: 'Please select your Gender' }}
            render={({ field: { onChange, value, ref }, fieldState: { error } }) => (
              <Select
                labelText="Gender"
                id="eGender"
                placeholder="Select Gender"
                onChange={onChange}
                value={value}
                ref={ref}
                isDisabled={isViewOnly}
                errorMessage={error?.message}
                options={Gender}
              />
            )}
          />
        </Col>
        <Col lg={6} md={6} xs={12} className="mt-md-0">
          <Controller
            name="nAge"
            control={control}
            rules={{ required: 'Age is required', max: { value: 100, message: 'Age must not exceed 100' } }}
            render={({ field, fieldState: { error } }) => (
              <Input
                {...field}
                labelText="Age"
                type="number"
                onKeyDown={(e) => {
                  const exceptThisSymbols = ["e", "E", "+", "-", "."]
                  exceptThisSymbols.includes(e.key) && e.preventDefault()
                }}
                disabled={isViewOnly}
                placeholder="Enter the Age"
                id="nAge"
                errorMessage={error?.message}
              />
            )}
          />
        </Col>
      </Row>

      <Row className="mt-lg-2">
        <Col lg={6} md={6} xs={12}>
          <Row>
            <Col lg={12} md={12} xs={12}>
              <Controller
                name="sMobile"
                control={control}
                rules={{
                  required: 'Contact Number is required',
                  minLength: {
                    value: 10,
                    message: 'Contact Number must have atleast 10 digits'
                  }
                }}
                render={({ field, fieldState: { error } }) => (
                  <Input
                    {...field}
                    labelText="Contact Number"
                    type="number"
                    onKeyDown={(e) => {
                      const exceptThisSymbols = ["e", "E", "+", "-", "."]
                      exceptThisSymbols.includes(e.key) && e.preventDefault()
                    }}
                    placeholder="Enter Contact Number"
                    id="sMobile"
                    disabled={isViewOnly}
                    errorMessage={error?.message}
                  />
                )}
              />
            </Col>
          </Row>
        </Col>
        <Col lg={6} md={6} xs={12}>
          <Controller
            name="iBranchId"
            control={control}
            rules={{ required: 'Please select a Branch' }}
            render={({ field: { onChange, value, ref }, fieldState: { error } }) => (
              <>
                <Select
                  labelText="Branch"
                  id="iBranchId"
                  placeholder="Select Branch"
                  onChange={onChange}
                  value={value}
                  getOptionLabel={(option) => option?.sName}
                  getOptionValue={(option) => option?._id}
                  ref={ref}
                  isDisabled={isViewOnly}
                  errorMessage={error?.message}
                  options={organizationList}
                />
              </>
            )}
          />
        </Col>
      </Row>

      <Row className='mt-2 mt-lg-2'>
        <Col lg={12} md={12} xs={12}>
          <Controller
            name="sAddress"
            control={control}
            rules={{ required: 'Address is required' }}
            render={({ field, fieldState: { error } }) => (
              <>
                <DescriptionInput
                  className="p-2 text-dark"
                  label="Address"
                  errorMessage={error?.message}
                  disabled={isViewOnly}
                  placeholder="Enter Address"
                  {...field}
                />
              </>
            )}
          />
        </Col>
      </Row>

      <Row className="mt-2 mt-lg-2 mt-xs-3">
        <Col lg={6} md={6} xs={12}>
          <Controller
            name="dBirthDate"
            control={control}
            rules={{ required: 'Date of Birth is required' }}
            render={({ field: { ref, onChange, value }, fieldState: { error } }) => (
              <CalendarInput
                disabled={isViewOnly}
                onChange={onChange}
                value={value || (isViewOnly && new Date().toISOString().substring(0, 16))}
                ref={ref}
                errorMessage={error?.message}
                title="Date Of Birth"
              />
            )}
          />
        </Col>
        <Col lg={6} md={6} xs={12}>
          <Controller
            name="dAnniversaryDate"
            control={control}
            rules={{
              validate: (value) => {
                if (new Date(value) < new Date(new Date(watch('dBirthDate')).getFullYear() + 18, new Date(watch('dBirthDate')).getMonth(), new Date(watch('dBirthDate')).getDate())) {
                  return 'The Anniversary date must be 18 years after the Date of Birth.'
                }
                return true
              }
            }}
            render={({ field: { ref, onChange, value }, fieldState: { error } }) => (
              <CalendarInput
                disabled={isViewOnly}
                onChange={onChange}
                min={watch('dBirthDate')}
                value={value || (isViewOnly && new Date().toISOString().substring(0, 16))}
                ref={ref}
                errorMessage={error?.message}
                title="Anniversary Date"
              />
            )}
          />
        </Col>
      </Row>

      <Row>
        <Col lg={12} md={12} xs={12}>
          <Controller
            name="sFitnessGoal"
            control={control}
            rules={{ required: 'Fitness Goal is required' }}
            render={({ field, fieldState: { error } }) => (
              <>
                <DescriptionInput
                  className="p-2 text-dark"
                  label="Fitness Goal"
                  errorMessage={error?.message}
                  disabled={isViewOnly}
                  placeholder="Enter your Fitness Goal"
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

export default AddCustomer
