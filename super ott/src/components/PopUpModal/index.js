import { Button, Modal, ModalBody, ModalFooter } from 'reactstrap'

const PopupModal = ({
  show,
  setShow,
  handleDeleteAction,
  handleCancelCalled,
  message = 'Are you sure you want to delete this item?',
  btnName = 'Delete',
  cancelButtonText = 'Cancel',
  isDisable
}) => {
  return (
    <Modal isOpen={show} toggle={() => setShow(!show)} className="modal-dialog-centered">
      <ModalBody>{message}</ModalBody>
      <ModalFooter>
        <div>
          <Button style={{ marginRight: '10px' }} color="primary" onClick={() => handleDeleteAction()} disabled={isDisable}>
            {btnName}
          </Button>
          <Button color="secondary" onClick={() => handleCancelCalled()}>
            {cancelButtonText}
          </Button>
        </div>
      </ModalFooter>
    </Modal>
  )
}
export default PopupModal
