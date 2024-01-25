import React from 'react'
import { Modal } from 'react-bootstrap'
import PropTypes from 'prop-types'

const DeleteModal = ({ show, handleClose, handleDelete, id, date }) => {
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
          <h2>Delete </h2>
          <h4>Are you sure to delete this?</h4>
        </div>
      </Modal.Body>
      <Modal.Footer>
        {date
          ? <button
          type='button'
          onClick={() => handleDelete(date)}
          className='theme-btn w-100 red-btn'
        > Delete</button>
          : <button
          type='button'
          onClick={() => handleDelete(id)}
          className='theme-btn w-100 red-btn'
        >
          Delete
        </button>}
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

DeleteModal.propTypes = {
  show: PropTypes.bool,
  handleClose: PropTypes.func,
  handleDelete: PropTypes.func,
  id: PropTypes.any,
  date: PropTypes.string

}

export default DeleteModal
