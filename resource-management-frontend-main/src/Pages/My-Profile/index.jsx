import React, { useState } from 'react'
import { useQuery, useQueryClient } from 'react-query'
import { Col, Dropdown, Row } from 'react-bootstrap'
import { getProfileProjects } from 'Query/My-Profile/myprofile.query'
import ActionButton from 'Components/ActionButton'
import Divider from 'Components/Divider'
import PageTitle from 'Components/Page-Title'
import Wrapper from 'Components/wrapper'
import SkillsCard from 'Components/SkillsCard'
import TablePagination from 'Components/Table-pagination'
import { Loading } from 'Components'
import { ReactComponent as GradeIcon } from 'Assets/Icons/grade.svg'
import { ReactComponent as EmailIcon } from 'Assets/Icons/email.svg'
import { ReactComponent as MobileIcon } from 'Assets/Icons/mobile.svg'
import { ReactComponent as Share } from 'Assets/Icons/Share.svg'
import Resume from 'Assets/Icons/Resume'
import { handleAlterImage, projectStatusColor, projectStatusLabel } from 'helpers'
import '../Employee-Management/Employee-Detail/_employeeDetails.scss'

export default function MyProfile() {
  const queryClient = useQueryClient()

  const [requestParams, setRequestParams] = useState({
    page: 0,
    limit: 3,
    eProjectStatus: '',
  })

  const { data } = useQuery('myProfile', () => queryClient.getQueryData('myProfile'), {
    select: (data) => data?.data.user,
  })
  const {
    data: projects,
    isLoading,
    isFetching,
  } = useQuery(['myProfile-projects', requestParams], () => getProfileProjects(requestParams), {
    select: (data) => data?.data?.data,
  })

  return (
    <>
      <Wrapper>
        <section className="emp_details_container">
          <div className="emp_image_container">
            <div className="emp-avatar">
              <img
                className="emp-avatar"
                src={data?.sProfilePic && 'https://jr-web-developer.s3.ap-south-1.amazonaws.com/' + data?.sProfilePic}
                onError={handleAlterImage}
              />
            </div>
            <div className="spiral spiral_1" />
            <div className="spiral spiral_2" />
            <div className="spiral spiral_3" />
            <div className="emp-grade">
              <div className="grade_icon">
                <GradeIcon />
              </div>
              <div className="grade_text">{data?.eGrade}</div>
            </div>
          </div>
          <div className="empDetails p-4 h-100 d-flex flex-column justify-content-between">
            <h4 className="employeeName fs-3 font-weight-bold">{data?.sName}</h4>
            <div className="fs-3 d-flex align-items-center">
              <div className="email d-flex align-items-center me-3 h-100">
                <EmailIcon className="me-2" />
                <a href={'mailto:' + data?.EmployeeDetail?.sEmail} className="fs-6 text-decoration-none ">
                  {data?.sEmail}
                </a>
              </div>
              <div className="number d-flex align-items-center me-3">
                <MobileIcon className="me-2" />
                <span style={{ fontSize: '14px' }}>{data?.sMobNum}</span>
              </div>
              <div className="resume  d-flex align-items-center me-3">
                <Resume fill="#7189AC" />
                <a href="#" className="fs-6 ms-2 text-decoration-none">
                  Resume
                </a>
              </div>
            </div>
            <div>
              <Divider />
            </div>
            <div className="employeeTable fs-3">
              <table className="w-100">
                <thead>
                  <tr className="fs-6 tableHead">
                    <td>Job profile</td>
                    <td>Department</td>
                    <td>EMP ID</td>
                    <td>Currently working</td>
                    <td>Experience</td>
                  </tr>
                </thead>
                <tbody>
                  <tr className="fs-6">
                    <td>{data?.sJobProfile?.sName}</td>
                    <td>{data?.sDepartment?.sName}</td>
                    <td>{data?.sEmpId}</td>
                    <td>{data?.eDevType === 'D' ? 'Dedicated' : 'Fixed'}</td>
                    <td>{data?.nExperience} Years</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="employeeName fs-3 d-flex gap-4 mt-3">
              <ActionButton actionButtonText="Share" className="share" setIcon={<Share />} />
            </div>
          </div>
        </section>
      </Wrapper>

      {!!data?.aSkills?.length && (
        <Wrapper>
          <PageTitle title="Skills" />
          <section className="mt-5 emp_skill_container">
            {data?.aSkills?.map((t, i) => {
              return (
                <div className="card skillCardContainer" key={i}>
                  <div className="card-body d-flex flex-column justify-content-around" style={{ width: '237px', height: '126px' }}>
                    <h6 className="card-title" style={{}}>
                      {t.sName}
                    </h6>
                    <h6 className="card-text" style={{ textAlign: 'right' }}>
                      {t.eScore}/10
                    </h6>
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
              )
            })}
          </section>
        </Wrapper>
      )}
      <Wrapper transparent className="mb-0 pb-0">
        <Row className="justify-content-center align-items-center">
          <Col xs={6} lg={6} md={6}>
            <PageTitle title="Projects" />
          </Col>
          <Col xs={6} lg={6} md={6}>
            <div className="d-flex justify-content-end all-dropdownButton">
              <Dropdown>
                <Dropdown.Toggle id="dropdown-basic">
                  <span>Status:</span> {requestParams?.eProjectStatus || 'All'}
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item as="button" onClick={() => setRequestParams({ ...requestParams, eProjectStatus: '' })}>
                    All
                  </Dropdown.Item>
                  {[projectStatusLabel.onHold, projectStatusLabel.inProgress, projectStatusLabel.completed, projectStatusLabel.pending]?.map((i) => (
                    <Dropdown.Item as="button" key={i} onClick={() => setRequestParams({ ...requestParams, eProjectStatus: i })}>
                      {i}
                    </Dropdown.Item>
                  ))}
                </Dropdown.Menu>
              </Dropdown>
            </div>
          </Col>
        </Row>
        {(isLoading || isFetching) && <Loading absolute />}
        <Row className="projects">
          {projects?.userProject?.map((t, i) => (
            <SkillsCard
              key={i}
              icon={'https://jr-web-developer.s3.ap-south-1.amazonaws.com/' + t?.sLogo}
              btnTxt={t?.eProjectStatus}
              btnClass={projectStatusColor(t?.eProjectStatus)}
              name={t?.sProjectName}
              description={t?.sProjectDescription}
            />
          ))}
        </Row>
      </Wrapper>
      {!projects?.userProject?.length && <Wrapper>No Records found</Wrapper>}
      <Wrapper transparent className="mt-0 pt-1">
        <TablePagination
          rowsOptions={[3, 6, 9]}
          currentPage={requestParams?.page || 0}
          totalCount={projects?.count || 0}
          pageSize={requestParams?.limit || 3}
          onPageChange={(page) => setRequestParams({ limit: requestParams.limit, page })}
          onLimitChange={(limit) => setRequestParams({ limit })}
        />
      </Wrapper>
    </>
  )
}
