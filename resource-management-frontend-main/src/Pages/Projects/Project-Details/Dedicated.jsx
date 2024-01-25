import React, { useEffect, useState } from 'react'

//component
import ActionColumn from 'Components/ActionColumn'
import PageTitle from 'Components/Page-Title'
import DataTable from 'Components/DataTable'
import CustomModal from 'Components/Modal'
import Wrapper from 'Components/wrapper'
import Button from 'Components/Button'
import Select from 'Components/Select'
import Input from 'Components/Input'

//query
import { addEmployeeInProject, removeEmployeeInProject, updateEmployeeInProject, updateProject } from 'Query/Project/project.mutation'
import { getEmployeeDetail } from 'Query/Project/project.query'
import { useMutation, useQuery } from 'react-query'
import { queryClient } from 'App'

//helper
import { appendParams, handleErrors, onlyInt, toaster } from 'helpers'
import InfoIcon from 'Assets/Icons/infoIcon'
import CustomToolTip from 'Components/TooltipInfo'

//hook
import useResourceDetails from 'Hooks/useResourceDetails'
import { useNavigate, useParams } from 'react-router-dom'
import { Controller, useForm } from 'react-hook-form'

import { Row, Col, Form } from 'react-bootstrap'
import { route } from 'Routes/route'
import PropTypes from 'prop-types'
import ConfirmationModal from 'Components/ConfirmationModal'
import { getOrganizationDetails } from 'Query/Organization/organization.query'
import './_dedicated.scss'
import { getEmployeeSpecificCurrency } from 'Query/Employee/employee.query'
import Compare from 'Assets/Icons/Compare'

