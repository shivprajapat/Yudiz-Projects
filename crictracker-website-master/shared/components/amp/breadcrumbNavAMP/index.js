import React from 'react'
import { useRouter } from 'next/router'
import PropTypes from 'prop-types'
import Trans from 'next-translate/Trans'

// import styles from './style.module.scss'

const BreadcrumbNavAMP = ({ isArticle }) => {
  const router = useRouter()
  const nav = router?.asPath?.replace(/\?.+/, '')?.split('/')?.filter((x) => x)

  return (
    <>
      <style jsx amp-custom>
        {`
          .breadcrumb ol{-webkit-flex-wrap:wrap;flex-wrap:wrap}.breadcrumb ol a{color:inherit;text-decoration:none;outline:none}.breadcrumb ol .item{text-transform:capitalize}.breadcrumb ol .item+.item{padding-left:.5rem}.breadcrumb ol .item+.item::before{content:">";padding-right:.5rem}.breadcrumb ol .item.active{color:var(--theme-color-medium);max-width:200px;white-space:nowrap;text-overflow:ellipsis;overflow:hidden}.breadcrumb ol .item a:active,.breadcrumb ol .item a:visited{color:inherit}/*# sourceMappingURL=style.css.map */

        `}
      </style>
      <nav aria-label="breadcrumb" className="breadcrumb">
        <ol className="mb-2 d-flex">
          <li className="item">
            <a href="/">
              <Trans i18nKey="common:Home" />
            </a>
          </li>
          {nav.length &&
            nav.map((value = '-', index) => {
              const isLast = index === nav?.length - 1
              const to = router?.asPath?.split(value)[0]
              return isLast ? (
                !isArticle && <li key={value} className="item active">
                  {value?.replace(/-/gi, ' ')}
                </li>
              ) : (
                <li key={value} className="item">
                  <a href={to + value}>{value.replace(/-/gi, ' ')}</a>
                </li>
              )
            })}
        </ol>
      </nav>
    </>
  )
}

BreadcrumbNavAMP.propTypes = {
  isArticle: PropTypes.bool
}

export default BreadcrumbNavAMP
