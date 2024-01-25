import React, { useState } from 'react'
import './_add-product.scss'
import PageTitle from 'Components/Page-Title'
import Wrapper from 'Components/wrapper'
import * as yup from 'yup'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { getSpecificEmployee } from '../../../Query/Employee/employee.query'
import { useMutation, useQuery } from 'react-query'
import { useNavigate, useParams } from 'react-router-dom'
import { addEmployee, updateEmployee } from 'Query/Employee/employee.mutation'
import { Loading } from 'Components'
import { Tabs, Tab } from 'react-bootstrap'
import { BasicDetails, ContractDetails, DedicatedDetails, FixedCostDetails } from '../Project-Details'
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

export default function AddEmployee() {
  const navigate = useNavigate()
  const [key, setKey] = useState('basicDetails')

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
  const { handleSubmit, reset } = useForm({
    resolver: yupResolver(validationSchema),
  })

  const [skillRatingArray, setSkillRatingArray] = useState([])
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
      eGrade: data.employeeGrade.label,
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
    <section className="add-project">
      <Wrapper>
        <section>
          <PageTitle
            title="Project Basic Details"
            cancelText="cancel"
            BtnText="Save & Next"
            handleButtonEvent={handleSubmit(onSubmit)}
            cancelButtonEvent={() => navigate('/projects')}
          />
          <Tabs className="project-tabs" activeKey={key} onSelect={(k) => setKey(k)}>
            <Tab eventKey="basicDetails" title={basicDetails()}>
              <BasicDetails />{' '}
            </Tab>
            <Tab eventKey="dedicatedDetails" title={dedicatedDetails()}>
              <DedicatedDetails />
            </Tab>
            <Tab eventKey="contractDetails" title={contractDetails()}>
              <ContractDetails />
            </Tab>
            <Tab eventKey="fixedCostDetails" title={fixedCostDetails()}>
              <FixedCostDetails />
            </Tab>
          </Tabs>
        </section>
      </Wrapper>
    </section>
  )
}

function basicDetails() {
  return (
    <div className="tab-item nav-item">
      <button>1</button>
      <p className="nav-link">Project Basic Details</p>
    </div>
  )
}
function dedicatedDetails() {
  return (
    <div className="tab-item nav-item">
      <button>2</button>
      <p className="nav-link">Dedicated Project Details</p>
    </div>
  )
}
function contractDetails() {
  return (
    <div className="tab-item nav-item">
      <button>3</button>
      <p className="nav-link">Contract Details</p>
    </div>
  )
}
function fixedCostDetails() {
  return (
    <div className="tab-item nav-item">
      <button>4</button>
      <p className="nav-link">Fixed Cost Project Details</p>
    </div>
  )
}
