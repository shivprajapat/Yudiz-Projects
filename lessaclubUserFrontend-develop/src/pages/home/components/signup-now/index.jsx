import React from 'react'
import { Button, Container } from 'react-bootstrap'
import { FormattedMessage } from 'react-intl'
import { useNavigate } from 'react-router-dom'

import './style.scss'

function SignupNow() {
  const navigate = useNavigate()

  const signUpHandler = () => {
    navigate('/signup')
  }

  return (
    <>
      <div className="coin-wallet">
        <Container fluid>
          <div className="coin-wallet-content">
            <h3 className="text-uppercase mb-0">
              <FormattedMessage id="createYourNuuCoinWalletAndGet100Coins" />
            </h3>
            <p>
              Earn NUUCOINS through sign-up, referrals and use across our entire eco-system of Brands and Partnered Services
            </p>
            <Button onClick={signUpHandler} className="white-border-btn">
              <FormattedMessage id="signUpNow" />
            </Button>
          </div>
        </Container>
      </div>
    </>
  )
}

export default SignupNow
