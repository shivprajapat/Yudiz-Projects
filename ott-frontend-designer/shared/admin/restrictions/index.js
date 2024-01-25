import React from 'react'
import { Col, Row } from 'react-bootstrap';
import style from "./style.module.scss";
import { Button, CheckBox, Heading, ModalWrapper } from '@/shared/components'

const Restrictions = () => {
  const { restriction, restriction_check, restriction_footer } = style;
  return (
    <section className={restriction}>
      <Heading title='Set Viewing Restrictions' />
      <ModalWrapper space_md space>
        <Row>
          <Col xxl={12}>
            <div className={restriction_check}>
              <CheckBox bgDark title="18+ " description="Videos rated 18+ will be restricted" />
            </div>
          </Col>
          <Col xxl={12}>
            <div className={restriction_check}>
              <CheckBox bgDark title="16+ " description="Videos rated 16+ will be restricted" />
            </div>
          </Col>
          <Col xxl={12}>
            <div className={restriction_check}>
              <CheckBox bgDark title="13+ " description="Videos rated 13+ will be restricted" />
            </div>
          </Col>
          <Col xxl={12}>
            <div className={restriction_footer}>
              <Button bgOrange>Update</Button>
            </div>
          </Col>
        </Row>
      </ModalWrapper>
    </section>
  )
}

export default Restrictions