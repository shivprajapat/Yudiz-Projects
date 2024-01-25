import React from 'react'
import WithAuth from 'shared/components/with-auth'

import './style.scss'
import { Col, Container, Row, Form } from 'react-bootstrap'

const Referrals = () => {
  return (
    <section className="referrals section-padding">
      <Container>
        <div className="referrals-tab">
          <Row>
            <Col xxl={7} lg={8}>
              <div className="referrals-content">
                <h3 className="heading">Invite your friends and collect discounts.</h3>
                <p>
                  There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by
                  injected
                </p>
                <Form>
                  <Form.Control type="email" className="input" />
                  <Form.Control type="submit" className="input" value="Copy" />
                </Form>
              </div>
            </Col>
          </Row>
        </div>
      </Container>
    </section>
  )
}

export default WithAuth(Referrals)
