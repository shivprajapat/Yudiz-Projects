import { coinsIcon, couponsIcon, giftsIcon, userImg } from 'assets/images'
import React from 'react'
import { Button, Card } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import './style.scss'

function MysteryBox() {
  return (
    <Card className="create-items">
      <Card.Header className="img-box">
        <Card.Img
          variant="top"
          src="https://news.mit.edu/sites/default/files/styles/news_article__image_gallery/public/images/202012/MIT-Coding-Brain-01-press_0.jpg?itok=JKoUflf8"
        />
        <Button className="gray-btn" as={Link}>
          <img src={giftsIcon} alt="" /> Mystery Box 1
        </Button>
      </Card.Header>
      <Card.Body>
        <Card.Text>
          <Card.Title>Nft’s</Card.Title>
          <Card.Link as={Link}>
            <img src={userImg} alt="userImg" />
            <p>Above 0.52 ETH</p>
          </Card.Link>
        </Card.Text>
        <Card.Text>
          <Card.Title>Coupons</Card.Title>
          <Card.Link as={Link}>
            <img src={couponsIcon} alt="" />
            <p>Above 0.52 ETH</p>
          </Card.Link>
        </Card.Text>
        <Card.Text>
          <Card.Title>Nuu Coins</Card.Title>
          <Card.Link as={Link}>
            <img src={coinsIcon} alt="" />
            <p>10-1000</p>
          </Card.Link>
        </Card.Text>
      </Card.Body>
      <Card.Footer>
        <Button className="white-btn" as={Link}>Get Loot Box for 100 Nuu Coins</Button>
      </Card.Footer>
    </Card>
  )
}

export default MysteryBox
