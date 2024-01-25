import React from 'react'
import PropTypes from 'prop-types'
import { Button, Card } from 'react-bootstrap'
import { Link } from 'react-router-dom'

import './style.scss'
import { allRoutes } from 'shared/constants/allRoutes'
import { giftsIcon, userProfileIcon } from 'assets/images'
import PermissionProvider from 'shared/components/permission-provider'

function MysteryBox({ mysteryBoxId, name, price, thumbnailUrl, availableStock }) {
  const isAuthenticated = localStorage.getItem('userToken')

  const getLink = () => (isAuthenticated ? allRoutes.mysteryBoxDetails(mysteryBoxId) : allRoutes.login)

  return (
    <Card className="create-items-mystery position-relative">
      <Link to={getLink()} className="overlay-link" />

      <Card.Header className="img-box">
        <Card.Img variant="top" src={thumbnailUrl || userProfileIcon} />
        <Button className="gray-btn" as={Link} to={getLink()}>
          <img src={giftsIcon} alt="" /> {name.slice(0, 20)}
        </Button>
      </Card.Header>
      {availableStock && <PermissionProvider isUserOnly>
        <Card.Footer>
          <Button className="white-btn" as={Link} to={getLink()}>
            Buy for {price} Nuucoins
          </Button>
        </Card.Footer>
      </PermissionProvider>}
    </Card>
  )
}

MysteryBox.propTypes = {
  mysteryBoxId: PropTypes.number,
  availableStock: PropTypes.number,
  name: PropTypes.string,
  price: PropTypes.number,
  thumbnailUrl: PropTypes.string
}

export default MysteryBox
