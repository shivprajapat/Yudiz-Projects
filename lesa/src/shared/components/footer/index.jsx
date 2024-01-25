import React from 'react'
import { Button, Form } from 'react-bootstrap'
import { FormattedMessage } from 'react-intl'
import { Link } from 'react-router-dom'

import { Instagram, LinkedIn, Twitter, YouTube } from 'assets/images/social-media-icons/icons'
import { allRoutes } from 'shared/constants/allRoutes'
import './style.scss'

const Footer = () => {
  return (
    <>
      <footer>
        <div className="d-flex justify-content-center align-items-center follow-us">
          <h5 className="text-uppercase mb-0">
            <FormattedMessage id="followUsOn" />
          </h5>
          <ul className="d-flex align-items-center">
            <li>
              <Link to="/" target="_blank">
                <Instagram />
              </Link>
            </li>
            <li>
              <Link to="/" target="_blank">
                <YouTube />
              </Link>
            </li>
            <li>
              <Link to="/" target="_blank">
                <Twitter />
              </Link>
            </li>
            <li>
              <Link to="/" target="_blank">
                <LinkedIn />
              </Link>
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
            <Form>
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
                <Link to="/">
                  <FormattedMessage id="auction" />
                </Link>
              </li>

              <li>
                <Link to="/">
                  <FormattedMessage id="drop" />
                </Link>
              </li>

              <li>
                <Link to="/">
                  <FormattedMessage id="crates" />
                </Link>
              </li>
              <li>
                <Link to="/">
                  <FormattedMessage id="community" />
                </Link>
              </li>
            </ul>
          </div>
          <div className="drop-desc">
            <span className="text-uppercase">
              <FormattedMessage id="dropYourNftsToOur" />
            </span>
            <Button className="drop-btn">
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
              <Link to="/">
                <FormattedMessage id="privacyPolicy" />
              </Link>
            </li>
            <li>
              <Link to="/">
                <FormattedMessage id="termsAndConditions" />
              </Link>
            </li>
          </ul>
        </div>
      </footer>
    </>
  )
}

export default Footer
