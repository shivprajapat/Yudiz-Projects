import React, { useEffect, useMemo, useState } from 'react'
import CalendarInput from 'Components/Calendar-Input'
import DescriptionInput from 'Components/DescriptionInput'
import Input from 'Components/Input'
import PageTitle from 'Components/Page-Title'
import Select from 'Components/Select'
import Wrapper from 'Components/wrapper'
import usePageType from 'Hooks/usePageType'
import { addMealPlan, addMealSchedule, updateMealPlan, updateMealSchedule } from 'Query/MealPlan/mealplan.mutation'
import { route } from 'Routes/route'
import { formatDate, parseParams, toaster } from 'helpers'
import { Row, Col } from 'react-bootstrap'
import { Controller, useForm } from 'react-hook-form'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { getMealScheduleList, getSpecificMealPlan } from 'Query/MealPlan/mealplan.query'
import './_addMealPlan.scss'
import DynamicWeekSchedule from 'Components/DynamicWeeks'

function AddMealPlan () {
  const params = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const parsedData = parseParams(location.search)

  const queryClient = useQueryClient()
  const { isAdd, isEdit, id } = usePageType()

  const { control, reset, getValues, watch, handleSubmit } = useForm()
  const { control: controlMealSchedule, setValue: mealSetValue, reset: resetMealSchedule, handleSubmit: handleMealSchedule, watch: mealScheduleWatch, getValues: mealScheduleGetValues, resetField } = useForm()

  const [weeks, setWeeks] = useState({})
  const [copiedWeeks, setCopiedWeeks] = useState({})

  const [mealPlanId, setMealPlanId] = useState('')
  const [status, setStatus] = useState(false)

  function getParams () {
    return {
      iCustomerId: parsedData?.iCustomerId || params?.id,
    }
  }
  const requestParams = useMemo(() => getParams(), [])

  // get specific meal plan
  const { loading } = useQuery(['mealPlanDetail', id], () => getSpecificMealPlan(id), {
    enabled: !!id,
    select: (data) => data.data.oMealPlan,
    onSuccess: (data) => {
      reset({
        sTitle: data?.sTitle,
        dStartDate: formatDate(data?.dStartDate, '-', true),
        dEndDate: formatDate(data?.dEndDate, '-', true),
        sDescription: data?.sDescription,
        iCustomerId: data?.iCustomerId,
      })
    }
  })

  // get meal schedule list
  const { data: mealScheduleList } = useQuery(['mealScheduleDetail', params?.id, getValues('dEndDate')], () => getMealScheduleList({ iMealPlanId: params?.id, dFromDate: getValues('dStartDate'), dToDate: getValues('dEndDate') }), {
    enabled: !isAdd && !!getValues('dEndDate'),
    select: (data) => data.data.data,
    staleTime: 240000,
  })

  useEffect(() => {
    if (mealScheduleList) {
      DateCalculation()
    }
  }, [mealScheduleList, parsedData?.iCustomerId])

  // add Meal Plan Details
  const mutation = useMutation((data) => addMealPlan(data), {
    onSuccess: (data) => {
      setMealPlanId(data.data.data.iMealPlanId)
      queryClient.invalidateQueries('customers')
      queryClient.invalidateQueries('mealplans')
      toaster(data.data.message)
    },
  })

  // add Meal Schedule
  const { mutate: postMealSchedule } = useMutation((data) => addMealSchedule(data), {
    onSuccess: (data) => {
      // queryClient.invalidateQueries('customers')
      queryClient.invalidateQueries('mealplans')
      toaster(data.data.message)
      navigate(route.mealplans)
    },
  })

  // update meal plan details
  const { mutate: mutateUpdateMealPlan } = useMutation((data) => updateMealPlan(data), {
    onSuccess: (res) => {
      queryClient.invalidateQueries('mealplans')
      toaster(res.data.message)
      // navigate(route.mealplans)
      // navigate(`${route.mealPlansAddViewEdit('add')}?iCustomerId=${requestParams?.iCustomerId}`)
    },
  })

  // update Meal Schedule
  const { mutate: mutateUpdateMealSchedule } = useMutation((data) => updateMealSchedule(data), {
    onSuccess: (res) => {
      queryClient.invalidateQueries(['mealScheduleDetail'])
      queryClient.invalidateQueries(['mealplans'])
      toaster(res.data.message)
      navigate(route.mealplans)
      // navigate(`${route.mealPlansAddViewEdit('add')}?iCustomerId=${requestParams?.iCustomerId}`)
    },
  })

  const onSubmit = (data) => {

    const addData = {
      ...data,
      dStartDate: formatDate(data.dStartDate, '-', true),
      dEndDate: formatDate(data.dEndDate, '-', true),
      iCustomerId: requestParams?.iCustomerId,
      eType: 'C'
    }

    if (params?.id) {
      mutateUpdateMealPlan({
        id: params.id,
        sTitle: data.sTitle,
        sDescription: data.sDescription,
        iCustomerId: data.iCustomerId,
        dStartDate: data.dStartDate,
        dEndDate: data.dEndDate
      })
    } else {
      mutation.mutate({
        addData
      })
    }
    setStatus(false)
  }

  function handleCancel () {
    if (isEdit) {
      navigate(route.mealplans)
    } else {
      navigate(route.customersAddViewEdit('edit', parsedData?.iCustomerId))
    }
  }

  const onMealScheduleSubmit = (data) => {
    const aPlanDetails = []

    for (let key in data) {
      if (key.startsWith('sDescription')) {
        const dMealPlanDate = `dMealPlanDate-${key.split('-')[1]}-${key.split('-')[2]}-${key.split('-')[3]}`

        aPlanDetails.push({
          dMealPlanDate: data[dMealPlanDate],
          sDescription: data[key],
          iMealPlanId: mealPlanId || params?.id,
          id: mealScheduleList?.aMealPlan?.find(item => formatDate(item?.dMealPlanDate, '-', true) === data[dMealPlanDate])?._id
        })
      }
    }

    const addData = {
      aPlanDetails: aPlanDetails,
      iMealPlanId: mealPlanId || params?.id,
    }

    if (params?.id) {
      mutateUpdateMealSchedule({ addData })
      setWeeks({})
      reset({
        sTitle: '',
        // dStartDate: formatDate(result?.dStartDate, '-', true),
        // dEndDate: formatDate(result?.dEndDate, '-', true),
        sDescription: '',
        iCustomerId: mealPlanId
      })
      resetMealSchedule()
    } else {
      postMealSchedule(addData)
      setWeeks({})
      resetMealSchedule()
    }
  }

  function DateCalculation () {
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

    let tempWeek = 1
    const week = {}

    week[`week ${tempWeek}`] = []

    for (let date = new Date(watch('dStartDate')); date <= new Date(watch('dEndDate')); date.setDate(date.getDate() + 1)) {
      const dayName = dayNames[date.getDay()]
      const formattedDate = formatDate(date, '-', true)

      if (!week[`week ${tempWeek}`]) {
        week[`week ${tempWeek}`] = []
      }

      const mealPlanItem = mealScheduleList?.aMealPlan?.find(item => formatDate(item?.dMealPlanDate, '-', true) === formattedDate)
      const value = mealPlanItem?.sDescription

      week[`week ${tempWeek}`].push(
        {
          date: formattedDate,
          day: dayName,
          value: value
        }
      )

      if (date.getDay() === 6) {
        tempWeek += 1
      }
    }
    setWeeks(week)
  }

  useEffect(() => {
    const result = Object.keys(weeks)?.map((d, i) => ({ label: d, value: i + 1 }))
    const filterResult = result?.filter((item) => mealScheduleWatch('oWeeks')?.label !== item?.label)

    setCopiedWeeks(filterResult)
  }, [weeks, mealScheduleWatch('oWeeks')])

  return (
    <>
      <Wrapper isLoading={loading}>
        <div className="pageTitle-head">
          <PageTitle
            title="Meal Plan Details"
            cancelText="Cancel"
            BtnText={isEdit ? status === true && 'Update' : 'Save'}
            handleButtonEvent={handleSubmit(onSubmit)}
            cancelButtonEvent={() => handleCancel()}
          />
        </div>

        <Row className="mt-3">
          <Col lg={12} md={12} xs={12}>
            <Controller
              name="sTitle"
              control={control}
              rules={{ required: 'This field is required' }}
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
        </Row>

        <Row>
          <Col lg={5} md={5} sm={6} xs={12}>
            <Row>
              <Controller
                name="dStartDate"
                control={control}
                rules={{
                  required: 'Start Date is required', validate: (date) => {
                    if (new Date(getValues('dEndDate')) < new Date(date)) {
                      return 'Start Date must be less than End Date'
                    }
                  }
                }}
                render={({ field: { ref, onChange, value }, fieldState: { error } }) => (
                  <>
                    <CalendarInput
                      onChange={(e) => {
                        onChange(e)
                        DateCalculation()
                      }}
                      value={value}
                      ref={ref}
                      max={getValues('dEndDate')}
                      errorMessage={error?.message}
                      title='Start Date'
                      isImportant='true'
                    />
                  </>
                )}
              />
            </Row>
            <Row className='mt-2'>
              <Controller
                name="dEndDate"
                control={control}
                rules={{
                  required: 'End Date is required', validate: (date) => {
                    if (new Date(getValues('dStartDate')) > new Date(date)) {
                      return 'End Date must be greater than Start Date'
                    }
                  }
                }}
                render={({ field: { ref, onChange, value }, fieldState: { error } }) => (
                  <CalendarInput
                    onChange={(e) => {
                      onChange(e)
                      DateCalculation()
                      setStatus(true)
                    }}
                    min={getValues('dStartDate')}
                    value={value}
                    ref={ref}
                    errorMessage={error?.message}
                    title='End Date'
                    isImportant='true'
                  />
                )}
              />
            </Row>
          </Col>

          <Col lg={7} md={7} sm={6} xs={12}>
            <Controller
              name="sDescription"
              control={control}
              rules={{ required: 'Description is required' }}
              render={({ field, fieldState: { error } }) => (
                <DescriptionInput
                  className="p-2 text-dark"
                  label='Description'
                  isImportant='true'
                  errorMessage={error?.message}
                  placeholder="Enter Description"
                  {...field}
                />
              )}
            />
          </Col>
        </Row>
      </Wrapper>

      <Wrapper>
        <div className="pageTitle-head">
          <PageTitle
            title="Meal Plan Schedule"
            cancelText="Cancel"
            BtnText={isEdit ? status === false ? 'Update' : '' : mealPlanId !== '' && 'Save'}
            handleButtonEvent={handleMealSchedule(onMealScheduleSubmit)}
            cancelButtonEvent={() => handleCancel()}
          />
        </div>

        <Row className="mt-3">
          <Col lg={4} md={4} sm={6} xs={12}>
            <Controller
              name="oWeeks"
              control={controlMealSchedule}
              rules={{ required: 'This field is required' }}
              render={({ field: { onChange, value, ref }, fieldState: { error } }) => {
                const weekCount = Object.keys(weeks).map((d, i) => ({ label: d, value: i + 1 }))
                return (
                  <>
                    <Select
                      labelText='Weeks'
                      isImportant='true'
                      id="oWeeks"
                      placeholder="Select Weeks"
                      onChange={(e) => {
                        resetField('oCopy')
                        onChange(e)
                      }}
                      getOptionLabel={(option) => option.label}
                      getOptionValue={(option) => option.value}
                      value={value}
                      ref={ref}
                      errorMessage={error?.message}
                      options={weekCount}
                    />
                  </>
                )
              }}
            />
          </Col>
          {watch('dStartDate') && watch('dEndDate') &&
            <Col lg={4} md={4} sm={6} xs={12} className='mt-2 mt-lg-0 mt-md-0 mt-sm-0'>
              {Object.entries(weeks)?.length !== 1 &&
                <Controller
                  name="oCopy"
                  control={controlMealSchedule}
                  render={({ field: { onChange, value, ref }, fieldState: { error } }) => (
                    <>
                      <Select
                        labelText="Copy From"
                        id="oCopy"
                        placeholder="Select Weeks to Copy"
                        onChange={(e) => {
                          const sCurrentWeek = mealScheduleWatch('oWeeks')?.label
                          const aOldData = weeks?.[e?.label]?.map(item => ({
                            ...item,
                            value: mealScheduleGetValues(`sDescription-${formatDate(item.date, '-', false)}`)
                          }))

                          setWeeks({
                            ...weeks,
                            [sCurrentWeek]: weeks[sCurrentWeek]?.map((d) => {
                              const isAvailable = aOldData?.find((o) => o.day === d.day)
                              if (isAvailable) {
                                mealSetValue(`sDescription-${formatDate(d.date, '-', false)}`, isAvailable.value)
                                return { ...d, sDescription: isAvailable.value }
                              }
                              return d
                            })
                          })

                          onChange(e)
                        }}
                        getOptionLabel={(option) => option.label}
                        getOptionValue={(option) => option.value}
                        value={value || (value === undefined && '')}
                        ref={ref}
                        errorMessage={error?.message}
                        options={copiedWeeks}
                      />
                    </>
                  )}
                />
              }
            </Col>
          }
        </Row>

        <Row className='mt-3'>
          <Col lg={12} md={12} xs={12}>
            {weeks && weeks?.[mealScheduleWatch('oWeeks')?.label]?.map((item) => {
              return (
                <React.Fragment key={item.date}>
                  <DynamicWeekSchedule
                    item={item}
                    control={controlMealSchedule}
                    isAdd={isAdd}
                  />
                </React.Fragment>
              )
            })}
          </Col>
        </Row>
      </Wrapper>
    </>
  )
}

export default AddMealPlan

