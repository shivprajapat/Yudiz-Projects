import React, { useState } from 'react'
import { Col, Form, InputGroup, Row } from 'react-bootstrap';
import Image from 'next/image';
import DatePicker from "react-datepicker";

import style from "./style.module.scss";
import IconPencil from '@/assets/images/jsIcon/iconPencil';
import { Avatar, Button, CheckBox, ModalWrapper } from '@/shared/components';
import { iconFemale, iconMail, iconMale, iconOther, iconPhone, iconUser } from '@/assets/images';

const AccountDetails = () => {
  const { account_details, account_details_buttons } = style;
  const [save, setSave] = useState(false);
  const [startDate, setStartDate] = useState(new Date());
  const handleMembership = () => {
    setSave((prev) => !prev)
  }
  const handleSubmit = (e) => {
    e.preventDefault();
  }

  return (
    <section className={account_details}>
      <ModalWrapper space_md>
        <div className='flex-space'>
          <Avatar SizeL icon={iconUser} title='shiv' Horizontal />
          <Button BtnIcon={<IconPencil />} bgDark onClick={handleMembership}>{save ? "" : "Edit Profile"}</Button>
        </div>
      </ModalWrapper>
      <Form onSubmit={handleSubmit}>
        <Form.Group className="form-group">
          <Form.Label>Name</Form.Label>
          <InputGroup className="form-group">
            <InputGroup.Text id="basic-addon1"><Image src={iconUser} alt="iconUser" /></InputGroup.Text>
            <Form.Control type='text' placeholder="XYZ Name" />
          </InputGroup>
        </Form.Group>
        <Form.Group className="form-group">
          <Form.Label>Mobile Number</Form.Label>
          <InputGroup className="form-group">
            <InputGroup.Text id="basic-addon1"><Image src={iconPhone} alt="iconPhone" /> +91</InputGroup.Text>
            <Form.Control type='number' placeholder="9802235212" />
          </InputGroup>
        </Form.Group>
        <Form.Group className="form-group">
          <Form.Label>Email Address</Form.Label>
          <InputGroup className="form-group">
            <InputGroup.Text id="basic-addon1"><Image src={iconMail} alt="iconPhone" /> </InputGroup.Text>
            <Form.Control type='email' placeholder="xyz125@mail.com" />
          </InputGroup>
        </Form.Group>
        <Form.Group className="form-group">
          <Form.Label>Birth Date</Form.Label>
          <InputGroup className="form-group">
            <DatePicker
              selected={startDate}
              onChange={(date) => setStartDate(date)}
              shouldCloseOnSelect={false}
              className='form-control'
            />
          </InputGroup>
        </Form.Group>
        <Form.Group className="form-group">
          <Form.Label>Select Gender</Form.Label>
          <div className='d-flex flex-wrap gap-3'>
            <div className={account_details_buttons}><CheckBox bgDark icon={iconMale} title="Male" /></div>
            <div className={account_details_buttons}><CheckBox bgDark icon={iconFemale} title="Female" /></div>
            <div className={account_details_buttons}><CheckBox bgDark icon={iconOther} title="Other" /></div>
          </div>
        </Form.Group>
        {
          save ?
            (
              <Form.Group>
                <Row>
                  <Col sm={6}><Button bgDark fullWidth onClick={() => handleMembership()}>Discard</Button></Col>
                  <Col sm={6}><Button bgOrange fullWidth onClick={() => handleMembership()}>Save Changes</Button></Col>
                </Row>
              </Form.Group>
            )
            : null
        }

      </Form>
    </section>
  )
}

export default AccountDetails