import React from 'react'
import { Col, Row } from 'reactstrap'
import StatsCard from './ui-elements/stats/StatsCard'

const Home = () => {
  return (
    <div id="dashboard-ecommerce">
      <Row className="match-height">
        <Col xl="12" md="6" xs="12">
          <StatsCard cols={{ xl: '3', sm: '6' }} />
        </Col>
      </Row>
    </div>
  )
}

export default Home
