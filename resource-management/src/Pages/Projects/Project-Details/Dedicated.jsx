import React from 'react'
import Input from 'Components/Input'
import Select from 'Components/Select'
import * as yup from 'yup'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { departmentList, getSpecificEmployee, jobProfileList, skillList } from '../../../Query/Employee/employee.query'
import { useMutation, useQueries, useQuery } from 'react-query'
import { useNavigate, useParams } from 'react-router-dom'
import { addEmployee, updateEmployee } from 'Query/Employee/employee.mutation'
import { Loading } from 'Components'
import { Row, Col, Form } from 'react-bootstrap'
import CalendarInput from 'Components/Calendar-Input'
const validationSchema = yup.object().shape({
  employeeName: yup.string().required('Employee Name is required'),
  employeeId: yup
    .string()
    .required('Employee ID is required')
    .matches(/^[0-9]+$/, 'Must be only digits')
    .min(4, 'More then 3 digits')
    .max(5, 'Less then 5 digits'),
  employeeEmailId: yup.string().email('must be email').required('Email ID is required'),
  employeeContactNumber: yup.string().required('Mobile Number is required'),
  employeeJobProfile: yup.object().shape({
    sName: yup.string().required('Job Profile is required'),
    _id: yup.string().required('Job Profile is required'),
  }),
  employeeDepartment: yup
    .object()
    .shape({
      sName: yup.string().required('Department is required'),
      _id: yup.string().required('Department is required'),
    })
    .nullable(),
  employeeExperience: yup.string().required('Experience is required'),
  employeeGrade: yup
    .object()
    .shape({
      label: yup.string().required('Grade is required'),
      value: yup.string().required('Grade is required'),
    })
    .nullable(),
})

export default function DedicatedDetails() {
  const navigate = useNavigate()

  const mutation = useMutation((data) => addEmployee(data), {
    onSuccess: () => {
      navigate('/employee-management')
    },
  })
  const updateMutation = useMutation((data) => updateEmployee(data), {
    onSuccess: () => {
      navigate('/employee-management')
    },
  })

  // useForm
  const {
    control,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
  })

  // Default Grade Data
  const Grade = [
    { label: 'Billy Dawkins', value: 'Billy Dawkins' },
    { label: 'B', value: 'B' },
    { label: 'C', value: 'C' },
    { label: 'D', value: 'D' },
  ]
  const data = useQueries([
    { queryKey: 'empProfile', queryFn: jobProfileList, refetchOnWindowFocus: false, retry: false },
    { queryKey: 'empDepartment', queryFn: departmentList, refetchOnWindowFocus: false, retry: false },
    { queryKey: 'empSkill', queryFn: skillList, refetchOnWindowFocus: false, retry: false },
  ])

  // Set Rating of perticular Skill

  const skillArray = data[2]?.data?.data?.data?.skills

  // Edit Employee
  const { type, id } = useParams()

  if (type === 'edit') {
    useQuery('editEmployee', () => getSpecificEmployee(id), {
      retry: false,
      select: (data) => {
        return data?.data?.EmployeeDetail
      },
      onSuccess: (data) => {
        reset({
          employeeName: data?.sName,
          employeeId: data?.sEmpId,
          employeeEmailId: data?.sEmail,
          employeeContactNumber: data?.sMobNum,
          employeeExperience: data?.nExperience,
          employeeDepartment: { sName: data?.iDepartmentId?.sName || 'select', _id: data?.iDepartmentId?._id || '' },
          employeeJobProfile: { sName: data?.iJobProfileId?.sName || 'select', _id: data?.iJobProfileId?._id || '' },
          employeeGrade: { value: data?.eGrade, label: data?.eGrade },
          empSkill: data?.aSkills.map((item) => ({ sName: item?.sName, _id: item?.iSkillId, eScore: item?.eScore })),
        })
      },
      refetchOnWindowFocus: false,
    })
  }

  if (mutation.isLoading || updateMutation.isLoading) {
    return <Loading />
  }

  return (
    <form>
      <Row>
        <Col lg={5} md={6}>
          <Col lg={11} md={12} className="mb-3 input">
            <Form.Label>Cost Type</Form.Label>
            <Row className="mb-3 checkbox">
              <Form.Group as={Col} className="d-flex align-items-center">
                <input type="radio" id="monthly" name="fav_language" value="Monthly" />
                <label htmlFor="monthly">Monthly</label>
              </Form.Group>
              <Form.Group as={Col} className="d-flex align-items-center">
                <input type="radio" id="hourly" name="fav_language" value="Hourly" />
                <label htmlFor="hourly">Hourly</label>
              </Form.Group>
            </Row>
          </Col>
          <Col lg={11} md={12} className="mb-3">
            <Controller
              name="costName"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  labelText={'Cost'}
                  placeholder={'Enter Project Cost'}
                  id={'costName'}
                  errorMessage={errors.employeeName?.message}
                />
              )}
            />
          </Col>
          <Col lg={11} md={12} className="mb-3">
            <CalendarInput title="Billing Cycle Date" />
          </Col>
          <Col lg={11} md={12} className="mb-3">
            <CalendarInput title="Notice Period" />
          </Col>
        </Col>
        <Col lg={5} md={6}>
          <Col lg={11}>
            <Row>
              <Col lg={12}>
                <div className="input mb-0">
                  <Form.Label>Work Hour limit (Optional)</Form.Label>
                </div>
              </Col>
              <Col lg={6}>
                <Controller
                  name="employeeGrade"
                  control={control}
                  render={({ field }) => (
                    <Select
                      {...field}
                      id="employeeGrade"
                      value={
                        type
                          ? { label: field.value?.label, value: field.value?.value }
                          : { label: field.value?.label || 'Min Hour', value: field.value?.value || '' }
                      }
                      onChange={(e) => {
                        field.onChange(e)
                      }}
                      errorMessage={errors.employeeGrade?.label?.message}
                      options={Grade}
                    />
                  )}
                />
              </Col>
              <Col lg={6}>
                <Controller
                  name="employeeGrade"
                  control={control}
                  render={({ field }) => (
                    <Select
                      {...field}
                      id="employeeGrade"
                      value={
                        type
                          ? { label: field.value?.label, value: field.value?.value }
                          : { label: field.value?.label || 'Max Hours', value: field.value?.value || '' }
                      }
                      onChange={(e) => {
                        field.onChange(e)
                      }}
                      errorMessage={errors.employeeGrade?.label?.message}
                      options={Grade}
                    />
                  )}
                />
              </Col>
            </Row>
          </Col>

          <Col lg={11} md={12} className="form-dropdown">
            <Controller
              name="empSkill"
              control={control}
              render={({ field }) => (
                <Select
                  labelText="Add Employee"
                  {...field}
                  closeMenuOnSelect={false}
                  isMulti
                  getOptionLabel={(option) => option?.sName}
                  getOptionValue={(option) => option?._id}
                  value={type ? field.value : field.value || []}
                  onChange={(e) => {
                    field.onChange(e)
                  }}
                  options={skillArray}
                />
              )}
            />
          </Col>
        </Col>
      </Row>
    </form>
  )
}
