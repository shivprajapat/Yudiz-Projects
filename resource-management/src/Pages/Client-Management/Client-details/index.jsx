import React, { useState } from 'react'
import Wrapper from 'Components/wrapper'
import './_client-management.scss'
import PageTitle from 'Components/Page-Title'
import DescriptionBox from 'Components/Description'
import Delete from 'Assets/Icons/Delete'
import Edit from 'Assets/Icons/Edit'
import ActionButton from 'Components/ActionButton/index'
import { Row, Col, Dropdown } from 'react-bootstrap'
import iconPhone from 'Assets/Icons/phone.svg'
import iconEmail from 'Assets/Icons/email.svg'

import { useMutation, useQuery } from 'react-query'
import { useNavigate, useParams } from 'react-router-dom'
import { getSpecificClient, getSpecificClientProjects } from 'Query/Client/client.query'
import CustomModal from 'Components/Modal'
import Button from 'Components/Button'
import { deleteClient } from 'Query/Client/client.mutation'
import { Loading } from 'Components'
import { countries, getFlagImage, projectStatusColor, toaster } from 'helpers/helper'
import TablePagination from 'Components/Table-pagination'
import SkillsCard from 'Components/SkillsCard'
const ClientBox = (title, images) => {
  return (
    <div className="icon">
      <img src={images} alt="" />
      <p>{title}</p>
    </div>
  )
}
export default function ClientDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [data, setData] = useState({})
  const [projects, setProjects] = useState({})
  const [modal, setModal] = useState({ open: false })
  const [requestParams, setRequestParams] = useState({
    page: 0,
    limit: 3,
    eProjectStatus: '',
  })

  const { isLoading, isFetching } = useQuery(['specificClient', id], () => getSpecificClient(id), {
    select: (data) => data?.data?.data,
    onSuccess: (data) => {
      setData(data)
    },
  })
  const { isLoading: projectsLoading, isFetching: ProjectFetching } = useQuery(
    ['specificClientProjects', id, requestParams],
    () => getSpecificClientProjects(id, requestParams),
    {
      select: (data) => data?.data?.data,
      onSuccess: (data) => {
        setProjects(data)
      },
    }
  )

  const mutation = useMutation(deleteClient, {
    onSuccess: (data) => {
      toaster(data.data.message)
      setModal({ open: false })
      navigate('/client-management')
    },
  })

  function gotoEdit() {
    navigate('/client-management/edit/' + id)
  }

  if (isLoading || isFetching) return <Loading />

  return (
    <section className="client-section">
      <Wrapper>
        <Row>
          <Col lg={12}>
            <Row className="justify-content-center">
              <Col xxl={6} lg={10} md={9}>
                <div className="client-head">
                  <PageTitle title={data?.sName} />
                  <ul className="client-links">
                    <li>{ClientBox(data?.sEmail, iconEmail)}</li>
                    <li>{ClientBox(data?.sMobNum, iconPhone)}</li>
                    <li>
                      <div className="icon">
                        {getFlagImage(data?.sCode || countries[data?.sCountry])}
                        <p>{data?.sCountry}</p>
                      </div>
                    </li>
                  </ul>
                </div>
              </Col>
              <Col xxl={6} lg={2} md={3}>
                <div className="fs-3 d-flex gap-4 justify-content-end">
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
        </Row>
      </Wrapper>
      {data?.sOtherInfo && (
        <Wrapper>
          <div className="pageTitle-head">
            <PageTitle title="Other Information" />
          </div>
          <DescriptionBox title={data?.sOtherInfo} />
        </Wrapper>
      )}
      <Wrapper transparent className="mb-0 pb-0">
        {(projectsLoading || ProjectFetching) && <Loading absolute />}
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
                  {['On Hold', 'In Progress', 'Completed', 'Pending']?.map((i) => (
                    <Dropdown.Item as="button" key={i} onClick={() => setRequestParams({ ...requestParams, eProjectStatus: i })}>
                      {i}
                    </Dropdown.Item>
                  ))}
                </Dropdown.Menu>
              </Dropdown>
            </div>
          </Col>
        </Row>
        <Row className="project-skills">
          {projects?.clientProject?.map((t, i) => (
            <SkillsCard
              key={i}
              icon={'https://jr-web-developer.s3.ap-south-1.amazonaws.com/' + t?.sLogo}
              btnTxt={t?.eProjectStatus}
              btnClass={projectStatusColor(t?.eProjectStatus)}
              name={t?.sName}
              description={t?.sProjectDescription}
            />
          ))}
        </Row>
      </Wrapper>
      {!projects?.clientProject?.length && <Wrapper >No Records found</Wrapper>}
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
      <CustomModal open={modal.open} handleClose={() => setModal({ open: false })} title="are you sure?">
        <h6>are you sure you want to delete?</h6>
        <div className="d-flex justify-content-between">
          <div></div>
          <div className="mt-5">
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
