import React from "react";
import { Col, Container, Nav, Row } from "react-bootstrap";
import Image from "next/image";
import Link from "next/link";

import style from "./style.module.scss";
import { iconAppleStore, iconFacebook, iconInstagram, iconPlayStore, iconTwitter, iconYoutube, } from "@/assets/images";

const Footer = () => {
  const {
    footer,
    footer_item,
    footer_title,
    social_link,
    footer_item_download,
    nav,
    copyright,
  } = style;
  const data = [
    { icon: iconFacebook },
    { icon: iconTwitter },
    { icon: iconInstagram },
    { icon: iconYoutube },
  ];
  return (
    <footer className={footer}>
      <Container fluid>
        <Row>
          <Col xl={4}>
            <div className={footer_item}>
              <h5 className={footer_title}>Connect with us</h5>
              <ul className={social_link}>
                {
                  data?.map((item, index) => (
                    <li key={index}>
                      <Link href="/"><Image src={item.icon} alt="" /></Link>
                    </li>
                  ))
                }
              </ul>
              <Nav as="ul" className={nav}>
                <Nav.Item as="li">
                  <Link href="/about-us">About Us</Link>
                </Nav.Item>
                <Nav.Item as="li">
                  <Link href="/privacy-policy">Privacy Policy</Link>
                </Nav.Item>
                <Nav.Item as="li">
                  <Link href="/terms-condition">Terms & Condition</Link>
                </Nav.Item>
              </Nav>
            </div>
          </Col>
          <Col xl={8}>
            <div className={footer_item + " " + footer_item_download}>
              <h5 className={footer_title}>Download Our App</h5>
              <ul>
                <li><Link href="/"><Image src={iconPlayStore} alt="" /></Link></li>
                <li><Link href="/"><Image src={iconAppleStore} alt="" /></Link></li>
              </ul>
            </div>
          </Col>
        </Row>
        <Row>
          <div className={copyright}>
            <p>Copyright © 2022 JOJO. All rights reserved.</p>
          </div>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
