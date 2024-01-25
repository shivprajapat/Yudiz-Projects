import React from 'react'
import { Container, Row, Col, Nav, Tab, Button } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'

import './style.scss'
import { arrowBackIcon, galleryEditIcon, userImg, profileBannerImg } from 'assets/images'
import Information from './components/information'
import Links from './components/links'
import { allRoutes } from 'shared/constants/allRoutes'
import useEditProfile from './hooks/use-edit-profile'

const EditProfile = () => {
  const navigate = useNavigate()
  const { selectedTab, handleTabChange, handleStepSubmit, defaultValues, loading } = useEditProfile()

  return (
    <section className="edit-profile-section section-padding">
      <Container>
        <Row>
          <Col md={6}>
            <div className="back-arrow-box">
              <Button className="back-btn" onClick={() => navigate(allRoutes.profileCollected)}>
                <img src={arrowBackIcon} alt="" />
              </Button>
              <h3 className="arrow-heading">Edit Profile</h3>
            </div>
          </Col>
        </Row>
      </Container>
      <div className="edit-profile-banner">
        <div className="edit-profile-banner-content">
          <img src={profileBannerImg} alt="banner-img" className="img-fluid profile-ban-img" />
          <div className="file-input">
            <input type="file" name="addImage" id="addImage" accept="image/*,video/*,audio/*" />
            <div className="file-input-text">
              <img src={galleryEditIcon} alt="" />
              <span>Replace Photo</span>
            </div>
          </div>
        </div>

        <div className="banner-left-image flex-shrink-0">
          <div className="banner-user-image">
            <img src={userImg} alt="profile-img" className="img-fluid user-img" />
            <div className="file-input">
              <input type="file" name="addImage" id="addImage" accept="image/*,video/*,audio/*" />
              <div className="file-input-text">
                <img src={galleryEditIcon} alt="" />
                <span>Replace Photo</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Container id="edit-profile-container">
        <Tab.Container id="edit-profile-tabs" className="side-tabs" activeKey={selectedTab}>
          <Row>
            <Col xxl={3} lg={4} md={6}>
              <Nav variant="pills" className="flex-column">
                <Nav.Item onClick={() => handleTabChange('basicInformation')}>
                  <Nav.Link eventKey="basicInformation">Basic Information</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="links">Links</Nav.Link>
                </Nav.Item>
              </Nav>
            </Col>
            <Col xxl={6} lg={7} md={6} className="offset-xxl-1 offset-lg-1">
              <div className="edit-profile-right-section">
                <Tab.Content>
                  <Tab.Pane eventKey="basicInformation">
                    <Information handleStepSubmit={handleStepSubmit} defaultValues={defaultValues} />
                  </Tab.Pane>
                  <Tab.Pane eventKey="links">
                    <Links handleStepSubmit={handleStepSubmit} defaultValues={defaultValues} loading={loading} />
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

export default EditProfile
