import React from 'react'
import { Modal, Button, Form } from 'react-bootstrap'
import PropTypes from 'prop-types'
const ReviewModal = ({ show, handleClose }) => {
  return (
    <Modal show={show} onHide={handleClose} centered className="ReviewModal common-modal">
      <Modal.Header closeButton>
        <Modal.Title>Add Review</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <h2>Write review for Tracy J. Fontenot </h2>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Write Review</Form.Label>
            <Form.Control as="textarea" rows={5} placeholder="Enter Project Name" />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="primary" onClick={handleClose}>
          submit
        </Button>
      </Modal.Footer>
    </Modal>
  )
}
ReviewModal.propTypes = {
  show: PropTypes.string,
  handleClose: PropTypes.func,
}
export default ReviewModal
