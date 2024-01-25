import React from 'react'
import { FormattedMessage } from 'react-intl'
// import PropTypes from 'prop-types'
import { Button } from 'reactstrap'
import Trophy from '../../../assests/images/noDataTrophy.svg'
import { useNavigate } from 'react-router-dom'

function LoginMessage () {
  const navigate = useNavigate()

  return (
    <div className="no-team d-flex align-items-center justify-content-center fixing-width2">
      <div className="" style={{ padding: '40px' }}>
        <img alt="img not found" src={Trophy} />
        <h6 className="mt-4">
          <FormattedMessage id="Trophy_is_waiting_for_you" />
        </h6>
        <Button block className="mt-3" color="primary" onClick={() => navigate('/login')}><FormattedMessage id="Login" /></Button>
      </div>
    </div>
  )
}

LoginMessage.propTypes = {
}

export default LoginMessage
