import React from 'react'
import Input from 'Components/Input'
import * as yup from 'yup'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { departmentList, getSpecificEmployee, jobProfileList, skillList } from '../../../Query/Employee/employee.query'
import { useMutation, useQueries, useQuery } from 'react-query'
import { useNavigate, useParams } from 'react-router-dom'
import { addEmployee, updateEmployee } from 'Query/Employee/employee.mutation'
import { Loading } from 'Components'
import { Row, Col } from 'react-bootstrap'
import CalendarInput from 'Components/Calendar-Input'
import Select from 'Components/Select'


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

export default function FixedCostDetails() {
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
        <Col lg={5} md={6} className="mb-3">
          <Col lg={11} md={12} className="mb-3">
            <Controller
              name="costName"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  labelText={'Project'}
                  placeholder={'Enter Project Name'}
                  id={'costName'}
                  errorMessage={errors.employeeName?.message}
                />
              )}
            />
          </Col>
          <Col lg={11} md={12} className="mb-3">
            <Controller
              name="costName"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  labelText={'Timeline (in days)'}
                  placeholder={'Enter Project Name'}
                  id={'costName'}
                  errorMessage={errors.employeeName?.message}
                />
              )}
            />
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
        </Col>
        <Col lg={5} md={6} className="mb-3">
          <Col lg={11} md={12} className="mb-3">
           <CalendarInput title='Start Date' />
          </Col>
          <Col lg={11} md={12} className="mb-3">
           <CalendarInput title='End Daye' />
          </Col>
          <Col lg={11} md={12} className="mb-3">
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
