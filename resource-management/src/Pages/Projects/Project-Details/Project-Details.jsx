import React, { useState } from 'react'
import PageTitle from 'Components/Page-Title'
import Wrapper from 'Components/wrapper'
import './_project-details.scss'
import { Col, Container, Row, ListGroup, Card } from 'react-bootstrap'
import { getEmployeeList } from '../../../Query/Employee/employee.query'
import { useQuery, useQueryClient } from 'react-query'
import { useMutation } from 'react-query'

import iconDownload from '../../../Assets/Icons/download.svg'
import iconTrash from '../../../Assets/Icons/trash.svg'
import iconFile from '../../../Assets/Icons/file.png'
import DataTable from 'Components/DataTable'
import { deleteEmployee } from 'Query/Employee/employee.mutation'
import Delete from '../../../Assets/Icons/Delete'
import Edit from '../../../Assets/Icons/Edit'
import ActionButton from '../../../Components/ActionButton/index'
import TablePopup from 'Components/TablePopup'
import iconUser from '../../../Assets/Images/user.png'
import iconLogo from '../../../Assets/Icons/logo.svg'
import ReviewModal from 'Components/Modals/ReviewModal'
import EmployeeReview from 'Components/Modals/EmployeeReview'
import CustomCard from 'Components/Card'
import DescriptionBox from 'Components/Description'

