import React, { useState } from 'react'
import { route } from 'Routes/route'
import { Row, Col } from 'react-bootstrap'
import { useForm, Controller } from 'react-hook-form'
import { useNavigate, useParams } from 'react-router-dom'
import { useMutation, useQuery, useQueryClient } from 'react-query'

// component
import DescriptionInput from 'Components/DescriptionInput'
import CalendarInput from 'Components/Calendar-Input'
import PageTitle from 'Components/Page-Title'
import Divider from 'Components/Divider'
import Wrapper from 'Components/wrapper'
import Rating from 'Components/Rating'
import Select from 'Components/Select'
import Input from 'Components/Input'

// query
import { addEmployee, updateEmployee } from 'Query/Employee/employee.mutation'
import { getOrganizationList } from 'Query/Organization/organization.query'
import { getDesignation } from 'Query/Designation/designation.query'
import { getEmployeeById } from 'Query/Employee/employee.query'

//  icons
import { PiCurrencyInrBold } from 'react-icons/pi'
import Information from 'Assets/Icons/infoIcon'

// hook
import useInfiniteScroll from 'Hooks/useInfiniteScroll'
import usePageType from 'Hooks/usePageType'

// helper
import { Gender, UserType, calculateAge, formatDate, rules, toaster } from 'helpers'

import './_addEmployee.scss'


