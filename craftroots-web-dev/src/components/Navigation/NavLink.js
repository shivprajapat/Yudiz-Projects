import React from 'react'
import PropTypes from 'prop-types'
import Link from 'next/link'

function NavLink({ title, path, className, onClick }) {
  const handleClick = () => {
    if (onClick) {
      onClick()
    }
  }
  return (
    <li>
      <Link
        href={path}
        className={`nav-link ${className}`}
        onClick={handleClick}
      >
        {title}
      </Link>
    </li>
  )
}

export default NavLink
NavLink.propTypes = {
  path: PropTypes.string,
  title: PropTypes.string,
  className: PropTypes.string,
  onClick: PropTypes.func,
}

NavLink.defaultProps = {
  className: '',
}
