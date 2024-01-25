/* eslint-disable react/prop-types */
import React, { useState } from 'react'

//component
import ActionButton from 'Components/ActionButton/index'
import PageTitle from 'Components/Page-Title'
import DataTable from 'Components/DataTable'
import CustomModal from 'Components/Modal'
import Divider from 'Components/Divider'
import Wrapper from 'Components/wrapper'
import Button from 'Components/Button'

//query
import { getSpecificEmployee, getProjectsOfEmployee, getReviewsOfEmployee } from 'Query/Employee/employee.query'
import { deleteEmployee } from 'Query/Employee/employee.mutation'
import { useMutation, useQuery } from 'react-query'

//icons
import { ReactComponent as MobileIcon } from 'Assets/Icons/mobile.svg'
import { ReactComponent as GradeIcon } from 'Assets/Icons/grade.svg'
import { ReactComponent as EmailIcon } from 'Assets/Icons/email.svg'
import Delete from 'Assets/Icons/Delete'
import Edit from 'Assets/Icons/Edit'


import { OverlayTrigger, Popover, Tab, Tabs } from 'react-bootstrap'
import { useNavigate, useParams } from 'react-router-dom'

// import Resume from 'Assets/Icons/Resume'
// import { ReactComponent as Share } from 'Assets/Icons/Share.svg'
import { appendParams, cell, formatDate, handleAlterImage, isGranted, parseParams, permissionsName, toaster } from 'helpers'
import './_employeeDetails.scss'
import EmployeeDetailsResponsive from './Employee-Detail-responsive'

