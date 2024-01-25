import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import WithAuth from 'shared/components/with-auth'

import { Col, Row, Form } from 'react-bootstrap'
import './style.scss'
import { getReferralCode } from 'modules/referral/redux/service'
import { SHOW_TOAST } from 'modules/toast/redux/action'
import { TOAST_TYPE } from 'shared/constants'

const Referrals = () => {
  const dispatch = useDispatch()
  const referral = useSelector((state) => state.referral.referral)
  const referralCode = referral?.referral?.referralCode
  const referralLink = `${process.env.REACT_APP_FRONTEND_BASE_URL}/signup?` + `referralCode=${referralCode}`
  useEffect(() => {
    if (!referral) {
      dispatch(getReferralCode())
    }
  }, [])

  const copyToClipboard = (e) => {
    e.preventDefault()
    navigator.clipboard.writeText(referralCode)
    dispatch({
      type: SHOW_TOAST,
      payload: {
        message: 'Referral code copied',
        type: TOAST_TYPE.Success
      }
    })
  }

  const copyLinkToClipboard = (e) => {
    e.preventDefault()
    navigator.clipboard.writeText(referralLink)
    dispatch({
      type: SHOW_TOAST,
      payload: {
        message: 'Referral link copied',
        type: TOAST_TYPE.Success
      }
    })
  }

  return (
    <section className="referrals section-padding">
      {/* <Container> */}
      <div className="referral-container">
        <div className="referrals-tab">
          <Row>
            <Col xxl={7} lg={8}>
              <div className="referrals-content">
                <h3 className="heading">Invite your friends and collect discounts.</h3>
                <p>
                  There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by
                  injected
                </p>
                <Form autoComplete="off">
                  <p className="custom-input">{referralCode}</p>
                  <Form.Control type="submit" className="input" value="Copy" onClick={(e) => copyToClipboard(e)} />
                </Form>
                <button className="btn btn-primary mt-3" onClick={(e) => copyLinkToClipboard(e)}>
                  Share link
                </button>
              </div>
            </Col>
          </Row>
        </div>
      </div>
      {/* </Container> */}
    </section>
  )
}

export default WithAuth(Referrals)
