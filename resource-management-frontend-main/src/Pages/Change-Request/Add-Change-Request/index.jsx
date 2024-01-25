import React, { useState, useRef } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { useNavigate, useParams } from 'react-router-dom'
import { useMutation, useQuery } from 'react-query'
import { Row, Col, Table } from 'react-bootstrap'
import { getCrDetails, getProjectDepartments } from 'Query/CR/cr.query'
import { getProjectEmployees, addCr, updateCr } from 'Query/CR/cr.mutation'
import Input from 'Components/Input'
import Wrapper from 'Components/wrapper'
import PageTitle from 'Components/Page-Title'
import Select from 'Components/Select'
import CalendarInput from 'Components/Calendar-Input'
import Divider from 'Components/Divider'
import ActionColumn from 'Components/ActionColumn'
import useInfiniteScroll from 'Hooks/useInfiniteScroll'
import useResourceDetails from 'Hooks/useResourceDetails'
import { countDiff, countHoursEquality, handleErrors, onlyInt, projectStatus, toaster } from 'helpers'
import { route } from 'Routes/route'
import '../../Dashboard/_dashboard.scss'

export default function AddChangeRequest() {
  const navigate = useNavigate()
  const { type, id } = useParams()
  const editMode = type === 'edit' && id
  const { control, handleSubmit, watch, setError, setValue, reset, getValues } = useForm()
  const aProjectBaseDepartments = watch('aProjectBaseDepartments')
  const aProjectBaseEmployee = watch('aProjectBaseEmployee')
  const iProjectId = watch('iProjectId')

  const [depWiseEmployee, setDepWiseEmployee] = useState([])
  const requestParams = useRef({
    page: 0,
    limit: 10,
    isMore: false,
  })

  function setRequestParams(data) {
    requestParams.current = data
  }

  const getEmployeeFromDepartment = useMutation(getProjectEmployees, {
    onSuccess: (data) => {
      const emp = data?.data?.data?.employee
      setRequestParams({ ...requestParams.current, isMore: emp?.length === requestParams.current.limit })
      if (requestParams.current.page > 0) {
        setDepWiseEmployee([...depWiseEmployee, ...emp])
      } else {
        setDepWiseEmployee(emp || [])
        removeNotQualifiedEmployees()
      }
    },
    onError: () => {},
  })

  function removeNotQualifiedEmployees() {
    const newValue = []
    for (let emp of getValues('aProjectBaseEmployee')) {
      const isExist = !!getValues('aProjectBaseDepartments')?.find((dep) => dep.iDepartmentId === emp.iDepartmentId)
      if (isExist) {
        newValue.push(emp)
      }
    }
    setValue('aProjectBaseEmployee', newValue)
  }

  useQuery(['getCrDetails', id], () => getCrDetails(id), {
    enabled: !!id,
    select: (data) => data.data.data.cr,
    onSuccess: (data) => {
      reset({
        iProjectId: data?.project,
        sName: data?.sName,
        dStartDate: data?.dStartDate?.substring(0, 10),
        dEndDate: data?.dEndDate?.substring(0, 10),
        nTimeLineDays: data?.nTimeLineDays,
        nCost: data?.nCost,
        aProjectBaseDepartments: data.crwisedepartments.map((d) => ({
          ...d,
          nAmount: d.nCost,
          nHours: d.nMinutes / 60,
          iDepartmentId: d._id,
        })),
        aProjectBaseEmployee: data.crwiseemployees.map((d) => ({ ...d, iEmployeeId: d._id })),
      })
      setValue('eCrStatus', { label: data?.eCrStatus, value: data?.eCrStatus })
    },
  })

  const updateMutation = useMutation(updateCr, {
    onSuccess: () => {
      toaster('CR Updated Successfully')
      navigate(route.changeRequest)
    },
    onError: (error) => {
      Array.isArray(error.response.data.errors) && handleErrors(error.response.data.errors, setError)
    },
  })

  const mutation = useMutation(addCr, {
    onSuccess: () => {
      toaster('CR Added Successfully')
      navigate(route.changeRequest)
    },
    onError: (error) => {
      Array.isArray(error.response.data.errors) && handleErrors(error.response.data.errors, setError)
    },
  })

  function fetchMoreEmployees() {
    if (requestParams.current?.isMore) {
      getEmployeeFromDepartment.mutate({
        query: { ...requestParams.current, page: requestParams.current.page + 15 },
        aDepartmentIds: watch('aProjectBaseDepartments')?.map((dep) => dep?.iDepartmentId),
        id: iProjectId?._id,
      })
      setRequestParams({ ...requestParams.current, page: requestParams.current.page + 10 })
    }
  }

  function onSubmit(e) {
    const { nCost, dStartDate, dEndDate, sName, nTimeLineDays, aProjectBaseDepartments, aProjectBaseEmployee, sDescription, eCrStatus } = e
    const totalHours = getValues('aProjectBaseDepartments')?.reduce((a, c) => {
      a = a + (Number(c?.nHours) || 0)
      return a
    }, 0)
    const totalAmount = getValues('aProjectBaseDepartments')?.reduce((a, c) => {
      a = a + (Number(c?.nAmount) || 0)
      return a
    }, 0)

    if (!countHoursEquality(+watch('nTimeLineDays') * 8, totalHours)) {
      toaster('Total Hours and selected Department Hours does not match', 'warning')
      return
    }
    if (!countHoursEquality(watch('nCost'), totalAmount)) {
      toaster('Total Cost and selected Department Cost does not match', 'warning')
      return
    }

    const resData = {
      sName,
      nCost,
      iProjectId: iProjectId?._id,
      dStartDate,
      dEndDate,
      nTimeLineDays,
      sDescription,
      aCrBaseDepartment: aProjectBaseDepartments?.map((d) => ({ ...d, nCost: d.nAmount, nMinutes: d?.nHours * 60 || 0 })),
      aCrBaseEmployee: aProjectBaseEmployee,
    }

    if (type === 'edit' && id) {
      resData.id = id
      resData.eCrStatus = eCrStatus.value

      updateMutation.mutate(resData)
    } else {
      mutation.mutate(resData)
    }
  }

  const { resourceDetail, handleScroll, data, handleSearch } = useResourceDetails(['FixedProjects'])

  const [dataParams, setDataParams] = useState({
    limit: 15,
    page: 0,
    next: false,
  })

  const {
    data: resourceDetailDepartmemt = [],
    handleScroll: handleScrollDepartment,
    handleSearch: handleSearchDeparment,
    reset: resetDepartmentOptions,
  } = useInfiniteScroll(['departmentsOfProject', iProjectId?._id], () => getProjectDepartments(iProjectId?._id), {
    enabled: !!iProjectId?._id,
    select: (data) => data.data.data.projectDepartments,
    requestParams: dataParams,
    updater: setDataParams,
    onReset: () => {
      removeNotQualifiedDepartments()
      removeNotQualifiedEmployees()
    },
  })

  function removeNotQualifiedDepartments() {
    const newValue = []
    for (let department of getValues('aProjectBaseDepartments')) {
      const isExist = department.iProjectId === iProjectId?._id
      if (isExist) {
        newValue.push(department)
      }
    }
    setValue('aProjectBaseDepartments', newValue)
  }

  function getDetail(property) {
    return { ...data[property], data: resourceDetail?.[property] }
  }

  function handleRemoveDepartment(id) {
    const newDepartments = aProjectBaseDepartments.filter((dep) => dep.iDepartmentId !== id)

    // getEmployeeFromDepartment.mutate({
    //   query: { page: 0, limit: 15, id: iProjectId?._id },
    //   aDepartmentIds: newDepartments?.map((dep) => dep?._id),
    //   id: iProjectId?._id,
    // })
    return newDepartments
  }

  function handleRemoveEmployee(id) {
    const newDepartments = aProjectBaseEmployee.filter((emp) => emp.iEmployeeId !== id)
    return newDepartments
  }

  const departmentTotalUsedHours = aProjectBaseDepartments?.reduce((a, c) => {
    a = a + (Number(c?.nHours) || 0)
    return a
  }, 0)
  const departmentTotalUsedAmount = aProjectBaseDepartments?.reduce((a, c) => {
    a = a + (Number(c?.nAmount) || 0)
    return a
  }, 0)

  function handleDepartmentHourChange(depId, nHours) {
    const newHours = nHours.replace(onlyInt, '')
    setValue(
      'aProjectBaseDepartments',
      watch('aProjectBaseDepartments')?.map((d) => (d.iDepartmentId === depId ? { ...d, nHours: +newHours } : d))
    )
  }
  function handleDepartmentCostChange(depId, nAmount) {
    const newAmount = nAmount.replace(onlyInt, '')

    setValue(
      'aProjectBaseDepartments',
      watch('aProjectBaseDepartments')?.map((d) => (d.iDepartmentId === depId ? { ...d, nAmount: +newAmount } : d))
    )
  }

  return (
    <Wrapper>
      <PageTitle
        title={editMode ? 'Edit CR' : 'Create New CR'}
        cancelText="Cancel"
        cancelButtonEvent={() => navigate('/change-request')}
        BtnText={editMode ? 'Save' : 'Add New CR'}
        handleButtonEvent={handleSubmit(onSubmit)}
      />
      <div style={{ width: '80%' }} className="m-2 my-5">
        <Row className="mb-2">
          <Col xs={12} lg={6} md={6}>
            <Controller
              name="sName"
              control={control}
              rules={{ required: 'This field is required' }}
              render={({ field: { onChange, value, ref }, fieldState: { error } }) => (
                <Input
                  onChange={onChange}
                  value={value}
                  ref={ref}
                  labelText="CR Name"
                  placeholder="Enter CR Name"
                  id="sName"
                  errorMessage={error?.message}
                />
              )}
            />
          </Col>
          {editMode ? (
            <Col xs={12} lg={6} md={6}>
              <Controller
                name="eCrStatus"
                control={control}
                render={({ field: { onChange, value, ref }, fieldState: { error } }) => (
                  <Select
                    labelText="Select Status"
                    placeholder="Select status"
                    id="eCrStatus"
                    ref={ref}
                    value={value}
                    onChange={onChange}
                    errorMessage={error?.message}
                    options={projectStatus}
                  />
                )}
              />
            </Col>
          ) : (
            <Col xs={12} lg={6} md={6}>
              <Controller
                name="iProjectId"
                control={control}
                render={({ field: { onChange, value, ref }, fieldState: { error } }) => (
                  <Select
                    labelText="Project"
                    placeholder="Select Project"
                    id="iProjectId"
                    getOptionLabel={(option) => option?.sName}
                    getOptionValue={(option) => option?._id}
                    ref={ref}
                    value={value}
                    onChange={(e) => {
                      onChange(e)
                      resetDepartmentOptions()
                      setValue('aProjectBaseDepartments', [])
                    }}
                    errorMessage={error?.message}
                    onInputChange={(s) => handleSearch('FixedProjects', s)}
                    fetchMoreData={() => handleScroll('FixedProjects')}
                    isLoading={getDetail('FixedProjects')?.isLoading}
                    options={getDetail('FixedProjects').data}
                  />
                )}
              />
            </Col>
          )}
        </Row>
        <Row className="mb-2">
          <Col xs={12} lg={6} md={6}>
            <Controller
              name="nTimeLineDays"
              control={control}
              rules={{ required: 'This field is required' }}
              render={({ field: { onChange, value, ref }, fieldState: { error } }) => (
                <Input
                  onChange={(e) => onChange(e.target.value.replace(onlyInt, ''))}
                  value={value}
                  ref={ref}
                  labelText="Timeline (in days)"
                  placeholder="Enter Project Timeline"
                  id="nTimeLineDays"
                  errorMessage={error?.message}
                />
              )}
            />
          </Col>
          <Col xs={12} lg={6} md={6}>
            <Controller
              name="nCost"
              control={control}
              rules={{ required: 'This field is required' }}
              render={({ field: { onChange, value, ref }, fieldState: { error } }) => (
                <Input
                  onChange={(e) => onChange(e.target.value.replace(onlyInt, ''))}
                  value={value}
                  ref={ref}
                  labelText="Cost"
                  placeholder="Enter Project Cost"
                  id="costName"
                  errorMessage={error?.message}
                />
              )}
            />
          </Col>
        </Row>
        <Row className="mb-2">
          <Col xs={12} lg={6} md={6}>
            <Controller
              name="dStartDate"
              control={control}
              rules={{ required: 'This field is required' }}
              render={({ field, fieldState: { error } }) => (
                <CalendarInput {...field} max={watch('dEndDate')} errorMessage={error?.message} title="Start Date" />
              )}
            />
          </Col>
          <Col xs={12} lg={6} md={6}>
            <Controller
              name="dEndDate"
              control={control}
              rules={{ required: 'This field is required' }}
              render={({ field, fieldState: { error } }) => (
                <CalendarInput {...field} min={watch('dStartDate')} errorMessage={error?.message} title="End Date" />
              )}
            />
          </Col>
        </Row>
        <Row className="mb-2">
          <Col xs={12} lg={6} md={6}>
            <Controller
              name="aProjectBaseDepartments"
              control={control}
              rules={{ required: 'This field is required' }}
              render={({ field: { onChange, value, ref }, fieldState: { error } }) => (
                <Select
                  labelText="Department"
                  placeholder="Select Department"
                  closeMenuOnSelect={false}
                  isMulti
                  isDisabled={!iProjectId?._id}
                  getOptionLabel={(option) => option?.sName}
                  getOptionValue={(option) => option?.iDepartmentId}
                  ref={ref}
                  onChange={(e, o) => {
                    getEmployeeFromDepartment.mutate({
                      query: { page: 0, limit: 15, id: iProjectId?._id },
                      aDepartmentIds: e?.map((dep) => dep?.iDepartmentId),
                      id: iProjectId?._id,
                    })
                    setRequestParams({
                      page: 0,
                      limit: 10,
                      isMore: false,
                    })
                    if (o.action === 'remove-value') {
                      onChange(handleRemoveDepartment(o.removedValue.iDepartmentId))
                    } else {
                      onChange([...(aProjectBaseDepartments?.length ? aProjectBaseDepartments : []), o.option])
                    }
                  }}
                  value={value}
                  noOptionsMessage={() => <>No Department</>}
                  errorMessage={error?.message}
                  onInputChange={handleSearchDeparment}
                  fetchMoreData={handleScrollDepartment}
                  options={resourceDetailDepartmemt}
                />
              )}
            />
          </Col>
          <Col xs={12} lg={6} md={6}>
            <Controller
              name="aProjectBaseEmployee"
              control={control}
              render={({ field: { onChange, value, ref }, fieldState: { error } }) => (
                <Select
                  labelText="Employee"
                  placeholder="Select Employee"
                  closeMenuOnSelect={false}
                  isMulti
                  isDisabled={!iProjectId?._id}
                  getOptionLabel={(option) => option?.sName}
                  getOptionValue={(option) => option?.iEmployeeId}
                  ref={ref}
                  onChange={(_, o) => {
                    if (o.action === 'remove-value') {
                      onChange(handleRemoveEmployee(o.removedValue.iEmployeeId))
                    } else {
                      onChange([...(aProjectBaseEmployee?.length ? aProjectBaseEmployee : []), o.option])
                    }
                  }}
                  value={value}
                  noOptionsMessage={() => <>No Employee</>}
                  errorMessage={error?.message}
                  fetchMoreData={fetchMoreEmployees}
                  options={depWiseEmployee}
                />
              )}
            />
          </Col>
        </Row>
      </div>
      {aProjectBaseDepartments?.length ? (
        <>
          <Divider className="mx-0 mb-3" />
          <h6 className="page-title ">Department’s Hours</h6>
          <Wrapper className="my-5 mx-0" transparent>
            <div className="dashboard">
              <Table className="datatable m-0 w-100">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Department </th>
                    <th>Hours</th>
                    <th>Cost</th>
                    <th></th>
                  </tr>
                </thead>

                <tbody>
                  {aProjectBaseDepartments?.map((department, i) => (
                    <tr key={i}>
                      <td className="size-sm">{i + 1}</td>
                      <td className="size-sm">{department.sName}</td>
                      <td className="size-sm">
                        <Input
                          placeholder="add hours"
                          inputContainerClass="mb-0"
                          onChange={(e) => handleDepartmentHourChange(department.iDepartmentId, e.target.value)}
                          disableError
                          value={department?.nHours}
                        />
                      </td>
                      <td className="size-sm">
                        <Input
                          placeholder="add cost"
                          inputContainerClass="mb-0"
                          disableError
                          onChange={(e) => handleDepartmentCostChange(department.iDepartmentId, e.target.value)}
                          value={department?.nAmount}
                        />
                      </td>
                      <ActionColumn
                        className="m-0"
                        handleDelete={() => setValue('aProjectBaseDepartments', handleRemoveDepartment(department.iDepartmentId))}
                      />
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr>
                    <th></th>
                    <th></th>
                    <th>{countDiff((watch('nTimeLineDays') || 0) * 8, departmentTotalUsedHours || 0)} Remaining Hours</th>
                    <th>{countDiff(watch('nCost') || 0, departmentTotalUsedAmount || 0)} Remaining Hours</th>
                    <th></th>
                  </tr>
                </tfoot>
              </Table>
            </div>
          </Wrapper>
        </>
      ) : null}
    </Wrapper>
  )
}