function AddEmployee() {
  const params = useParams()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const { isAdd, id, isEdit } = usePageType()
  const { control, reset, handleSubmit, watch, setValue } = useForm()

  const [organizationParams, setOrganizationParams] = useState({
    limit: 15,
    page: 0,
    next: false,
  })
  const [designationParams, setDesignationParams] = useState({
    limit: 15,
    page: 0,
    next: false,
  })

  const Type = [
    { label: 'Personal', value: 'Personal' },
    { label: 'General', value: 'General' },
  ]

  useQuery(['employeesDetails', id], () => getEmployeeById(id), {
    enabled: !!params?.id,
    select: (data) => data.data.employee,
    onSuccess: (data) => {
      reset({
        eUserType: UserType.find((item) => item?.value === data?.eUserType),
        sName: data?.sName,
        sEmail: data?.sEmail,
        eGender: Gender?.find((item) => item.value === data?.eGender),
        sMobile: data?.sMobile,
        dBirthDate: formatDate(data.dBirthDate, '-', true),
        dAnniversaryDate: data.dAnniversaryDate && formatDate(data.dAnniversaryDate, '-', true),
        sAddress: data?.sAddress,
        aBranchId: data?.aBranchId,
        sDesignation: { sTitle: data?.sDesignation },
        eType: Type?.find((g) => g.value === data?.eType),
        nExpertLevel: data?.nExpertLevel,
        sExperience: data?.sExperience,
        nCharges: data?.nCharges,
        nCommission: data?.nCommission
      })
    },
  })


  const {
    data: organizationList = [],
    handleScroll: handleScroll,
    handleSearch: handleSearch,
  } = useInfiniteScroll(['organizationList', id, isAdd, isEdit], () => getOrganizationList(organizationParams), {
    select: (data) => data.data.data.aOrganizationList,
    requestParams: organizationParams,
    updater: setOrganizationParams,
    onSuccess: (data) => {
      setValue('aBranchId', data?.filter((item) => !item?.isBranch))
    }
  })

  const {
    data: designationList = [],
    handleScroll: handleScrollDesignation,
    handleSearch: handleSearchDesignation,
  } = useInfiniteScroll(['designationList', id, isAdd, isEdit], () => getDesignation(designationParams), {
    select: (data) => data.data.data.aDesignationList,
    requestParams: designationParams,
    updater: setDesignationParams,
  })


  // post employee
  const mutation = useMutation(addEmployee, {
    onSuccess: (res) => {
      queryClient.invalidateQueries('employees')
      toaster(res.data.message)
      navigate(route.employees)
    },
  })

  //  update employee
  const updateMutation = useMutation(updateEmployee, {
    onSuccess: (res) => {
      queryClient.invalidateQueries('employees')
      toaster(res.data.message)
      navigate(route.employees)
    },
  })

  const onSubmit = (data) => {
    const { sName, sEmail, eGender, sMobile, dBirthDate, sAddress, aBranchId, dAnniversaryDate,
      sDesignation, eType, sExperience, nExpertLevel, nCharges, nCommission, eUserType } = data

    const newData = {
      sName,
      sEmail,
      sMobile,
      sAddress,
      nCharges,
      nAge: calculateAge(new Date(watch('dBirthDate'))),
      dBirthDate,
      nCommission,
      sExperience,
      nExpertLevel,
      dAnniversaryDate,
      eType: eType?.value,
      eGender: eGender?.value,
      eUserType: eUserType?.value,
      sDesignation: sDesignation?.sTitle,
      aBranchId: aBranchId?.map(item => item._id),
    }

    if (id) {
      updateMutation.mutate({
        id,
        newData
      })
    } else {
      mutation.mutate(newData)
    }
  }

  return (
    <Wrapper isLoading={mutation.isLoading || updateMutation.isLoading}>

      <PageTitle
        title={'Employee Details'}
        cancelText="Cancel"
        BtnText={id ? 'Update' : 'Save'}
        handleButtonEvent={handleSubmit(onSubmit)}
        cancelButtonEvent={() => navigate(route?.employees)}
      />

      <Divider className={'mt-2 mb-3'} />

      <Row className='mt-3'>
        <Col>
          <Controller
            name="eUserType"
            control={control}
            rules={rules?.select('Employee type')}
            render={({ field: { onChange, value, ref }, fieldState: { error } }) => (
              <Select
                labelText='Employee Type'
                isImportant='true'
                id="eUserType"
                placeholder="Select Employee Type"
                onChange={onChange}
                value={value}
                ref={ref}
                errorMessage={error?.message}
                options={UserType}
                isDisabled={!!params?.id}
              />
            )}
          />
        </Col>
      </Row>

      <Row className="mt-3">
        <Col lg={6} md={6} sm={6} xs={12}>
          <Controller
            name="sName"
            control={control}
            rules={rules?.global('Name')}
            render={({ field, fieldState: { error } }) => (
              <Input
                {...field}
                isImportant='true'
                labelText='Name'
                placeholder="Enter Name"
                id="sName"
                errorMessage={error?.message} />
            )}
          />
        </Col>
        <Col lg={6} md={6} sm={6} xs={12}>
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

      <Row className="mt-3">
        <Col lg={6} md={6} sm={6} xs={12}>
          <Controller
            name="eGender"
            control={control}
            rules={rules?.select('Gender')}
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
        <Col lg={6} md={6} sm={6} xs={12} className='mt-2 mt-lg-0 mt-md-0 mt-sm-0'>
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
                  isImportant='true'
                  labelText='Contact Number'
                  type="text"
                  placeholder="eg.: 9876543210"
                  id="sMobile"
                  errorMessage={error?.message}
                />
              )
            }
            }
          />
        </Col>
      </Row>

      <Row className='mt-3'>
        <Col lg={6} md={6} xs={12}>
          <Row>
            <Col lg={12} md={12} sm={6} xs={12} className='mt-2'>
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
                        // isImportant='true'
                        title='Date Of Birth'
                      />
                    </>
                  )
                }}
              />
            </Col>
            <Col lg={12} md={12} sm={6} xs={12} className='mt-1'>
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
        </Col>
        <Col lg={6} md={6} xs={12}>
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

      <Row className='mt-3'>
        <Col lg={6} md={6} sm={6} xs={12}>
          <Controller
            name="aBranchId"
            control={control}
            rules={rules?.select('Branch')}
            render={({ field: { onChange, value, ref }, fieldState: { error } }) => (
              <>
                <Select
                  labelText="Branch"
                  isImportant={true}
                  id="aBranchId"
                  placeholder="Select Branch"
                  onChange={onChange}
                  value={value}
                  getOptionLabel={(option) => option?.sName}
                  getOptionValue={(option) => option?._id}
                  ref={ref}
                  isMulti={true}
                  onInputChange={handleSearch}
                  fetchMoreData={handleScroll}
                  errorMessage={error?.message}
                  options={organizationList}
                />
              </>
            )}
          />
        </Col>
        <Col lg={6} md={6} sm={6} xs={12}>
          <Controller
            name="sDesignation"
            control={control}
            rules={rules?.select('Designation')}
            render={({ field: { onChange, value, ref }, fieldState: { error } }) => (
              <>
                <Select
                  labelText="Designation"
                  isImportant={true}
                  id="sDesignation"
                  placeholder="Select Designation"
                  onChange={onChange}
                  value={value}
                  getOptionLabel={(option) => option?.sTitle}
                  getOptionValue={(option) => option?._id}
                  ref={ref}
                  onInputChange={handleSearchDesignation}
                  fetchMoreData={handleScrollDesignation}
                  errorMessage={error?.message}
                  options={designationList}
                />
              </>
            )}
          />
        </Col>
      </Row>

      {watch('eUserType')?.value === 'T' && <>
        <Row className='mt-3'>

          <Col lg={6} md={6} sm={6} xs={12} className='mt-2 mt-lg-0 mt-md-0 mt-sm-0'>
            <Controller
              name="eType"
              control={control}
              rules={rules?.select('Trainer type')}
              render={({ field: { onChange, value, ref }, fieldState: { error } }) => (
                <Select
                  labelText='Trainer Type'
                  isImportant='true'
                  id="eType"
                  placeholder="Select Trainer Type"
                  onChange={onChange}
                  value={value}
                  ref={ref}
                  errorMessage={error?.message}
                  options={Type}
                />
              )}
            />
          </Col>

          <Col lg={6} md={6} sm={6} xs={12} className="mt-md-0">
            <Controller
              name="nCharges"
              control={control}
              rules={rules?.integer('Charges field')}
              render={({ field: { value, onChange, ref }, fieldState: { error } }) => {
                return (
                  <Input
                    startIcon={<PiCurrencyInrBold />}
                    ref={ref}
                    onChange={onChange}
                    value={value}
                    labelText='Charges'
                    isImportant='true'
                    type="number"
                    onKeyDown={(e) => {
                      const exceptThisSymbols = ["e", "E", "+", "-", "."]
                      exceptThisSymbols.includes(e.key) && e.preventDefault()
                    }}
                    placeholder="Enter Charges"
                    id="nCharges"
                    errorMessage={error?.message}
                  />
                )
              }
              }
            />
          </Col>

        </Row>

        <Row className="mt-3">

          <Col lg={6} md={6} xs={12} className="mt-md-0 mt-sm-2">
            <Controller
              name="sExperience"
              control={control}
              rules={rules?.global('Experience')}
              render={({ field, fieldState: { error } }) => (
                <Input
                  {...field}
                  info={<Information />}
                  tooltipContent={`If you have 1 year or more of experience, it will be displayed as 'x year(s)'. Similarly for 1 months or more of experience, it will be shown as 'x month(s)'. We value your expertise, so let us know your experience level accurately!`}
                  labelText='Experience'
                  isImportant='true'
                  placeholder="eg.: 1 year"
                  id="sExperience"
                  errorMessage={error?.message}
                />
              )}
            />
          </Col>

          <Col lg={6} md={6} sm={6} xs={12} className="mt-md-0">
            <Controller
              name="nCommission"
              control={control}
              rules={rules?.percentage('Commission field')}
              render={({ field: { ref, onChange, value }, fieldState: { error } }) => (
                <Input
                  ref={ref}
                  info={<Information />}
                  tooltipContent={`Commission must be entered as a value between 0 and 100. For example, if you want to set a commission rate of 15%, simply enter '15' in the commission field. Please do not include the percent symbol (%).`}
                  onChange={onChange}
                  value={value}
                  labelText='Commission'
                  isImportant='true'
                  type="number"
                  onKeyDown={(e) => {
                    const exceptThisSymbols = ["e", "E", "+", "-", "."]
                    exceptThisSymbols.includes(e.key) && e.preventDefault()
                  }}
                  max={100}
                  placeholder="eg.: 30"
                  id="nCommission"
                  errorMessage={error?.message}
                />
              )}
            />
          </Col>

        </Row>

        <Row className='mt-3 mb-3'>

          <Col lg={6} md={6} xs={12}>
            <Controller
              name="nExpertLevel"
              control={control}
              rules={rules?.select('Expert Level')}
              render={({ field: { onChange, value }, fieldState: { error } }) => (
                <div className="rating-container">
                  <label className="mb-1">Expert Level</label>
                  <Rating setFunction={(data) => onChange(data.eScore)} ratingCount={value} />
                  {error?.message && <p className="expertLevelErrorMessage">{error?.message}</p>}
                </div>
              )}
            />
          </Col>

        </Row>

      </>}
    </Wrapper>
  )
}

export default AddEmployee
