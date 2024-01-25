import React, { useState } from 'react'
import Input from 'Components/Input'
import PageTitle from 'Components/Page-Title'
import Select from 'Components/Select'
import Wrapper from 'Components/wrapper'
import * as yup from 'yup'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { departmentList, getSpecificEmployee, jobProfileList, skillList } from '../../../Query/Employee/employee.query'
import { useMutation, useQueries, useQuery, useQueryClient } from 'react-query'
import { useNavigate, useParams } from 'react-router-dom'
import Rating from 'Components/Rating'
// import ReactSelect from 'react-select'
import DataTable from 'Components/DataTable'
import ActionButton from 'Components/ActionButton'
import Resume from '../../../Assets/Icons/Resume'
import { addEmployee, updateEmployee } from 'Query/Employee/employee.mutation'
import { Loading } from 'Components'
import { toaster } from 'helpers/helper'

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
  employeeAvailabilityHours: yup.string().required('availability hours is required'),
  employeeGrade: yup
    .object()
    .shape({
      label: yup.string().required('Grade is required'),
      value: yup.string().required('Grade is required'),
    })
    .nullable(),
  employeeAvailability: yup
    .object()
    .shape({
      label: yup.string().required('Grade is required'),
      value: yup.string().required('Grade is required'),
    })
    .nullable(),
})

