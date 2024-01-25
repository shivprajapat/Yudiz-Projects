/* eslint-disable react/jsx-no-target-blank */
import React, { memo } from 'react'
import { Button, Form } from 'react-bootstrap'
import { FormattedMessage } from 'react-intl'
import { Link, useNavigate } from 'react-router-dom'

import { Facebook, Instagram, LinkedIn, Twitter } from 'assets/images/icon-components/icons'
import { allRoutes } from 'shared/constants/allRoutes'
import './style.scss'

const Footer = () => {
  const navigate = useNavigate()
  return (
    <>
      <footer>
        <div className="d-flex justify-content-center align-items-center follow-us">
          <h5 className="text-uppercase mb-0">
            <FormattedMessage id="followUsOn" />
          </h5>
          <ul className="d-flex align-items-center">
            <li>
              <a href="https://www.instagram.com/nuuway.nft/?next=%2F" target="_blank">
                <Instagram />
              </a>
            </li>
            <li>
              <a href="https://twitter.com/NUUWAYNFT" target="_blank">
                <Twitter />
              </a>
            </li>
            <li>
              <a href="/" target="_blank">
                <LinkedIn />
              </a>
            </li>
            <li>
              <a href="https://www.facebook.com/profile.php?id=100082070903113" target="_blank">
                <Facebook />
              </a>
            </li>
          </ul>
        </div>
        <div className="footer-content d-flex flex-wrap">
          <div className="footer-desc">
            <span className="text-uppercase">
              <FormattedMessage id="stayConnected" /> <br></br>
              <FormattedMessage id="getNewsOnArtistsProducts" />
              <br></br> <FormattedMessage id="liveEventsAndMore" />
            </span>
            <Form autoComplete="off">
              <Form.Group>
                <Form.Control type="email" placeholder="nam@email.com" />
                <Button className="sub-btn" type="submit">
                  <FormattedMessage id="submit" />
                </Button>
              </Form.Group>
            </Form>
          </div>
          <div className="quick-links">
            <ul>
              <li>
                <Link to={allRoutes.explore}>
                  <FormattedMessage id="explore" />
                </Link>
              </li>
              <li>
                <Link to={allRoutes.auction}>
                  <FormattedMessage id="auction" />
                </Link>
              </li>

              <li>
                <Link to={allRoutes.drop}>
                  <FormattedMessage id="drop" />
                </Link>
              </li>

              <li>
                <Link to={allRoutes.crates}>
                  <FormattedMessage id="crates" />
                </Link>
              </li>
              <li>
                <Link to={allRoutes.community}>
                  <FormattedMessage id="community" />
                </Link>
              </li>
            </ul>
          </div>
          <div className="drop-desc">
            <span className="text-uppercase">
              <FormattedMessage id="dropYourNftsToOur" />
            </span>
            <Button className="drop-btn" onClick={() => navigate(allRoutes.drop)}>
              <FormattedMessage id="drop" />
            </Button>
          </div>
        </div>
        <div className="copyright d-flex justify-content-between align-items-center">
          <span>
            <FormattedMessage id="lesaClubAllRightReserved" />
          </span>
          <ul className="d-flex">
            <li>
              <Link to={allRoutes.faq}>
                <FormattedMessage id="faq" />
              </Link>
            </li>
            <li>
              <Link to={allRoutes.customerSupport}>
                <FormattedMessage id="customerSupport" />
              </Link>
            </li>
            <li>
              <Link to={allRoutes.privacyPolicy}>
                <FormattedMessage id="privacyPolicy" />
              </Link>
            </li>
            <li>
              <Link to={allRoutes.termsAndConditions}>
                <FormattedMessage id="termsAndConditions" />
              </Link>
            </li>
          </ul>
        </div>
      </footer>
    </>
  )
}

export default memo(Footer)
