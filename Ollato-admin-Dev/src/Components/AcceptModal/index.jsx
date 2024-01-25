import React from 'react'
import { Modal } from 'react-bootstrap'
import PropTypes from 'prop-types'

const AcceptModal = ({ show, id, handleClose, handleAcceptReject }) => {
  return (
    <Modal
      show={show}
      onHide={handleClose}
      aria-labelledby='contained-modal-title-vcenter'
      centered
    >
      <Modal.Header closeButton></Modal.Header>
      <Modal.Body>
        <div className='title-box has-subtitle'>
          <h2>Accept</h2>
          <h4>Are you sure to accept this request?</h4>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <button
          type='button'
          onClick={() => handleAcceptReject(id)}
          className='theme-btn w-100 darkk-btn'
        >
          Yes
        </button>
        <button
          type='button'
          onClick={handleClose}
          className='theme-btn w-100 gray-btn'
        >
          No
        </button>
      </Modal.Footer>
    </Modal>
  )
}

AcceptModal.propTypes = {
  show: PropTypes.bool,
  handleClose: PropTypes.func,
  handleAcceptReject: PropTypes.func,
  id: PropTypes.any

}

export default AcceptModal
