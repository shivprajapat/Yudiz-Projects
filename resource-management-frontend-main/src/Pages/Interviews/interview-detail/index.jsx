import React, { useRef, useState } from 'react'
import { Col, Row, Card } from 'react-bootstrap'
import { useNavigate, useParams } from 'react-router-dom'
import { useMutation, useQuery } from 'react-query'
import { deleteInterview } from 'Query/Interview/interview.mutation'
import { getSpecificInterview } from 'Query/Interview/interviews.query'
import ActionButton from 'Components/ActionButton/index'
import CustomCard from 'Components/Card'
import InterviewEditor from 'Components/Editor'
import CustomModal from 'Components/Modal'
import Button from 'Components/Button'
import PageTitle from 'Components/Page-Title'
import Wrapper from 'Components/wrapper'
import { Loading } from 'Components'
import Delete from 'Assets/Icons/Delete'
import Edit from 'Assets/Icons/Edit'
import { formatDate, interviewStatus, toaster } from 'helpers'
import './_interviews.scss'

export default function InterviewDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const editorRef = useRef(null)
  const [data, setData] = useState({})
  const [modal, setModal] = useState({ open: false })

  const { isLoading } = useQuery(['specificClient', id], () => getSpecificInterview(id), {
    select: (data) => data?.data?.data,

    onSuccess: (data) => {
      setData(data)
    },
  })

  const mutation = useMutation(deleteInterview, {
    onSuccess: (data) => {
      toaster(data.data.message)
      setModal({ open: false })
      navigate('/client-management')
    },
  })

  function gotoEdit() {
    navigate('/interviews/edit/' + id)
  }

  const handleClick = () => {
    navigate('/interviews')
  }

  if (isLoading) return <Loading />
  return (
    <section className="interviews-details-section project-section">
      <Wrapper>
        <Row>
          <div className="add-interviews">
            <Col lg={12}>
              <Row className="justify-content-center">
                <Col lg={6} md={6}>
                  <PageTitle title="Interview Details" />
                </Col>
                <Col lg={6} md={6}>
                  <div className="fs-3 d-flex gap-4 justify-content-end ">
                    <ActionButton actionButtonText="Edit" className="edit" onClick={gotoEdit} setIcon={<Edit fill="#27B98D" />} />
                    <ActionButton
                      actionButtonText="Delete"
                      className="delete"
                      onClick={() => setModal({ open: true })}
                      setIcon={<Delete fill="#FF5658" />}
                    />
                  </div>
                </Col>
              </Row>
            </Col>
          </div>
          <Col lg={12} md={12}>
            <div className="interviews-details">
              <Row>
                <Col lg={12} md={12}>
                  <div className="profile-details-section">
                    <div className="profile-details-tab">
                      <Row className="justify-content-center">
                        {data.sEmpName && <CustomCard name="Employee Name" description={data.sEmpName} />}
                        {data?.sClientName && <CustomCard name="Client Name" description={data?.sClientName} />}
                        {data?.sProjectName && <CustomCard name="Project Name" description={data?.sProjectName} />}
                        {data?.eInterviewStatus && (
                          <CustomCard
                            name="Project Status"
                            description={<span className={interviewStatus(data?.eInterviewStatus)}>{data?.eInterviewStatus}</span>}
                          />
                        )}
                      </Row>
                    </div>
                    <div className="profile-details-tab border-0 pt-0">
                      <Row className="justify-content-center">
                        <Col lg={6} md={6}>
                          <div className="custom-card">
                            <Card>
                              <Card.Body>
                                <Card.Title>Date</Card.Title>
                                <Card.Text className="date-time">{formatDate(data.dInterviewDate)}</Card.Text>
                              </Card.Body>
                            </Card>
                          </div>
                        </Col>
                        <Col lg={6} md={6}>
                          <div className="custom-card">
                            <Card>
                              <Card.Body>
                                <Card.Title>Time</Card.Title>
                                <Card.Text>{data.sInterviewTime}</Card.Text>
                              </Card.Body>
                            </Card>
                          </div>
                        </Col>
                      </Row>
                      <Row className="justify-content-center">
                        <Col lg={6} md={6}>
                          <div className="custom-card">
                            <Card>
                              <Card.Body>
                                <Card.Title>Technology</Card.Title>
                                <div className="button-tag">
                                  {data?.aTechnologyName?.map((item, i) => (
                                    <span key={i} className="light-blue50">
                                      {item}
                                    </span>
                                  ))}
                                </div>
                              </Card.Body>
                            </Card>
                          </div>
                        </Col>
                        {data?.aProjectTag && (
                          <Col lg={6} md={6}>
                            <div className="custom-card">
                              <Card>
                                <Card.Body>
                                  <Card.Title>Project Tag</Card.Title>
                                  <div className="button-tag">
                                    {data?.aProjectTag?.map(({ sTextColor, sBackGroundColor, sName }, i) => (
                                      <span
                                        key={i}
                                        style={{ color: sTextColor, backgroundColor: sBackGroundColor }}
                                        className="light-green"
                                      >
                                        {sName}
                                      </span>
                                    ))}
                                  </div>
                                </Card.Body>
                              </Card>
                            </div>
                          </Col>
                        )}
                      </Row>
                    </div>
                  </div>
                </Col>
              </Row>
            </div>
          </Col>
        </Row>
      </Wrapper>
      <Wrapper>
        <div className="add-interviews">
          <div className="d-flex justify-content-between align-items">
            <PageTitle title="Interview Description" />
            <button className="btn btn-blue" onClick={handleClick}>
              Add
            </button>
          </div>
          <div className="interviews-editor">
            <InterviewEditor editorRef={editorRef} />
          </div>
        </div>
      </Wrapper>
      <Wrapper>
        <div className="add-interviews">
          <div className="d-flex justify-content-between align-items">
            <PageTitle title="Interview Feedback" />
            <button className="btn btn-blue" onClick={handleClick}>
              Add
            </button>
          </div>
          <div className="interviews-editor">
            <InterviewEditor editorRef={editorRef} />
          </div>
        </div>
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
    </section>
  )
}
