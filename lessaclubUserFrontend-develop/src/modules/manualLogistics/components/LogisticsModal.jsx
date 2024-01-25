import React from 'react'
import { Modal, Button } from 'react-bootstrap'
import PropTypes from 'prop-types'

const LogisticsModal = ({ show, handleClose, title, handleConfirmation, loading, payload }) => {
  return (
    <Modal show={show} onHide={handleClose} centered className="delete-modal">
      <Modal.Header style={{ border: 'none' }}>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>&apos;{payload?.action?.label}&apos;</Modal.Body>
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
LogisticsModal.propTypes = {
  show: PropTypes.bool,
  title: PropTypes.string,
  handleClose: PropTypes.func,
  description: PropTypes.string,
  handleConfirmation: PropTypes.func,
  loading: PropTypes.bool,
  payload: PropTypes.object
}
export default LogisticsModal
