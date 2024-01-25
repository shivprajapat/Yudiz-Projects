import React from 'react'
import PropTypes from 'prop-types'
import { Row, Col } from 'react-bootstrap'
import dynamic from 'next/dynamic'

import styles from './style.module.scss'
import flagInd from '@assets/images/placeholder/team-placeholder.jpg'

const MyImage = dynamic(() => import('@shared/components/myImage'))

const LatestMatches = (props) => {
  return (
    <section className={`${styles.latestMatches} common-section pb-0`}>
      <p className={`${props?.fantasystyles?.itemTitle} text-primary fw-bold text-uppercase d-flex align-items-center`}>
        LATEST FORM - Last 5 matches
      </p>
      <Row>
        <Col md={6} className="">
          <div className={`${styles.item} d-flex align-items-center`}>
            <div className={`${styles.imgBlock} flex-shrink-0 me-2 me-ms-0 me-md-2 mb-1 mb-md-0 mt-1 mt-md-0`}>
              <MyImage src={flagInd} alt="user" placeholder="blur" layout="responsive" />
            </div>
            <div className="">IND</div>
            <div className={`${styles.point} me-2 ms-2 ms-md-3 me-md-3`}>4/5</div>
            <div className="d-flex text-center">
              <p className={`${styles.match} text-secondary text-light bg-success mb-0`}>W</p>
              <p className={`${styles.match} text-secondary text-light bg-success mb-0`}>W</p>
              <p className={`${styles.match} text-secondary text-light bg-danger mb-0`}>L</p>
              <p className={`${styles.match} text-secondary text-light bg-success mb-0`}>W</p>
              <p className={`${styles.match} text-secondary text-light bg-danger mb-0`}>L</p>
            </div>
          </div>
        </Col>
        <Col md={6} className="">
          <div className={`${styles.item} d-flex flex-row-reverse flex-md-row align-items-center justify-content-end`}>
            <div className="d-flex text-center">
              <p className={`${styles.match} text-secondary text-light bg-success mb-0`}>W</p>
              <p className={`${styles.match} text-secondary text-light bg-danger mb-0`}>L</p>
              <p className={`${styles.match} text-secondary text-light bg-danger mb-0`}>L</p>
              <p className={`${styles.match} text-secondary text-light bg-success mb-0`}>W</p>
              <p className={`${styles.match} text-secondary text-light bg-danger mb-0`}>L</p>
            </div>
            <div className={`${styles.point} me-2 ms-2 ms-md-3 me-md-3`}>4/5</div>
            <div className="">IND</div>
            <div className={`${styles.imgBlock} flex-shrink-0 me-2 me-md-0 ms-md-2 mb-1 mb-md-0 mt-1 mt-md-0`}>
              <MyImage src={flagInd} alt="user" placeholder="blur" layout="responsive" />
            </div>
          </div>
        </Col>
      </Row>
    </section>
  )
}

LatestMatches.propTypes = {
  fantasystyles: PropTypes.any
}

export default LatestMatches
