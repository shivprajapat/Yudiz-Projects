import React from 'react'
import PropTypes from 'prop-types'
import { Button, Offcanvas } from 'react-bootstrap'
import { AiOutlineClose } from 'react-icons/ai'

import './style.scss'

function Drawer({ isOpen, children, onClose, title, className }) {
  return (
    <Offcanvas className={className} show={isOpen} onHide={onClose} keyboard={false} backdrop={false} placement="end">
      <Offcanvas.Header className="d-flex align-items-center justify-content-start">
        <Button variant="outline-none" onClick={onClose}>
          <AiOutlineClose />
        </Button>
        <Offcanvas.Title>{title}</Offcanvas.Title>
      </Offcanvas.Header>
      <Offcanvas.Body>{children}</Offcanvas.Body>
    </Offcanvas>
  )
}
Drawer.propTypes = {
  isOpen: PropTypes.bool,
  children: PropTypes.node,
  onClose: PropTypes.func,
  title: PropTypes.any,
  className: PropTypes.string
}
export default Drawer
