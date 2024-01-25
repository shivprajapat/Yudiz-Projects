import React, { useCallback, useEffect, useState, useRef } from 'react'
import { useMutation } from 'react-query'
import { useForm, Controller } from 'react-hook-form'
import { useNavigate, useParams } from 'react-router-dom'
import { Row, Col, Table } from 'react-bootstrap'
import PropTypes from 'prop-types'
import {
  addDepartmentInProject,
  addEmployeeInProject,
  EmployeeFromDepartment,
  removeDepartmentInProject,
  removeEmployeeInProject,
  updateDepartments,
  updateDepartmentsMeta,
  updateEmployeeInProject,
  updateProject,
} from 'Query/Project/project.mutation'
import Input from 'Components/Input'
import CalendarInput from 'Components/Calendar-Input'
import Select from 'Components/Select'
import Wrapper from 'Components/wrapper'
import Divider from 'Components/Divider'
import ActionColumn from 'Components/ActionColumn'
import Button from 'Components/Button'
import { queryClient } from 'App'
import CustomToolTip from 'Components/TooltipInfo'
import PageTitle from 'Components/Page-Title'
import { debounce } from 'Hooks/debounce'
import useResourceDetails from 'Hooks/useResourceDetails'
import InfoIcon from 'Assets/Icons/infoIcon'
import { route } from 'Routes/route'
import { appendParams, changeDateFormat, countDiff, countHoursEquality, handleErrors, onlyInt, toaster } from 'helpers'
import '../../Dashboard/_dashboard.scss'

