import React from 'react'
import './_donate.scss'
import WithAuth from 'shared/components/with-auth'
import { Container, Col, Row, Form, Button } from 'react-bootstrap'
import { donateCardImg, donateShape } from 'assets/images'
const Donate = () => {
  return (
    <div className="donate-page">
      <div className="inner-donate">
        <Container>
          <Row>
            <Col lg={4} md={4} sm={6}>
              <div className="donate-title">
                <h4>Help the poor for their better future</h4>
              </div>
            </Col>
            <div className="donateShape">
              <img src={donateCardImg} className="img-fluid donate-card-img" alt="" />
              <img src={donateShape} className="img-fluid donate-shape-img" alt="" />
            </div>
          </Row>
        </Container>
      </div>
      <div className="inner-donate-cause">
        <Container>
          <Row>
            <Col lg={6} md={6}>
              <div className="cause-item">
                <div className="donate-title">
                  <h6>Donate for a good cause </h6>
                  <p>
                    when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters,
                    as opposed to using Content here, content here, making it look like readable English look...{' '}
                  </p>
                </div>
                <Form autoComplete="off">
                  <Form.Group className="form-group">
                    <Form.Label>How would you like to donate ?</Form.Label>
                    <Row className="radio-items">
                      <Form.Group as={Col} lg="4" md="6">
                        <Form.Check
                          type="radio"
                          name="Crypto"
                          className="radio-box"
                          id="check1"
                          label={<span id="check1">Crypto Currency</span>}
                        />
                      </Form.Group>{' '}
                      <Form.Group as={Col} lg="4" md="6">
                        <Form.Check
                          type="radio"
                          name="Crypto"
                          className="radio-box"
                          id="check2"
                          label={<span id="check2">Fiat Currency</span>}
                        />
                      </Form.Group>{' '}
                      <Form.Group as={Col} lg="4" md="6">
                        <Form.Check
                          type="radio"
                          name="Crypto"
                          className="radio-box"
                          id="check3"
                          label={<span id="check3">Nuu Coins</span>}
                        />
                      </Form.Group>
                    </Row>
                  </Form.Group>
                  <Form.Group className="form-group">
                    <Form.Label>How much would you like to donate</Form.Label>
                    <Form.Control name="password" placeholder="0.005 ETH" />
                  </Form.Group>
                  <Form.Group className="form-group mb-0 footer-button">
                    <Button className="white-btn" type="submit">
                      Make Payment
                    </Button>
                  </Form.Group>
                </Form>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </div>
  )
}

export default WithAuth(Donate)
