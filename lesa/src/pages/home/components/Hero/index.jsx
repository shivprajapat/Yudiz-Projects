import React from 'react'
import { Container } from 'react-bootstrap'

import './style.scss'
import { heroImg } from 'assets/images'

const Hero = () => {
  return (
    <div>
      <div className="banner">
        <Container fluid>
          <div className="banner-content">
            <p>
              There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by
              injected humour, or randomised words which don&apos;t look even slightly believable.
            </p>
          </div>
        </Container>
        <img src={heroImg} alt="banner-img" className="img-fluid" />
      </div>
    </div>
  )
}

export default Hero
