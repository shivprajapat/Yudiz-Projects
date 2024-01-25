import { giftsIcon } from 'assets/images'
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
      <Card.Footer>
        <Button className="white-btn" as={Link}>
          Buy for 100 Nuu Coins
        </Button>
      </Card.Footer>
    </Card>
  )
}

export default MysteryBox
