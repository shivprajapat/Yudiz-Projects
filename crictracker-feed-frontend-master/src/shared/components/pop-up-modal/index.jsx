import React from 'react'
import { Modal } from 'react-bootstrap'
import PropTypes from 'prop-types'

function PopUpModal({ title, isOpen, onClose, children, isCentered }) {
  return (
    <>
      <Modal show={isOpen} onHide={onClose} animation={true} centered={isCentered || false}>
        <Modal.Header closeButton closeVariant='white'>
          <Modal.Title>{title}</Modal.Title>
        </Modal.Header>
        <Modal.Body className='mt-3 mx-lg-4'>{children}</Modal.Body>
      </Modal>
    </>
  )
}

PopUpModal.propTypes = {
  children: PropTypes.node,
  title: PropTypes.string.isRequired,
  isOpen: PropTypes.bool.isRequired,
  isCentered: PropTypes.bool,
  onClose: PropTypes.func.isRequired
}
export default PopUpModal
