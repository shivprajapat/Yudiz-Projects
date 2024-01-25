import React from 'react'
import { Button, Modal } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import { FormattedMessage } from 'react-intl'

import { orderStackOneIcon, orderStackTwoIcon, orderStackThreeIcon } from 'assets/images'
import './style.scss'

const CommonModal = ({ show, titleId, icon, background, btnTxtId, btnLink, topTitleId, topDescId, isForSignup, data, description }) => {
  return (
    <Modal show={show} centered className="modal-medium order-placed-modal">
      <Modal.Body className="text-center">
        <div className="order-placed-modal-content">
          <div className="top-title">
            {topTitleId && (
              <h5>
                <FormattedMessage id={topTitleId} />
              </h5>
            )}

            {isForSignup && data && (
              <span>
                <FormattedMessage id={topDescId} /> <strong>{data.mail}</strong>
              </span>
            )}
          </div>

          {icon && <img src={icon} alt="check-img" className="img-fluid check-img" />}

          {titleId && (
            <h4>
              <FormattedMessage id={titleId} />
            </h4>
          )}
          {description && <p className="lead">{description}</p>}

          {btnTxtId && (
            <div className="modal-btns d-flex justify-content-center">
              <Button className="normal-btn flex-shrink-0" variant="link" as={Link} to={btnLink}>
                <FormattedMessage id={btnTxtId} />
              </Button>
            </div>
          )}
        </div>

        {background && (
          <>
            <img src={orderStackOneIcon} alt="check-img" className="img-fluid stackone" />
            <img src={orderStackTwoIcon} alt="check-img" className="img-fluid stacktwo" />
            <img src={orderStackThreeIcon} alt="check-img" className="img-fluid stackthree" />
          </>
        )}
      </Modal.Body>
    </Modal>
  )
}
CommonModal.propTypes = {
  show: PropTypes.bool,
  icon: PropTypes.any,
  titleId: PropTypes.string,
  btnTxtId: PropTypes.string,
  background: PropTypes.bool,
  btnLink: PropTypes.string,
  topTitleId: PropTypes.string,
  topDescId: PropTypes.string,
  isForSignup: PropTypes.bool,
  data: PropTypes.object,
  description: PropTypes.string || null
}

export default CommonModal
