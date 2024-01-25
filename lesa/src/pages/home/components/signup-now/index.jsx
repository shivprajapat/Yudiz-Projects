import React from 'react'
import { Container } from 'react-bootstrap'
import { FormattedMessage } from 'react-intl'
import { Link } from 'react-router-dom'

import './style.scss'

function SignupNow() {
  return (
    <>
      <div className="coin-wallet">
        <Container fluid>
          <div className="coin-wallet-content">
            <h3 className="text-uppercase mb-0">
              <FormattedMessage id="createYourNuuCoinWalletAndGet100Coins" />
            </h3>
            <p>
              There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by
              injected humour.
            </p>
            <Link to="/" className="white-border-btn">
              <FormattedMessage id="signUpNow" />
            </Link>
          </div>
        </Container>
      </div>
    </>
  )
}

export default SignupNow
