import React from 'react'

import './style.scss'
import CommunityMain from 'pages/community/components/CommunityMain'
import CommunitySideBar from 'pages/community/components/CommunitySideBar'
import { Col, Row } from 'react-bootstrap'
import WriteInCommunity from 'pages/community/components/WriteInCommunity'

const Community = () => {
  return (
    <section className='communities'>
      <div className="container-fluid">
      <Row>
      <Col xxl={8} lg={10} md={10}><WriteInCommunity /></Col>
        <Col xxl={4} lg={2} md={2}></Col>
        <Col xxl={8} lg={8} md={6}><CommunityMain /></Col>
        <Col xxl={4} lg={4} md={6}><CommunitySideBar /></Col>
      </Row>
      </div>
    </section>
  )
}

export default Community
