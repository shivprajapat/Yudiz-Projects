import React, { useContext } from 'react'

import { useMutation, useQuery, useQueryClient } from 'react-query'
import { Controller, useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { Col, Row } from 'react-bootstrap'
import { rules, toaster } from 'helpers'
import { route } from 'Routes/route'

// component
import PageTitle from 'Components/Page-Title'
import Wrapper from 'Components/wrapper'
import Input from 'Components/Input'

// query
import { addOrganization, updateOrganization } from 'Query/Organization/organization.mutation'
import { getSpecificOrganization } from 'Query/Organization/organization.query'

// icons
import Information from 'Assets/Icons/infoIcon'

// hook
import usePageType from 'Hooks/usePageType'

import { userContext } from 'context/user'
import './_addOrganization.scss'

function AddOrganization() {

  const navigate = useNavigate()
  const { isEdit, id } = usePageType()
  const queryClient = useQueryClient()
  const { state } = useContext(userContext)

  const { control, reset, handleSubmit } = useForm()

  const { isLoading } = useQuery(['organizationsDetails', id], () => getSpecificOrganization(id), {
    enabled: isEdit,
    select: (data) => data.data.organization,
    onSuccess: (data) => {
      reset({
        sName: data?.sName,
        sEmail: data?.sEmail,
        iOrganizationId: data?.iOrganizationId,
        sMobile: data?.sMobile,
        sSecondaryMobile: data?.sSecondaryMobile,
        sLocation: data?.sLocation,
        sLogo: data.sLogo ? data.sLogo : undefined
      })
    },
  })

  const mutation = useMutation((data) => addOrganization(data), {
    onSuccess: (data) => {
      queryClient.invalidateQueries('organizations')
      toaster(data.data.message)
      navigate(route.organizations)
    },
  })

  const updateMutation = useMutation((data) => updateOrganization(data), {
    onSuccess: (res) => {
      queryClient.invalidateQueries('organizations')
      queryClient.invalidateQueries('batchschedules')
      queryClient.invalidateQueries(['batchschedulesDetails'], res)
      queryClient.invalidateQueries('employees')
      queryClient.invalidateQueries(['employeesDetails'], res)
      queryClient.invalidateQueries('trainer')
      queryClient.invalidateQueries(['trainersDetails'], res)
      queryClient.invalidateQueries('customers')
      queryClient.invalidateQueries(['customersDetails'], res)
      toaster(res.data.message)
      navigate(route.organizations)
    },
  })

  const onSubmit = (data) => {
    if (data?.sLogo === "") {
      data.sLogo = undefined
    }
    const addData = {
      ...data,
      sName: data.sName,
      sEmail: data.sEmail,
      sLogo: data?.sLogo,
      sMobile: data.sMobile,
      sSecondaryMobile: data.sSecondaryMobile,
      sLocation: data.sLocation,
      iOrganizationId: state?.user?.iOrganizationId?._id
    }

    if (id) {
      updateMutation.mutate({ id, addData })
    } else {
      mutation.mutate({
        addData
      })
    }
  }

  return (
    <>
      <Wrapper isLoading={isLoading || mutation.isLoading || updateMutation.isLoading}>
        <div className="pageTitle-head">
          <PageTitle
            title="Organization Details"
            cancelText="Cancel"
            BtnText={id ? 'Update' : 'Save'}
            handleButtonEvent={handleSubmit(onSubmit)}
            cancelButtonEvent={() => navigate(route.organizations)}
          />
        </div>

        <Row className="mt-3">
          <Col lg={6} md={6} xs={12}>
            <Controller
              name="sName"
              control={control}
              rules={rules?.global('Organization name')}
              render={({ field, fieldState: { error } }) => (
                <Input
                  {...field}
                  labelText='Name'
                  placeholder="Enter Name"
                  id="sName"
                  isImportant='true'
                  errorMessage={error?.message}
                />
              )}
            />
          </Col>
          <Col lg={6} md={6} xs={12}>
            <Controller
              name="sEmail" 
              control={control}
              rules={rules?.email('Email')}
              render={({ field, fieldState: { error } }) => (
                <Input
                  {...field}
                  isImportant='true'
                  labelText='Email'
                  placeholder="eg.: example@gmail.com"
                  id="sEmail"
                  errorMessage={error?.message}
                />
              )}
            />
          </Col>
        </Row>

        <Row className="mt-lg-2 mt-2">
          <Col lg={6} md={6} xs={12} className="mt-md-0">
            <Controller
              name="sMobile"
              control={control}
              rules={rules?.contact('Contact Number')}
              render={({ field: { value, onChange, ref }, fieldState: { error } }) => {
                return (
                  <Input
                    ref={ref}
                    info={<Information />}
                    tooltipContent='Please make sure to enter your phone number without any country code, spaces or special characters like brackets or dashes. Keeping the number in a continuous sequence will help us reach you more effectively.'
                    onChange={onChange}
                    value={value}
                    isImportant='true'
                    labelText='Contact Number'
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
          <Col lg={6} md={6} xs={12}>
            <Controller
              name="sSecondaryMobile"
              control={control}
              rules={rules?.contact('Secondary Contact Number')}
              render={({ field: { value, onChange, ref }, fieldState: { error } }) => {
                return (
                  <Input
                    ref={ref}
                    info={<Information />}
                    tooltipContent='Please make sure to enter your phone number without any country code, spaces or special characters like brackets or dashes. Keeping the number in a continuous sequence will help us reach you more effectively.'
                    onChange={onChange}
                    value={value}
                    isImportant='true'
                    labelText='Secondary Contact Number'
                    type="number"
                    placeholder="eg.: 9876543210"
                    id="sSecondaryMobile"
                    errorMessage={error?.message}
                  />
                )
              }
              }
            />
          </Col>
        </Row>

        <Row>
          <Col lg={6} md={6} xs={12}>
            <Controller
              name="sLocation"
              control={control}
              rules={rules?.global('Location')}
              render={({ field, fieldState: { error } }) => (
                <Input
                  {...field}
                  isImportant='true'
                  labelText='Location'
                  placeholder="Enter Location"
                  id="sLocation"
                  errorMessage={error?.message}
                />
              )}
            />
          </Col>
        </Row>
      </Wrapper>
    </>
  )
}

export default AddOrganization 
