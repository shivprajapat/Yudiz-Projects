import React from 'react'
import { useRouter } from 'next/router'
import PropTypes from 'prop-types'
import { Breadcrumb } from 'react-bootstrap'
// import Link from 'next/link'
import Trans from 'next-translate/Trans'

import styles from './style.module.scss'
import CustomLink from '../customLink'

const BreadcrumbNav = ({ isArticle, listicleCurrentPage = 1 }) => {
  const router = useRouter()
  let nav = router?.asPath?.replace(/\?.+/, '')?.split('/')?.filter((x) => x)
  nav = listicleCurrentPage === 1 ? nav : nav.slice(0, -1)
  return (
    <Breadcrumb className={`${styles.breadcrumb} text-capitalize`}>
      {/* <Breadcrumb.Item linkAs={Link} href="/" className={`${styles.item} mb-1`}> */}
      <li className={`${styles.item} mb-1`}>
        <CustomLink href='/' prefetch={false}>
          <a><Trans i18nKey="common:Home" /></a>
        </CustomLink>
      </li>
      {/* </Breadcrumb.Item> */}
      {nav.length !== 0 &&
        nav.map((value = '-', index) => {
          const isLast = index === nav?.length - 1
          const to = router?.asPath?.split(value)[0]
          if (isLast) {
            if (!isArticle) {
              return (
                <Breadcrumb.Item key={value} className={`${styles.item} ${styles.active} mb-1`} active>
                  {value?.replace(/-/gi, ' ')}
                </Breadcrumb.Item>
              )
            } else {
              return null
            }
          } else {
            return (
              <li key={value} className={`${styles.item} mb-1`}>
                <CustomLink href={value === 'author' ? `${to + value}s` : to + value} prefetch={false}>
                  <a>{value.replace(/-/gi, ' ')}</a>
                </CustomLink>
              </li>
            )
          }
        })}
    </Breadcrumb>
  )
}

BreadcrumbNav.propTypes = {
  isArticle: PropTypes.bool,
  listicleCurrentPage: PropTypes.number
}

export default BreadcrumbNav