export default function AddEmployee() {
  const navigate = useNavigate()

  const queryClient = useQueryClient()

  const mutation = useMutation((data) => addEmployee(data), {
    onSuccess: () => {
      queryClient.invalidateQueries('emp/')
      toaster('Employee Added Successfully')
      navigate('/employee-management')
    },
  })
  const updateMutation = useMutation((data) => updateEmployee(data), {
    onSuccess: () => {
      queryClient.invalidateQueries('employee05')
      toaster('Employee Updated Successfully')
      navigate('/employee-management')
    },
  })

  // useForm
  const {
    watch,
    control,
    handleSubmit,
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

  const AvailabilityStatus = [
    { label: 'Available', value: 'Available' },
    { label: 'Not Available', value: 'Not Available' },
    { label: 'Partially Available', value: 'Partially Available' },
  ]

  // Skill Table Heading Row
  const [columns] = useState([
    { name: '#', connectionName: 'id', isSorting: false, sort: 0 },
    { name: 'Skill', connectionName: 'name', isSorting: false, sort: 0 },
    { name: 'Rating', connectionName: 'rating', isSorting: false, sort: 0 },
  ])

  const data = useQueries([
    { queryKey: 'empProfile', queryFn: jobProfileList },
    { queryKey: 'empDepartment', queryFn: departmentList },
    { queryKey: 'empSkills', queryFn: skillList },
  ])
  const jobProfileArray = data[0]?.data?.data?.data?.jobProfiles
  const departmentArray = data[1]?.data?.data?.data?.departments
  const skillArray = data[2]?.data?.data?.data?.skills

  // Set Rating of perticular Skill
  const [skillRatingArray, setSkillRatingArray] = useState([])

  const setRatingCount = (data) => {
    const currentData = skillRatingArray?.filter((item) => item.iSkillId === data.iSkillId)
    const otherData = skillRatingArray?.filter((item) => item.iSkillId !== data.iSkillId)
    if (currentData?.length !== 0) {
      currentData[0] = data
      setSkillRatingArray([...otherData, ...currentData])
    } else {
      setSkillRatingArray([...skillRatingArray, data])
    }
  }

  function handleRemoveSkill(e, opt) {
    if (opt.action == 'remove-value') {
      const otherData = skillRatingArray?.filter((item) => item.iSkillId !== opt.removedValue._id)
      setSkillRatingArray(otherData)
    } else if (opt.action == 'clear') {
      setSkillRatingArray([])
    }
  }

  // Form OnSubmit data
  const onSubmit = (data) => {
    const empData = {
      sName: data.employeeName,
      sEmpId: data.employeeId,
      sEmail: data.employeeEmailId,
      sMobNum: data.employeeContactNumber,
      iDepartmentId: data.employeeDepartment._id,
      iJobProfileId: data.employeeJobProfile._id,
      nExperience: data.employeeExperience,
      nAvailabilityHours: data.employeeAvailabilityHours,
      eGrade: data.employeeGrade.label,
      eAvailabilityStatus: data.employeeAvailability.label,
      aSkills: skillRatingArray,
      sResumeLink: 'www.google.com',
    }
    if (type === 'edit') {
      updateMutation.mutate({ id, empData })
    } else {
      mutation.mutate(empData)
    }
  }

  // Edit Employee
  const { type, id } = useParams()

  if (type === 'edit') {
    useQuery('editEmployee', () => getSpecificEmployee(id), {
      retry: false,
      select: (data) => {
        return data?.data?.EmployeeDetail
      },
      onSuccess: (data) => {
        setSkillRatingArray(data?.aSkills?.map((item) => ({ sName: item?.sName, iSkillId: item?.iSkillId, eScore: item?.eScore })))
        reset({
          employeeName: data?.sName,
          employeeId: data?.sEmpId,
          employeeEmailId: data?.sEmail,
          employeeContactNumber: data?.sMobNum,
          employeeExperience: data?.nExperience,
          employeeDepartment: { sName: data?.iDepartmentId?.sName || 'select', _id: data?.iDepartmentId?._id || '' },
          employeeJobProfile: { sName: data?.iJobProfileId?.sName || 'select', _id: data?.iJobProfileId?._id || '' },
          employeeGrade: { value: data?.eGrade, label: data?.eGrade },
          employeeAvailability: { value: data?.eAvailabilityStatus, label: data?.eAvailabilityStatus },
          employeeAvailabilityHours: data?.nAvailabilityHours,
          empSkill: data?.aSkills.map((item) => ({ sName: item?.sName, _id: item?.iSkillId, eScore: item?.eScore })),
        })
      },
    })
  }

  if (mutation.isLoading || updateMutation.isLoading) {
    return <Loading />
  }

  return (
    <>
      <Wrapper>
        <section>
          <PageTitle
            title="Employee Details"
            cancelText="cancel"
            BtnText="Save"
            handleButtonEvent={handleSubmit(onSubmit)}
            cancelButtonEvent={() => navigate('/employee-management')}
          />
          <div>
            <form className="container">
              <div className="row ms-3 mt-5">
                <div className="col-md-4">
                  <Controller
                    name="employeeName"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        labelText={'Employee Name'}
                        placeholder={'Enter Employee Name'}
                        id={'employeeName'}
                        errorMessage={errors.employeeName?.message}
                      />
                    )}
                  />
                </div>
                <div className="col-md-4 offset-md-1">
                  <Controller
                    name="employeeId"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        labelText={'Employee ID'}
                        placeholder={'Enter Employee ID'}
                        id={'employeeId'}
                        errorMessage={errors.employeeId?.message}
                      />
                    )}
                  />
                </div>
                <div className="col-md-4 ">
                  <Controller
                    name="employeeEmailId"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        disabled={type}
                        labelText={'Email ID'}
                        placeholder={'Enter Email ID'}
                        id={'employeeEmailId'}
                        errorMessage={errors.employeeEmailId?.message}
                      />
                    )}
                  />
                </div>
                <div className="col-md-4 offset-md-1">
                  <Controller
                    name="employeeContactNumber"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        labelText={'Contact Number'}
                        placeholder={'Enter Contact Number'}
                        id={'employeeContactNumber'}
                        errorMessage={errors.employeeContactNumber?.message}
                      />
                    )}
                  />
                </div>
                <div className="col-md-4">
                  <Controller
                    name="employeeJobProfile"
                    control={control}
                    render={({ field }) => (
                      <Select
                        {...field}
                        placeholder="Select Job Profile"
                        labelText="Job Profile"
                        id="employeeJobProfile"
                        value={
                          type
                            ? { sName: field?.value?.sName, _id: field?.value?._id }
                            : !!field?.value === false
                            ? null
                            : { sName: field?.value?.sName || 'select', _id: field?.value?._id || '' }
                        }
                        onChange={(e) => {
                          field.onChange({ sName: e?.sName, _id: e?._id })
                        }}
                        getOptionLabel={(option) => option.sName}
                        getOptionValue={(option) => option._id}
                        errorMessage={errors.employeeJobProfile?.sName?.message}
                        options={jobProfileArray}
                      />
                    )}
                  />
                </div>
                <div className="col-md-4 offset-md-1">
                  <Controller
                    name="employeeDepartment"
                    control={control}
                    render={({ field }) => (
                      <Select
                        {...field}
                        labelText="Select Department"
                        placeholder={'Select department'}
                        id="employeeDepartment"
                        value={
                          type
                            ? { sName: field?.value?.sName, _id: field?.value?._id }
                            : !!field?.value === false
                            ? null
                            : { sName: field?.value?.sName || 'select', _id: field?.value?._id || '' }
                        }
                        onChange={(e) => {
                          field.onChange({ sName: e?.sName, _id: e?._id })
                        }}
                        getOptionLabel={(option) => option.sName}
                        getOptionValue={(option) => option._id}
                        errorMessage={errors.employeeDepartment?.sName?.message}
                        options={departmentArray}
                      />
                    )}
                  />
                </div>
                <div className="col-md-4">
                  <Controller
                    name="employeeExperience"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        labelText={'Experience in Years'}
                        placeholder={'Enter Years of Experience'}
                        id={'employeeExperience'}
                        errorMessage={errors.employeeExperience?.message}
                      />
                    )}
                  />
                </div>
                <div className="col-md-4 offset-md-1">
                  <Controller
                    name="employeeGrade"
                    control={control}
                    render={({ field }) => (
                      <Select
                        {...field}
                        placeholder="Select Grade"
                        labelText="Select Grade"
                        id="employeeGrade"
                        value={
                          type
                            ? { label: field?.value?.label, value: field?.value?.value }
                            : !!field?.value === false
                            ? null
                            : { label: field?.value?.label || 'select', value: field?.value?.value || '' }
                        }
                        onChange={(e) => {
                          field.onChange(e)
                        }}
                        errorMessage={errors.employeeGrade?.label?.message}
                        options={Grade}
                      />
                    )}
                  />
                </div>
                <div className="col-md-4">
                  <Controller
                    name="employeeAvailabilityHours"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        labelText={'Availability hours'}
                        placeholder={'Enter Availability hours'}
                        id={'employeeAvailabilityHours'}
                        errorMessage={errors.employeeAvailabilityHours?.message}
                      />
                    )}
                  />
                </div>
                <div className="col-md-4 offset-md-1">
                  <Controller
                    name="employeeAvailability"
                    control={control}
                    render={({ field }) => (
                      <Select
                        {...field}
                        placeholder="Select Availability"
                        labelText="Select Availability"
                        id="employeeAvailability"
                        value={
                          type
                            ? { label: field?.value?.label, value: field?.value?.value }
                            : !!field?.value === false
                            ? null
                            : { label: field?.value?.label, value: field?.value?.value }
                        }
                        onChange={(e) => {
                          field.onChange(e)
                        }}
                        errorMessage={errors.employeeAvailability?.label?.message}
                        options={AvailabilityStatus}
                      />
                    )}
                  />
                </div>
              </div>
            </form>
          </div>
        </section>
      </Wrapper>
      <Wrapper>
        <PageTitle title="Resume" />
        <div className="container m-3 ">
          <ActionButton actionButtonText="Create Resume" className="create_resume" setIcon={<Resume fill="#0487FF" />} />
        </div>
      </Wrapper>
      <Wrapper>
        <PageTitle title="Skill Score" />
        <div className="row mt-5 ms-3">
          <div className="col-10">
            <Controller
              name="empSkill"
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  closeMenuOnSelect={false}
                  isMulti
                  getOptionLabel={(option) => option?.sName}
                  getOptionValue={(option) => option?._id}
                  value={type ? field.value : field.value || null}
                  onChange={(e, opt) => {
                    handleRemoveSkill(e, opt)
                    field.onChange(e)
                  }}
                  options={skillArray}
                />
              )}
            />
            <div className="mt-3">
              <DataTable disableActions={true} align="left" columns={columns} totalData={watch('empSkill')?.length}>
                {watch('empSkill')?.map((item, i) => {
                  return (
                    <tr key={item._id}>
                      <td>{i + 1}</td>
                      <td>{item.sName}</td>
                      <td>
                        <Rating sTitle={item.sName} sId={item._id} ratingCount={item.eScore} setFunction={setRatingCount} />
                      </td>
                    </tr>
                  )
                })}
              </DataTable>
            </div>
          </div>
        </div>
      </Wrapper>
    </>
  )
}
