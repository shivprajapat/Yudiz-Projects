import React from 'react'
import Link from 'next/link'
import { Nav } from 'react-bootstrap'

import styles from './style.module.scss'

const SeriesNav = () => {
  return (
    <Nav variant="pills" className={`${styles.seriesNav} text-uppercase scroll-list flex-nowrap text-nowrap`}>
      <Nav.Item className={`${styles.item}`}>
        <Link href="/series/">
          <a className="nav-link">Home</a>
        </Link>
      </Nav.Item>
      <Nav.Item className={`${styles.item}`}>
        <Link href="/series/IPL/news">
          <a className="nav-link">News</a>
        </Link>
      </Nav.Item>
      <Nav.Item className={`${styles.item}`}>
        <Link href="/series/IPL">
          <a className={`nav-link ${styles.active}`}>Videos</a>
        </Link>
      </Nav.Item>
      <Nav.Item className={`${styles.item}`}>
        <Link href="/series/">
          <a className="nav-link">Photos</a>
        </Link>
      </Nav.Item>
      <Nav.Item className={`${styles.item}`}>
        <Link href="/series/IPL/fixtures">
          <a className="nav-link">Fixtures</a>
        </Link>
      </Nav.Item>
      <Nav.Item className={`${styles.item}`}>
        <Link href="/series/IPL/standings">
          <a className="nav-link">Standings</a>
        </Link>
      </Nav.Item>
      <Nav.Item className={`${styles.item}`}>
        <Link href="/series/IPL/stats">
          <a className="nav-link">Stats</a>
        </Link>
      </Nav.Item>
      <Nav.Item className={`${styles.item}`}>
        <Link href="/series/">
          <a className="nav-link">Teams</a>
        </Link>
      </Nav.Item>
      <Nav.Item className={`${styles.item}`}>
        <Link href="/series/IPL/archive">
          <a className="nav-link">Archive</a>
        </Link>
      </Nav.Item>
      <Nav.Item className={`${styles.item}`}>
        <Link href="/series/">
          <a className="nav-link">Fantasy Tips</a>
        </Link>
      </Nav.Item>
    </Nav>
  )
}

export default SeriesNav
