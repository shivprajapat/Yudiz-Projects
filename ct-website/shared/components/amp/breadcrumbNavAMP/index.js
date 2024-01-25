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
          .light-mode {
            --font-color: #23272e;
            --font-secondary: #323842;
            --theme-bg: #f2f4f7;
            --light-mode-bg: #fff;
          }
          .dark-mode {
            --font-color: #fff;
            --font-secondary: #fff;
            --theme-bg: #23272e;
            --light-mode-bg: #323842;
          }
          .breadcrumb ol {
            margin: 0 0 1rem;
            padding: 0;
            list-style: none;
            display: flex;
            display: -webkit-flex;
            -webkit-flex-wrap: wrap;
            flex-wrap: wrap;
          }
          .breadcrumb ol a {
            color: inherit;
            text-decoration: none;
            outline: none;
          }
          .breadcrumb ol .item {
            text-transform: capitalize;
          }
          .breadcrumb ol .item + .item {
            padding-left: 0.5rem;
          }
          .breadcrumb ol .item + .item::before {
            content: '>';
            padding-right: 0.5rem;
          }
          .breadcrumb ol .item.active {
            color: #045de9;
            max-width: 200px;
            white-space: nowrap;
            text-overflow: ellipsis;
            overflow: hidden;
          }
          .breadcrumb ol .item a:active,
          .breadcrumb ol .item a:visited {
            color: inherit;
          } /*# sourceMappingURL=style.css.map */
        `}
      </style>
      <nav aria-label="breadcrumb" className="breadcrumb">
        <ol>
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
                !isArticle && <li key={value} className="item active" active>
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
