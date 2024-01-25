import React from 'react'
import Input from 'Components/Input'
import Select from 'Components/Select'
import * as yup from 'yup'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { departmentList, getSpecificEmployee, jobProfileList, skillList } from '../../../Query/Employee/employee.query'
import { useMutation, useQueries, useQuery } from 'react-query'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { addEmployee, updateEmployee } from 'Query/Employee/employee.mutation'
import { Loading } from 'Components'
import { Row, Col, Form } from 'react-bootstrap'
import userIcon from '../../../Assets/Images/user.png'
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

export default function BasicDetails() {
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
    { label: 'A', value: 'A' },
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
        <Col xxl={12} lg={12}>
          <div className="user-profile">
            <div className="profile">
              <div className="profile-img">
                <img src={userIcon} alt="user" className="img-fluid" />
              </div>
            </div>
            <div className="icon">
              <img src={require('../../../Assets/Icons/camara.svg').default} alt="camara" className="img-fluid" />
              <input type="file" id="file" />{' '}
            </div>
          </div>
        </Col>
        <Col lg={10}>
          <Row>
            <Col lg={6} md={6}>
              <Col lg={12} md={12} className="mb-3">
                <Controller
                  name="employeeName"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      labelText={'Project Name'}
                      placeholder={'Enter Project Name'}
                      id={'employeeName'}
                      errorMessage={errors.employeeName?.message}
                    />
                  )}
                />
              </Col>
              <Col lg={12} md={12} className="mb-3">
                <Controller
                  name="employeeGrade"
                  control={control}
                  render={({ field }) => (
                    <Select
                      {...field}
                      errorDisable
                      labelText="Type of Project"
                      id="employeeGrade"
                      value={
                        type
                          ? { label: field.value?.label, value: field.value?.value }
                          : { label: field.value?.label || 'Select project Type', value: field.value?.value || '' }
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
              <Col lg={12} md={12} className="mb-3">
                <Controller
                  name="employeeGrade"
                  control={control}
                  render={({ field }) => (
                    <Select
                      {...field}
                      errorDisable
                      labelText="BA"
                      id="employeeGrade"
                      value={
                        type
                          ? { label: field.value?.label, value: field.value?.value }
                          : { label: field.value?.label || 'Select', value: field.value?.value || '' }
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
              <Col lg={12} md={12} className="mb-3">
                <Controller
                  name="employeeGrade"
                  control={control}
                  render={({ field }) => (
                    <Select
                      {...field}
                      errorDisable
                      labelText="BDE"
                      id="employeeGrade"
                      value={
                        type
                          ? { label: field.value?.label, value: field.value?.value }
                          : { label: field.value?.label || 'Select', value: field.value?.value || '' }
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
              <Col lg={12} md={12} className="mb-3">
                <Controller
                  name="employeeName"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      labelText={'Client Name'}
                      placeholder={'Enter Client Name'}
                      id={'employeeName'}
                      errorMessage={errors.employeeName?.message}
                    />
                  )}
                />
              </Col>
            </Col>
            <Col lg={6} md={6}>
              <Col lg={12} md={12} className="form-dropdown">
                <Controller
                  name="employeeGrade"
                  control={control}
                  render={({ field }) => (
                    <Select
                      {...field}
                      errorDisable
                      labelText="Project Manager (Optional)"
                      id="employeeGrade"
                      value={
                        type
                          ? { label: field.value?.label, value: field.value?.value }
                          : { label: field.value?.label || 'Select Project Manager', value: field.value?.value || '' }
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
              <Col xs={12} lg={12} md={12} className="form-dropdown">
                <Controller
                  name="empSkill"
                  control={control}
                  render={({ field }) => (
                    <Select
                      {...field}
                      labelText="Technology"
                      errorDisable
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
                <Form.Text className="suggested">
                  <span>Suggested:</span>
                  <Link to="/">NFT Market Place,</Link>
                  <Link to="/">Magento,</Link>
                  <Link to="/">Flutter,</Link>
                </Form.Text>
              </Col>
              <Col lg={12} md={12}>
                <Controller
                  name="empSkill"
                  control={control}
                  render={({ field }) => (
                    <Select
                      {...field}
                      labelText="Project Tag"
                      errorDisable
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
                <Form.Text className="suggested">
                  <span>Suggested:</span>
                  <Link to="/">Corporate,</Link>
                  <Link to="/">Wealth,</Link>
                  <Link to="/">NFT,</Link>
                </Form.Text>
              </Col>
            </Col>
          </Row>
        </Col>
      </Row>
    </form>
  )
}
