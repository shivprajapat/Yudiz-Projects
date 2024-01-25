import React from 'react'
import Image from 'next/image'
import style from "./style.module.scss";
import { imgAds } from '@/assets/images'
import { Col, Container, Row } from 'react-bootstrap'

const Ads = () => {
  const { ads } = style;

  return (
    <section className={ads}>
      <Container fluid>
        <Row>
          <Col lg={9} className="mx-auto">
            <Image src={imgAds} alt="imgAds" />
          </Col>
        </Row>
      </Container>
    </section>
  )
}

export default Ads