function FixedCostDetails({ setPage, formData, projectType, keyValue }) {
  const navigate = useNavigate()
  const { type, id } = useParams()
  const { control, handleSubmit, reset, watch, setError, getValues, setValue } = useForm()

  const aProjectBaseDepartments = watch('aProjectBaseDepartments')
  const aProjectBaseEmployee = watch('aProjectBaseEmployee')

  const [depWiseEmployee, setDepWiseEmployee] = useState([])
  const requestParams = useRef({
    page: 0,
    limit: 10,
    isMore: false,
  })

  function setRequestParams(data) {
    requestParams.current = data
  }

  const { resourceDetail, handleScroll, data, handleSearch } = useResourceDetails(['department'])

  const updateMutation = useMutation(updateProject, {
    onSuccess: () => {
      toaster('Project Updated Successfully')
      queryClient.invalidateQueries('getProjectDetails').then(() => {
        setPage('3')
      })
    },
    onError: (error) => {
      Array.isArray(error.response.data.errors) && handleErrors(error.response.data.errors, setError)
    },
  })
  const addDepartment = useMutation(addDepartmentInProject)
  const removeDepartment = useMutation(removeDepartmentInProject)
  const addEmployee = useMutation(addEmployeeInProject)
  const updateEmployee = useMutation(updateEmployeeInProject)
  const removeEmployee = useMutation(removeEmployeeInProject)
  const updateDepartmentList = useMutation(updateDepartments)

  const getEmployeeFromDepartment = useMutation(EmployeeFromDepartment, {
    onSuccess: (data) => {
      const emp = data?.data?.data?.employee
      setRequestParams({ ...requestParams.current, isMore: data.data.data?.employee.length === requestParams.current.limit })
      if (requestParams.current.page > 0) {
        setDepWiseEmployee([...depWiseEmployee, ...emp])
      } else {
        setDepWiseEmployee(emp.length ? emp : [])
        removeNotQualifiedEmployees()
      }
    },
  })

  function handleDepartmentUpdate(onSuccess) {
    const { sCost, dStartDate, dEndDate, nTimeLineDays } = getValues()

    updateDepartmentList.mutate(
      {
        id,
        data: {
          aProjectBaseDepartment: aProjectBaseDepartments?.map((dep) => ({
            iDepartmentId: dep._id,
            nMinutes: dep.nHours ? dep.nHours * 60 : 0,
            nCost: dep.nAmount || 0,
            nCostInPercentage: Number(dep.nCostInPercentage || 0),
          })),
          nCost: +sCost,
          nTimeLineDays: +nTimeLineDays,
          dStartDate,
          dEndDate,
        },
      },
      { onSuccess }
    )
  }

  function removeNotQualifiedEmployees() {
    const newValue = []
    for (let emp of getValues('aProjectBaseEmployee')) {
      const isExist = !!getValues('aProjectBaseDepartments')?.find((dep) => dep._id === emp.iDepartmentId)
      if (!isExist) {
        handleRemoveEmployeeToDb(emp._id, {
          onError: () => {
            setValue('aProjectBaseEmployee', [...newValue, emp])
          },
        })
      } else {
        newValue.push(emp)
      }
    }
    setValue('aProjectBaseEmployee', newValue)
  }

  function fetchMoreEmployees() {
    if (requestParams.current?.isMore) {
      getEmployeeFromDepartment.mutate({
        query: { ...requestParams.current, page: requestParams.current.page + 10 },
        aDepartmentIds: aProjectBaseDepartments?.map((dep) => dep?._id),
      })
      setRequestParams({ ...requestParams.current, page: requestParams.current.page + 10 })
    }
  }

  function onSubmit(e) {
    const { sCost, dStartDate, dEndDate, nTimeLineDays, aProjectBaseDepartments } = e
    const totalHours = aProjectBaseDepartments?.reduce((a, c) => {
      a = a + (Number(c?.nHours) || 0)
      return a
    }, 0)
    const totalAmount = aProjectBaseDepartments?.reduce((a, c) => {
      a = a + (Number(c?.nAmount) || 0)
      return a
    }, 0)
    const totalPercentage = aProjectBaseDepartments?.reduce((a, c) => {
      a = a + (Number(c?.nCostInPercentage) || 0)
      return a
    }, 0)
    if (!countHoursEquality(nTimeLineDays * 8, totalHours)) {
      toaster('Total Hours and selected Department Hours does not match', 'warning')
      return
    }
    if (!countHoursEquality(100, totalPercentage)) {
      toaster('Total Cost in % should be equal 100', 'warning')
      return
    }
    if (!countHoursEquality(sCost, totalAmount)) {
      toaster('Total Cost and selected Department Cost does not match', 'warning')
      return
    }

    const resData = {
      flag: 2,
      iProjectId: id,
      eProjectType: formData?.eProjectType || 'Fixed',
      dStartDate,
      dEndDate,
      sCost,
      nTimeLineDays,
    }

    if(formData?.flag['2'] === 'Y') {
      handleDepartmentUpdate(() => updateMutation.mutate(resData))
    } else if (type === 'edit' && id) {
      updateMutation.mutate(resData)
    }
  }

  useEffect(() => {
    if (formData && type === 'edit') {
      const { eProjectType, flag, dStartDate, dEndDate, employee, sCost, nTimeLineDays, department } = formData
      if (flag['2'] === 'Y' && eProjectType === projectType) {
        setPage('3')
      }
      reset({
        flag,
        iProjectId: id,
        nTimeLineDays: nTimeLineDays || '',
        eProjectType,
        sCost: sCost || '',
        dStartDate: changeDateFormat(dStartDate),
        dEndDate: changeDateFormat(dEndDate),
        aProjectBaseDepartments: department.map((d) => ({
          ...d,
          sName: d?.sDepartmentName,
          nHours: d?.nMinutes ? d?.nMinutes / 60 : 0,
          nAmount: d?.nCost || 0,
          nCostInPercentage: d?.nCostInPercentage || 0,
        })),
        aProjectBaseEmployee: employee.map((d) => ({
          ...d,
          sName: d?.sEmployeeName,
          nAvailabilityMinutes: d?.nAvailabilityMinutes ? d?.nAvailabilityMinutes / 60 : 0,
        })),
      })
      if ('2' === keyValue) {
        getEmployeeFromDepartment.mutate({
          query: { page: 0, limit: 10 },
          aDepartmentIds: department?.map((dep) => dep?._id),
        })
      }

      setRequestParams({
        page: 0,
        limit: 10,
        isMore: false,
      })
    }
  }, [formData])

  function getDetail(property) {
    return { ...data[property], data: resourceDetail?.[property] }
  }

  const handleDepartmentsMeta = useMutation(updateDepartmentsMeta)

  const handleHoursChange = useCallback(
    debounce((depId, newHours, id) => {
      const { sCost, dStartDate, dEndDate, nTimeLineDays } = getValues()

      handleDepartmentsMeta.mutate({
        iProjectId: id,
        iDepartmentId: depId,
        nMinutes: newHours * 60,
        sCost,
        nTimeLineDays,
        dStartDate,
        dEndDate,
      })
    }),
    []
  )

  const handleAmountChange = useCallback(
    debounce((depId, newPercentage, id) => {
      const { sCost, dStartDate, dEndDate, nTimeLineDays } = getValues()
      handleDepartmentsMeta.mutate({
        iProjectId: id,
        iDepartmentId: depId,
        nCostInPercentage: Number(newPercentage),
        nCost: (Number(newPercentage) * Number(sCost)) / 100,
        sCost,
        nTimeLineDays,
        dStartDate,
        dEndDate,
      })
    }),
    []
  )
  const handleEmployeeHoursChange = useCallback(
    debounce((empId, newHours, id) => {
      updateEmployee.mutate({
        iProjectId: id,
        iEmployeeId: empId,
        nAvailabilityMinutes: newHours * 60,
      })
    }, 1000),
    []
  )
  function handleEmployeeHourChange(empId, nHours) {
    const newHours = nHours.replace(onlyInt, '')
    if (newHours <= 8) {
      handleEmployeeHoursChange(empId, newHours, id)
      setValue(
        'aProjectBaseEmployee',
        getValues('aProjectBaseEmployee')?.map((d) => (d._id === empId ? { ...d, nAvailabilityMinutes: newHours } : d))
      )
    }
  }
  function handleEmployeeHourOnBlur(empId, nHours) {
    const newHours = nHours.replace(onlyInt, '')
    if (newHours <= 8) {
      updateEmployee.mutate({
        iProjectId: id,
        iEmployeeId: empId,
        nAvailabilityMinutes: newHours * 60,
      })
      setValue(
        'aProjectBaseEmployee',
        getValues('aProjectBaseEmployee')?.map((d) => (d._id === empId ? { ...d, nAvailabilityMinutes: newHours } : d))
      )
    }
  }

  function handleDepartmentHourChange(depId, nHours) {
    let newHours = nHours.replace(onlyInt, '')

    if (formData?.flag['2'] !== 'Y') {
      handleHoursChange(depId, newHours, id)
      setValue(
        'aProjectBaseDepartments',
        getValues('aProjectBaseDepartments')?.map((d) => (d._id === depId ? { ...d, nHours: newHours } : d))
      )
    } else {
      setValue(
        'aProjectBaseDepartments',
        getValues('aProjectBaseDepartments')?.map((d) => (d._id === depId ? { ...d, nHours: newHours } : d))
      )
    }
  }

  function handleDepartmentCostInPercentageChange(depId, nCostInPercentage) {
    const resultSCost = getValues('sCost')
    let newPercentage = nCostInPercentage.replace(onlyInt, '')

    if (formData?.flag['2'] !== 'Y') {
      handleAmountChange(depId, newPercentage, id)
      setValue(
        'aProjectBaseDepartments',
        watch('aProjectBaseDepartments')?.map((d) =>
          d._id === depId ? { ...d, nCostInPercentage: newPercentage, nAmount: (resultSCost * newPercentage) / 100 } : d
        )
      )
    } else {
      setValue(
        'aProjectBaseDepartments',
        watch('aProjectBaseDepartments')?.map((d) =>
          d._id === depId ? { ...d, nCostInPercentage: newPercentage, nAmount: (resultSCost * newPercentage) / 100 } : d
        )
      )
    }
  }

  function handleRemoveDepartment(id) {
    const newDepartments = aProjectBaseDepartments?.filter((dep) => dep._id !== id)
    getEmployeeFromDepartment.mutate({
      query: { page: 0, limit: 10 },
      aDepartmentIds: newDepartments?.map((dep) => dep?._id),
    })
    setRequestParams({
      page: 0,
      limit: 10,
      isMore: false,
    })
    return newDepartments
  }

  function handleAddDepartmentToDb(depId, { onSuccess, onError }) {
    addDepartment.mutate({ iDepartmentId: depId, iProjectId: id }, { onSuccess, onError })
  }
  function handleRemoveDepartmentToDb(depId, { onSuccess, onError }) {
    removeDepartment.mutate({ iDepartmentId: depId, iProjectId: id }, { onSuccess, onError })
  }
  function handleAddEmployeeToDb(empId, { onSuccess, onError }) {
    addEmployee.mutate({ iEmployeeId: empId, iProjectId: id }, { onSuccess, onError })
  }
  function handleRemoveEmployeeToDb(empId, { onSuccess, onError }) {
    removeEmployee.mutate({ iEmployeeId: empId, iProjectId: id }, { onSuccess, onError })
  }

  function handleRemoveEmployee(id) {
    const newEmployees = aProjectBaseEmployee?.filter((dep) => dep._id !== id)
    handleRemoveEmployeeToDb(id, { onSuccess: () => {}, onError: () => {} })
    return newEmployees
  }

  const updateDepartmentCosting = (value) => {
    if (value) {
      const result = watch('aProjectBaseDepartments')?.map((d) =>
        d.nCostInPercentage ? { ...d, nAmount: (value * d.nCostInPercentage) / 100 } : d
      )
      setValue('aProjectBaseDepartments', result)
      if (formData?.flag['2'] !== 'Y') {
        result.forEach((element) => {
          const { dStartDate, dEndDate, nTimeLineDays } = getValues()
          handleDepartmentsMeta.mutate({
            iProjectId: id,
            iDepartmentId: element?._id,
            nCostInPercentage: Number(element?.nCostInPercentage),
            nCost: (Number(element?.nCostInPercentage) * Number(value)) / 100,
            sCost: Number(value),
            nTimeLineDays,
            dStartDate,
            dEndDate,
          })
        })
      }
    }
  }

  const departmentTotalUsedHours = aProjectBaseDepartments?.reduce((a, c) => {
    a = a + (Number(c?.nHours) || 0)
    return a
  }, 0)
  const departmentTotalUsedPercentage = aProjectBaseDepartments?.reduce((a, c) => {
    a = a + (Number(c?.nCostInPercentage) || 0)
    return a
  }, 0)

  function handleCancel() {
    navigate(route.projects)
    appendParams({ eProjectType: projectType })
  }

  return (
    <Wrapper transparent isLoading={updateMutation?.isLoading}>
      <Row>
        <Col lg={5} md={6} className="mb-3">
          <Col lg={11} md={12} className="mb-3">
            <Controller
              name="nTimeLineDays"
              control={control}
              rules={{ required: 'This field is required' }}
              render={({ field: { onChange, value, ref }, fieldState: { error } }) => (
                <Input
                  onChange={(e) => onChange(e.target.value.replace(onlyInt, ''))}
                  value={value}
                  ref={ref}
                  labelText="Timeline (in days)*"
                  placeholder="Enter Project Timeline"
                  id="nTimeLineDays"
                  errorMessage={error?.message}
                  endIcon={
                    <CustomToolTip position="right" tooltipContent="8 hours will be considered per day">
                      {({ target }) => <InfoIcon ref={target} />}
                    </CustomToolTip>
                  }
                />
              )}
            />
          </Col>

          <Col lg={11} md={12} className="mb-3">
            <Controller
              name="sCost"
              control={control}
              rules={{ required: 'This field is required' }}
              render={({ field: { onChange, value, ref }, fieldState: { error } }) => (
                <Input
                  onChange={(e) => onChange(e.target.value.replace(onlyInt, ''))}
                  value={value}
                  ref={ref}
                  labelText={`Cost ${formData?.sCurrency?.sSymbol ? `(In ${formData.sCurrency.sSymbol})` : ''}*`}
                  placeholder="Enter Cost"
                  id="costName"
                  errorMessage={error?.message}
                  onBlur={(e) => updateDepartmentCosting(e?.target?.value)}
                />
              )}
            />
          </Col>
          <Col lg={11} md={12}>
            <Controller
              name="aProjectBaseDepartments"
              control={control}
              rules={{ required: 'This field is required' }}
              render={({ field: { onChange, value, ref }, fieldState: { error } }) => (
                <Select
                  labelText="Departments*"
                  placeholder="Select Departments"
                  closeMenuOnSelect={false}
                  isMulti
                  getOptionLabel={(option) => option?.sName}
                  getOptionValue={(option) => option?._id}
                  ref={ref}
                  onChange={(e, o) => {
                    e?.length &&
                      getEmployeeFromDepartment.mutate({
                        query: { page: 0, limit: 10 },
                        aDepartmentIds: e?.map((dep) => dep?._id),
                      })
                    setRequestParams({
                      page: 0,
                      limit: 10,
                      isMore: false,
                    })
                    if (o.action === 'remove-value') {
                      handleRemoveDepartmentToDb(o.removedValue._id, {
                        onSuccess: () => onChange(handleRemoveDepartment(o.removedValue._id)),
                      })
                    } else {
                      o.option.nHours = 1
                      handleAddDepartmentToDb(o.option._id, {
                        onSuccess: () => onChange([...aProjectBaseDepartments, o.option]),
                      })
                    }
                  }}
                  value={value}
                  errorMessage={error?.message}
                  onInputChange={(s) => handleSearch('department', s)}
                  fetchMoreData={() => handleScroll('department')}
                  isLoading={getDetail('department')?.isLoading || addDepartment?.isLoading || removeDepartment?.isLoading}
                  options={getDetail('department')?.data}
                />
              )}
            />
          </Col>
        </Col>
        <Col lg={5} md={6} className="mb-3">
          <Col lg={11} md={12} className="mb-3">
            <Controller
              name="dStartDate"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <CalendarInput {...field} max={watch('dEndDate')} errorMessage={error?.message} title="Start Date" />
              )}
            />
          </Col>
          <Col lg={11} md={12} className="mb-3">
            <Controller
              name="dEndDate"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <CalendarInput {...field} min={watch('dStartDate')} errorMessage={error?.message} title="End Date" />
              )}
            />
          </Col>

          <Col lg={11} md={12}>
            <Controller
              name="aProjectBaseEmployee"
              control={control}
              render={({ field: { onChange, value, ref }, fieldState: { error } }) => (
                <Select
                  labelText="Employees"
                  placeholder="Select Employees"
                  closeMenuOnSelect={false}
                  isMulti
                  getOptionLabel={(option) => option?.sName}
                  getOptionValue={(option) => option?._id}
                  ref={ref}
                  onChange={(e, o) => {
                    if (o.action === 'remove-value') {
                      handleRemoveEmployeeToDb(o.removedValue._id, {
                        onSuccess: () => onChange(handleRemoveEmployee(o.removedValue._id)),
                      })
                    } else {
                      o.option.nHours = 1
                      handleAddEmployeeToDb(o.option._id, {
                        onSuccess: () => onChange([...aProjectBaseEmployee, o.option]),
                      })
                    }
                  }}
                  value={value}
                  errorMessage={error?.message}
                  isLoading={addEmployee?.isLoading || removeEmployee?.isLoading}
                  // onInputChange={(s) => handleSearch('employee', s)}
                  fetchMoreData={fetchMoreEmployees}
                  options={depWiseEmployee}
                />
              )}
            />
          </Col>
        </Col>
      </Row>

      {aProjectBaseDepartments && aProjectBaseDepartments?.length ? (
        <>
          <Divider className="mx-0 mb-3" />
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <h6 className="page-title ">Department’s Hours</h6>
            {formData?.flag['2'] === 'Y' ? (
              <Button
                className="p-2 px-3"
                onClick={() => {
                  handleDepartmentUpdate()
                }}
                disabled={
                  countDiff(watch('nTimeLineDays') * 8, departmentTotalUsedHours || 0) || countDiff(100, departmentTotalUsedPercentage || 0)
                }
                loading={updateDepartmentList?.isLoading}
              >
                Update
              </Button>
            ) : (
              <></>
            )}
          </div>
          {formData?.flag['2'] === 'Y' ? (
            <div style={{ fontSize: 13 }}>Department details only update after clicked on update button</div>
          ) : (
            <></>
          )}
          <Wrapper className="mt-4 mb-3 mx-0" transparent>
            <div className="dashboard">
              <Table className="datatable m-0 w-100">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Department </th>
                    <th>Hours</th>
                    <th>Cost in %</th>
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
                          inputContainerStyle={{ margin: 0 }}
                          onChange={(e) => handleDepartmentHourChange(department._id, e.target.value)}
                          value={department?.nHours}
                        />
                      </td>
                      <td className="size-sm">
                        <Input
                          placeholder="add cost in %"
                          inputContainerStyle={{ margin: 0 }}
                          onChange={(e) => handleDepartmentCostInPercentageChange(department._id, e.target.value)}
                          value={department?.nCostInPercentage}
                        />
                      </td>
                      <td className="size-sm">
                        <Input disabled={true} inputContainerStyle={{ margin: 0 }} value={department?.nAmount} />
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr>
                    <th></th>
                    <th></th>
                    <th
                      className={
                        countDiff(watch('nTimeLineDays') * 8, departmentTotalUsedHours || 0) > 0 ||
                          countDiff(watch('nTimeLineDays') * 8, departmentTotalUsedHours || 0) < 0
                          ? 'text-danger'
                          : ''
                      }
                    >
                      {countDiff(watch('nTimeLineDays') * 8, departmentTotalUsedHours || 0)} Remaining Hours
                    </th>
                    <th
                      className={
                        countDiff(100, departmentTotalUsedPercentage || 0) > 0 || countDiff(100, departmentTotalUsedPercentage || 0) < 0
                          ? 'text-danger'
                          : ''
                      }
                    >
                      {countDiff(100, departmentTotalUsedPercentage || 0)} Remaining Cost in %
                    </th>
                    <th></th>
                    <th></th>
                  </tr>
                </tfoot>
              </Table>
            </div>
          </Wrapper>
        </>
      ) : null}

      {aProjectBaseEmployee?.length ? (
        <>
          <Divider className="mx-0 mb-3" />
          <h6 className="page-title ">Employee’s Hours</h6>
          <Wrapper className="my-5 mx-0" transparent>
            <div className="dashboard">
              <Table className="datatable m-0 w-100">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Employee </th>
                    <th>Availability hours per day</th>
                    <th></th>
                  </tr>
                </thead>

                <tbody>
                  {aProjectBaseEmployee?.map((employee, i) => (
                    <tr key={i}>
                      <td className="size-sm">{i + 1}</td>
                      <td className="size-sm">{employee.sName}</td>
                      <td className="size-sm">
                        <Input
                          disableError
                          placeholder="add hours"
                          inputContainerStyle={{ margin: 0 }}
                          onChange={(e) => handleEmployeeHourChange(employee._id, e.target.value)}
                          onBlur={(e) => handleEmployeeHourOnBlur(employee._id, e.target.value)}
                          value={employee?.nAvailabilityMinutes}
                          defaultValue={1}
                        />
                      </td>
                      <ActionColumn
                        className="mt-1"
                        handleDelete={() => setValue('aProjectBaseEmployee', handleRemoveEmployee(employee._id))}
                      />
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          </Wrapper>
        </>
      ) : null}

      <PageTitle
        className="m-0"
        cancelText="Cancel"
        cancelButtonEvent={handleCancel}
        BtnText={keyValue !== '3' ? 'Save & Next' : 'Save'}
        handleButtonEvent={handleSubmit(onSubmit)}
      />
    </Wrapper>
  )
}

FixedCostDetails.propTypes = {
  setPage: PropTypes.func,
  formData: PropTypes.object,
  keyValue: PropTypes.string,
  projectType: PropTypes.string,
}

FixedCostDetails.displayName = 'FixedCostDetails'

export default FixedCostDetails
