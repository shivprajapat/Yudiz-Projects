import React, { useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { useNavigate, useParams } from 'react-router-dom'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import { Row, Col } from 'react-bootstrap'
import Input from 'Components/Input'
import Wrapper from 'Components/wrapper'
import PageTitle from 'Components/Page-Title'
import Rating from 'Components/Rating'
import { Gender, formatDate, toaster } from 'helpers'
import { route } from 'Routes/route'
import DescriptionInput from 'Components/DescriptionInput'
import Select from 'Components/Select'
import usePageType from 'Hooks/usePageType'
import { getSpecificTrainer } from 'Query/Trainer/trainer.query'
import './_addTrainer.scss'
import { addTrainer, updateTrainer } from 'Query/Trainer/trainer.mutation'
import CalendarInput from 'Components/Calendar-Input'
import { getOrganizationList } from 'Query/Organization/organization.query'
import { ReactComponent as SearchIcon } from 'Assets/Icons/search.svg'

function AddTrainer () {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const params = useParams()
  const { isEdit, isAdd, id } = usePageType()

  const [age, setAge] = useState(null)

  const Type = [
    { label: 'Personal', value: 'Personal' },
    { label: 'General', value: 'General' },
  ]

  // const eUserType = [
  //   { label: 'Trainer', value: 'T' },
  //   { label: 'Staff', value: 'S' },
  // ]

  const mutation = useMutation((data) => addTrainer(data), {
    onSuccess: (res) => {
      queryClient.invalidateQueries('trainer')
      toaster(res.data.message)
      navigate(route.trainers)
    },
  })
  const updateMutation = useMutation((data) => updateTrainer(data), {
    onSuccess: (res) => {
      queryClient.invalidateQueries('trainer')
      toaster(res.data.message)
      navigate(route.trainers)
    },
  })

  const { control, reset, handleSubmit, watch, setError, clearErrors } = useForm()

  const onSubmit = (data) => {
    data.aBranchId = data.aBranchId.map(item => item._id)
    data.eGender = data.eGender.value
    data.eType = data.eType.value
    // data.aBranchId = data

    if (data?.dAnniversaryDate === "") {
      data.dAnniversaryDate = undefined
    }

    if (id) {
      updateMutation.mutate({ id, data })
    } else {
      mutation.mutate({ ...data, eUserType: 'T', nAge: age })
    }
  }

  const { isLoading } = useQuery(['trainersDetails', id], () => getSpecificTrainer(id), {
    enabled: !!params?.id,
    select: (data) => data.data.employee,
    onSuccess: (data) => {
      data.eGender = Gender?.find((g) => g.value === data?.eGender)
      data.eType = Type?.find((g) => g.value === data?.eType)
      data.dBirthDate = formatDate(data.dBirthDate, '-', true)
      data.dAnniversaryDate = data.dAnniversaryDate ? formatDate(data.dAnniversaryDate, '-', true) : undefined
      reset(data)
    },
  })

  const { data: organizationList } = useQuery('organizationList', () => getOrganizationList(), {
    enabled: isAdd || !!id,
    select: (data) => data.data.data.aOrganizationList,
    staleTime: 240000,
  })

  return (
    <Wrapper isLoading={isLoading || mutation.isLoading || updateMutation.isLoading}>
      <PageTitle
        title="Trainer Details"
        cancelText="Cancel"
        BtnText={'Save'}
        handleButtonEvent={handleSubmit(onSubmit)}
        cancelButtonEvent={() => navigate(route.trainers)}
      />
      <Row className="mt-3">
        <Col lg={6} md={6} xs={12}>
          <Controller
            name="sName"
            control={control}
            rules={{ required: 'Trainer name is required' }}
            render={({ field, fieldState: { error } }) => (
              <Input {...field} labelText="Name" placeholder="Enter Name" id="sName" errorMessage={error?.message} />
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
                errorMessage={error?.message}
                options={Gender}
              />
            )}
          />
        </Col>
        <Col lg={6} md={6} xs={12}>
          <Controller
            name="aBranchId"
            control={control}
            render={({ field: { onChange, value, ref }, fieldState: { error } }) => (
              <>
                <Select
                  labelText="Branch"
                  id="aBranchId"
                  placeholder="Select Branch"
                  onChange={onChange}
                  value={value}
                  getOptionLabel={(option) => option?.sName}
                  getOptionValue={(option) => option?._id}
                  ref={ref}
                  isMulti={true}
                  errorMessage={error?.message}
                  options={organizationList}
                />
              </>
            )}
          />
        </Col>
        {/* {isViewOnly &&
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
                  placeholder="Enter the Age"
                  id="nAge"
                  errorMessage={error?.message}
                />
              )}
            />
          </Col>
        } */}
      </Row>
      <Row className="mt-lg-2 mt-2">
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
                    message: 'Contact Number must have 10 digits'
                  }
                }}
                render={({ field: { value, onChange, ref }, fieldState: { error } }) => {
                  const regex = /^(\+?[0-9()\s.-]*)$/
                  return (
                    <Input
                      ref={ref}
                      onChange={(e) => {
                        const inputValue = e.target.value

                        if (inputValue === '' || regex.test(inputValue)) {
                          clearErrors('sMobile')
                          onChange(e)
                        } else {
                          setError('sMobile', {
                            type: 'manual',
                            message: 'Mobile must be in digits'
                          })
                        }
                      }}
                      // pattern={/^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/}
                      value={value}
                      labelText="Contact Number"
                      type="text"
                      onKeyDown={(e) => {
                        const exceptThisSymbols = ["e", "E", "+", "-", "."]
                        exceptThisSymbols.includes(e.key) && e.preventDefault()
                      }}
                      placeholder="Enter Contact Number"
                      id="sMobile"
                      errorMessage={error?.message}
                    />
                  )
                }
                }
              />
            </Col>
            <Col lg={12} md={12} xs={12}>
              <Controller
                name="eType"
                control={control}
                rules={{ required: 'Please select the Trainer type' }}
                render={({ field: { onChange, value, ref }, fieldState: { error } }) => (
                  <Select
                    labelText="Type"
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
          </Row>
        </Col>
        <Col lg={6} md={6} xs={12}>
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
                  placeholder="Enter Address"
                  {...field}
                />
              </>
            )}
          />
        </Col>
      </Row>
      <Row className="mt-xs-3 mt-lg-3">
        <Col lg={6} md={6} xs={12}>
          <Controller
            name="nExpertLevel"
            control={control}
            rules={{ required: 'Please select the Expert Level' }}
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <div className="rating-container">
                <label className="mb-1">Expert Level</label>
                <Rating setFunction={(data) => onChange(data.eScore)} ratingCount={value} />
                {error?.message && <p className="errorMessage my-2">{error?.message}</p>}
              </div>
            )}
          />
        </Col>
        <Col lg={6} md={6} xs={12} className="mt-md-0">
          <Controller
            name="sExperience"
            control={control}
            rules={{ required: 'Experience is required' }}
            render={({ field, fieldState: { error } }) => (
              <Input
                {...field}
                labelText="Experience"
                placeholder="eg.: 1 year"
                id="sExperience"
                errorMessage={error?.message}
              />
            )}
          />
        </Col>
      </Row>
      <Row>
        <Col lg={6} md={6} xs={12} className="mt-md-0">
          <Controller
            name="nCharges"
            control={control}
            rules={{ required: 'Charges field is required' }}
            render={({ field: { value, onChange, ref }, fieldState: { error } }) => {
              return (
                <Input
                  startIcon={<SearchIcon />}
                  ref={ref}
                  onChange={(e) => {
                    const inputValue = e.target.value
                    const onlyDigits = /^[0-9]*$/

                    if (inputValue === '' || onlyDigits.test(inputValue)) {
                      clearErrors('nCharges')
                      onChange(e)
                    } else {
                      setError('nCharges', {
                        type: 'manual',
                        message: 'Charges must be in digits'
                      })
                    }
                  }}
                  value={value}
                  labelText="Charges"
                  type="text"
                  onKeyDown={(e) => {
                    const exceptThisSymbols = ["e", "E", "+", "-", "."]
                    exceptThisSymbols.includes(e.key) && e.preventDefault()
                  }}
                  placeholder="Enter Charges"
                  id="nCharges"
                  errorMessage={error?.message}
                />
              )}
            }
          />
        </Col>
        <Col lg={6} md={6} xs={12} className="mt-md-0">
          <Controller
            name="nCommission"
            control={control}
            rules={{
              required: 'Commission field is required',
              max: {
                value: 100,
                message: 'Commission must be from 0 - 100%'
              }
            }}
            render={({ field: { ref, onChange, value }, fieldState: { error } }) => (
              <Input
                ref={ref}
                onChange={(e) => {
                  const inputValue = e.target.value
                  const onlyDigits = /^[0-9]*$/

                  if (inputValue === '' || onlyDigits.test(inputValue)) {
                    clearErrors('nCommission')
                    onChange(e)
                  } else {
                    setError('nCommission', {
                      type: 'manual',
                      message: 'Commission must be in digits'
                    })
                  }
                }}
                value={value}
                labelText="Commission"
                type="text"
                onKeyDown={(e) => {
                  const exceptThisSymbols = ["e", "E", "+", "-", "."]
                  exceptThisSymbols.includes(e.key) && e.preventDefault()
                }}
                max={100}
                placeholder="eg.: 30%"
                id="nCommission"
                errorMessage={error?.message}
              />
            )}
          />
        </Col>
      </Row>
      <Row>
        <Col lg={6} md={6} xs={12} className="mt-md-0">
          <Controller
            name="dBirthDate"
            control={control}
            rules={{
              required: 'Date of Birth is required',
              validate: () => {
                if (age < 18) {
                  return 'Minimum Age Requirement Not Met.'
                }
              }
            }}
            render={({ field: { ref, onChange, value }, fieldState: { error } }) => {
              const dateDiff = new Date().getFullYear() - 17
              const date = new Date(dateDiff, 0, 1)

              const ageDiff = Date.now() - new Date(watch('dBirthDate')).getTime()
              const ageDate = new Date(ageDiff)
              const age = Math.ceil(ageDate / (24 * 60 * 60 * 1000 * 365.25))
              setAge(age)
              
              return (
                <CalendarInput
                  onChange={onChange}
                  value={value || (isEdit && new Date().toISOString().substring(0, 16))}
                  ref={ref}
                  max={date.toISOString().split('T')[0]}
                  errorMessage={error?.message}
                  title="Date Of Birth"
                />
              )
            }}
          />
        </Col>
        <Col lg={6} md={6} xs={12} className="mt-md-0">
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
    </Wrapper>
  )
}

export default AddTrainer
