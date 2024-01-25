import React, { useState } from 'react'
import { FormattedMessage } from 'react-intl'
import { Button, Col, Container, Row } from 'react-bootstrap'

import './style.scss'
import { connectWallet1Img, connectWallet2Img } from 'assets/images'
import SelectWalletModal from 'shared/components/select-wallet-modal'

const ConnectWallet = () => {
  const [connectWallet, setConnectWallet] = useState(false)

  const onChangeSelectWallet = () => {
    setConnectWallet(!connectWallet)
  }

  return (
    <>
      {connectWallet && <SelectWalletModal show={connectWallet} onCloseSelectWallet={onChangeSelectWallet} />}

      <div className="connect-wallet">
        <Container fluid>
          <Row>
            <Col md="5">
              <div className="wallet-title">
                <h2 className="text-uppercase">
                  <FormattedMessage id="perhaps" /> <br></br> <FormattedMessage id="youWillBe" /> <br></br>
                  <FormattedMessage id="theLucky" /> <br></br> <FormattedMessage id="person" />
                </h2>
                <Button className="black-btn" onClick={onChangeSelectWallet}>
                  <FormattedMessage id="connectWallet" />
                </Button>
              </div>
            </Col>
            <Col md="7">
              <div className="wallet-content">
                <p>
                  <FormattedMessage id="lootCratesWillBeAvailableWhenYouConnectYourWallet" />
                </p>
                <div className="wallet-images">
                  <img src={connectWallet1Img} alt="wallet-img" className="img-fluid wall-img-1" />
                  <img src={connectWallet2Img} alt="wallet-img" className="img-fluid wall-img-2" />
                  <h3>
                    <FormattedMessage id="open" />
                    <span>
                      <FormattedMessage id="crate" />
                    </span>
                  </h3>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </>
  )
}

export default ConnectWallet
