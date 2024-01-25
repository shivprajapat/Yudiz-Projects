/* eslint-disable react/prop-types */
import React, { useState } from 'react'

//component
import EmployeeReview from 'Components/Modals/EmployeeReview'
import ActionButton from 'Components/ActionButton/index'
import ReviewModal from 'Components/Modals/ReviewModal'
import ActionColumn from 'Components/ActionColumn'
import DescriptionBox from 'Components/Description'
import AlterImage from 'Components/AlterImage'
import PageTitle from 'Components/Page-Title'
import DataTable from 'Components/DataTable'
import CustomModal from 'Components/Modal'
import CustomCard from 'Components/Card'
import Divider from 'Components/Divider'
import Wrapper from 'Components/wrapper'
import Button from 'Components/Button'

//query
import { deleteProject, deleteProjectEmployeeReview } from 'Query/Project/project.mutation'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import { getProjectDetail } from 'Query/Project/project.query'

//icons
import iconDownload from 'Assets/Icons/download.svg'
import iconLogo from 'Assets/Icons/logo.svg'
import iconFile from 'Assets/Icons/file.png'
import Shape from 'Assets/Icons/shape.svg'
import Delete from 'Assets/Icons/Delete'
import Edit from 'Assets/Icons/Edit'

//helper
import {
  cell, changeDateFormat, convertMinutesToTime, formatDate, handleAlterImage, toaster,
  projectStatusColor, imageAppendUrl, isGranted, permissionsName, projectStatusLabel
} from 'helpers'

import { Col, Container, Row, ListGroup, Card, OverlayTrigger, Popover } from 'react-bootstrap'
import { Link, useNavigate, useParams } from 'react-router-dom'
import './_project-details.scss'

