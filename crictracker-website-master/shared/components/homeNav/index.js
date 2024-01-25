import React from 'react'
import { Button, Nav } from 'react-bootstrap'
import PropTypes from 'prop-types'
import dynamic from 'next/dynamic'

import styles from './style.module.scss'
import noteIcon from '@assets/images/icon/note-icon.svg'
import fantasyTipsIcon from '@assets/images/icon/fantasy-tips-icon.svg'
import videoIcon from '@assets/images/icon/video-icon.svg'
import Trans from 'next-translate/Trans'

const MyImage = dynamic(() => import('@shared/components/myImage'))
const HomeNav = ({ active, handleChange }) => {
  return (
    <Nav variant="pills" className={`${styles.articleTab} light-bg text-uppercase equal-width-nav mb-3 mb-md-4 br-lg overflow-hidden`}>
      <Nav.Item>
        <Button
          onClick={() => handleChange('ar')}
          className={`${styles.navLink} ${active === 'ar' && styles.active} w-100 nav-link position-relative rounded-0 d-flex align-items-center justify-content-center`}
        >
          <span className={`${styles.icon} me-1 me-lg-2 my-1`}>
            <MyImage src={noteIcon} alt="facebook" layout="responsive" />
          </span>
          <span><Trans i18nKey="common:Articles" /></span>
        </Button>
      </Nav.Item>
      <Nav.Item>
        <Button
          onClick={() => handleChange('fa')}
          className={`${styles.navLink} ${active === 'fa' && styles.active} nav-link position-relative rounded-0 d-flex align-items-center justify-content-center w-100`}
        >
          <span className={`${styles.icon} me-1 me-lg-2 my-1`}>
            <MyImage src={fantasyTipsIcon} alt="facebook" layout="responsive" />
          </span>
          <span><Trans i18nKey="common:Fantasy" /></span>
        </Button>
      </Nav.Item>
      {/* <Nav.Item>
        <Link href="/ipl">
          <a className={`${styles.navLink} nav-link position-relative rounded-0 ${styles.starIcon} d-flex align-items-center justify-content-center`}>
            <StarIcon />
            <span>IPL</span>
          </a>
        </Link>
      </Nav.Item> */}
      <Nav.Item>
        <Button
          onClick={() => handleChange('v')}
          className={`${styles.navLink} ${active === 'v' && styles.active} nav-link position-relative rounded-0 d-flex align-items-center justify-content-center w-100`}
        >
          <span className={`${styles.icon} me-1 me-lg-2 my-1`}>
            <MyImage src={videoIcon} alt="facebook" layout="responsive" />
          </span>
          <span><Trans i18nKey="common:Videos" /></span>
        </Button>
      </Nav.Item>
    </Nav>
  )
}
HomeNav.propTypes = {
  active: PropTypes.string,
  handleChange: PropTypes.func
}

export default HomeNav
