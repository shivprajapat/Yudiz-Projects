import React, { memo } from 'react'
import { Link } from 'react-router-dom'
import { Container, Navbar } from 'react-bootstrap'

import './style.scss'
import { logoIcon } from 'assets/images'
import KycModal from 'shared/components/kyc-modal'
import TruliooKyc from 'modules/truliooKyc'
import { allRoutes } from 'shared/constants/allRoutes'
import SelectWalletModal from 'shared/components/select-wallet-modal'
import useHeader from './use-header'
import DesktopMenu from 'shared/components/header/desktop-menu'
import MobileMenu from 'shared/components/header/mobile-menu'

const Header = () => {
  const { truliooKyc, connectWallet, onChangeSelectWallet, kyc, onConfirm, onClose, isLoggedIn, handleKyc, logOut } = useHeader()

  return (
    <>
      {truliooKyc && <TruliooKyc />}
      <SelectWalletModal networkGeneric={true} show={connectWallet} onCloseSelectWallet={onChangeSelectWallet} />
      {kyc && <KycModal show={kyc} onConfirm={onConfirm} onClose={onClose} />}

      <header>
        <Navbar bg="light" expand="lg">
          <Container fluid>
            <Navbar.Brand as={Link} to={allRoutes.home}>
              <img src={logoIcon} alt="Nuuway" className="img-fluid" />
            </Navbar.Brand>
            <DesktopMenu isLoggedIn={isLoggedIn} onChangeSelectWallet={onChangeSelectWallet} logOut={logOut} handleKyc={handleKyc} />
            <MobileMenu isLoggedIn={isLoggedIn} onChangeSelectWallet={onChangeSelectWallet} logOut={logOut} handleKyc={handleKyc} />
          </Container>
        </Navbar>
      </header>
    </>
  )
}

export default memo(Header)
