/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react'
import './_add-interviews.scss'
import * as yup from 'yup'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { useMutation, useQueries, useQuery } from 'react-query'
import { useNavigate, useParams } from 'react-router-dom'
import { Loading } from 'Components'
import { Row, Col, Dropdown } from 'react-bootstrap'
import Wrapper from 'Components/wrapper'
import PageTitle from 'Components/Page-Title'
import InterviewEditor from 'Components/Editor'
import Select from 'Components/Select'
import CalendarInput from 'Components/Calendar-Input'
import { EmployeeList, getSpecificInterview, ProjectList } from 'Query/Interview/interviews.query'
import { addInterview, filterInterview, updateInterview } from 'Query/Interview/interview.mutation'
import { timeSelect } from 'helpers/helper'

const validationSchema = yup.object().shape({
  employeeName: yup.object().shape({
    sName: yup.string().required('Technology is required'),
    _id: yup.string().required('Technology is required'),
  }),
  clientName: yup.object().shape({
    sName: yup.string().required('Client is required'),
    _id: yup.string().required('Client is required'),
  }),
  // technology: yup.array(),
  project: yup.object().shape({
    sName: yup.string().required('Project is required'),
    _id: yup.string().required('Project is required'),
  }),
  interviewStatus: yup.object().shape({
    label: yup.string().required('Status is required'),
    value: yup.string().required('Status is required'),
  }),
})
const AddInterview = () => {
  const navigate = useNavigate()

  const mutation = useMutation((data) => addInterview(data), {
    onSuccess: () => {
      navigate('/interviews')
    },
  })
  const updateMutation = useMutation((data) => updateInterview(data), {
    onSuccess: () => {
      navigate('/interviews')
    },
  })

  const { refetch } = useQuery('editInterview', () => getSpecificInterview(id), {
    enabled: false,
    select: (data) => {
      return data?.data?.EmployeeDetail
    },
    onSuccess: (data) => {
      console.log(data)
      // reset({
      //   // employeeName: data,
      // })
    },
  })

  const [employeeList, setEmployeeList] = useState([])
  const [projectList, setProjectList] = useState([])
  const [technologyList, setTechnologyList] = useState([])
  const [clientList, setClientList] = useState([])

  useQueries([
    {
      queryKey: 'employeeList',
      queryFn: EmployeeList,
      onSuccess: (data) => {
        setEmployeeList(data.data.data.employee)
      },
    },
    {
      queryKey: 'projectList',
      queryFn: ProjectList,
      onSuccess: (data) => {
        setProjectList(data.data.data)
      },
    },
  ])

  const { mutate: getTechnoClient } = useMutation(filterInterview, {
    onSuccess: (data) => {
      setTechnologyList(data.data.data.technology)
      setClientList(data.data.data.client)
    },
  })

  const {
    control,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
  })

  const { type, id } = useParams()

  useEffect(() => {
    if (type === 'edit') {
      refetch()
    }
  }, [type])

  const onSubmit = (data) => {
    const InteviewData = {
      iEmpId: '62bbf269c70787df2e0a0ef7',
      iClientId: '62bae448365ddb02600375b8',
      iProjectId: '62bae9c7365ddb02600376d0',
      aTechnologyId: ['62bae18156100b36883a1ee0', '62bae18956100b36883a1ee3'],
      eInterviewStatus: 'Interviewing',
      dInterviewDate: '2022-07-28',
      sInterviewTime: '10:00am',
      sJobDescriptions: 'iwiheh ioohdfdf owhoeh oisdho0',
    }
    if (type === 'edit') {
      updateMutation.mutate({ id, InteviewData })
    } else {
      mutation.mutate(InteviewData)
    }
  }

  if (mutation.isLoading || updateMutation.isLoading) {
    return <Loading />
  }
  const InterviewStatus = [
    { sName: 'Interviewing', _id: 'Interviewing' },
    { sName: 'Selected', _id: 'Selected' },
    { sName: 'Profile Shared', _id: 'Profile Shared' },
    { sName: 'Not Selected', _id: 'Not Selected' },
  ]
  return (
    <section className="add-interviews">
      <Wrapper>
        <div className="pageTitle-head">
          <PageTitle title="Create Interview" cancelText="Cancel" BtnText="Save" cancelButtonEvent={() => navigate('/interviews')} />
        </div>
        <form className="interviews-form">
          <Row>
            <Col lg={5} md={6} spacing={2}>
              <Col lg={11} md={12}>
                <Controller
                  name="employeeName"
                  control={control}
                  render={({ field }) => (
                    <Select
                      {...field}
                      errorDisable
                      labelText="Employee Name"
                      id="InterviewStatus"
                      value={type ? field.value : field.value || null}
                      onChange={(e) => {
                        field.onChange(e)
                      }}
                      getOptionLabel={(option) => option.sName}
                      getOptionValue={(option) => option._id}
                      errorMessage={errors.employeeName?.label?.message}
                      options={employeeList}
                    />
                  )}
                />
              </Col>
              <Col lg={11} md={12} className="mb-3">
                <Controller
                  name="technology"
                  control={control}
                  render={({ field }) => (
                    <Select
                      {...field}
                      isMulti
                      labelText="Select technology"
                      placeholder={'Select technology'}
                      id="technology"
                      value={type ? field.value : field.value || null}
                      onChange={(e) => {
                        field.onChange(e)
                      }}
                      errorDisable
                      isDisabled={!technologyList?.length}
                      getOptionLabel={(option) => option.sName}
                      getOptionValue={(option) => option._id}
                      errorMessage={errors.technology?.sName?.message}
                      options={technologyList}
                    />
                  )}
                />
              </Col>
              <Col lg={11} md={12} className="">
                <Controller
                  name="InterviewStatus"
                  control={control}
                  render={({ field }) => (
                    <Select
                      {...field}
                      errorDisable
                      labelText="Interview Status"
                      id="InterviewStatus"
                      value={type ? field.value : field.value || null}
                      onChange={(e) => {
                        field.onChange(e)
                      }}
                      getOptionLabel={(option) => option.sName}
                      getOptionValue={(option) => option._id}
                      errorMessage={errors.employeeGrade?.label?.message}
                      options={InterviewStatus}
                    />
                  )}
                />
              </Col>
              <Col lg={11} md={12} className="mb-3">
                <CalendarInput title="Select Date" />
              </Col>
              <Col lg={11} md={12} className="mb-3">
                <Controller
                  name="time"
                  control={control}
                  render={({ field }) => (
                    <Select
                      {...field}
                      errorDisable
                      labelText="Time"
                      id="time"
                      value={type ? field.value : field.value || null}
                      onChange={(e) => {
                        field.onChange(e)
                      }}
                      getOptionLabel={(option) => option.sName}
                      getOptionValue={(option) => option._id}
                      errorMessage={errors.clientName?.label?.message}
                      options={timeSelect()}
                    />
                  )}
                />
              </Col>
            </Col>
            <Col lg={5} md={6}>
              <Col lg={11} md={12}>
                <Controller
                  name="clientName"
                  control={control}
                  render={({ field }) => (
                    <Select
                      {...field}
                      errorDisable
                      labelText="Client Name"
                      id="clientName"
                      value={type ? field.value : field.value || null}
                      onChange={(e) => {
                        field.onChange(e)
                      }}
                      getOptionLabel={(option) => option.sName}
                      getOptionValue={(option) => option._id}
                      isDisabled={!clientList?.length}
                      errorMessage={errors.clientName?.label?.message}
                      options={clientList}
                    />
                  )}
                />
              </Col>
              <Col lg={11} md={12} className="mb-3">
                <Controller
                  name="Project"
                  control={control}
                  render={({ field }) => (
                    <Select
                      {...field}
                      errorDisable
                      labelText="Project"
                      id="Project"
                      value={type ? field.value : field.value || null}
                      onChange={(e) => {
                        getTechnoClient(e._id)
                        setValue('technology', null)
                        setValue('clientName', null)
                        field.onChange(e)
                      }}
                      getOptionLabel={(option) => option.sName}
                      getOptionValue={(option) => option._id}
                      errorMessage={errors.Project?.sName?.message}
                      options={projectList}
                    />
                  )}
                />
              </Col>
              <Col lg={11} md={12}>
                <div className="input mb-0">
                  <label className="form-label">Job Description</label>
                  <InterviewEditor />
                </div>
              </Col>
            </Col>
          </Row>
        </form>
      </Wrapper>
    </section>
  )
}

export default AddInterview
