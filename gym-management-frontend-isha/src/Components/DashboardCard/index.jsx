import React from 'react'
import PropTypes from 'prop-types'
import { Card } from 'react-bootstrap'
import './_style.scss'

const DashboardCard = ({ name, number, color, onClick }) => {
  return (
    // <Col xxl={3} lg={4} md={6}>
      <div className="custom-card mb-4">
        <Card style={{ backgroundColor: color }} onClick={onClick}>
          <Card.Body>
            <Card.Title style={{ color: 'white' }}>{name}</Card.Title>
            <Card.Text as="h3" style={{ color: 'white' }}>
              {number}
            </Card.Text>
          </Card.Body>
        </Card>
      </div>
    // </Col>
  )
}

DashboardCard.propTypes = {
  name: PropTypes.string,
  color: PropTypes.string,
  number: PropTypes.number,
  onClick: PropTypes.func,
}
export default DashboardCard
