import React, { useRef, useState } from 'react'
import PropTypes from 'prop-types'

import { Link } from 'react-router-dom'
import { Button, Card, Popover } from 'react-bootstrap'

import './style.scss'
import { assetIcon, couponIcon, giftsIcon, nuuCoinsIcon, userProfileIcon } from 'assets/images'
import { allRoutes } from 'shared/constants/allRoutes'
import PermissionProvider from 'shared/components/permission-provider'
import './popover.css'
import Overlay from 'react-bootstrap/Overlay'
function LootBox({ lootBoxId, name, price, thumbnailUrl, nuuCoinHints, couponsHints, assetHints, blockchainNetwork, availableStock }) {
  const isAuthenticated = localStorage.getItem('userToken')
  const [show, setShow] = useState(false)
  const target = useRef(null)
  // const {
  //   state: { profileData = {} }
  // } = React.useContext(GlobalEventsContext)

  // let blockchainNetworkSymbol

  // switch (blockchainNetwork) {
  //   case 'Ethereum':
  //     blockchainNetworkSymbol = 'ETH'
  //     break
  //   case 'Polygon':
  //     blockchainNetworkSymbol = 'MATIC'
  //     break
  //   case 'Solana':
  //     blockchainNetworkSymbol = 'SOL'
  //     break
  //   default:
  //     blockchainNetworkSymbol = ''
  // }

  const getLink = () => (isAuthenticated ? allRoutes.lootBoxDetails(lootBoxId) : allRoutes.login)

  return (
    <Card className="create-items position-relative">
      <Link to={getLink()} className="overlay-link" />
      <Card.Header className="img-box">
        <Card.Img variant="top" src={thumbnailUrl || userProfileIcon} />
        <Button className="gray-btn" as={Link} to={getLink()}>
          <img src={giftsIcon} alt="" /> {name}
        </Button>
      </Card.Header>
      <Card.Body>
        {assetHints && (
          <Card.Text as="div" className="">
            <Card.Title>Assets</Card.Title>
            <Card.Link as={Link} to={getLink()}>
              <img src={assetIcon} alt="userImg" />
              <p>
                Above &nbsp; {assetHints.minAmount} &nbsp; NFTs
              </p>
            </Card.Link>
          </Card.Text>
        )}
        {couponsHints?.description && (
          <>
            <Card.Text
              as="div"
              // className='popover__wrapper'
              ref={target}
              onMouseEnter={() => setShow(true)}
              onMouseLeave={() => setShow(null)}
            >
              <Card.Title>Coupons</Card.Title>
              <Card.Link as={Link} to={getLink()} >
                <img src={couponIcon} alt="" className='loot-box-icn'/>
                <p>
                  Offer
                </p>
              </Card.Link>
            </Card.Text>
              <Overlay target={target.current} show={show} placement="top">
                {(props) => (
                  <Popover id="overlay-example" {...props}>
                  <Popover.Body>
                    {couponsHints?.description}
                  </Popover.Body>
                  </Popover>
                )}
              </Overlay>
          </>
        )}
        {nuuCoinHints?.minCount && nuuCoinHints?.maxCount && (
          <Card.Text as="div">
            <Card.Title>Nuucoins</Card.Title>
            <Card.Link as={Link} to={getLink()}>
              <img src={nuuCoinsIcon} alt="" />
              <p>
                {nuuCoinHints.minCount} - {nuuCoinHints.maxCount}
              </p>
            </Card.Link>
          </Card.Text>
        )}
      </Card.Body>
      {availableStock > 0 && <PermissionProvider isUserOnly>
        <Card.Footer>
          <Button className="white-btn" as={Link} to={getLink()}>
            Get Loot Box for {price} Nuucoins
          </Button>
        </Card.Footer>
      </PermissionProvider>}
    </Card>
  )
}

LootBox.propTypes = {
  lootBoxId: PropTypes.number,
  name: PropTypes.string,
  price: PropTypes.number,
  availableStock: PropTypes.number,
  thumbnailUrl: PropTypes.string,
  nuuCoinHints: PropTypes.object,
  couponsHints: PropTypes.object,
  assetHints: PropTypes.object,
  blockchainNetwork: PropTypes.string
}

export default LootBox
