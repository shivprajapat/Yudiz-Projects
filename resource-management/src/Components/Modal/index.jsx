import React from 'react'
import PropTypes from 'prop-types'

import Modal from 'react-bootstrap/Modal'

export default function CustomModal({ open, handleClose, title, children }) {
  return (
    <Modal
      show={open}
      onHide={handleClose}
      size="md"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      animation
      className=" common-modal"
    >
      <Modal.Header closeButton>
        <span className="modal-title" style={{ fontWeight: 'bold' }}>
          {title}
        </span>
      </Modal.Header>
      <Modal.Body>{children}</Modal.Body>
    </Modal>
  )
}

CustomModal.propTypes = {
  open: PropTypes.bool,
  handleClose: PropTypes.func,
  children: PropTypes.node,
  title: PropTypes.node,
}
