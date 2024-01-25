import React from 'react'
import { Container, Row, Col } from 'react-bootstrap'
import PropTypes from 'prop-types'
import dynamic from 'next/dynamic'

import profileStyles from '../profile-style.module.scss'
import ProfileContentHelper from './ProfileContentHelper'

const ProfileSidebar = dynamic(() => import('@shared/components/profile/profileSidebar'))

const ProfileContent = ({ isEdit }) => {
  return (
    <main className={`${profileStyles.profilePage} common-section`}>
      <Container>
        <Row className="justify-content-center">
          <Col xl={10}>
            <section className={`${profileStyles.profile} d-flex flex-column flex-sm-row common-box p-0`}>
              <ProfileSidebar>
                {(props) => <ProfileContentHelper {...props} />}
              </ProfileSidebar>
            </section>
          </Col>
        </Row>
      </Container>
    </main>
  )
}

ProfileContent.propTypes = {
  isEdit: PropTypes.bool
}

export default ProfileContent
