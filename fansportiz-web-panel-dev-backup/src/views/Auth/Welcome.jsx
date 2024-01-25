import React from 'react'
import { Row, Col } from 'reactstrap'
// import PropTypes from 'prop-types'
import { FormattedMessage } from 'react-intl'
import { Link } from 'react-router-dom'
import logo from '../../assests/images/fansportiz_logo.svg'
import useActiveSports from '../../api/activeSports/queries/useActiveSports'

function Welcome () {
  const { activeSport } = useActiveSports()

  return (
    <div className="d-flex justify-content-center align-items-center h-100 welcome">
      <img alt="" src={logo} width="200px" />
      <div className="welcome-inner">
        <Link className="btn btn-white d-block" to={`/home/${activeSport}/v1`}>
          <FormattedMessage id="Lets_Play" />
        </Link>
        <div className="welcome-login-block text-center">
          <Row>
            <Col className="col-6">
              <p className="small-text"><FormattedMessage id="New_User" /></p>
              <Link to="/sign-up"><FormattedMessage id="Sign_up" /></Link>
            </Col>
            <Col className="col-6">
              <p className="small-text"><FormattedMessage id="Already_user" /></p>
              <Link to="/login"><FormattedMessage id="Login" /></Link>
            </Col>
          </Row>
        </div>
      </div>
    </div>
  )
}

// Welcome.propTypes = {
// }

export default Welcome