export default function EmployeeDetail() {
  const parsed = parseParams(location.search)
  const navigate = useNavigate()
  const { id } = useParams()

  const [modal, setModal] = useState({ open: false })
  const [skills, setSkills] = useState([])
  const [selectedTab, setSelectedTab] = useState(parsed.tab || 'Projects')

  const { data, isLoading } = useQuery(['specificEmp', id], () => getSpecificEmployee(id), {
    select: (data) => data?.data,
    staleTime: 10000,
    onSuccess: (data) => {
      setSkills(data?.EmployeeDetail?.aSkills)
    },
    refetchInterval: (data) => {
      if (data?.EmployeeDetail) {
        setSkills(data?.EmployeeDetail?.aSkills)
      }
    },
  })
  const { data: employeeProjectData, isLoading: isEmployeeProjectLoading } = useQuery(['projects'], () => getProjectsOfEmployee(id, { page: 0, limit: 5 }), {
    select: (data) => data.data.data,
    staleTime: 10000,
    enabled: selectedTab === 'Projects'
  })

  const { data: employeeReviewData, isLoading: isEmployeeReviewLoading } = useQuery(['reviews'], () => getReviewsOfEmployee(id, { page: 0, limit: 5 }), {
    select: (data) => data.data.data,
    staleTime: 10000,
    enabled: selectedTab === 'Reviews'
  })

  const mutation = useMutation(deleteEmployee, {
    onSuccess: (data) => {
      toaster(data?.data?.message, 'success')
      setModal({ open: false })
      navigate('/employee-management')
    },
  })

  function MapData({ array, split, property, start = 0, show = 2, end, withoutAdd, tag }) {
    show = show > array.length ? array.length : show
    return tag ? (
      <>
        {array?.slice(start, show)?.map(({ sTextColor, sBackGroundColor, sProjectTagName }, i) => (
          <span key={i} style={{ color: sTextColor, backgroundColor: sBackGroundColor }} className="light-blue">
            {sProjectTagName}
          </span>
        ))}
        {ExtraData({ array: array?.slice(show), split, property: 'sProjectTagName', start, show, withoutAdd, tag })}
      </>
    ) : (
      <div>
        <span>{array?.slice(start, show)?.map((data, i) => (i === (end || show - 1) ? data[property] : data[property] + split))} </span>
        {ExtraData({ array: array?.slice(show), split, property, start, show, withoutAdd })}
      </div>
    )
  }

  function ExtraData({ array, property, tag }) {
    const length = array.length
    const data = array?.map((item, i) => item[property] + (array?.length - 1 === i ? '' : ', '))
    return (
      length > 0 && (
        <OverlayTrigger
          trigger={'click'}
          body
          placement="top-end"
          overlay={
            <Popover style={{ borderRadius: '10px' }} id="popover-basic">
              <div
                className="p-1 m-2 px-1"
                style={{ backgroundColor: tag ? '' : '#244b2d', color: tag ? '' : '#2dd253', borderRadius: '8px', border: '0px' }}
              >
                {tag
                  ? array?.map((item, i) => {
                    return (
                      <span
                        key={i}
                        style={{ color: item.sTextColor, backgroundColor: item.sBackGroundColor }}
                        className="light-blue"
                      >
                        {item[property]}
                      </span>
                    )
                  })
                  : data}
              </div>
            </Popover>
          }
        >
          <span className="badge bg-secondary text-dark cursor-pointer">{` +${length} More`}</span>
        </OverlayTrigger>
      )
    )
  }

  function handleTabChange(e) {
    setSelectedTab(e)
    appendParams({ tab: e })
  }
  // const mql = window.matchMedia('(max-width: 767px)')

  return (
    <>


      <div className='employee-details-responsive' >
        <EmployeeDetailsResponsive data={data} permissionsName={permissionsName} setModal={setModal} />
      </div>

      <Wrapper className="employee-details" isLoading={isLoading}>

        <section className="emp_details_container">
          <div className="emp_image_container">
            <div className="">
              <img
                className="emp-avatar"
                src={'https://jr-web-developer.s3.ap-south-1.amazonaws.com/' + data?.EmployeeDetail?.sProfilePic}
                onError={handleAlterImage}
              />
            </div>
            <div className="spiral spiral_1" />
            <div className="spiral spiral_2" />
            <div className="spiral spiral_3" />

            {
              data?.EmployeeDetail?.eGrade ?
                <div className="emp-grade">
                  <div className="grade_icon">
                    <GradeIcon />
                  </div>
                  <div className="grade_text">{data?.EmployeeDetail?.eGrade}</div>
                </div>
                : null
            }

          </div>
          <div className="empDetails p-4 h-100 d-flex flex-column justify-content-between">
            <div className='d-flex justify-content-between'>
              <h4 className="employeeName fs-4 font-weight-bold">{data?.EmployeeDetail?.sName}</h4>
              <div className="employeeDetailsAction d-flex gap-4 ">
                {/* <ActionButton actionButtonText="Share" className="share" setIcon={<Share />} /> */}
                {
                  isGranted(permissionsName.UPDATE_EMPLOYEE) &&
                  <ActionButton
                    actionButtonText="Edit"
                    className="edit"
                    onClick={() => navigate(`/employee-management/edit/${data?.EmployeeDetail?._id}`)}
                    setIcon={<Edit fill="#27B98D" />}
                  />
                }
                {
                  isGranted(permissionsName.DELETE_EMPLOYEE) &&
                  <ActionButton
                    actionButtonText="Delete"
                    className="delete"
                    onClick={() => setModal({ open: true })}
                    setIcon={<Delete fill="#FF5658" />}
                  />
                }
              </div>
            </div>
            <div className="d-flex align-items-center mt-1">
              <div className="email d-flex align-items-center me-4 h-100">
                <EmailIcon className="me-1" width={13} height={13} />
                <a href={'mailto:' + data?.EmployeeDetail?.sEmail} className="empEmail">
                  {data?.EmployeeDetail?.sEmail}
                </a>
              </div>
              <div className="number d-flex align-items-center">
                <MobileIcon className="me-1" width={12} height={12} />
                <span className="empMobile">{data?.EmployeeDetail?.sMobNum}</span>
              </div>
              {/* <div className="resume  d-flex align-items-center me-3">
                <Resume fill="#7189AC" />
                <a href="#" className="fs-6 ms-2 text-decoration-none">
                  Resume
                </a>
              </div> */}
            </div>

            <div className='my-2'>
              <Divider />
            </div>

            <div className="employeeTable">
              <table className='w-100'>
                <thead>
                  <tr className="tableHead">
                    <td>Job profile</td>
                    <td>Department</td>
                    <td>Experience</td>
                    <td>employee ID</td>
                  </tr>
                </thead>
                <tbody>
                  <tr className="tablebody">
                    <td>{data?.EmployeeDetail?.iJobProfileId?.sName}</td>
                    <td>{data?.EmployeeDetail?.iDepartmentId?.sName}</td>
                    <td>{data?.EmployeeDetail?.nExperience} Years</td>
                    <td>{data?.EmployeeDetail?.sEmpId}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="employeeTable mt-4">
              <table className='w-100'>
                <thead>
                  <tr className="tableHead">
                    <td>Currently working</td>
                    <td>Organization Branch</td>
                    <td>Availability Status</td>
                    <td>Availability Hours</td>
                  </tr>
                </thead>
                <tbody>
                  <tr className="tablebody">
                    <td>{data?.EmployeeDetail?.eDevType}</td>
                    <td>{data?.EmployeeDetail?.iBranchId?.sName}</td>
                    <td>{data?.EmployeeDetail?.eAvailabilityStatus || '—'}</td>
                    <td>{data?.EmployeeDetail?.nAvailabilityHours || '—'}</td>
                  </tr>
                </tbody>
              </table>
            </div>

          </div>
        </section>
      </Wrapper>

      <Wrapper isLoading={isLoading}>
        <PageTitle title="Skills" />
        <section className="mt-5 emp_skill_container">
          {skills?.length ? (
            skills?.map((t, i) => {
              return (
                <div className="card skillCardContainer" key={i}>
                  <div className="card-body d-flex flex-column justify-content-around" style={{ width: '237px', height: '126px' }}>
                    <h6 className="card-title" style={{}}>
                      {t.sName}
                    </h6>
                    <div>
                      <p className="card-text mb-1" style={{ textAlign: 'right', fontSize: '14px' }}>
                        {t.eScore}/10
                      </p>
                      <div className="progress" style={{ height: '8px' }}>
                        <div
                          className={`progress-bar-${i + 1}`}
                          role="progressbar"
                          style={{ width: `${t.eScore * 10}%` }}
                          aria-valuenow="100"
                          aria-valuemin="0"
                          aria-valuemax="100"
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })
          ) : (<div>No Skill Added.</div>)}
        </section>
      </Wrapper>

      <Wrapper>
        <Tabs className="project-tabs" style={{ width: 'fit-content' }} activeKey={selectedTab} onSelect={handleTabChange}>
          <Tab eventKey="Projects" title={<p className="text-center m-0">Projects</p>}></Tab>
          <Tab eventKey="Reviews" title={<p className="text-center m-0">Reviews</p>}></Tab>
        </Tabs>
        <DataTable
          columns={selectedTab === 'Reviews' ? [
            { name: '#', connectionName: 'id', isSorting: false, sort: 0 },
            { name: 'Project Name', connectionName: 'project?.sName', isSorting: false, sort: 0 },
            { name: 'Review', connectionName: 'sReview', isSorting: false, sort: 0 },
          ] : [
            { name: '#', connectionName: 'id', isSorting: false, sort: 0 },
            { name: 'Project Name', connectionName: 'sName', isSorting: false, sort: 0 },
            { name: 'Client Name', connectionName: 'client', isSorting: false, sort: 0 },
            { name: 'Completion Date', connectionName: 'dEndDate', isSorting: false, sort: 0 },
            { name: 'Technology', connectionName: 'technology', isSorting: false, sort: 0 },
            { name: 'Project Tag', connectionName: 'projectTag', isSorting: false, sort: 0 },
          ]}
          totalData={selectedTab === 'Reviews' ? (employeeReviewData?.projects?.length || 0) : (employeeProjectData?.projects?.length || 0)}
          isLoading={isEmployeeProjectLoading || isEmployeeReviewLoading || mutation.isLoading}
          disableActions={true}
        >
          {selectedTab === 'Reviews' ? employeeReviewData?.projects?.map((item, i) => (
            <tr key={i + item?._id}>
              <td>{cell(i + 1)}</td>
              <td>{item?.project?.sName}</td>
              <td>{item?.sReview || 'No review yet'}</td>
            </tr>
          )) : employeeProjectData?.projects?.map((item, i) => (
            <tr key={i + item?._id}>
              <td>{cell(i + 1)}</td>
              <td>{item?.sName}</td>
              <td>{MapData({ array: item?.client, property: 'sClientName', split: ', ', show: 2 })}</td>
              <td>{formatDate(item?.dEndDate)}</td>
              <td>{MapData({ array: item?.technology, property: 'sTechnologyName', split: ', ', show: 1 })}</td>
              <td className="table-btn">{MapData({ array: item?.projecttag, split: '', show: 1, tag: true })}</td>
            </tr>
          ))}
        </DataTable>
      </Wrapper>
      <CustomModal modalBodyClassName="p-0 py-2" open={modal.open} handleClose={() => setModal({ open: false })} title="Are you sure?">
        <h6>are you sure you want to delete?</h6>
        <div className="d-flex justify-content-between">
          <div></div>
          <div className="mt-4">
            <Button className="bg-secondary bg-lighten-xl me-2 text-muted" onClick={() => setModal({ open: false })}>
              Cancel
            </Button>
            <Button onClick={() => mutation.mutate(id)} loading={mutation.isLoading}>
              Delete
            </Button>
          </div>
        </div>
      </CustomModal>
    </>
  )
}
