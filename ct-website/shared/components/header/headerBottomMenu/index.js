import React, { useState } from 'react'
import { Dropdown } from 'react-bootstrap'
import Link from 'next/link'
import { useRouter } from 'next/router'

import styles from './style.module.scss'
// import { useQuery } from '@apollo/client'
// import { HEADER_MENU } from '@graphql/home/home.query'
import { getHeaderMenu } from '@shared/libs/menu'

function HeaderBottomMenu() {
  const router = useRouter()
  const [isDropdown, setDropdown] = useState(false)
  const showDropdown = (e) => setDropdown(!isDropdown)
  const hideDropdown = (e) => setDropdown(false)
  const menu = getHeaderMenu()

  // const { data } = useQuery(HEADER_MENU)

  return (
    <div className={`${styles.headerMenu} d-flex text-nowrap`}>
      <ul className="d-flex mb-0 m-auto">
        {menu?.map((m, i) => {
          if (m?.oChildren?.length) {
            return (
              <li key={m?._id}>
                <Dropdown show={isDropdown} onMouseEnter={showDropdown} onMouseLeave={hideDropdown}>
                  <Dropdown.Toggle variant="link" id={m.sTitle} className={styles.navMore}>
                    {m.sTitle}
                  </Dropdown.Toggle>
                  <Dropdown.Menu className={styles.dropdownMenu}>
                    {m?.oChildren.map((c) => {
                      return (
                        <Dropdown.Item key={c?._id} as={Link} href={c?.sSlug}>
                          <a className="dropdown-item">{c?.sTitle}</a>
                        </Dropdown.Item>
                      )
                    })}
                  </Dropdown.Menu>
                </Dropdown>
              </li>
            )
          } else {
            return (
              <li key={m?._id}>
                <Link href={m?.eMenuType === 'outside' ? m?.sUrl || '/' + m?.sSlug : '/' + m?.sSlug} prefetch={false}>
                  <a
                    className={`${styles.navItem} ${(router.asPath).slice(0, -1) === '/' + m?.sSlug ? styles.active : ''} ${i === 0 ? styles.liveUpdate : ''} `}
                    target={m?.eUrlTarget}
                  >
                    {m?.sTitle}
                  </a>
                </Link>
              </li>
            )
          }
        })}
      </ul>
    </div>
  )
}
export default HeaderBottomMenu
