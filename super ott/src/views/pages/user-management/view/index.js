import { Fragment, useEffect, useState } from 'react'
import { Card, CardHeader, CardTitle, CardBody, FormGroup, Row, Col } from 'reactstrap'
import Breadcrumbs from '@components/breadcrumbs'
import { useParams } from 'react-router-dom'

import { FailureToastNotification } from '../../../../components/ToastNotification'
import axios from 'axios'

const UpdateUser = () => {
  const { id } = useParams()
  const [data, setData] = useState()

  const fetchGenreDetails = () => {
    axios
      .get(`${process.env.REACT_APP_AUTH_URL}/user/view/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('adminAuthToken')}`
        }
      })
      .then((res) => {
        setData(res?.data?.data)
      })
      .catch((error) => {
        FailureToastNotification(error.response?.message)
      })
  }

  useEffect(() => {
    fetchGenreDetails()
  }, [])
  return (
    <Fragment>
      <Breadcrumbs breadCrumbTitle="Super" breadCrumbParent="User Management" breadCrumbActive="User" />
      <Card>
        <CardHeader className="mb-1">
          <CardTitle tag="h4" className="">
            User
          </CardTitle>
        </CardHeader>
        <CardBody>
          <Row>
            <Col md="6" sm="12">
              <FormGroup className="view-user">
                <h5 className="mb-1 pb-0.5 ">Full Name</h5>
                <CardTitle className="badge badge-light-primary sUserName">{data?.sUserName}</CardTitle>
              </FormGroup>
            </Col>
          </Row>
          <Row>
            <Col md="6" sm="12">
              <FormGroup className="view-user">
                <h5 className="mb-1 pb-0.5 ">Gender</h5>
                <CardTitle className="badge badge-light-primary sUserName">{data?.eGender}</CardTitle>
              </FormGroup>
            </Col>
            <Col md="6" sm="12">
              <FormGroup className="view-user">
                <h5 className="mb-1 pb-0.5 ">Date of Birth</h5>
                <CardTitle className="badge badge-light-primary">01 / 01 / 2000</CardTitle>
              </FormGroup>
            </Col>
          </Row>
          <Row>
            <Col md="6" sm="12">
              <FormGroup className="view-user">
                <h5 className="mb-1 pb-0.5 ">Mobile Number</h5>
                <CardTitle className="badge badge-light-primary">{data?.sMobile}</CardTitle>
              </FormGroup>
            </Col>
            <Col md="6" sm="12">
              <FormGroup className="view-user">
                <h5 className="mb-1 pb-0.5 ">Email Id</h5>
                <CardTitle className="badge badge-light-primary">{data?.sEmail}</CardTitle>
              </FormGroup>
            </Col>
          </Row>
        </CardBody>
      </Card>
    </Fragment>
  )
}

export default UpdateUser
