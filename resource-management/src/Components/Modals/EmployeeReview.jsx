import React from 'react'
import { Modal, Form } from 'react-bootstrap'
import PropTypes from 'prop-types'
const EmployeeReview = ({ show, handleClose }) => {
  return (
    <Modal show={show} onHide={handleClose} centered className="EmployeeReview common-modal">
      <Modal.Header closeButton>
        <Modal.Title>Employee Review</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="modal-body-head">
          <span>Employee Name</span>
          <p>Tracy J. Fontenot </p>
        </div>
        <Form.Group>
          <span>Review</span>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Et ac ac elementum sed turpis nulla leo. Consectetur mauris cras
            elementum viverra amet morbi purus, vestibulum. Eget elit nunc ultrices lacus. Platea volutpat aliquam diam nibh. Id odio diam
            quam leo lorem.
          </p>
        </Form.Group>
      </Modal.Body>
    </Modal>
  )
}
EmployeeReview.propTypes = {
  show: PropTypes.string,
  handleClose: PropTypes.func,
}
export default EmployeeReview
