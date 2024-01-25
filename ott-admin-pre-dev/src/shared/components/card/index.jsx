import React from 'react'
import PropTypes from 'prop-types'
import Card from 'react-bootstrap/Card'
import './style.scss';

export default function Cards({ cardtext, cardtitle }) {
  return (
    <Card className='dash-card'>
      <Card.Body>
        <Card.Text>{cardtext}</Card.Text>
        <Card.Title>{cardtitle}</Card.Title>
      </Card.Body>
    </Card>
  )
}

Card.propTypes = {
  cardtext: PropTypes.string,
  cardtitle: PropTypes.string
}