const ProjectDetails = () => {
  const [data, setData] = useState([])
  const [popup, setPopup] = useState(false)
  const [show, setShow] = useState(false)
  const [employeeReview, setEmployeeReview] = useState(false)
  const handleClose = () => setShow(false)
  const handleShow = () => setShow(true)
  const EmployeeReviewClose = () => setEmployeeReview(false)
  function rightSide(e) {
    e.stopPropagation()
    setPopup(!popup)
  }
  const outSide = (event) => {
    event.stopPropagation()
    setPopup(false)
  }

  const [columns] = useState([
    { name: '#', connectionName: 'id', isSorting: false, sort: 0 },
    { name: 'Employee Name', connectionName: 'employeeName', isSorting: false, sort: 0 },
    { name: 'Availablity Hours', connectionName: 'availablityHours', isSorting: false, sort: 0 },
    { name: 'Review', connectionName: 'review', isSorting: false, sort: 0 },
  ])

  const queryClient = useQueryClient()

  const [requestParams] = useState({
    page: 0,
    limit: 5,
    search: '',
  })
  const { isLoading } = useQuery(['emp', requestParams], () => getEmployeeList(requestParams), {
    onSuccess: (data) => {
      setData(data.data)
    },
  })

  const mutation = useMutation(deleteEmployee, {
    onSuccess: () => {
      queryClient.invalidateQueries('emp')
    },
  })

  return (
    <section className="project-section" onClick={(e) => outSide(e)}>
      <Container fluid>
        <Row>
          <Col lg={12} md={12}>
            <Wrapper>
              <div className="profile-details">
                <Row>
                  <Col lg={12} md={12}>
                    <img src={require('../../../Assets/Icons/shape.svg').default} alt="shape" className="img-fluid shape-img" />
                  </Col>
                  <Col lg={12} md={12}>
                    <div className="profile-details-section">
                      <Row className="profile-details-padding">
                        <div className="company-logo">
                          <img src={iconLogo} alt="iconLogo" className="img-fluid" />
                        </div>
                        <Col lg={8} md={8}>
                          <div className="employee-content txt">
                            <h2>Yorkshire Lifting Share</h2>
                            <p>
                              <span>Due Date:</span>25 Aug, 2022
                            </p>
                            <p>
                              <span>Client</span>Bessie Cooper, Leslie Alexander
                            </p>
                          </div>
                        </Col>
                        <Col lg={4} md={4}>
                          <div className="employee-content">
                            <div className="fs-3 d-flex gap-4 justify-content-end ">
                              <ActionButton actionButtonText="Edit" className="edit" setIcon={<Edit fill="#27B98D" />} />
                              <ActionButton actionButtonText="Delete" className="delete" setIcon={<Delete fill="#FF5658" />} />
                            </div>
                            <div className="employee-image">
                              <img src={iconUser} alt="" className="img-fluid" />
                              <img src={iconUser} alt="" className="img-fluid" />
                              <img src={iconUser} alt="" className="img-fluid" />
                              <img src={iconUser} alt="" className="img-fluid" />
                              <img src={iconUser} alt="" className="img-fluid" />
                              <span>+5</span>
                            </div>
                          </div>
                        </Col>
                      </Row>
                      <div className="profile-details-tab">
                        <Row className="justify-content-center">
                          <CustomCard name="Project Type" description="Fixed" />
                          <CustomCard name="Cost" description="$10,000" />
                          <CustomCard name="Timeline" description="4 Months" />
                          <CustomCard name="Project Manager" description="John Stumpf" />
                        </Row>
                      </div>
                      <div className="profile-details-tab border-0 pt-0">
                        <Row className="justify-content-center">
                          <Col lg={6} md={6}>
                            <div className="custom-card">
                              <Card>
                                <Card.Body>
                                  <Card.Title>Technology</Card.Title>
                                  <div className="button-tag">
                                    <span className="light-blue50">Unity</span>
                                    <span className="light-blue50">Magento</span>
                                    <span className="light-blue50">UI/UX</span>
                                    <span className="light-blue50">HTML</span>
                                    <span className="light-blue50">Blockchain</span>
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
                                    <span className="light-ola">NFT</span>
                                    <span className="light-green">Environment</span>
                                    <span className="light-blue">Education</span>
                                    <span className="light-red">Corporate</span>
                                    <span className="light-yellow">Health</span>
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
              <Wrapper className="mr-0">
                <PageTitle title="Project Description" />
                <DescriptionBox
                  title=" Lorem ipsum dolor sit amet, consectetur adipiscing elit. At suspendisse quis ut libero erat odio porttitor mattis. Quam
                    augue cras eu dictum. Mauris amet, risus id diam. Sapien vulputate scelerisque imperdiet amet, cras etiam blandit.
                    Turpis pretium, tortor ipsum, tellus vel maecenas et ultrices posuere. Feugiat imperdiet urna massa tortor. Vitae sit
                    malesuada turpis pulvinar. Magnis tincidunt id vitae nullam sagittis leo sit velit ut. Facilisi elit malesuada nunc id."
                />
              </Wrapper>
            </div>
          </Col>
          <Col lg={6} md={6}>
            <div className="file-section">
              <Wrapper>
                <PageTitle title="Project Files" />
                <div className="details-box">
                  {new Array(5).fill('').map((item) => {
                    return (
                      <ListGroup as="ul" numbered key={item}>
                        <ListGroup.Item as="li" className="d-flex justify-content-between align-items-start">
                          <div className="details-box-right d-flex">
                            <div className="icon">
                              <img src={iconFile} alt="iconFile" />
                            </div>
                            <div className="content">
                              <h6 className="title">Project-_Contract.docx</h6>
                              <span>2 days ago, 25kb</span>
                            </div>
                          </div>
                          <ul>
                            <li>
                              <img src={iconDownload} alt="iconDownload" />{' '}
                            </li>
                            <li>
                              <img src={iconTrash} alt="iconTrash" />
                            </li>
                          </ul>
                        </ListGroup.Item>
                      </ListGroup>
                    )
                  })}
                </div>
              </Wrapper>
            </div>
          </Col>
          <Col lg={12} md={12}>
            <div className={employeeReview ? 'employee-section active' : 'employee-section'}>
              <Wrapper>
                <PageTitle title="Employee" />
                <div className="details-box">
                  <DataTable columns={columns} totalData={data?.EmployeeData?.length} isLoading={isLoading || mutation.isLoading}>
                    <tr>
                      <td>1</td>
                      <td>Tracy J. Fontenot </td>
                      <td>4 hrs, Partially Available</td>
                      <td>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</td>
                      <td>
                        <button className="dotes" onClick={(e) => rightSide(e)}>
                          <span></span>
                          <span></span>
                          <span></span>
                        </button>
                      </td>
                    </tr>
                    <tr>
                      <td>2</td>
                      <td>Tracy J. Fontenot </td>
                      <td>4 hrs, Partially Available</td>
                      <td>
                        <button className="popup-link" onClick={handleShow}>
                          Add Review
                        </button>
                      </td>
                      <td>
                        <button className="dotes" onClick={rightSide}>
                          <span></span>
                          <span></span>
                          <span></span>
                        </button>
                      </td>
                    </tr>
                  </DataTable>
                  {popup && <TablePopup EmployeeReviewFun={setEmployeeReview} />}
                </div>
              </Wrapper>
            </div>
          </Col>
        </Row>
        <ReviewModal show={show} handleClose={handleClose} />
        <EmployeeReview show={employeeReview} handleClose={EmployeeReviewClose} />
      </Container>
    </section>
  )
}

export default ProjectDetails
