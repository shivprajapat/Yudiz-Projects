import React from 'react'
import { Container, Row, Col } from 'react-bootstrap'

import profileStyles from '../profile-style.module.scss'
import ProfileSidebar from '@shared/components/profile/profileSidebar'
import ProfileEditContentHelper from './ProfileEditContentHelper'

const ProfileEditContent = () => {
  return (
    <>
      <main className={`${profileStyles.profilePage} common-section`}>
        <Container>
          <Row className="justify-content-center">
            <Col xxl={10} lg={11}>
              <section className={`${profileStyles.profile} d-flex flex-column flex-sm-row common-box p-0`}>
                <ProfileSidebar isEdit>{(props) => <ProfileEditContentHelper {...props} />}</ProfileSidebar>
              </section>
            </Col>
          </Row>
        </Container>
      </main>
    </>
  )
}

export default ProfileEditContent
