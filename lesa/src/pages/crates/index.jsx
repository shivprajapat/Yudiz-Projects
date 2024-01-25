import React from 'react'

import './style.scss'
import PageHeader from 'shared/components/page-header'
import LootBox from './components/loot-box'
import MysteryBox from './components/mystery-box'
import { Col, Container, Row } from 'react-bootstrap'

const Crates = () => {
  return (
    <section className="crates-page section-padding">
      <Container>
        <PageHeader title="Crates" />

        <div className="mastery-section">
        <h4 className="heading">Mystery Boxes</h4>
          <Row>
          <Col lg={4} md={6}>
            <MysteryBox />
          </Col>
          <Col lg={4} md={6}>
            <MysteryBox />
          </Col>
          <Col lg={4} md={6}>
            <MysteryBox />
          </Col>
        </Row>
        </div>
        <div className="lootbox-section">
        <h4 className="heading">Loot Boxes</h4>
         <Row>
          <Col lg={6} md={6}>
          <LootBox />
          </Col>
          <Col lg={6} md={6}>
          <LootBox />
          </Col>
          <Col lg={6} md={6}>
          <LootBox />
          </Col>
          <Col lg={6} md={6}>
          <LootBox />
          </Col>
        </Row>
        </div>
      </Container>
    </section>
  )
}

export default Crates