// setProjectType, formData, setPage
function DedicatedDetails({ setPage, formData, projectType, keyValue }) {
  const navigate = useNavigate()
  const { type, id } = useParams()

  const currencySymbol = formData?.sCurrency?.sSymbol || ''
  const currencyId = formData?.sCurrency?._id || ''

  const { resourceDetail, handleScroll, data, handleSearch } = useResourceDetails(['employee'])

  const { control, handleSubmit, reset, setError, watch, getValues } = useForm()

  const {
    control: modalControl,
    handleSubmit: modalHandleSubmit,
    reset: modalReset,
    setError: modalSetError,
    watch: modalWatch,
    setValue: modalSetValue,
    clearErrors: modalClearErrors,
    // getValues: modalGetValue
  } = useForm({
    defaultValues: { eCostType: 'Hourly' },
  })

  const selectedEmployee = modalWatch('aProjectBaseEmployee')
  const currentNHourCost = modalWatch('nHourCost')
  const currentNMaxHours = modalWatch('nMaxHours')
  const currentNCost = modalWatch('nCost')
  const currentECostType =  modalWatch('eCostType')

  const [deleteModal, setDeleteModal] = useState({ open: false })
  const [modal, setModal] = useState({ open: false })
  const [employees, setEmployees] = useState([])
  const [employeeCurrencyCost, setEmployeeCurrencyCost] = useState('')

  useEffect(() => {
    if (formData && type === 'edit') {
      const { flag, employee, eProjectType, dBillingCycleDate, dNoticePeriodDate } = formData
      if (flag['2'] === 'Y' && eProjectType === projectType) {
        setPage('3')
      }
      setEmployees(employee?.map((d) => ({ ...d, sName: d.sEmployeeName })))

      reset({
        dNoticePeriodDate: dNoticePeriodDate || '',
        dBillingCycleDate: dBillingCycleDate || '',
      })
    }
  }, [formData])

  // get office-master-organization
  const { data: organizationData } = useQuery({
    queryKey: ['organizationDetail'],
    queryFn: () => getOrganizationDetails(),
    select: (data) => data?.data?.data?.details,
  })

  const { refetch: employeeCurrencyRefetch, isLoading: employeeCurrencyIsLoading } = useQuery(
    ['employeeCurrency'],
    () =>
      getEmployeeSpecificCurrency({
        iEmployeeId: selectedEmployee?._id,
        iCurrencyId: currencyId,
      }),
    {
      select: (data) => data.data.data,
      enabled: !!selectedEmployee?._id && !!currencyId,
      onSuccess: (data) => {
        if (data?.nCost) {
          setEmployeeCurrencyCost(data?.nCost?.toFixed(2) || '')
        } else {
          setEmployeeCurrencyCost('')
        }
      },
      onError: () => {
        setEmployeeCurrencyCost('')
      },
    }
  )

  //get project-employee
  const { isFetching } = useQuery(
    ['project-employee-detail-dedicated', modal?.id],
    () =>
      getEmployeeDetail({
        iProjectId: id,
        iEmployeeId: modal?.id,
      }),
    {
      enabled: !!modal?.id,
      select: (data) => data.data.data.employee,
      onSuccess: (d) => {
        modalReset({
          eCostType: d.eCostType,
          nAvailabilityHours: d.nAvailabilityMinutes / 60,
          aProjectBaseEmployee: d.employee,
          nMinHours: d.nMinMinutes / 60 || '',
          nMaxHours: d.nMaxMinutes / 60 || '',
          nCost: d.nClientCost?.toFixed(2),
          nHourCost: (d.nCost * 60)?.toFixed(2),
        })
      },
    }
  )

  //post project-employee
  const addEmployeeMutation = useMutation(addEmployeeInProject, {
    onSuccess: () => {
      toaster('Employee Added Successfully')
      queryClient.invalidateQueries('getProjectDetails').then(() => {
        const timeout = setTimeout(() => {
          // reset({
          //   dNoticePeriodDate: watch('dNoticePeriodDate'),
          //   dBillingCycleDate: watch('dBillingCycleDate'),
          // })
          handleModalClose()
          setPage('2')
          clearTimeout(timeout)
        }, 100)
      })
    },
    onError: (error) => handleErrors(error.response.data.errors, modalSetError),
  })

  // update project-employee
  const updateEmployeeMutation = useMutation(updateEmployeeInProject, {
    onSuccess: () => {
      toaster('Employee updated Successfully')
      queryClient.invalidateQueries('getProjectDetails').then(() => {
        const timeout = setTimeout(() => {
          // reset({
          //   dNoticePeriodDate: watch('dNoticePeriodDate'),
          //   dBillingCycleDate: watch('dBillingCycleDate'),
          // })
          handleModalClose()
          setPage('2')
          clearTimeout(timeout)
        }, 100)
      })
    },
    onError: (error) => handleErrors(error.response.data.errors, modalSetError),
  })

  // Delete Project-employee
  const removeEmployee = useMutation(removeEmployeeInProject, {
    onSuccess: () => {
      queryClient.invalidateQueries('getProjectDetails').then(() => {
        const timeout = setTimeout(() => {
          reset({
            dNoticePeriodDate: watch('dNoticePeriodDate'),
            dBillingCycleDate: watch('dBillingCycleDate'),
          })
          handleDeleteModalClose()
          setPage('2')
          clearTimeout(timeout)
        }, 100)
      })
    },
    onError: () => {
      handleDeleteModalClose()
    },
  })

  // update project
  const updateMutation = useMutation(updateProject, {
    onSuccess: () => {
      setPage('3')
      queryClient.invalidateQueries('getProjectDetails')
      toaster('Project Updated Successfully')
    },
    onError: (error) => {
      Array.isArray(error.response.data.errors) && handleErrors(error.response.data.errors, setError)
    },
  })

  const billingDayAndNoticePeriodUpdateMutation = useMutation(updateProject, {
    onError: (error) => {
      Array.isArray(error.response.data.errors) && handleErrors(error.response.data.errors, setError)
    },
  })

  function handleModalClose() {
    setModal({ open: false })
    modalReset({
      eCostType: 'Hourly',
      nAvailabilityHours: null,
      aProjectBaseEmployee: null,
      nMinHours: null,
      nMaxHours: null,
      nCost: null,
      nHourCost: null,
    })
  }

  function handleCancel() {
    navigate(route.projects)
    appendParams({ eProjectType: projectType })
  }

  function handleDeleteModalClose() {
    setDeleteModal({ open: false, id: undefined })
  }

  function handleDelete() {
    removeEmployee.mutate({ iProjectId: id, iEmployeeId: deleteModal.id })
  }

  function onSubmit(e) {
    const { dNoticePeriodDate, dBillingCycleDate } = e
    const resData = {
      flag: 2,
      iProjectId: id,
      eProjectType: 'Dedicated',
      dNoticePeriodDate,
      dBillingCycleDate,
    }
    if (type === 'edit' && id) {
      updateMutation.mutate(resData)
    }
  }

  function handleDBillingCycleDateOnBlur(value) {
    const resData = {
      flag: 2,
      iProjectId: id,
      eProjectType: 'Dedicated',
      dNoticePeriodDate: +getValues('dNoticePeriodDate'),
      dBillingCycleDate: +value,
    }
    if (type === 'edit' && id) {
      billingDayAndNoticePeriodUpdateMutation.mutate(resData)
    }
  }

  function handleDNoticePeriodDateOnBlur(value) {
    const resData = {
      flag: 2,
      iProjectId: id,
      eProjectType: 'Dedicated',
      dNoticePeriodDate: +value,
      dBillingCycleDate: +getValues('dBillingCycleDate'),
    }
    if (type === 'edit' && id) {
      billingDayAndNoticePeriodUpdateMutation.mutate(resData)
    }
  }

  function modalOnSubmit(e) {
    const { eCostType, nAvailabilityHours, aProjectBaseEmployee, nMinHours, nMaxHours, nCost, nHourCost } = e

    if (nAvailabilityHours > 8 || !nAvailabilityHours) {
      toaster('Availability Hours should be greater than zero and less then equal to 8', 'error')
      return
    }

    const data = {
      iProjectId: id,
      iEmployeeId: aProjectBaseEmployee._id,
      nAvailabilityMinutes: nAvailabilityHours * 60,
      nMinMinutes: nMinHours * 60,
      nMaxMinutes: nMaxHours * 60,
      eCostType,
      nClientCost: +(+nCost).toFixed(2),
      nCost: +(nHourCost / 60).toFixed(5),
    }
    if (modal.id) {
      updateEmployeeMutation.mutate(data)
    } else {
      addEmployeeMutation.mutate(data)
    }
  }

  function calculateEmployeeCostPrHour(nCost, nMaxHours, isOnlyReturn = false) {
    const result = ((nCost || 0) / (nMaxHours || organizationData?.nDaysPerMonth * organizationData?.nHoursPerDay)).toFixed(2)
    if (isOnlyReturn) {
      return result
    }
    if (!nCost) {
      modalSetValue('nHourCost', '')
    } else {
      modalSetValue('nHourCost', result)
      if (result?.length) {
        modalClearErrors.apply('nHourCost')
      }
    }
  }

  function getDetail(property) {
    return { ...data[property], data: resourceDetail?.[property] }
  }

  useEffect(() => {
    if (selectedEmployee?._id) {
      employeeCurrencyRefetch()
    } else {
      setEmployeeCurrencyCost('')
    }
  }, [selectedEmployee])

  const permissions = {
    UPDATE: 'UPDATE_PROJECT',
    DELETE: 'DELETE_PROJECT',
    get ALL() {
      return [this.UPDATE, this.DELETE]
    },
  }

  const RenderCompareMessage = () => {
    if (selectedEmployee?._id && !employeeCurrencyIsLoading && !employeeCurrencyCost) {
      return (
        <div
          style={{
            color: '#f29b20',
          }}
        >
          Employee Cost/Hour not exist in employee profile
        </div>
      )
    } else if (selectedEmployee?._id && currentNHourCost && employeeCurrencyCost) {
      if (+currentNHourCost === +employeeCurrencyCost) {
        return (
          <div
            style={{
              color: '#f29b20',
            }}
          >
            Client Cost/Hour and Employee Cost/Hour both are same
          </div>
        )
      } else if (+currentNHourCost < +employeeCurrencyCost) {
        return (
          <div
            style={{
              color: '#f29b20',
            }}
          >{`Client cost/hour fell short by ${(+employeeCurrencyCost - +currentNHourCost).toFixed(
            2
          )} ${currencySymbol} compared to the employee cost/hour.`}</div>
        )
      } else {
        return (
          <div
            style={{
              color: '#0ea085',
            }}
          >{`Client cost/hour exceeded by ${(+currentNHourCost - +employeeCurrencyCost).toFixed(
            2
          )} ${currencySymbol} compared to the employee cost/hour.`}</div>
        )
      }
    }
    return <></>
  }

  return (
    <Wrapper transparent isLoading={updateMutation?.isLoading}>
      <Row>
        <Col xs={12} lg={4} md={4}>
          <Controller
            name="dBillingCycleDate"
            control={control}
            rules={{ required: 'Enter billing cycle date' }}
            render={({ field: { onChange, value, ref }, fieldState: { error } }) => (
              <Input
                onChange={({ target }) => onChange(target.value.replace(onlyInt, ''))}
                onBlur={(e) => handleDBillingCycleDateOnBlur(e.target.value)}
                value={value}
                ref={ref}
                errorMessage={error?.message}
                labelText="Billing Cycle Date*"
                placeholder="Enter Billing Cycle Date"
              />
            )}
          />
        </Col>
        <Col xs={12} lg={4} md={4}>
          <Controller
            name="dNoticePeriodDate"
            control={control}
            rules={{ required: 'Enter Notice period' }}
            render={({ field: { onChange, value, ref }, fieldState: { error } }) => (
              <Input
                onChange={({ target }) => onChange(target.value.replace(onlyInt, ''))}
                onBlur={(e) => handleDNoticePeriodDateOnBlur(e.target.value)}
                value={value}
                ref={ref}
                errorMessage={error?.message}
                labelText="Notice Period*"
                placeholder="Enter Notice Period"
              />
            )}
          />
        </Col>
        <Col xs={12} lg={4} md={4} style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Button onClick={() => setModal({ open: true })}> Add Employee</Button>
          </div>
        </Col>
      </Row>

      <div className="my-4">
        <DataTable
          columns={[
            { name: '#', connectionName: 'id', isSorting: false, sort: 0 },
            { name: 'Employee ', connectionName: 'sName', isSorting: false, sort: 0 },
            { name: 'Availability Hours', connectionName: 'nAvailabilityMinutes', isSorting: false, sort: 0 },
            { name: 'Cost type', connectionName: 'eCostType', isSorting: false, sort: 0 },
          ]}
          align="left"
          totalData={employees?.length}
          actionPadding="25px"
        >
          {employees?.map((employee, i) => (
            <tr key={i}>
              <td>{i + 1}</td>
              <td>{employee?.sEmployeeName}</td>
              <td>{employee?.nAvailabilityMinutes / 60 || 0}</td>
              <td>{employee?.eCostType || 0}</td>
              <ActionColumn
                className="m-0"
                handleEdit={() => setModal({ open: true, id: employee._id })}
                handleDelete={() => setDeleteModal({ open: true, id: employee._id })}
                permissions={permissions}
              />
            </tr>
          ))}
        </DataTable>
      </div>

      <PageTitle
        className="m-4"
        cancelText="Cancel"
        cancelButtonEvent={handleCancel}
        BtnText={keyValue !== '3' ? 'Save & Next' : 'Save'}
        handleButtonEvent={handleSubmit(onSubmit)}
      />

      <CustomModal
        open={modal.open}
        handleClose={handleModalClose}
        size="xl"
        title={modal?.id ? 'Edit Employee' : 'Add Employee'}
        isLoading={isFetching}
      >
        <div className="d-flex flex-column w-100">
          <Row>
            <Col xs={12} sm={12} md={12} lg={6}>
              <Controller
                name="aProjectBaseEmployee"
                control={modalControl}
                rules={{ required: 'Employee field is required' }}
                render={({ field: { onChange, value, ref }, fieldState: { error } }) => (
                  <Select
                    labelText="Employee"
                    getOptionLabel={(option) => option?.sName}
                    getOptionValue={(option) => option?._id}
                    ref={ref}
                    onChange={onChange}
                    value={value}
                    errorMessage={error?.message}
                    onInputChange={(s) => handleSearch('employee', s)}
                    fetchMoreData={() => handleScroll('employee')}
                    isLoading={getDetail('employee').isLoading}
                    options={getDetail('employee').data}
                    placeholder="Select Employee"
                    isEmployeeSelector={true}
                  />
                )}
              />
            </Col>
            <Col xs={12} sm={12} md={12} lg={6} className="input">
              <Form.Label>Cost Type</Form.Label>
              <Controller
                name="eCostType"
                control={modalControl}
                render={({ field: { onChange, value, ref } }) => (
                  <Row className="mb-2 pt-2 checkbox">
                    <Form.Group as={Col} className="d-flex align-items-center">
                      <input
                        type="radio"
                        id="monthly"
                        name="fav_language"
                        value="Monthly"
                        checked={value === 'Monthly'}
                        onChange={({ target }) => {
                          onChange(target.value), calculateEmployeeCostPrHour(currentNCost, currentNMaxHours)
                        }}
                        ref={ref}
                      />
                      <label htmlFor="monthly">Monthly</label>
                    </Form.Group>
                    <Form.Group as={Col} className="d-flex align-items-center">
                      <input
                        type="radio"
                        id="hourly"
                        name="fav_language"
                        checked={value === 'Hourly'}
                        value="Hourly"
                        onChange={({ target }) => {
                          onChange(target.value), modalSetValue('nHourCost', currentNCost)
                          if (currentNCost?.length) {
                            modalClearErrors('nHourCost')
                          }
                        }}
                        ref={ref}
                      />
                      <label htmlFor="hourly">Hourly</label>
                    </Form.Group>
                  </Row>
                )}
              />
            </Col>
          </Row>
          <Row style={{ marginTop: 25 }}>
            <Col xs={12} sm={12} md={12} lg={3} className="input">
              <Controller
                name="nAvailabilityHours"
                control={modalControl}
                rules={{ required: 'Availability hours field is required' }}
                render={({ field: { onChange, value, ref }, fieldState: { error } }) => (
                  <Input
                    onChange={({ target }) => onChange(+target.value.replace(onlyInt, '') || '')}
                    value={value}
                    ref={ref}
                    labelText="Availability hours"
                    placeholder="Enter availability hours"
                    id="nAvailabilityHours"
                    errorMessage={error?.message}
                    endIcon={
                      <CustomToolTip tooltipContent="Number between 1 to 8" position="right">
                        {({ target }) => <InfoIcon ref={target} />}
                      </CustomToolTip>
                    }
                  />
                )}
              />
            </Col>
            <Col xs={12} sm={12} md={12} lg={3}>
              <Controller
                name="nMinHours"
                control={modalControl}
                render={({ field: { onChange, value, ref }, fieldState: { error } }) => (
                  <Input
                    id="nMinHours"
                    placeholder="Min Hours"
                    labelText="Min Hours"
                    onChange={({ target }) => onChange(+target.value.replace(onlyInt, ''))}
                    value={value}
                    ref={ref}
                    errorMessage={error?.message}
                    errorDisable
                  />
                )}
              />
            </Col>
            <Col xs={12} sm={12} md={12} lg={3}>
              <Controller
                name="nMaxHours"
                control={modalControl}
                render={({ field: { onChange, value, ref }, fieldState: { error } }) => (
                  <Input
                    id="nMaxHours"
                    placeholder="Max Hours"
                    labelText="Max Hours"
                    onChange={({ target }) => {
                      onChange(+target.value.replace(onlyInt, '') || '')
                      if (currentECostType === 'Hourly') {
                        modalSetValue('nHourCost', currentNCost)
                        if (currentNCost?.length) {
                          modalClearErrors('nHourCost')
                        }
                      } else {
                        calculateEmployeeCostPrHour(currentNCost, +target.value.replace(onlyInt, ''))
                      }
                    }}
                    value={value}
                    ref={ref}
                    errorMessage={error?.message}
                    errorDisable
                  />
                )}
              />
            </Col>
            <Col xs={12} sm={12} md={12} lg={3} className="input">
              <Controller
                name="nCost"
                control={modalControl}
                rules={{ required: 'Client Cost field is required' }}
                render={({ field: { onChange, value, ref }, fieldState: { error } }) => (
                  <Input
                    onChange={({ target }) => {
                      onChange(target.value)
                      if (currentECostType === 'Hourly') {
                        modalSetValue('nHourCost', target.value)
                        if (target.value?.length) {
                          modalClearErrors('nHourCost')
                        }
                      } else {
                        calculateEmployeeCostPrHour(target.value, currentNMaxHours)
                      }
                    }}
                    onBlur={(e) => {
                      if (e.target.value) {
                        if (e.target.value == currentNHourCost) {
                          modalSetValue('nHourCost', (+e.target.value).toFixed(2))
                        }
                        modalSetValue('nCost', (+e.target.value).toFixed(2))
                      }
                    }}
                    value={value}
                    ref={ref}
                    labelText={`Client Cost ${currencySymbol ? `(In ${currencySymbol})` : ''}`}
                    placeholder="Enter client cost"
                    id="nCost"
                    errorMessage={error?.message}
                    type={'number'}
                    endIcon={
                      <CustomToolTip tooltipContent="cost in 2 decimal point" position="right">
                        {({ target }) => <InfoIcon ref={target} />}
                      </CustomToolTip>
                    }
                  />
                )}
              />
            </Col>
          </Row>
          <Row className="d-flex justify-content-center align-items-center">
            <Col xs={12} sm={12} md={12} lg={5} className="input">
              <Controller
                name="nHourCost"
                control={modalControl}
                render={({ field: { value, ref } }) => (
                  <Input
                    value={value}
                    ref={ref}
                    labelText={`Client Cost / Hour ${currencySymbol ? `(In ${currencySymbol})` : ''}`}
                    placeholder="Client Cost / Hour"
                    id="nHourCost"
                    disabled={true}
                    endIcon={
                      currentECostType === 'Monthly' && currentNHourCost ? (
                        <CustomToolTip
                          tooltipContent={
                            <div>
                              <div>{`Client cost per hour = (client cost) / (${
                                currentNMaxHours ? 'max hours' : 'org. days per month * org. hours per day'
                              })`}</div>
                              <br />
                              <div>{`${currentNHourCost} = ${currentNCost}/${
                                currentNMaxHours
                                  ? currentNMaxHours
                                  : `${organizationData?.nDaysPerMonth} * ${organizationData?.nHoursPerDay}`
                              }`}</div>
                            </div>
                          }
                          position="right"
                        >
                          {({ target }) => <InfoIcon ref={target} />}
                        </CustomToolTip>
                      ) : (
                        <></>
                      )
                    }
                  />
                )}
              />
            </Col>
            <Col xs={12} sm={12} md={12} lg={2} className="input d-flex align-items-center">
              <Compare fill="#495159" />
            </Col>
            <Col xs={12} sm={12} md={12} lg={5} className="input">
              <Controller
                name="employeeCostPerHour"
                control={modalControl}
                render={({ field: { ref } }) => (
                  <Input
                    value={employeeCurrencyCost}
                    ref={ref}
                    labelText={`Employee Cost / Hour ${currencySymbol ? `(In ${currencySymbol})` : ''}`}
                    placeholder="Employee Cost / Hour"
                    id="employeeCostPerHour"
                    disabled={true}
                  />
                )}
              />
            </Col>
          </Row>
          <Row>{RenderCompareMessage()}</Row>
          <div className="mt-3 d-flex justify-content-end">
            <Button className="bg-secondary bg-lighten-xl me-2 text-muted" onClick={handleModalClose}>
              Cancel
            </Button>
            <Button onClick={modalHandleSubmit(modalOnSubmit)} loading={false}>
              Save
            </Button>
          </div>
        </div>
      </CustomModal>

      <ConfirmationModal
        open={deleteModal.open}
        title="Are you sure?"
        handleClose={handleDeleteModalClose}
        handleCancel={handleDeleteModalClose}
        handleConfirm={handleDelete}
      >
        <h6>Are you sure you want to delete?</h6>
      </ConfirmationModal>
    </Wrapper>
  )
}

DedicatedDetails.propTypes = {
  formData: PropTypes.object,
  setProjectType: PropTypes.func,
  setPage: PropTypes.func,
  keyValue: PropTypes.string,
  projectType: PropTypes.string,
}
export default DedicatedDetails
