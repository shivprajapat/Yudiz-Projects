import React, { useEffect } from 'react'
import Link from 'next/link'
import { Nav } from 'react-bootstrap'
import PropTypes from 'prop-types'
import { useRouter } from 'next/router'

import styles from './style.module.scss'

const CommonNav = (props) => {
  const router = useRouter()
  useEffect(() => {
    const active = typeof window !== 'undefined' && document.getElementById(router.asPath)
    if (active) active.scrollIntoView({ block: 'end', inline: 'center' })
  }, [])
  return (
    <>
      <Nav
        variant="pills"
        className={`${styles.commonNav} ${props.isEqualWidth && 'equal-width-nav'} ${props.themeLight && styles.themeLightNav
          } text-uppercase scroll-list flex-nowrap text-nowrap`}
      >
        {props?.items?.map(({ navItem, url, active }) => (
          <Nav.Item key={url} className={`${styles.item}`}>
            {props.queryParams && (
              <Link
                href={{
                  pathname: url,
                  query: { q: router?.query?.q }
                }}
                prefetch={false}
              >
                <a id={url} className={`${active && styles.active} nav-link`} target={(navItem === 'Standings' && props.isMatch) ? '_blank' : '_self'}>{navItem}</a>
              </Link>
            )}
            {!props.queryParams && (
              <Link href={url} prefetch={false}>
                <a id={url} className={`${active && styles.active} nav-link`} target={(navItem === 'Standings' && props.isMatch) ? '_blank' : '_self'}>{navItem}</a>
              </Link>
            )}
          </Nav.Item>
        ))}
      </Nav>
    </>
  )
}

CommonNav.propTypes = {
  items: PropTypes.array,
  isEqualWidth: PropTypes.bool,
  themeLight: PropTypes.bool,
  queryParams: PropTypes.bool,
  isMatch: PropTypes.bool
}

export default CommonNav
