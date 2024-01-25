import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { Dropdown } from 'react-bootstrap'
import { useRouter } from 'next/router'
import dynamic from 'next/dynamic'

import styles from './style.module.scss'
// import { useQuery } from '@apollo/client'
// import { HEADER_MENU } from '@graphql/home/home.query'
import { getHeaderMenu } from '@shared/libs/menu'
import useWindowSize from '@shared/hooks/windowSize'

const CustomLink = dynamic(() => import('@shared/components/customLink'))

function HeaderBottomMenu() {
  const router = useRouter()
  const menu = getHeaderMenu()

  // const { data } = useQuery(HEADER_MENU)

  return (
    <div className={`${styles.headerMenu} light-bg xsmall-text d-flex text-nowrap`}>
      <ul className="d-flex mb-0 m-auto">
        {menu?.map((m, i) => {
          if (m?.oChildren?.length) {
            return (
              <li key={m?._id}>
                {/* <Dropdown show={true}>
                  <Dropdown.Toggle variant="link" id={m._id} className={`${styles.navMore} text-uppercase fw-bold d-block`}>
                    {m.sTitle}
                  </Dropdown.Toggle>
                  <Dropdown.Menu id={m._id} className={styles.dropdownMenu}>
                    {m?.oChildren.map((c) => {
                      return (
                        <Dropdown.Item key={c?._id} as={Link} href={c?.sSlug}>
                          <a className="dropdown-item">{c?.sTitle}</a>
                        </Dropdown.Item>
                      )
                    })}
                  </Dropdown.Menu>
                </Dropdown> */}
                <CDropdown data={m} />
              </li>
            )
          } else {
            const firstChat = m?.sSlug?.charAt(0)
            return (
              <li key={m?._id}>
                <CustomLink href={`${firstChat === '/' ? '' : '/'}${m?.sSlug}`} prefetch={false}>
                  <a
                    className={`${styles.navItem} ${(router.asPath).slice(0, -1) === '/' + m?.sSlug ? styles.active : ''} ${(m?.sSlug === 'live-scores' || m?.sSlug === 'live-scores/?ref=hm') ? styles.liveUpdate : ''} text-uppercase fw-bold d-block br-sm`}
                    target={m?.eUrlTarget}
                  >
                    {m?.sTitle}
                  </a>
                </CustomLink>
              </li>
            )
          }
        })}
      </ul>
    </div>
  )
}
export default HeaderBottomMenu

const CDropdown = ({ data }) => {
  const [show, setShow] = useState(false)
  const [width] = useWindowSize()

  useEffect(() => {
    if (width < 1024) {
      function onScrollMenu(e) {
        setShow(false)
      }
      window.addEventListener('click', (e) => { // Close when user click on outside
        const element = document.getElementById(`uniq${data?._id}`)
        if (!element?.contains(e.target)) {
          setShow(false)
        }
      })

      window.addEventListener('scroll', onScrollMenu, { passive: true })
      return () => window.removeEventListener('scroll', onScrollMenu)
    }
  }, [width])
  return (
    <>
      {data?.oChildren?.map((c) => {
        const fs = c?.sSlug?.charAt(0)
        return (
          <CustomLink href={`${fs === '/' ? '' : '/'}${c?.sSlug}`} prefetch={false} key={`d-none${c?._id}`} >
            <a className="d-none">{c?.sTitle}</a>
          </CustomLink>
        )
      })}
      <Dropdown
        show={show}
        onMouseEnter={() => width > 1024 ? setShow(true) : ''}
        onClick={() => width < 1024 ? setShow(!show) : ''}
        onMouseLeave={() => width > 1024 ? setShow(false) : ''}
        id={`uniq${data?._id}`}
      >
        <Dropdown.Toggle variant="link" id={data._id} className={`${styles.navMore} text-uppercase fw-bold d-block`}>
          {data.sTitle}
        </Dropdown.Toggle>
        <Dropdown.Menu id={data._id} className={`${styles.dropdownMenu}`}>
          {data?.oChildren.map((c) => {
            const fs = c?.sSlug?.charAt(0)
            return (
              <CustomLink key={c?._id} href={`${fs === '/' ? '' : '/'}${c?.sSlug}`}>
                <a className='dropdown-item'>{c?.sTitle}</a>
              </CustomLink>
            )
            // return (
            //   <Dropdown.Item key={c?._id} as={Link} href={`${fs === '/' ? '' : '/'}${c?.sSlug}`}>
            //     <a className="dropdown-item">{c?.sTitle}</a>
            //   </Dropdown.Item>
            // )
          })}
        </Dropdown.Menu>
      </Dropdown>
    </>
  )
}
CDropdown.propTypes = {
  data: PropTypes.object
}
