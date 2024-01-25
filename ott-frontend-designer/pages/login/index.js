import React, { useState } from 'react'
import Image from 'next/image'
import OtpInput from 'react-otp-input';
import style from "./style.module.scss";
import AuthLogin from '@/shared/components/AuthLogin'
import { Button, Footer, Header, ModalWrapper, SuccessCard } from '@/shared/components'
import { iconCheck, iconEdit, iconPhone } from '@/assets/images'
import { Col, Container, Form, InputGroup, Row } from 'react-bootstrap'

const StepLogin = ({ onNext }) => {
  const handleSubmit = (e) => {
    e.preventDefault();
  }
  return (
    <AuthLogin title="Login" subtitle="Login to continue to enjoy personalized experience." onsubmit={handleSubmit}>
      <Form.Group className="form-group">
        <Form.Label>Mobile Number</Form.Label>
        <InputGroup className="form-group">
          <InputGroup.Text id="basic-addon1"><Image src={iconPhone} alt="iconPhone" /> +91</InputGroup.Text>
          <Form.Control type='number' placeholder="Placeholder" />
          <Form.Control.Feedback type="invalid">Please enter valid mobile number</Form.Control.Feedback>
        </InputGroup>
      </Form.Group>
      <Button bgOrange fullWidth onClick={onNext}>Get OTP</Button>
    </AuthLogin>
  )
}
const StepVerify = ({ onNext }) => {
  const [code, setCode] = useState("");
  const handleChange = (code) => setCode(code);
  return (
    <div className={style.verify}>
      <AuthLogin title="Verify Your OTP">
        <Form.Group className="form-group">
          <div className={style.verify_header}>
            <Form.Label>OTP sent to <span>+91 8245635485</span></Form.Label>
            <Form.Label><Image src={iconEdit} alt="edit" /> <span>Edit</span></Form.Label>

          </div>
          <div className="otp-group">
            <OtpInput
              className='opt-input'
              value={code}
              onChange={handleChange}
              numInputs={4}
              isInputNum={true}
              shouldAutoFocus={true}
            />
          </div>
        </Form.Group>
        <Button bgOrange fullWidth onClick={onNext}>Verify</Button>
      </AuthLogin>
    </div>
  )
}
const StepSuccessfully = () => <SuccessCard title="Logged in Successfully" SizeM/>

const steps = {
  1: StepLogin,
  2: StepVerify,
  3: StepSuccessfully
};

const Login = () => {
  const [step, setStep] = useState(1);
  const Step = steps[step];

  function onNext() {
    setStep(step + 1);
  }

  return (
    <section className={`${style.login} banner-padding`}>
      <Container>
        <Step onNext={onNext} />
      </Container>
    </section>
  )
}

export default Login
Login.getLayout = function PageLayout(page) {
  return (
    <>
      <Header showLogo={true} />
      {page}
      <Footer />
    </>
  )
}