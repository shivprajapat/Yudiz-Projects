import React from 'react'
import { Col, Card } from 'react-bootstrap'
import PropTypes from 'prop-types'
import './_card.scss'

const CustomCard = ({ name, description }) => {
  return (
    <Col lg={3} md={6}>
      <div className="custom-card">
        <Card>
          <Card.Body>
            <Card.Title>{name}</Card.Title>
            <Card.Text as="div">{description} </Card.Text>
          </Card.Body>
        </Card>
      </div>
    </Col>
  )
}

CustomCard.propTypes = {
  name: PropTypes.string,
  description: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
}
export default CustomCard
