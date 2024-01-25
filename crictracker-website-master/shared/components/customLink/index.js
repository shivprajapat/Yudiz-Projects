import React from 'react'
import PropTypes from 'prop-types'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { checkIsGlanceView } from '@shared/utils'
import { DOMAIN } from '@shared/constants'

const CustomLink = ({ href, prefetch, children, unWrapNextLink = true, ...rest }) => {
  const router = useRouter()
  const path = router?.asPath
  const [, queryString] = path?.split('?')
  const isGlanceView = checkIsGlanceView(router?.query)
  const isMobileWebView = router?.query?.isMobileWebView
  rest.prefetch = prefetch || false

  function getURL() {
    if (typeof href === 'object' && href?.pathname) {
      const h = href?.pathname?.charAt(0) === '/' ? href?.pathname?.substring(1) : href.pathname
      return `${DOMAIN}${h}?${queryString}`
    } else {
      const h = href?.charAt(0) === '/' ? href?.substring(1) : href
      return `${DOMAIN}${h}?${queryString}`
    }
  }

  if (isMobileWebView && unWrapNextLink) {
    return (
      <a href={getURL()} {...children.props}>
        {children.props.children}
      </a>
    )
  } else {
    return (
      <Link href={((isGlanceView && queryString) || (isMobileWebView && queryString)) ? `${href}?${queryString}` : href} {...rest}>{children}</Link>
    )
  }
}

CustomLink.propTypes = {
  href: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.shape({
      href: PropTypes.string,
      auth: PropTypes.string,
      hash: PropTypes.string,
      host: PropTypes.string,
      hostname: PropTypes.string,
      pathname: PropTypes.string,
      protocol: PropTypes.string,
      search: PropTypes.string,
      slashes: PropTypes.bool,
      port: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.bool
      ]),
      query: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.object
      ])
    })
  ]).isRequired,
  children: PropTypes.any.isRequired,
  prefetch: PropTypes.bool,
  unWrapNextLink: PropTypes.bool
}

export default CustomLink
