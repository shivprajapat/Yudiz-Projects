import React from 'react'
import { Button } from 'react-bootstrap'
import PropTypes from 'prop-types'

import { plusIcon } from 'assets/images'

const CardHeading = ({ title, btnText, btnHandler, isActionDisabled }) => {
  return (
    <div className="card-heading-box">
      <h5>{title}</h5>
      {!isActionDisabled && (
        <div className="btn-block">
          <Button className="white-btn" onClick={btnHandler}>
            {btnText}
            <img src={plusIcon} alt="add" />
          </Button>
        </div>
      )}
    </div>
  )
}
CardHeading.propTypes = {
  title: PropTypes.string,
  btnText: PropTypes.string,
  btnHandler: PropTypes.func,
  isActionDisabled: PropTypes.bool
}

export default CardHeading
