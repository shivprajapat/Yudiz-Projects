import React from 'react'
import { Button, Modal } from 'react-bootstrap'
import PropTypes from 'prop-types'

import { modalMonkeyImg } from 'assets/images'
import './KycModal.scss'

const KycModal = ({ show, onClose, onConfirm }) => {
  return (
    <Modal show={show} onHide={onClose} centered className="modal-medium kyc-modal">
      <Modal.Body className="text-center">
        <div className="kyc-modal-content">
          <img src={modalMonkeyImg} alt="monkey-nft" className="img-fluid" />
          <h5>Register KYC</h5>
          <p>
            Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit.
            Exercitation veniam consequat sunt nostrud amet.
          </p>
          <div className="modal-btns d-flex justify-content-center">
            <Button className="white-border-btn flex-shrink-0" variant="link" onClick={onClose}>
              Do it later
            </Button>
            <Button className="white-btn flex-shrink-0" onClick={onConfirm}>
              Do it now
            </Button>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  )
}
KycModal.propTypes = {
  show: PropTypes.bool,
  onClose: PropTypes.func,
  onConfirm: PropTypes.func
}
export default KycModal
