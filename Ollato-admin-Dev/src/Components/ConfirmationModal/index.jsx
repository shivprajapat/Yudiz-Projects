import React from 'react'
import PropTypes from 'prop-types'
import { Modal } from 'react-bootstrap'

export default function ConfirmationModal ({ show, setShow, onSuccess }) {
  //   const [show, setShow] = useState(false)
  const handleClose = () => setShow(false)
  //   const handleShow = () => setShow(true)
  return (
    <>
      <Modal show={show} onHide={handleClose} aria-labelledby="contained-modal-title-vcenter"
        centered>
        <Modal.Header closeButton>
        </Modal.Header>
        <Modal.Body>
          <div className="title-box has-subtitle">
            <h2>Delete </h2>
            <h4>Are you sure to delete this?</h4>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <button onClick={onSuccess} className='theme-btn w-100 red-btn'>
            Delete
          </button>
          <button onClick={handleClose} className='theme-btn w-100 gray-btn'>
            Cancel
          </button>
        </Modal.Footer>
      </Modal>
    </>
  )
}
ConfirmationModal.propTypes = {
  show: PropTypes.bool,
  setShow: PropTypes.func,
  onSuccess: PropTypes.func
}
