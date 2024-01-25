import React from 'react'
import { Link } from 'react-router-dom'
import { Container, Navbar } from 'react-bootstrap'

import './style.scss'
import { logoIcon } from 'assets/images'
import KycModal from 'shared/components/kyc-modal'
import TruliooKyc from 'modules/truliooKyc'
import { allRoutes } from 'shared/constants/allRoutes'
import SelectWalletModal from 'shared/components/select-wallet-modal'
import useHeader from './use-header'
import DesktopMenu from 'shared/components/header/DesktopMenu'
import MobileMenu from 'shared/components/header/MobileMenu'
import { useWindowSize } from 'shared/hooks/use-window-size'

const Header = () => {
  const { truliooKyc, connectWallet, onChangeSelectWallet, kyc, onConfirm, onClose, isLoggedIn, setKyc, logOut } = useHeader()
  const { width } = useWindowSize()

  return (
    <>
      {truliooKyc && <TruliooKyc />}
      {connectWallet && <SelectWalletModal show={connectWallet} onCloseSelectWallet={onChangeSelectWallet} />}
      {kyc && <KycModal show={kyc} onConfirm={onConfirm} onClose={onClose} />}

      <header>
        <Navbar bg="light" expand="lg">
          <Container fluid>
            <Navbar.Brand as={Link} to={allRoutes.home}>
              <img src={logoIcon} alt="Nuuway" className="img-fluid" />
            </Navbar.Brand>
            {width >= 992 ? (
              <DesktopMenu isLoggedIn={isLoggedIn} onChangeSelectWallet={onChangeSelectWallet} logOut={logOut} setKyc={setKyc} />
            ) : (
              <MobileMenu isLoggedIn={isLoggedIn} />
            )}
          </Container>
        </Navbar>
      </header>
    </>
  )
}

export default Header
