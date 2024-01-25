import React from 'react'
import Modal from 'react-bootstrap/Modal'
import Wrapper from 'Components/wrapper'
import { ICustomModalProps } from 'types/interfaces/CustomModal.types'

export default function CustomModal({
  open,
  handleClose,
  title,
  children,
  isLoading,
  disableHeader,
  className,
  modalBodyClassName,
  fullscreen = undefined ,
  size = 'lg',
  ...props
}: ICustomModalProps) {
  return (
    <Modal
      show={open}
      onHide={handleClose}
      size={size || ''}
      centered
      animation
      dialogClassName={className || 'modal-100w'}
      fullscreen={fullscreen}
      className={`common-modal`}
      {...props}
    >
      {!disableHeader && (
        <Modal.Header closeButton>
          <span className="modal-title" style={{ fontWeight: 'bold', textTransform: 'capitalize' }}>
            {title}
          </span>
        </Modal.Header>
      )}
      <Modal.Body className={modalBodyClassName || ''} style={{ maxWidth: '100%' }}>
        <Wrapper transparent isLoading={isLoading}>
          {children}
        </Wrapper>
      </Modal.Body>
    </Modal>
  )
}
