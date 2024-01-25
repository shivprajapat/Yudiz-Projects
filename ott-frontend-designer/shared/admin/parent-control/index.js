import React, { Fragment, useState } from 'react'
import OtpInput from 'react-otp-input';
import { Col, Form, Row } from 'react-bootstrap';

import { useModal } from '@/hooks';
import style from "./style.module.scss";
import IconPencil from '@/assets/images/jsIcon/iconPlay';
import { Button, CustomModal, Heading, HeadingBlock, ModalWrapper, ProfileCard, Switch } from '@/shared/components';

const ParentControl = () => {

  const { parent_control, parent_control_otp_wrap, parent_control_pin } = style;
  const [code, setCode] = useState("");
  const [checked, setChecked] = useState(false);
  const [pinProfile, setPinProfile] = useState(false);
  const { isShowing, toggle } = useModal()


  const handleChange = (code) => setCode(code);
  const handleConfirm = () => setPinProfile(!pinProfile);

  const handleSubmit = (e) => {
    e.preventDefault();
  }

  return (
    <Fragment>
      <section className={parent_control}>
        <Heading title='Parent Control' />
        <ModalWrapper space_md space>
          <article>
            <div className="flex-space">
              <h6 className='font-18'>Restrict videos inappropriate for your kids</h6>
              <Switch checked={checked} setChecked={setChecked} />
            </div>
          </article>
        </ModalWrapper>

        {/* // ** pin component */}
        {
          checked && (
            <Row>
              <Col xxl={5} lg={6}>
                <Form onSubmit={handleSubmit}>
                  <Form.Group className="form-group">
                    {/* <div className={style.verify_header}> */}
                    <HeadingBlock title="Set Pin" subtitle='Restrict videos inappropriate for your kids' />
                    {/* </div> */}
                    <Row className='align-items-center'>
                      <Col>
                        <div className={parent_control_otp_wrap}>
                          <div className="otp-group size-small">
                            <OtpInput
                              className='opt-input'
                              value={code}
                              onChange={handleChange}
                              numInputs={4}
                              isInputNum={true}
                              shouldAutoFocus={true}
                            />
                          </div>
                        </div>
                      </Col>
                      <Col>
                        <Button bgDark onClick={toggle} BtnIcon={<IconPencil />}>Edit</Button>
                      </Col>
                    </Row>
                  </Form.Group>
                  <Button bgOrange onClick={handleConfirm}>Confirm Pin</Button>
                </Form>
              </Col>
            </Row>
          )
        }

        {/* // ** pin component */}
        {
          pinProfile ? 
          ( <div className={parent_control_pin}>
            <HeadingBlock title='You can set maturity ratings for all profiles' />
            <Row>
              <Col xxl={4} lg={6}>
                <ProfileCard title="User 1" description='Videos rated 16+ will be restricted' />
              </Col>
              <Col xxl={4} lg={6}>
                <ProfileCard title="User 2" description='Videos rated 18+ will be restricted' />
              </Col>
              <Col xxl={4} lg={6}>
                <ProfileCard title="User 3" description='Videos rated 13+ will be restricted' />
              </Col>
            </Row>
          </div>)
          : null
        }
        
        
      </section>
      {isShowing &&
        <CustomModal title='Verify your OTP' closeConfirm={toggle} showClose>
          <div className="modal-body">
            <article>
              <p>Mobile Number <span>+91 8245635485</span></p>
              <Form onSubmit={handleSubmit}>
                <Form.Group className="form-group">
                  <div className="otp-group size-small">
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
              </Form>
            </article>
          </div>
          <div className="flex-space gap-3">
            <Button bgOrange fullWidth onClick={toggle}>Enter Otp</Button>
          </div>
        </CustomModal>
      }
    </Fragment>
  )
}

export default ParentControl