const ProjectDetails = () => {
  const isEditProjectPermission = isGranted(permissionsName.UPDATE_PROJECT)
  const isDeleteProjectPermission = isGranted(permissionsName.DELETE_PROJECT)

  const { id } = useParams()
  const navigate = useNavigate()

  const [show, setShow] = useState({ open: false })
  const [modal, setModal] = useState({ open: false })
  const [deleteModal, setDeleteModal] = useState({ open: false })
  const [employeeReview, setEmployeeReview] = useState({ open: false })
  const handleClose = () => setShow({ open: false })
  const handleShow = (employee) => setShow({ open: true, employee })
  const EmployeeReviewOpen = (employee) => setEmployeeReview({ open: true, employee })
  const EmployeeReviewClose = () => setEmployeeReview({ open: false })

  function gotoEdit() {
    navigate(`/projects/edit/${id}`)
  }
  function onDelete() {
    setModal({ open: true, id })
  }

  const [columns] = useState([
    { name: '#', connectionName: 'id', isSorting: false, sort: 0 },
    { name: 'Employee Name', connectionName: 'employeeName', isSorting: false, sort: 0 },
    { name: 'Review', connectionName: 'review', isSorting: false, sort: 0 },
  ])
  const [departmentColumns] = useState([
    { name: '#', connectionName: 'id', isSorting: false, sort: 0 },
    { name: 'Department Name', connectionName: 'departmentName', isSorting: false, sort: 0 },
    { name: 'Hours', connectionName: 'hours', isSorting: false, sort: 0 },
    { name: 'Cost', connectionName: 'cost', isSorting: false, sort: 0 },
  ])
  const [WorklogColumns] = useState([
    { name: '#', connectionName: 'id', isSorting: false, sort: 0 },
    { name: 'Tags', connectionName: 'aTaskTag', isSorting: false, sort: 0 },
    { name: 'Employee', connectionName: 'sEmployeeName', isSorting: false, sort: 0 },
    { name: 'Date', connectionName: 'sDescription', isSorting: false, sort: 0 },
    { name: 'Work Hours', connectionName: 'sDescription', isSorting: false, sort: 0 },
  ])

  const queryClient = useQueryClient()

  const { data, isLoading } = useQuery(['project-detail', id], () => getProjectDetail(id), {
    select: (data) => data.data.data.project,
  })

  const { mutate: deleteReview, isLoading: deleteReviewLoading } = useMutation(deleteProjectEmployeeReview, {
    onSuccess: () => {
      setDeleteModal({ open: false })
      queryClient.invalidateQueries('project-detail')
      toaster('review deleted successfully', 'warning')
    },
  })

  function handleDeleteModal(emp) {
    setDeleteModal({ open: true, emp })
  }

  const mutation = useMutation(deleteProject, {
    onSuccess: () => {
      queryClient.invalidateQueries('projects')
      setModal({ open: false })
    },
    onError: () => {
      setModal({ open: false })
    }
  })

  function MapData({ array, split, property, start = 0, show = 2, end, withoutAdd, tag }) {
    if (!array?.length) return 'no data'
    show = show > array?.length ? array?.length : show
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
    const length = array?.length
    const data = array?.map((item, i) => item[property] + (array?.length - 1 === i ? '' : ', '))
    return (
      length > 0 && (
        <OverlayTrigger
          trigger={["hover", "hover"]}
          body
          placement="top-end"
          overlay={
            <Popover style={{ borderRadius: '10px' }} id="popover-basic">
              <div
                className="p-1 m-2 px-1"
                style={{ backgroundColor: tag ? '' : '#244b2d', color: tag ? '' : '#2dd253', borderRadius: '8px', border: '0px' }}
              >
                {tag
                  ? array.map((item, i) => {
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

  function handleContractDownload(e) {
    const link = document.createElement('a')
    link.setAttribute('href', imageAppendUrl(e.sContract))
    link.setAttribute('download', e?.sName?.split('.')[0])
    link.click()
    link.remove()
  }

  const permissions = {
    READ: permissionsName.VIEW_PROJECT,
    UPDATE: permissionsName.VIEW_PROJECT,
    DELETE: permissionsName.VIEW_PROJECT,
    VIEW: permissionsName.VIEW_COST,
    get ALL() {
      return [this.READ, this.UPDATE, this.DELETE, this.VIEW]
    },
  }

  return (
    <section className="project-section">
      <Container fluid>
        <Row>
          <Col lg={12} md={12}>
            <Wrapper isLoading={isLoading}>
              <div className="profile-details">

                <Row>

                  <Col lg={12} md={12}>
                    <img src={Shape} alt="shape" className="img-fluid shape-img" />
                  </Col>

                  <Col lg={12} md={12}>
                    <div className="profile-details-section">

                      <Row className="profile-details-padding">

                        <Col className="company-logo p-2">
                          {data?.sLogo ? (
                            <img
                              src={'https://jr-web-developer.s3.ap-south-1.amazonaws.com/' + data?.sLogo}
                              alt="iconLogo"
                              onError={(e) => handleAlterImage(e, iconLogo)}
                              className="img-fluid"
                            />
                          ) : (
                            <AlterImage text={data?.sName} />
                          )}
                        </Col>

                        <Col>
                          <div className="employee-content txt">
                            <h2>{data?.sName}</h2>
                            <p>
                              <span>Client: </span>{' '}
                              {data?.sClient?.map((client, i) => client.sClientName + (i === data?.sClient.length - 1 ? '' : ', '))}
                            </p>

                            {/* <p>
                              <span>Description: </span>
                              {data?.sProjectDescription}
                            </p> */}
                            <div className={projectStatusColor(data?.eProjectStatus)}>{data?.eProjectStatus}</div>
                            {/* <div className='blue'>{data?.eProjectStatus}</div> */}
                          </div>
                        </Col>

                        {
                          data?.eProjectStatus !== projectStatusLabel.closed ? (
                            <Col>
                              <div className="employee-content">
                                <div className="fs-3 d-flex gap-4 justify-content-end ">
                                  {isGranted(permissions.VIEW) ?
                                    isEditProjectPermission && (
                                      <ActionButton
                                        onClick={gotoEdit}
                                        actionButtonText="Edit"
                                        className="edit"
                                        setIcon={<Edit fill="#27B98D" />}
                                      />
                                    )
                                    : null
                                  }
                                  {isDeleteProjectPermission && (
                                    <ActionButton
                                      onClick={onDelete}
                                      actionButtonText="Delete"
                                      className="delete"
                                      setIcon={<Delete fill="#FF5658" />}
                                    />
                                  )}
                                </div>
                              </div>
                            </Col>
                          ) : null
                        }
                      </Row>

                      <div className="profile-details-tab">
                        <Row className="justify-content-center">
                          <CustomCard name="Project Type" description={data?.eProjectType} />
                          {isGranted(permissions.VIEW) ? <CustomCard name="Cost" description={data?.sCost ?? 'no data'} /> : null}
                          <CustomCard name="Timeline" description={data?.nTimeLineDays ? data?.nTimeLineDays + ' Days' : 'no data'} />
                          <CustomCard name="Project Manager" description={data?.ProjectManager?.sEmployeeName || 'no data'} />
                          <CustomCard
                            name="Contract Start date"
                            description={data?.dContractStartDate ? formatDate(data?.dContractStartDate) : 'no data'}
                          />
                          <CustomCard
                            name="Contract End date"
                            description={data?.dContractEndDate ? formatDate(data?.dContractEndDate) : 'no data'}
                          />
                          <CustomCard name="BDE" description={data?.BD?.sEmployeeName || 'no data'} />
                          <CustomCard name="BA" description={data?.BA?.sEmployeeName || 'no data'} />
                        </Row>
                        <Row className="justify-content-center"></Row>
                      </div>
                      <div className="profile-details-tab border-0 pt-0">
                        <Row className="justify-content-center">
                          <Col lg={6} md={6}>
                            <div className="custom-card">
                              <Card>
                                <Card.Body>
                                  <Card.Title>Technology</Card.Title>
                                  <div className="button-tag">
                                    {!data?.technology.length ? 'no data' : null}
                                    {data?.technology?.map((tech, i) => (
                                      <span className="light-blue50" key={i}>
                                        {tech?.sTechnologyName}
                                      </span>
                                    ))}
                                  </div>
                                </Card.Body>
                              </Card>
                            </div>
                          </Col>
                          <Col lg={6} md={6}>
                            <div className="custom-card">
                              <Card>
                                <Card.Body>
                                  <Card.Title>Project Tag</Card.Title>
                                  <div className="button-tag">
                                    {!data?.projecttag.length ? 'no data' : null}
                                    {data?.projecttag?.map(({ sTextColor, sBackGroundColor, sProjectTagName }, i) => (
                                      <span key={i} style={{ color: sTextColor, backgroundColor: sBackGroundColor }} className="light-blue">
                                        {sProjectTagName}
                                      </span>
                                    ))}
                                  </div>
                                </Card.Body>
                              </Card>
                            </div>
                          </Col>
                        </Row>
                      </div>
                    </div>
                  </Col>
                </Row>
              </div>
            </Wrapper>
          </Col>
          <Col lg={6} md={6}>
            <div className="description-section">
              <Wrapper isLoading={isLoading} className="mr-0">
                <PageTitle title="Project Description" />
                <DescriptionBox title={data?.sProjectDescription || 'no data'} />
              </Wrapper>
            </div>
          </Col>
          <Col lg={6} md={6}>
            <div className="file-section">
              <Wrapper isLoading={isLoading}>
                <PageTitle title="Project Files" />
                <div className="details-box">
                  {!data?.contract?.length ? (
                    <ListGroup.Item as="div" className="d-flex justify-content-between align-items-start">
                      No Contract Found
                    </ListGroup.Item>
                  ) : null}
                  {data?.contract?.map((item, i) => {
                    return (
                      <ListGroup as="ul" numbered key={i}>
                        <ListGroup.Item as="li" className="d-flex justify-content-between align-items-start">
                          <div className="details-box-right d-flex">
                            <div className="icon">
                              <img src={iconFile} alt="iconFile" />
                            </div>
                            <div className="content">
                              <h6 className="title">{item?.sName}</h6>
                              <span>
                                {changeDateFormat(item?.dLastModified)}, {item?.sContentLength}
                              </span>
                            </div>
                          </div>
                          <ul>
                            <li className="d-flex align-items-center border-0">
                              <img src={iconDownload} alt="iconDownload" onClick={() => handleContractDownload(item)} />
                            </li>
                            {/* <li> 
                              <img src={iconTrash} alt="iconTrash" />
                            </li> */}
                          </ul>
                        </ListGroup.Item>
                      </ListGroup>
                    )
                  })}
                </div>
              </Wrapper>
            </div>
          </Col>
          {data?.eProjectType?.toLowerCase() === 'fixed' && (
            <Col lg={12} md={12}>
              <div className={'employee-section'}>
                <Wrapper>
                  <PageTitle title="Department" />
                  <div className="details-box">
                    <DataTable
                      columns={departmentColumns}
                      actionAlign="center"
                      actionPadding="10px"
                      totalData={data?.department?.length}
                      isLoading={isLoading || mutation.isLoading}
                      disableActions
                    >
                      {data?.department.map((dep, i) => (
                        <tr key={i}>
                          <td>{i + 1}</td>
                          <td>{dep?.sDepartmentName} </td>
                          <td>{dep?.nMinutes ? (dep?.nMinutes / 60) : 0}</td>
                          <td>{dep?.nCost ? dep?.nCost : 0}</td>
                        </tr>
                      ))}
                    </DataTable>
                  </div>
                </Wrapper>
              </div>
            </Col>
          )}
          <Col lg={12} md={12}>
            <div className={employeeReview ? 'employee-section active' : 'employee-section'}>
              <Wrapper>
                <PageTitle title="Employee" />
                <div className="details-box">
                  <DataTable
                    columns={columns}
                    actionAlign="center"
                    actionPadding="10px"
                    totalData={data?.employee?.length}
                    isLoading={isLoading || mutation.isLoading}
                  >
                    {data?.employee.map((emp, i) => (
                      <tr key={i}>
                        <td>{i + 1}</td>
                        <td>{emp?.sEmployeeName} </td>

                        {emp.sReview ? (
                          <td style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '100px' }}>{emp?.sReview}</td>
                        ) : (
                          <td>
                            <button className="popup-link" onClick={() => handleShow(emp)}>
                              Add Review
                            </button>
                          </td>
                        )}

                        <td style={{ paddingTop: 0, paddingBottom: 0, display: 'flex', justifyContent: 'center', minWidth: 126 }}>
                          <ActionColumn
                            permissions={permissions}
                            handleView={() => EmployeeReviewOpen(emp)}
                            handleEdit={emp?.sReview ? () => handleShow(emp) : null}
                            handleDelete={emp?.sReview ? () => handleDeleteModal(emp) : null}
                          />
                        </td>
                      </tr>
                    ))}
                  </DataTable>
                </div>
              </Wrapper>
            </div>
          </Col>
          <Col lg={12} md={12}>
            <Wrapper>
              <PageTitle
                title="Worklogs"
                extraComponent={
                  data?.worklogs?.length >= 5 ? (
                    <Link Link to={`/work-log?project=${id}&projectLabel=${data?.sName}`}>
                      More logs...
                    </Link>
                  ) : null
                }
              />
              <Divider width={'155%'} height="1px" />
              <DataTable
                columns={WorklogColumns}
                align="left"
                totalData={data?.worklogs?.length}
                isLoading={isLoading}
                actionPadding="25px"
                disableActions
              >
                {data?.worklogs?.map((item, i) => {
                  return (
                    <tr key={i}>
                      <td>{cell(i + 1)}</td>
                      <td>{cell(item?.sEmployeeName)}</td>
                      <td>{MapData({ array: item.aTaskTag, property: 'sName', split: ', ', show: 2 })}</td>
                      <td style={{ letterSpacing: '1px' }}> {cell(formatDate(item.dCreatedAt, '/'))}</td>
                      <td>{cell(convertMinutesToTime(item.nMinutes))}</td>
                    </tr>
                  )
                })}
              </DataTable>
            </Wrapper>
          </Col>
        </Row>
        <ReviewModal show={show} handleClose={handleClose} />
        <EmployeeReview show={employeeReview} handleClose={EmployeeReviewClose} />
      </Container>
      <CustomModal modalBodyClassName="p-0 py-2" open={modal.open} handleClose={() => setModal({ open: false })} title="Are you Sure?">
        <h6>Are you sure you want to delete?</h6>
        <div className="d-flex justify-content-between">
          <div></div>
          <div className="mt-4">
            <Button className="bg-secondary bg-lighten-xl me-2 text-muted" onClick={() => setModal({ open: false })}>
              Cancel
            </Button>
            <Button onClick={() => mutation.mutate(modal.id)} loading={mutation.isLoading}>
              Delete
            </Button>
          </div>
        </div>
      </CustomModal>
      <CustomModal
        modalBodyClassName="p-0 py-2"
        open={deleteModal.open}
        handleClose={() => setDeleteModal({ open: false })}
        title="Are you Sure?"
      >
        <h6>Are you sure you want to delete?</h6>
        <div className="d-flex justify-content-between">
          <div></div>
          <div className="mt-4">
            <Button className="bg-secondary bg-lighten-xl me-2 text-muted" onClick={() => setModal({ open: false })}>
              Cancel
            </Button>
            <Button onClick={() => deleteReview({ id: deleteModal.emp._id, data: { iProjectId: id } })} loading={deleteReviewLoading}>
              Delete
            </Button>
          </div>
        </div>
      </CustomModal>
    </section>
  )
}

export default ProjectDetails
