import React from 'react'
import { Link } from 'react-router-dom'
import { Row } from 'reactstrap'
import { FormattedMessage } from 'react-intl'
import useActiveSports from '../api/activeSports/queries/useActiveSports'

function NotFound () {
  const { activeSport } = useActiveSports()

  return (
    <div className="d-flex justify-content-center align-items-center h-100">
      <Row>
        <div className="notFound">
          <h1>
            <span className="span"><FormattedMessage id="404" /></span>
            <br />
            <h1><FormattedMessage id="Page_not_found" /></h1>
          </h1>
          <br />
          <Link to={`/home/${activeSport}`}>
            <FormattedMessage id="Go_home" />
          </Link>
        </div>
      </Row>
    </div>
  )
}

export default NotFound
