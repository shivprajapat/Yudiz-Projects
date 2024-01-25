import React from 'react'
import { Modal, Button } from 'react-bootstrap'
import PropTypes from 'prop-types'

import './style.scss'

const ConfirmationModal = ({ show, handleClose, title, description, handleConfirmation, loading }) => {
  return (
    <Modal show={show} onHide={handleClose} centered className="delete-modal">
      <Modal.Header>
        <Modal.Title>{title || 'Confirmation'}</Modal.Title>
      </Modal.Header>
      <Modal.Body>{description || 'Are you sure you want to delete this?'}</Modal.Body>
      <Modal.Footer>
        <Button className="white-btn" onClick={handleConfirmation} disabled={loading}>
          Yes
        </Button>
        <Button className="white-border-btn" onClick={handleClose} disabled={loading}>
          No
        </Button>
      </Modal.Footer>
    </Modal>
  )
}
ConfirmationModal.propTypes = {
  show: PropTypes.bool,
  title: PropTypes.string,
  handleClose: PropTypes.func,
  description: PropTypes.string,
  handleConfirmation: PropTypes.func,
  loading: PropTypes.bool
}
export default ConfirmationModal
