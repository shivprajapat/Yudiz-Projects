import React, { useEffect } from 'react'
import { Container, Col, Row, Form, Button } from 'react-bootstrap'
import './style.scss'
import WithAuth from 'shared/components/with-auth'
import { donateCardImg, donateShape } from 'assets/images'
import { useNavigate } from 'react-router-dom'
import { allRoutes } from 'shared/constants/allRoutes'
import { validationErrors } from 'shared/constants/validationErrors'
import { useForm } from 'react-hook-form'
import { useDispatch } from 'react-redux'
import { getUser } from 'modules/user/redux/service'

const Donate = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({ mode: 'all' })

  const handleDonationPayment = (data) => {
    navigate(allRoutes.donatePayment, { state: { amount: data.amount } })
  }

  useEffect(() => {
    const userId = localStorage.getItem('userId')
    dispatch(getUser(userId))
  }, [])

  return (
    <div className="donate-page">
      <div className="inner-donate">
        <Container>
          <Row>
            <Col lg={4} md={4} sm={6}>
              <div className="donate-title">
                <h4 className="donate-heading">Building Better Futures</h4>
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
                  <h6>A Marketplace for Good</h6>
                  <p className="mb-3">
                    A global marketplace like no other focussed on supporting creativity through education and resources, giving back to
                    society through the support of global community based good causes.
                  </p>
                  <p className="mb-3">
                    Forging human to human connections, educating the curious, rewarding the loyal and supporting creative individuals and
                    communities. We believe the more you know, the more you can adapt and thrive within new technological areas.
                  </p>
                  <p>
                    Follow us across social media channels and by signing up to our mailing list to stay informed of the impact your
                    creativity and support is having.
                  </p>
                </div>
                <Form autoComplete="off">
                  <Form.Group className="form-group">
                    <Form.Label>How much would you like to donate (in GBP)</Form.Label>
                    <Form.Control
                      name="amount"
                      type="number"
                      placeholder=""
                      {...register('amount', {
                        required: validationErrors.required,
                        valueAsNumber: true
                      })}
                    />
                    {errors.amount && (
                      <Form.Control.Feedback type="invalid" className="invalidFeedback">
                        {errors.amount.message}
                      </Form.Control.Feedback>
                    )}
                  </Form.Group>
                  <Form.Group className="form-group mb-0 footer-button">
                    <Button className="white-btn" type="submit" onClick={handleSubmit(handleDonationPayment)}>
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
