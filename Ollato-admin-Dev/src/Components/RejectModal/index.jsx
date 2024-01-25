import React from 'react'
import { Modal } from 'react-bootstrap'
import PropTypes from 'prop-types'

const RejectModal = ({ show, handleClose, handleAcceptReject, id }) => {
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
          <h2>Reject Session</h2>
          <h4>Are you sure to reject this session?</h4>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <button
          type='button'
          onClick={() => handleAcceptReject(id)}
          className='theme-btn w-100 red-btn'
        >
          Reject
        </button>
        <button
          type='button'
          onClick={handleClose}
          className='theme-btn w-100 gray-btn'
        >
          Cancel
        </button>
      </Modal.Footer>
    </Modal>
  )
}

RejectModal.propTypes = {
  show: PropTypes.bool,
  handleClose: PropTypes.func,
  handleAcceptReject: PropTypes.func,
  id: PropTypes.any

}

export default RejectModal
