import React from 'react'
import { Container, Row, Col, Nav, Tab, Button } from 'react-bootstrap'
import { Link } from 'react-router-dom'

import './style.scss'
import { arrowBackIcon } from 'assets/images'
import Information from './components/information'
import Links from './components/links'
import { allRoutes } from 'shared/constants/allRoutes'
import useEditProfile from './hooks/use-edit-profile'
import BankAccount from './components/bank-account'
import ProfileImages from './components/profile-images'
import WithAuth from 'shared/components/with-auth'

const EditProfile = () => {
  const { selectedTab, handleTabChange, handleStepSubmit, defaultValues, loading } = useEditProfile()

  return (
    <section className="edit-profile-section section-padding">
      <Container>
        <Row>
          <Col md={6}>
            <div className="back-arrow-box">
              <Button className="back-btn" as={Link} to={allRoutes.profileCollected}>
                <img src={arrowBackIcon} alt="" />
              </Button>
              <h3 className="arrow-heading">Edit Profile</h3>
            </div>
          </Col>
        </Row>
      </Container>

      <ProfileImages defaultValues={defaultValues} />

      <Container id="edit-profile-container">
        <Tab.Container id="edit-profile-tabs" className="side-tabs" activeKey={selectedTab}>
          <Row>
            <Col xxl={3} lg={4} md={6}>
              <Nav variant="pills" className="flex-column">
                <Nav.Item onClick={() => handleTabChange('basicInformation')}>
                  <Nav.Link eventKey="basicInformation">Basic Information</Nav.Link>
                </Nav.Item>
                <Nav.Item onClick={() => handleTabChange('links')}>
                  <Nav.Link eventKey="links">Links</Nav.Link>
                </Nav.Item>
                <Nav.Item onClick={() => handleTabChange('bankAccount')}>
                  <Nav.Link eventKey="bankAccount">Accounts</Nav.Link>
                </Nav.Item>
              </Nav>
            </Col>
            <Col xxl={6} lg={7} md={6} className="offset-xxl-1 offset-lg-1">
              <div className="edit-profile-right-section">
                <Tab.Content>
                  <Tab.Pane eventKey="basicInformation">
                    <Information handleStepSubmit={handleStepSubmit} defaultValues={defaultValues} loading={loading} />
                  </Tab.Pane>
                  <Tab.Pane eventKey="links" mountOnEnter>
                    <Links handleStepSubmit={handleStepSubmit} defaultValues={defaultValues} loading={loading} />
                  </Tab.Pane>
                  <Tab.Pane eventKey="bankAccount" mountOnEnter>
                    <BankAccount handleStepSubmit={handleStepSubmit} defaultValues={defaultValues} loading={loading} />
                  </Tab.Pane>
                </Tab.Content>
              </div>
            </Col>
          </Row>
        </Tab.Container>
      </Container>
    </section>
  )
}

export default WithAuth(EditProfile)
