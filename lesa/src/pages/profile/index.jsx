import React from 'react'
import { Container, Row } from 'react-bootstrap'
import { Outlet } from 'react-router-dom'

import ProfileDetail from 'pages/profile/components/profile-detail'
import './style.scss'
import useProfile from './hooks/use-profile'
import ProfileTabs from 'pages/profile/components/tabs'
import WithAuth from 'shared/components/with-auth'

const Profile = () => {
  const { id, user, tabs } = useProfile()
  return (
    <>
      <div className="profile-main-page">
        <Container fluid>
          <ProfileDetail user={user} />
          <ProfileTabs id={id} tabs={tabs} />
          <div className="tab-content">
            <Row>
              <Outlet />
            </Row>
          </div>
        </Container>
      </div>
    </>
  )
}

export default WithAuth(Profile)
