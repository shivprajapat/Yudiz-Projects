import React, { useState } from 'react'
import { Button, Modal, ModalHeader, ModalBody, FormGroup, InputGroup, InputGroupAddon, InputGroupText, Input, Label } from 'reactstrap'
import { User, Briefcase, Mail, Calendar, DollarSign, X } from 'react-feather'
import Flatpickr from 'react-flatpickr'

// ** Styles
import '@styles/react/libs/flatpickr/flatpickr.scss'

const AddNewModal = ({ open, handleModal }) => {
  const [Picker, setPicker] = useState(new Date())

  // ** Custom close btn
  const CloseBtn = <X className="cursor-pointer" size={15} onClick={handleModal} />
  return (
    <Modal isOpen={open} toggle={handleModal} className="sidebar-lg" modalClassName="modal-slide-in" contentClassName="pt-0">
      <ModalHeader className="mb-3" toggle={handleModal} close={CloseBtn} tag="div">
        <h5 className="modal-title">New Record</h5>
      </ModalHeader>
      <ModalBody className="flex-grow-1">
        <FormGroup>
          <Label for="full-name">Full Name</Label>
          <InputGroup>
            <InputGroupAddon addonType="prepend">
              <InputGroupText>
                <User size={15} />
              </InputGroupText>
            </InputGroupAddon>
            <Input id="full-name" placeholder="Bruce Wayne" />
          </InputGroup>
        </FormGroup>
        <FormGroup>
          <Label for="post">Post</Label>
          <InputGroup>
            <InputGroupAddon addonType="prepend">
              <InputGroupText>
                <Briefcase size={15} />
              </InputGroupText>
            </InputGroupAddon>
            <Input id="post" placeholder="Web Developer" />
          </InputGroup>
        </FormGroup>
        <FormGroup>
          <Label for="email">Email</Label>
          <InputGroup>
            <InputGroupAddon addonType="prepend">
              <InputGroupText>
                <Mail size={15} />
              </InputGroupText>
            </InputGroupAddon>
            <Input type="email" id="email" placeholder="brucewayne@email.com" />
          </InputGroup>
        </FormGroup>
        <FormGroup>
          <Label for="joining-date">Joining Date</Label>
          <InputGroup>
            <InputGroupAddon addonType="prepend">
              <InputGroupText>
                <Calendar size={15} />
              </InputGroupText>
            </InputGroupAddon>
            <Flatpickr className="form-control" id="joining-date" value={Picker} onChange={(date) => setPicker(date)} />
          </InputGroup>
        </FormGroup>
        <FormGroup className="mb-4">
          <Label for="salary">Salary</Label>
          <InputGroup>
            <InputGroupAddon addonType="prepend">
              <InputGroupText>
                <DollarSign size={15} />
              </InputGroupText>
            </InputGroupAddon>
            <Input type="number" id="salary" />
          </InputGroup>
        </FormGroup>
        <Button className="mr-1" color="primary" onClick={handleModal}>
          Submit
        </Button>
        <Button color="secondary" onClick={handleModal} outline>
          Cancel
        </Button>
      </ModalBody>
    </Modal>
  )
}

export default AddNewModal
