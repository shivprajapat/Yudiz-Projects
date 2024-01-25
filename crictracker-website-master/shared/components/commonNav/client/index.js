import React from 'react'
import PropTypes from 'prop-types'
import styles from '../style.module.scss'
import { Nav } from 'react-bootstrap'

function ClientCommonNav({ items, isEqualWidth, themeLight, active, onTabChange, isSticky }) {
  return (
    <Nav
      variant="pills"
      id="client-common-nav"
      className={`${styles.commonNav} ${isEqualWidth ? 'equal-width-nav' : ''} ${isSticky ? styles.stickyNav : ''} ${themeLight ? styles.themeLightNav : ''} text-uppercase scroll-list flex-nowrap text-nowrap`}
    >
      {items?.map(({ navItem, internalName }, i) => {
        return (
          <Nav.Item key={i} className={`${styles.item}`}>
            <Nav.Link
              as="button"
              className={`text-uppercase ${active === internalName ? styles.active : ''}`}
              onClick={() => {
                onTabChange && onTabChange(internalName)
              }}
            >
              {navItem}
            </Nav.Link>
          </Nav.Item>
        )
      })}
    </Nav>
  )
}

ClientCommonNav.propTypes = {
  items: PropTypes.array,
  isEqualWidth: PropTypes.bool,
  themeLight: PropTypes.bool,
  isSticky: PropTypes.bool,
  active: PropTypes.string,
  onTabChange: PropTypes.func
}

export default ClientCommonNav
