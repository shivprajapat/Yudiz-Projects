import React from 'react'
import { Col, Card } from 'react-bootstrap'
import PropTypes from 'prop-types'
import './_style.scss'

const DashboardCard = ({ name, number, color }) => {
  return (
    <Col xxl={3} lg={4} md={6}>
      <div className="custom-card">
        <Card>
          <Card.Body>
            <Card.Title>{name}</Card.Title>
            <Card.Text as="h3" style={{ color: color }}>
              {number}{' '}
            </Card.Text>
          </Card.Body>
        </Card>
      </div>
    </Col>
  )
}

DashboardCard.propTypes = {
  name: PropTypes.string,
  color: PropTypes.string,
  number: PropTypes.number,
}
export default DashboardCard
