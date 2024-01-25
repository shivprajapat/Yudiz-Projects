import React from 'react'
import { Container, Row, Col } from 'react-bootstrap'
import dynamic from 'next/dynamic'

import profileStyles from '../profile-style.module.scss'

const ProfileSidebar = dynamic(() => import('@shared/components/profile/profileSidebar'))
const SavedArticleHelper = dynamic(() => import('./SavedArticleHelper'))

function SavedArticle() {
  return (
    <>
      <main className={`${profileStyles.profilePage} common-section`}>
        <Container>
          <Row className="justify-content-center">
            <Col xxl={10} lg={11}>
              <section className={`${profileStyles.profile} d-flex flex-column flex-sm-row common-box p-0`}>
                <ProfileSidebar>{(props) => <SavedArticleHelper {...props} />}</ProfileSidebar>
              </section>
            </Col>
          </Row>
        </Container>
      </main>
    </>
  )
}

export default SavedArticle
