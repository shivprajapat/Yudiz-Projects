/* eslint-disable no-unused-vars */
import React, { useRef, useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { useMutation, useQueries, useQuery } from 'react-query'
import { useNavigate, useParams } from 'react-router-dom'
import { Row, Col } from 'react-bootstrap'
import { EmployeeList, getSpecificInterview, ProjectList } from 'Query/Interview/interviews.query'
import { addInterview, filterInterview, updateInterview } from 'Query/Interview/interview.mutation'
import { getTechnologyList } from 'Query/Technology/technology.query'
import { getClientList } from 'Query/Client/client.query'
import Wrapper from 'Components/wrapper'
import PageTitle from 'Components/Page-Title'
import InterviewEditor from 'Components/Editor'
import Select from 'Components/Select'
import CalendarInput from 'Components/Calendar-Input'
import CustomModal from 'Components/Modal'
import Button from 'Components/Button'
import { Loading } from 'Components'
import { timeSelect } from 'helpers'
import './_add-interviews.scss'

const AddInterview = () => {
  const navigate = useNavigate()
  const [description, setDesc] = useState('')
  const [modal, setModal] = useState({ open: false })

  const { type, id } = useParams()
  const {
    control,
    setValue,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm()

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
  useQuery(['editInterview', type], () => getSpecificInterview(id), {
    enabled: type === 'edit',
    select: (data) => {
      return data?.data?.data
    },
    onSuccess: (data) => {
      const res = {
        employeeName: data.iEmpId,
        clientName: data.iClientId,
        project: data.iProjectId,
        technology: data.aTechnologyId,
        interviewStatus: { sName: data.eInterviewStatus, _id: data.eInterviewStatus },
        dateAndTime: data.dInterviewDate.slice(0, 10),
        time: { sName: data.sInterviewTime, _id: data.sInterviewTime },
      }
      reset(res)
      setDesc(data?.sJobDescriptions)
    },
  })

  const [employeeList, setEmployeeList] = useState([])
  const [projectList, setProjectList] = useState([])
  const [technologyList, setTechnologyList] = useState([])
  const [clientList, setClientList] = useState([])

  const allQueriesData = useQueries([
    {
      queryKey: 'employeeList',
      queryFn: EmployeeList,
      select: (data) => data.data,
      onSuccess: (data) => {
        setEmployeeList(data.data.employee)
      },
      refetchOnMount: false,
    },
    {
      queryKey: 'projectList',
      queryFn: ProjectList,
      select: (data) => data.data,
      onSuccess: (data) => {
        setProjectList(data.data)
      },
      refetchOnMount: false,
    },
    {
      queryKey: 'technologyList',
      queryFn: getTechnologyList,
      select: (data) => data.data,
      onSuccess: (data) => {
        setTechnologyList(data.data.result)
      },
      refetchOnMount: false,
    },
    {
      queryKey: 'clientList',
      queryFn: getClientList,
      select: (data) => data.data,
      onSuccess: (data) => {
        setClientList(data.data.clients)
      },
      refetchOnMount: false,
    },
  ])

  const { mutate: getTechnoClient } = useMutation((d) => filterInterview(d.id, d.filter), {
    onSuccess: (data) => {
      const response = data?.data?.data
      Object.keys(response).forEach((entry) => {
        if (entry === 'client') {
          setClientList(response[entry])
        }
        if (entry === 'technology') {
          setTechnologyList(response[entry])
        }
        if (entry === 'project') {
          setProjectList(response[entry])
        }
      })
      // setTechnologyList(data.data.data.technology)
      // setClientList(data.data.data.client)
    },
  })

  const onSubmit = (data) => {
    setModal({ open: true })
    const InteviewData = {
      iEmpId: data.employeeName?._id,
      iClientId: data.clientName._id,
      iProjectId: data.project._id,
      aTechnologyId: data.technology.map((i) => i._id),
      eInterviewStatus: data.interviewStatus._id,
      dInterviewDate: data.dateAndTime,
      sInterviewTime: data.time.sName,
      sJobDescriptions: description,
    }
    // if (InterviewStatus[5]) return
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
          <PageTitle
            title="Create Interview"
            cancelText="Cancel"
            BtnText="Save"
            handleButtonEvent={handleSubmit(onSubmit)}
            cancelButtonEvent={() => navigate('/interviews')}
          />
        </div>
        <form className="interviews-form">
          <Row>
            <Col lg={5} md={6} spacing={2}>
              <Col lg={11} md={12}>
                <Controller
                  name="employeeName"
                  control={control}
                  rules={{ required: 'This field is required' }}
                  render={({ field }) => (
                    <Select
                      {...field}
                      css={{ marginBottom: '22px' }}
                      errorDisable
                      labelText="Employee Name"
                      id="employeeName"
                      value={type ? field.value : field.value || null}
                      onChange={(e) => {
                        field.onChange(e)
                      }}
                      getOptionLabel={(option) => option.sName}
                      getOptionValue={(option) => option._id}
                      errorMessage={errors.employeeName?.sName?.message}
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
                      css={{ marginBottom: '22px' }}
                      isMulti
                      labelText="Select technology"
                      placeholder={'Select technology'}
                      id="technology"
                      value={type ? field.value : field.value || null}
                      onChange={(e) => {
                        getTechnoClient({ id: e.map((v) => v._id), filter: 'aTechnologyId' })
                        field.onChange(e)
                      }}
                      errorDisable
                      // isDisabled={!technologyList?.length}
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
                  name="interviewStatus"
                  control={control}
                  rules={{ required: 'This field is required' }}
                  render={({ field }) => (
                    <Select
                      {...field}
                      css={{ marginBottom: '22px' }}
                      errorDisable
                      labelText="Interview Status"
                      id="InterviewStatus"
                      value={type ? field.value : field.value || null}
                      onChange={(e) => {
                        field.onChange(e)
                      }}
                      getOptionLabel={(option) => option.sName}
                      getOptionValue={(option) => option._id}
                      errorMessage={errors.interviewStatus?.sName?.message}
                      options={InterviewStatus}
                    />
                  )}
                />
              </Col>
              <Col lg={11} md={12} className="mb-3">
                <Controller
                  name="dateAndTime"
                  control={control}
                  render={({ field }) => (
                    <CalendarInput
                      onChange={(e) => {
                        field.onChange(e.target.value)
                      }}
                      value={field.value}
                      title="Select Date"
                    />
                  )}
                />
              </Col>
              <Col lg={11} md={12} className="mb-3">
                <Controller
                  name="time"
                  control={control}
                  render={({ field }) => (
                    <Select
                      {...field}
                      css={{ marginBottom: '22px' }}
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
                  rules={{ required: 'This field is required' }}
                  render={({ field }) => (
                    <Select
                      {...field}
                      css={{ marginBottom: '22px' }}
                      errorDisable
                      labelText="Client Name"
                      id="clientName"
                      value={type ? field.value : field.value || null}
                      onChange={(e) => {
                        getTechnoClient({ id: e._id, filter: 'iClientId' })
                        field.onChange(e)
                      }}
                      getOptionLabel={(option) => option.sName}
                      getOptionValue={(option) => option._id}
                      // isDisabled={!clientList?.length}
                      errorMessage={errors.clientName?.sName?.message}
                      options={clientList}
                    />
                  )}
                />
              </Col>
              <Col lg={11} md={12} className="mb-3">
                <Controller
                  name="project"
                  control={control}
                  rules={{ required: 'This field is required' }}
                  render={({ field }) => (
                    <Select
                      {...field}
                      css={{ marginBottom: '22px' }}
                      errorDisable
                      labelText="Project"
                      id="Project"
                      value={type ? field.value : field.value || null}
                      onChange={(e) => {
                        getTechnoClient({ id: e._id, filter: 'iProjectId' })
                        setValue('technology', null)
                        field.onChange(e)
                      }}
                      isClearable
                      getOptionLabel={(option) => option.sName}
                      getOptionValue={(option) => option._id}
                      errorMessage={errors.project?.sName?.message}
                      options={projectList}
                    />
                  )}
                />
              </Col>
              <Col lg={11} md={12}>
                <div className="input mb-0">
                  <label className="form-label">Job Description</label>
                  <InterviewEditor defaultContent={description} setDesc={setDesc} />
                </div>
              </Col>
            </Col>
          </Row>
        </form>
      </Wrapper>
      <CustomModal modalBodyClassName="p-0 py-2" open={modal.open} handleClose={() => setModal({ open: false })} title="Are you sure?">
        <h6>are you sure you want to delete?</h6>
        <div className="d-flex justify-content-between">
          <div></div>
          <div className="mt-4">
            <Button className="bg-secondary bg-lighten-xl me-2 text-muted" onClick={() => setModal({ open: false })}>
              Cancel
            </Button>
            <Button onClick={() => mutation.mutate()} loading={mutation.isLoading}>
              Delete
            </Button>
          </div>
        </div>
      </CustomModal>
    </section>
  )
}

export default AddInterview
