import React from 'react'
import { Col, Card } from 'react-bootstrap'
import PropTypes from 'prop-types'
import './_skills-card.scss'
const SkillsCard = ({ icon, btnTxt, btnClass, name, description }) => {
  return (
    <Col lg={4} md={6}>
      <div className="skills-card">
        <Card>
          <Card.Body className='skills-card-head'>
            <div className="skills-img">
            <img src={icon} alt="icon" />
            </div>
            <span className={btnClass}>{btnTxt} </span>
          </Card.Body>
          <Card.Body>
            <Card.Title>{name}</Card.Title>
            <Card.Text>{description} </Card.Text>
          </Card.Body>
        </Card>
      </div>
    </Col>
  )
}

SkillsCard.propTypes = {
  icon: PropTypes.string,
  btnTxt: PropTypes.string,
  btnClass: PropTypes.string,
  name: PropTypes.string,
  description: PropTypes.string,
}
export default SkillsCard
